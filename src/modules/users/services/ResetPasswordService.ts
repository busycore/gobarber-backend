import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { differenceInHours } from 'date-fns';
import { response } from 'express';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import UserToken from '../infra/typeorm/entities/UserToken';

interface IRequest {
  token: string;
  password: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository') private UsersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private UserTokensRepository: IUserTokensRepository,
    @inject('HashProvider') private HashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const usertoken = await this.UserTokensRepository.findByToken(token);

    if (!usertoken) {
      throw new AppError('User Token does not exist');
    }

    const user = await this.UsersRepository.findById(usertoken.user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const tokenCreatedAt = usertoken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('Token Expired');
    }
    user.password = await this.HashProvider.generateHash(password);

    await this.UsersRepository.save(user);
    console.log(user);
  }
}

export default ResetPasswordService;
