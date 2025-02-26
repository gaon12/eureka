/** node.js module import */
const express = require('express'); // express
const session = require('express-session'); // express 세션 설정
const path = require('path'); // 경로 설정
const bodyParser = require('body-parser'); // JSON 파싱
const cors = require('cors'); // CORS 설정
const dotenv = require('dotenv');
const morgan = require('morgan');
const lusca = require('lusca');

dotenv.config();

/** node.js application initialize */
const app = express();
// 라우팅 파일 연결
const userRouter = require('./route/userRouter');
const carRouter = require('./route/carRouter');
const noticeRouter = require('./route/noticeRouter');
const workRouter = require('./route/workRouter');
const complaintRouter = require('./route/complaintRouter');

app.set('port', process.env.NODE_PORT); // 포트 지정
app.use(cors('*'));
app.use(express.static(path.join(__dirname, '/build'))); // 정적 파일 경로
app.use(bodyParser.json());
app.use(express.urlencoded( {extended: false} ));
app.use(morgan('dev'));

/** connect config file */
const sessionOption = require('./lib/sessionOption');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption); // MySQL에 세션 저장

/** set session */
app.use(session({
    httpOnly: true,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(lusca.csrf());

/** routing */
app.use('/user', userRouter);
app.use('/car', carRouter);
app.use('/notice', noticeRouter);
app.use('/work', workRouter);
app.use('/complaint', complaintRouter);

/** /GET, 서비스 접속 메서드
 *  라우팅은 리액트에서 관리하므로 다른 페이지로 이동하는 별도의 API는 제공하지 않음
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(process.env.NODE_PORT, () => {
    console.log(`Node.js server listening at port ${process.env.NODE_PORT}`);
});