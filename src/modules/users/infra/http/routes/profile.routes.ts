import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profilerController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profilerController.show);
profileRouter.put('/', profilerController.update);

export default profileRouter;
