const express = require('express');
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const userRouter = require('./user/user.js');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/react-project/build'));
app.use(session({
    secret: 'eureka',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.use('/user', userRouter);

/** 리액트 파일 반환
 *  라우팅은 리액트에서 처리
 */
app.get("*", (req, res) => {
    const filePath = path.join(__dirname, 'react-project', 'build', 'index.html');
    res.sendFile(filePath);
});

app.listen(app.get('port'),() => {
    console.log('Express server listening on port ' + app.get('port'));
});