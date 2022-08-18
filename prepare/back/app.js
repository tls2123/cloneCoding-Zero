const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan')

const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');

const db = require('./models');
const passportConfig = require('./passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();
//한번 호출을 해주어야 한다.
const app = express();

db.sequelize.sync()
    .then(() => {
        console.log('db연결 성공');
    })
    .catch(console.error);

passportConfig();

app.use(morgan('dev'))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//미들웨어 4개
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/', (req, res) => { //Post/post
//     res.send('hello express');
// });

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
    console.log('서버 실행 중');
});