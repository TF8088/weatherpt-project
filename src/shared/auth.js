const passport = require('passport');
const dataSource = require('../database/db');
const LocalStrategy = require('passport-local').Strategy;
const UserSchema = require('../database/entity/userEntity');
const postUserTable = dataSource.getRepository(UserSchema);

const authenticateUser = async (email, password, done) => {
  console.log("authenticateUser")
  try {
    const user = await postUserTable.findOne({ where: { email: email } });
    console.log(JSON.stringify(user, null, 2));
    if (!user) {
      console.log("inside not user"); 
      return done(null, false);
    }
    if (password !== user.password) {
      return done(null, false, { message: 'Senha incorreta' });
    }
    return done(null, user);
  } catch (err) {
    console.log('Erro:', err);
    return done(err);
  }
};

const serializeUser = async (user, done) => {
  console.log(user);
  return done(null, user);
};

const deserializeUser = async (id, done) => {
  console.log("deserializeUser"); 
  User.findById(id, function (err, user) {
    return done(err, user);
  });
}

module.exports = { serializeUser, deserializeUser, authenticateUser };