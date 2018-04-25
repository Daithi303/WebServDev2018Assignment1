import passport from 'passport';
import passportJWT from 'passport-jwt';
import Model from './../api/model/model';
import dotenv from 'dotenv';

dotenv.config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.jwtSecret;
const strategy = new JWTStrategy(jwtOptions, async function(payload, next) {
  console.log('payload received', payload);
  // usually this would be a database call:
  const user = await Model.User.find({userName: payload});
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

export default passport;