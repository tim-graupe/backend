// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const User = require("../models/newUserModel");

// export const local = new LocalStrategy(
//   {
//     usernameField: "email",
//   },
//   async function (email, password, done) {
//     try {
//       const user = await User.findOne({ email: email });

//       if (!user) {
//         console.log("Incorrect username.");
//         return done(null, false);
//       }

//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (!passwordMatch) {
//         console.log("Incorrect password.");
//         return done(null, false);
//       }
//       return done(null, user);
//     } catch (err) {
//       console.log(err);
//       return done(err);
//     }
//   }
// );

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(async function (id, done) {
//   try {
//     const user = await User.findById(id);

//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// module.exports = local;
