import passport from "passport";
import { Strategy as GithubStrategy } from 'passport-github'
// @ts-ignore
import { User as DBUser } from '../../models';
import { UserData } from "../../pages";

passport.use('github',
  new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/github/callback"
    },
    async (accessToken: unknown, refreshToken: unknown, profile, done) => {
      try {
        let userData: UserData;
        console.info(accessToken, refreshToken, profile, done);
        const data = {
          fullName: profile.displayName,
          avatarUrl: profile.photos?.[0].value || '',
          isActive: 0,
          username: profile.username,
          phone: '',
        }

        const obj: Omit<UserData, 'id'> = {
          fullName: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          isActive: 0,
          username: profile.username,
          phone: '',
        };

        const findUser = await DBUser.findOne({
          where: {
            username: data.username,
          },
        });

        if (!findUser) {
          const user = await DBUser.create(obj);
          userData = user.toJSON();
        } else {
          userData = await findUser.toJSON();
        }
        done(null, { ...userData });
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