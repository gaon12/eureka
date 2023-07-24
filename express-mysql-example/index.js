const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/react-project/build'))

/** 회원가입
 *  /user/signup으로 접속
 *  회원가입 페이지 반환
 */
app.get('/user/signup', (req, res) => {
    const filePath = path.join(__dirname, 'react-project', 'build', 'index.html')
    res.sendFile(filePath)
})

/** 회원가입
 *  /user/signup으로 POST 요청
 *  phone2 값은 안받으면 NULL
 *  isAdmin 값은 기본값 0
 */
app.post('/user/signup', (req, res) => {
    const jsonData = req.body;
    console.log('Received data: ', jsonData);

    try {
        /** 받은 JSON 데이터 파싱 */
        console.log('동: ', jsonData.dong);
        console.log('호: ', jsonData.ho);
        console.log('이름: ', jsonData.username);
        console.log('비밀번호: ', jsonData.pw);
        console.log('전화번호: ', jsonData.phone1);
        console.log('예비 전화번호: ', jsonData.phone2);
        console.log('전입일: ', jsonData.movein);
        console.log('관리자 여부: ', jsonData.isAdmin);

        /** DB 커넥션 생성 */
        connection.connect();
        /** DB 데이터 삽입 쿼리 전송 */
        connection.query(`INSERT INTO user (dong, ho, username, pw, phone1, phone2, movein) 
            VALUES ('${jsonData.dong}', '${jsonData.ho}', '${jsonData.username}', '${jsonData.pw}', '${jsonData.phone1}', '${jsonData.phone2}', '${jsonData.movein}')`);
    } catch (error) {
        console.error(error);
    }

    res.send({message: 'Data received successfully!'});

    // return res.redirect("/");
});

app.listen(app.get('port'),() => {
    console.log('Express server listening on port ' + app.get('port'));
});