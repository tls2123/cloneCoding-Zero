const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


const router = express.Router();



router.get('/', async(req, res, next) => {  // GET /user
    try{
        if(req.user){
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id},
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            res.status(200).json(fullUserWithoutPassword);
        }else{
            res.status(200).json(null);
        }
        
    }catch(error){
        console.error(error);
        next(error);
    }
})
//팔로우 목록 
router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
    try {
      const user = await User.findOne({ where: { id: req.user.id }});
      if (!user) {
        res.status(403).send('없는 사람을 찾으려고 하시네요?');
      }
      const followers = await user.getFollowers({
        limit: parseInt(req.query.limit, 10),
      });
      res.status(200).json(followers);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
//팔로잉 목록 
router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
    try {
      const user = await User.findOne({ where: { id: req.user.id }});
      if (!user) {
        res.status(403).send('없는 사람을 찾으려고 하시네요?');
      }
      const followings = await user.getFollowings({
        limit: parseInt(req.query.limit, 10),
      });
      res.status(200).json(followings);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
router.get('/:userId', async(req, res, next) => {  // GET /user
    try{
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.params.userId},
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            if(fullUserWithoutPassword){
                const data = fullUserWithoutPassword.toJSON();
                data.Posts = data.Posts.length; //개인 정보 침해 예방
                data.Followers = data.Followers.length;
                data.Followings = data.Followings.length;
                res.status(200).json(fullUserWithoutPassword);
            }else{
                res.status(404).json('존재하지 않는 사용자입니다.');
            }
    }catch(error){
        console.error(error);
        next(error);
    }
})
router.get('/:userId/posts', async (req, res, next) => {
    try {
        const where= { UserId: req.params.userId };
        if(parseInt(req.query.lastId, 10)){   //초기로딩이 아닐때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            },{
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            },{
                model: Post,
                as: 'Retweet',
                include: [{
                  model: User,
                  attributes: ['id', 'nickname'],
                }]
            },{
                model: Image,
            }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(next);
    }
});
//미들웨어 확장하는 방법을 통해서 next나 res req를 사용
router.post('/login', isNotLoggedIn, ( req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);   //서버쪽 에러
            return next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user, async(loginErr) => {
            if(loginErr){
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id},
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next);
});

router.post('/', isNotLoggedIn ,async(req, res, next) => {  //POST/user/ -> saga의 주소와 일치
    try{    
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if(exUser){
            return res.status(403).send('이미 사용중인 아이디입니다.')
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 이런식으로 cors에러를 처리하기도 하지만 미들웨어도 많이 사용
        res.status(201).send('ok');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/logout', isLoggedIn , (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout ok')
});

router.patch('/nickname', isLoggedIn, async(req, res, next) => {
    try{
        await User.update({
            nickname: req.body.nickname,
        },{
            where: { id: req.user.id},
        });
        res.status(200).json({nickname: req.body.nickname});
    }catch(error){
        console.error(error);
        next(error);
    }
});
//팔로우
router.patch('/:userId/follow', isLoggedIn, async(req, res, next) => {
    try{
        const user = await User.findOne({ where: {id:req.params.userId}});
        if(!user){
            res.status(403).send('유령을 팔로우 하시려고 하네요?')
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10)});
    }catch(error){
        console.error(error);
        next(error);
    }
});
//언팔로우
router.delete('/:userId/follow', isLoggedIn, async(req, res, next) => {
    try{
        const user = await User.findOne({ where: {id:req.params.userId}});
        if(!user){
            res.status(403).send('유령을 팔로우 하시려고 하네요?')
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10)});
    }catch(error){
        console.error(error);
        next(error);
    }
});

//팔로우 제거
router.delete('/follower/:userId', isLoggedIn, async(req, res, next) => {
    try{
        const user = await User.findOne({ where: {id:req.params.userId}});
        if(!user){
            res.status(403).send('팔로잉 제거')
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10)});
    }catch(error){
        console.error(error);
        next(error);
    }
});
router.get('/:userId', async(req, res, next) => {  // GET /user
    try{
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.params.userId},
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            if(fullUserWithoutPassword){
                const data = fullUserWithoutPassword.toJSON();
                data.Posts = data.Posts.length; //개인 정보 침해 예방
                data.Followers = data.Followers.length;
                data.Followings = data.Followings.length;
                res.status(200).json(fullUserWithoutPassword);
            }else{
                res.status(404).json('존재하지 않는 사용자입니다.');
            }
    }catch(error){
        console.error(error);
        next(error);
    }
})
module.exports = router;