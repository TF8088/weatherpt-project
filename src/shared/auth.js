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
var userAuthenticate = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await postUserTable.findOne({ where: { username: username } });
    if (!user) {
      return done(null, false);
    }
    // Implemente a lógica de verificação da senha aqui
    // Comparando a senha do usuário com a senha fornecida no callback

    if (password !== user.password) {
      return done(null, false, { message: 'Senha incorreta' });
    }

    return done(null, user);
  } catch (err) {
    console.log('Erro:', err);
    return done(err);
  }
});


const serializeUser = (function (user, done) {
  done(null, user.id);
});

const deserializeUser = (function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = { serializeUser, deserializeUser, userAuthenticate };