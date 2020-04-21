import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email Address already used');
    }

    const hashedPassword = await hash(password, 8);
    const newUser = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await usersRepository.save(newUser);
    return newUser;
  }
}

export default CreateUserService;
