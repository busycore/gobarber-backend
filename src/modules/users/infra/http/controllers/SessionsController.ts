import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import AuthenticateUserServices from '@modules/users/services/AuthenticateUserService';

// Controller : Seguindo a metodogolia RESTFULL o controller deve ter no maximo 5 metodos
// index,show,create,update,delete

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const AuthenticationHandler = container.resolve(AuthenticateUserServices);

    const { user, token } = await AuthenticationHandler.execute({
      password,
      email,
    });
    return response.json({ user: classToClass(user), token });
  }
}
