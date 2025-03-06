import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FindManyOptions } from 'typeorm';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from '../service/user.service';
import { UserDTO } from './dto/user.dto';
import { MailService } from './mail.service';
import { transformPassword } from '../security';
import { KafeelService } from './kafeel.service';
import { ChildExtendedService } from './child.extend.service';
import { AuthorityDTO } from './dto/authority.dto';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
    private userService: UserService,
    private mailService: MailService,
    private readonly kafeelService: KafeelService,
    private readonly childExtendedService: ChildExtendedService,
  ) {}

  async login(userLogin: UserLoginDTO): Promise<any> {
    const loginUserName = userLogin.username;
    const loginPassword = userLogin.password;
    if (!loginUserName || !loginPassword) {
      throw new HttpException('Username and password are required!', HttpStatus.BAD_REQUEST);
    }

    const userFind = await this.userService.findByFields({ where: { login: loginUserName } });
    const validPassword = !!userFind && (await bcrypt.compare(loginPassword, userFind.password));
    if (!userFind || !validPassword) {
      throw new HttpException('Invalid login name or password!', HttpStatus.UNAUTHORIZED);
    }

    if (userFind && !userFind.activated) {
      throw new HttpException('Your account is not been activated!', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.findUserWithAuthById(userFind.id);

    const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };

    /* eslint-disable */
    return {
      id_token: this.jwtService.sign(payload),
    };
  }

  /* eslint-enable */
  async validateUser(payload: Payload): Promise<UserDTO | undefined> {
    return await this.findUserWithAuthById(payload.id);
  }

  async findUserWithAuthById(userId: number): Promise<UserDTO | undefined> {
    const userDTO: UserDTO = await this.userService.findByFields({ where: { id: userId } });
    return userDTO;
  }

  async getAccount(userId: number): Promise<UserDTO | undefined> {
    const userDTO: UserDTO = await this.findUserWithAuthById(userId);
    if (!userDTO) {
      return;
    }
    return userDTO;
  }

  async changePassword(userLogin: string, currentClearTextPassword: string, newPassword: string): Promise<void> {
    const userFind: UserDTO = await this.userService.findByFields({ where: { login: userLogin } });
    if (!userFind) {
      throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
    }

    if (!(await bcrypt.compare(currentClearTextPassword, userFind.password))) {
      throw new HttpException('error.passwordNotExist', HttpStatus.BAD_REQUEST);
    }
    userFind.password = newPassword;
    await this.userService.save(userFind, userLogin, true);
    return;
  }

  generateJwtToken(user: UserDTO): string {
    const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };
    return this.jwtService.sign(payload);
  }
  async getAllAuthorities(): Promise<AuthorityDTO[]> {
    return await this.authorityRepository.find();
  }
  constructLoginLink(token: string): string {
    const loginPath = 'login?';
    return `${process.env.CLIENT_SERVER}/${loginPath}token=${token}`;
  }

  async activateAccount(user: UserDTO): Promise<UserDTO> {
    user.activated = true;
    return await this.userService.save(user);
  }
  async ensureUserDoesNotExist(newUser: UserDTO): Promise<void> {
    const childByemail = await this.childExtendedService.findByFields({ where: { email: newUser.email } });

    const userByEmail = await this.userService.findByFields({ where: { email: newUser.email } });
    if (userByEmail || (!newUser.authorities.includes('ROLE_CHILD') && childByemail)) {
      throw new HttpException('error.emailexists', HttpStatus.BAD_REQUEST);
    }
    const userByLogin = await this.userService.findByFields({ where: { login: newUser.login } });
    if (userByLogin) {
      throw new HttpException('Login name already used!', HttpStatus.BAD_REQUEST);
    }
    const userByMobile = await this.userService.findByFields({ where: { mobile: newUser.mobile } });
    if (userByMobile) {
      throw new HttpException('error.mobileexists', HttpStatus.BAD_REQUEST);
    }
    const userByNationalId = await this.userService.findByFields({ where: { national_id: newUser.national_id } });
    const checkNationalIdFromChildTable = await this.childExtendedService.findByFields({ where: { nationalId: newUser.national_id } });
    if (userByNationalId || checkNationalIdFromChildTable) {
      throw new HttpException('error.nationalIdExists', HttpStatus.BAD_REQUEST);
    }
  }
  async registerNewUser(newUser: UserDTO): Promise<UserDTO> {
    await this.ensureUserDoesNotExist(newUser);
    newUser.login = newUser.email;

    const savedUser: UserDTO = await this.userService.save(newUser, newUser.login, true);

    // check if kafeel
    if (newUser.authorities.includes('ROLE_GUARANTOR')) {
      const kafeel = {
        user: savedUser,
        relChildKafeels: [],
      };
      await this.kafeelService.save(kafeel);
    }

    // Generate a JWT token for the user
    const token = this.generateJwtToken(savedUser);

    // Construct the login link
    const loginLink = this.constructLoginLink(token);

    // Send verification email
    await this.mailService.sendRegisterVerivication(savedUser, loginLink);

    return savedUser;
  }

  async updateUserSettings(userLogin: string, newUserInfo: UserDTO): Promise<UserDTO> {
    const userFind: UserDTO = await this.userService.findByFields({ where: { login: userLogin } });
    if (!userFind) {
      throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
    }
    const userFindEmail: UserDTO = await this.userService.findByFields({ where: { email: newUserInfo.email } });
    if (userFindEmail && newUserInfo.email !== userFind.email) {
      throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
    }

    userFind.firstName = newUserInfo.firstName;
    userFind.lastName = newUserInfo.lastName;
    userFind.email = newUserInfo.email;
    userFind.langKey = newUserInfo.langKey;
    await this.userService.save(userFind, userLogin);
    return;
  }

  async getAllUsers(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
    return await this.userService.findAndCount(options);
  }

  async forgotPassword(email: string, name?: string): Promise<string> {
    const user = await this.userService.findByFields({ where: { email } });
    if (!user) {
      throw new HttpException('error.notFountEmail', HttpStatus.BAD_REQUEST);
    }

    let forgotPath = 'reset-password?';

    const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };
    const token = this.jwtService.sign(payload);
    const forgotLink = `${process.env.CLIENT_SERVER}/${forgotPath}token=${token}`;
    const emailSended = await this.mailService.sendForgotPasswordToken(user, forgotLink, user?.login);
    return emailSended;
  }

  async resetPassword(token: string, password: string): Promise<any> {
    try {
      const user = await this.jwtService.verify(token);
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
      } else {
        user.password = password;
        await transformPassword(user);
        await this.userService.save(user);
      }
    } catch (error) {
      throw new HttpException('Token Expired', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyToken(token: string) {
    return await this.jwtService.verify(token);
  }
}
