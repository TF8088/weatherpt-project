const dataSource = require('../database/db');
const UserSchema = require('../database/entity/userEntity');
const postUserTable = dataSource.getRepository(UserSchema);

const authenticateUser = async (email, password, done) => {
  try {
    const user = await postUserTable.findOne({ where: { email: email } });
    // console.log(JSON.stringify(user, null, 2));
    if (!user) {
      return done(null, false);
    }
    // PASS WORD ECRYPT TODO
    if (password !== user.password) {
      console.log("err pass word false")
      return done(null, false, { message: 'Senha incorreta' });
    }
    return done(null, user);
  } catch (err) {
    console.log('Erro:', err);
    return done(err);
  }
};

const serializeUser =  (user, done) => {
  return done(null, user);
};

const deserializeUser = async (user, done) => {
  try {
    const userData = await postUserTable.findOne({where : { id : user.id }});
    return done(null, userData);
  } catch (err) {
    return done(err);
  }
}

module.exports = { serializeUser, deserializeUser, authenticateUser };