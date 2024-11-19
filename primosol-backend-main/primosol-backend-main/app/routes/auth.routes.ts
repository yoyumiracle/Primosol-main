import express, { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { requestMessage, verify } from '../controllers/auth.controller';

const router: Router = express.Router();

router.route("/request-message").post(
    (req: Request, res: Response, next: NextFunction) => requestMessage(req, res)
);

router.route("/verify").post(
    (req: Request, res: Response, next: NextFunction) => verify(req, res)
);

export default router;