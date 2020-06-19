import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import User from '@modules/users/infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private UsersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const UserExists = await this.UsersRepository.findByEmail(email);
    if (!UserExists) {
      throw new AppError('Incorret email/password combination.', 401);
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      UserExists.password,
    );

    if (!passwordMatches) {
      throw new AppError('Incorret email/password combination.', 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: UserExists.id,
      expiresIn,
    });

    return {
      user: UserExists,
      token,
    };
  }
}

export default AuthenticateUserService;
