import express, { Router } from 'express';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { depositFunds, withdrawFunds, swap } from '../controllers/swap.controller';

const router: Router = express.Router();

router.route("/token-swap").post(
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => swap(req, res)
);

router.route("/depositFunds").post(
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => depositFunds(req, res)
)

router.route("/withdrawFunds").post(
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => withdrawFunds(req, res)
)

export default router;