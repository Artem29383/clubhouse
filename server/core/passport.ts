import passport from "passport";
import { Strategy as GithubStrategy } from 'passport-github'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// @ts-ignore
import { User as DBUser } from '../../models';
import { UserData } from "../../pages";
import { createJwtToken } from '../../utils/createJwtToken';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  'jwt',
  new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, jwt_payload.data);
  }),
);

passport.use('github',
  new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/github/callback"
    },
    async (accessToken: unknown, refreshToken: unknown, profile, done) => {
      try {
        let userData: UserData;

        let obj: Omit<UserData, 'id'> = {
          fullName: profile.displayName,
          avatarUrl: profile.photos?.[0].value || '',
          isActive: 0,
          username: profile.username,
          phone: '',
        }

        const findUser = await DBUser.findOne({
          where: {
            username: obj.username,
          },
        });

        if (!findUser) {
          const user = await DBUser.create(obj);
          userData = user.toJSON();
        } else {
          userData = await findUser.toJSON();
        }
        done(null, { ...userData, token: createJwtToken(userData) });
      } catch (e) {
        done(e);
      }
    }
  ));


passport.serializeUser(function (user: UserData, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  DBUser.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  });
});

export { passport };
