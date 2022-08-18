const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt')

const { User } = require('../models');

module.exports = () => {
    try {
        passport.use(new LocalStrategy({
            usernameField: 'email',       //req.body.email(id, nickname etc)
            passwordField: 'password',      //req.body.password
        }, async (email, password, done) => {
            const user = await User.findOne({
                where: { email }      //기존의 유저가 잇는지 
            });
            if (!user) {
                return done(null, false, { reason: '존재하지 않는 이메일입니다.' })   //서버, 성공, 클라이언트 
            }
            const result = await bcrypt.compare(password, user.password);  //내가 쓴 패스워드 , 디비에 잇는 패스워드

            if (result) {
                return done(null, user);    //성공에 사용다 정보를 넘겨줌
            }
            return done(null, false, { reason: '비밀번호가 틀렸습니다.' })
        }));
    }catch(error){
        console.log(error);
        return done(error);
    }
}