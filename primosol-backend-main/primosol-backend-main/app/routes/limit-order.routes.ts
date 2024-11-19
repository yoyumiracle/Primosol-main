import express, { Request, Response } from 'express';
import passport from 'passport';
import * as controller from '../controllers/limit-order.controller';

const router = express.Router();

router.route("/add").post(
    passport.authenticate('jwt', { session: false }), controller.addLimitOrder
);

router.route("/update").post(
    passport.authenticate('jwt', { session: false }), controller.updateLimitOrder
);

router.route("/remove").post(
    passport.authenticate('jwt', { session: false }), controller.removeLimitOrder
);

router.route("/get").post(
    passport.authenticate('jwt', { session: false }), controller.getLimitOrders
)

export default router;