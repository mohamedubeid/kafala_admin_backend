import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../repository/user.repository';
import { transformPassword } from '../security';
import { UserDTO } from './dto/user.dto';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

  async findById(id: number): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOne(id);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async findByFields(options: FindOneOptions<UserDTO>): Promise<UserDTO | undefined> {
    options.relations = ['authorities'];
    const result = await this.userRepository.findOne(options);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async find(options: FindManyOptions<UserDTO>): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOne(options);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async findAndCount(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
    options.relations = ['authorities'];
    const resultList = await this.userRepository.findAndCount(options);
    const usersDTO: UserDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(user => usersDTO.push(UserMapper.fromEntityToDTO(this.flatAuthorities(user))));
      resultList[0] = usersDTO;
    }
    return resultList;
  }

  async ensureUserDoesNotExist(newUser: UserDTO): Promise<void> {
    const userByEmail = await this.findByFields({ where: { email: newUser.email } });
    if (userByEmail) {
      throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
    }
    const userByLogin = await this.findByFields({ where: { login: newUser.login } });
    if (userByLogin) {
      throw new HttpException('Login name already used!', HttpStatus.BAD_REQUEST);
    }
    const userByMobile = await this.findByFields({ where: { mobile: newUser.mobile } });
    if (userByMobile) {
      throw new HttpException('Mobile number already used!', HttpStatus.BAD_REQUEST);
    }
  }

  async save(userDTO: UserDTO, creator?: string, updatePassword = false): Promise<UserDTO | undefined> {
    const user = this.convertInAuthorities(UserMapper.fromDTOtoEntity(userDTO));
    if (updatePassword) {
      await transformPassword(user);
    }
    if (creator) {
      if (!user.createdBy) {
        user.createdBy = creator;
      }
      user.lastModifiedBy = creator;
    }
    if (user.login !== 'admin') {
      user.login = userDTO.email;
    }
    // user.login=userDTO.login;
    const result = await this.userRepository.save(user);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async update(userDTO: UserDTO, updater?: string): Promise<UserDTO | undefined> {
    return this.save(userDTO, updater);
  }

  async delete(userDTO: UserDTO): Promise<UserDTO | undefined> {
    const user = UserMapper.fromDTOtoEntity(userDTO);
    const result = await this.userRepository.remove(user);
    return UserMapper.fromEntityToDTO(result);
  }

  private flatAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach(authority => authorities.push(authority.name));
      user.authorities = authorities;
    }
    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach(authority => authorities.push({ name: authority }));
      user.authorities = authorities;
    }
    return user;
  }
}
