passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleID,
      clientSecret: process.env.googleSecret,
      callbackURL: "http://localhost:3000/",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);