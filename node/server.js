/** node.js module import */
const express = require('express'); // express
const session = require('express-session'); // express 세션 설정
const path = require('path'); // 경로 설정
const bodyParser = require('body-parser'); // JSON 파싱
const cors = require('cors'); // CORS 설정

/** node.js application initialize */
const app = express();
const port = 3000; // 접속 포트
// 라우팅 파일 연결
const userRouter = require('./route/userRouter');
const carRouter = require('./route/carRouter');
const noticeRouter = require('./route/noticeRouter');
const workRouter = require('./route/workRouter');

app.set('port', process.env.port||port); // 포트 지정
// CORS 설정
app.use(cors({
    origin: '*',
}));

app.use(express.static(path.join(__dirname, '/build'))); // 정적 파일 경로
app.use(bodyParser.json());
app.use(express.urlencoded( {extended: false} ));

/** connect config file */
const sessionOption = require('./lib/sessionOption');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption); // MySQL에 세션 저장

/** set session */
app.use(session({
    httpOnly: false,
    key: 'eureka',
    secret: 'eureka',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

/** routing */
app.use('/user', userRouter);
app.use('/car', carRouter);
app.use('/notice', noticeRouter);
app.use('/work', workRouter);

/** /GET, 서비스 접속 메서드
 *  라우팅은 리액트에서 관리하므로 다른 페이지로 이동하는 별도의 API는 제공하지 않음
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(process.env.port||port, () => {
    console.log(`Node.js server listening at port ${process.env.port||port}`);
});