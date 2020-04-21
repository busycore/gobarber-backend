import { Router } from 'express';

import AuthenticateUserServices from '../services/AuthenticateUserService';

const sessionsRouter = Router();

// Rota : Receber uma requisição ,chamar um arquivo e devolver uma resposta

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const AuthenticationHandler = new AuthenticateUserServices();

  const { user, token } = await AuthenticationHandler.execute({
    password,
    email,
  });
  delete user.password;
  return response.json({ user, token });
});

export default sessionsRouter;
