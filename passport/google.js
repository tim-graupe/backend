<<<<<<< HEAD
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.googleID,
//       clientSecret: process.env.googleSecret,
//       callbackURL: "https://tim-graupe.github.io/frontend",
//       passReqToCallback: true,
//     },
//     function (request, accessToken, refreshToken, profile, done) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//       });
//     }
//   )
// );
=======
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleID,
      clientSecret: process.env.googleSecret,
      callbackURL: "https://tim-graupe.github.io/frontend",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
>>>>>>> 218bb65796a9ec24b3b524c5afa3526a7cb9bab8
