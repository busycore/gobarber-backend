import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashRepository from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}
@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private UsersRepository: IUsersRepository,
    @inject('HashProvider') private HashProvider: IHashRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.UsersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }
    const userWithUpdatedEMail = await this.UsersRepository.findByEmail(email);

    if (userWithUpdatedEMail && user_id !== userWithUpdatedEMail.id) {
      throw new AppError('Email already in use');
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.HashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old Password doest not match');
      }
    }

    if (password) {
      user.password = await this.HashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;
    return this.UsersRepository.save(user);
  }
}

export default UpdateProfileService;
