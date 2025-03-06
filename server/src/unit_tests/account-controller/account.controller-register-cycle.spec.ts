import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../service/auth.service';
import { UserDTO } from '../../service/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AccountController } from '../../web/rest/account.controller';
import { AuthorityRepository } from '../../repository/authority.repository';
import { MailService } from '../../service/mail.service';

describe('AccountController', () => {
  let accountController: AccountController;
  let authService: AuthService;
  let jwtService: JwtService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerNewUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
            sendRegisterVerivication: jest.fn(),
            mailerService: {},
          },
        },
      ],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
  });
  //    controller test cases ........
  describe('registerAccount', () => {
    it('should register a new user', async () => {
      const userDTO: UserDTO = {
        id: 1,
        login: 'test',
        email: 'test@example.com',
        authorities: [],
        password: '',
      };
      const req = {} as Request;

      jest.spyOn(authService, 'registerNewUser').mockResolvedValue(userDTO);

      expect(await accountController.registerAccount(req, { ...userDTO, password: 'password' })).toBe(userDTO);
      expect(authService.registerNewUser).toHaveBeenCalledWith({ ...userDTO, password: 'password' });
    });

    it('should throw an error if user already exists', async () => {
      const userDTO: UserDTO = {
        id: 1,
        login: 'test',
        email: 'test@example.com',
        authorities: [],
        password: '',
      };
      const req = {} as Request;

      jest.spyOn(authService, 'registerNewUser').mockRejectedValue(new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST));

      await expect(accountController.registerAccount(req, { ...userDTO, password: 'password' })).rejects.toThrow(
        'Email is already in use!',
      );
    });

    it('should throw an error if no data is entered', async () => {
      const req = {} as Request;

      jest.spyOn(authService, 'registerNewUser').mockImplementation(() => {
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      });

      await expect(accountController.registerAccount(req, {} as any)).rejects.toThrow('No data provided');
    });
  });
});

//    service test cases ........
describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let jwtService: Partial<JwtService>;
  let mailService: Partial<MailService>;
  let authorityRepository: Partial<AuthorityRepository>;

  beforeEach(() => {
    userService = {
      findByFields: jest.fn(),
      save: jest.fn(),
    };

    jwtService = { sign: jest.fn() };
    mailService = {
      sendRegisterVerivication: jest.fn(),
    };
    authorityRepository = {
      findByIds: jest.fn(),
    };

    authService = new AuthService(
      jwtService as JwtService,
      authorityRepository as AuthorityRepository,
      userService,
      mailService as MailService,
    );
  });

  describe('registerNewUser', () => {
    it('should ensure the user does not exist', async () => {
      const newUser: UserDTO = {
        id: 1,
        login: 'test',
        email: 'test@example.com',
        authorities: [],
        password: '',
      };
      jest.spyOn(userService, 'findByFields').mockResolvedValue(null);

      await authService.ensureUserDoesNotExist(newUser);

      expect(userService.findByFields).toHaveBeenCalledWith({ where: { login: newUser.login } });
      expect(userService.findByFields).toHaveBeenCalledWith({ where: { email: newUser.email } });
    });
    it('should throw an error if login already exists', async () => {
      const newUser: UserDTO = {
        id: 1,
        login: 'test',
        email: 'test@example.com',
        mobile: '1234567890',
        authorities: [],
        password: '',
      };

      jest.spyOn(userService, 'findByFields').mockResolvedValueOnce(null).mockResolvedValueOnce(newUser);

      await expect(authService.ensureUserDoesNotExist(newUser)).rejects.toThrow('Login name already used!');
    });

    it('should throw an error if email already exists', async () => {
      const newUser: UserDTO = {
        id: 1,
        login: 'test',
        email: 'test@example.com',
        mobile: '1234567890',
        authorities: [],
        password: '',
      };

      jest.spyOn(userService, 'findByFields').mockResolvedValueOnce(newUser).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      await expect(authService.ensureUserDoesNotExist(newUser)).rejects.toThrow('Email is already in use!');
    });

    it('should throw an error if mobile number already exists', async () => {
      const newUser: UserDTO = {
        id: 1,
        login: 'test',
        email: 'test@example.com',
        mobile: '1234567890',
        authorities: [],
        password: '',
      };

      jest.spyOn(userService, 'findByFields').mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(newUser);

      await expect(authService.ensureUserDoesNotExist(newUser)).rejects.toThrow('Mobile number already used!');
    });

    it('should construct the login link', () => {
      process.env.CLIENT_SERVER = 'http://localhost:3000';
      const token = 'jwt_token';

      expect(authService.constructLoginLink(token)).toBe('http://localhost:3000/login?token=jwt_token');
    });
  });
});
