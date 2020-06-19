import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();
// Rota : Receber uma requisição ,chamar um arquivo e devolver uma resposta

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
