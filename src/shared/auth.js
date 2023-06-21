const passport = require('passport');
const dataSource = require('../database/db');
const LocalStrategy = require('passport-local').Strategy;
const UserSchema = require('../database/entity/userEntity');
const postUserTable = dataSource.getRepository(UserSchema);

// function userAuthenticate2(username, password, done) {
//   /* Alterar codigo Para o meu Projeto Fonte: Documenteção */
//   // postUserTable.findOne({ where: { username: username } }, function (err, user) {
//   //   console.log(user)
//   // })
//   console.log("Teste");
//   // User.findOne({ username: username }, function (err, user) {
//   //   if (err) { return done(err); }
//   //   if (!user) { return done(null, false); }
//   //   if (!user.verifyPassword(password)) { return done(null, false); }
//   //   return done(null, user);
//   // });
// }
var userAuthenticate = new LocalStrategy((username, password, done) => {
  try {
    console.log("Teste");
  } catch (err) {
    console.log("Err ", err)
  }
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = { serializeUser, deserializeUser, userAuthenticate};
