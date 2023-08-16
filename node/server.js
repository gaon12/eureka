/** node.js module import */
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

/** node.js application initialize */
const app = express();
const port = 3000;
const userRouter = require('./route/userRouter');
const carRouter = require('./route/carRouter');
const noticeRouter = require('./route/noticeRouter');
const workRouter = require('./route/workRouter');

app.set('port', process.env.port||port);
app.use(cors({
    origin: '*',
}));

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());
app.use(express.urlencoded( {extended: false} ));

/** connect config file */
const sessionOption = require('./lib/sessionOption');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);

/** set session */
app.use(session({
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