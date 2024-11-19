import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import { secret } from '../config/auth.config';
import { getUserById } from '../models';

interface JwtPayload {
  id: string;
}

export default function configurePassport(passport: passport.PassportStatic): void {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  passport.use(new JwtStrategy(opts, (jwt_payload: JwtPayload, done: VerifiedCallback) => {
    getUserById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => {
        return done(err, false);
      });
  }));
}