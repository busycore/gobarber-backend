import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import usersRouter from '../routes/users.routes';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const UserRepository = getRepository(User);
    const UserExists = await UserRepository.findOne({ where: { email } });
    if (!UserExists) {
      throw new AppError('Incorret email/password combination.', 401);
    }
    const passwordMatches = await compare(password, UserExists.password);
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
