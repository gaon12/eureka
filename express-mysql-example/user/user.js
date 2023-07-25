const express = require('express');
const router = express.Router();
const path = require("path");

const mysql = require("mysql");
const dbconfig = require('../config/database.js');
const connection = mysql.createConnection(dbconfig);

/** 회원가입
 *  /user/signup으로 접속
 *  회원가입 페이지 반환
 */
router.get('/signup', (req, res) => {
    const filePath = path.join('../', 'static', 'index.html');
    res.sendFile(filePath);
})

/** 회원가입
 *  /user/signup으로 POST 요청
 *  phone2 값은 안받으면 NULL
 *  isAdmin 값은 기본값 0
 */
router.post('/signup', (req, res) => {
    const jsonData = req.body;
    console.log('Received data: ', jsonData);

    /** 요청받은 JSON 데이터 파싱해서 변수로 저장 */
    const dong = jsonData.dong;
    const ho = jsonData.ho;
    const username = jsonData.username;
    const pw1 = jsonData.pw1;
    const pw2 = jsonData.pw2;
    const phone1 = jsonData.phone1;
    const phone2 = jsonData.phone2;
    const movein = jsonData.movein;

    /** 회원가입 프로세스 */
    /** 필수 항목이 모두 존재하는지 확인 */
    if (dong && ho && pw1 && pw2 && username && phone1 && movein) {
        connection.connect();
        /** 동과 호가 DB에 이미 존재하는지 확인 */
        connection.query('SELECT * FROM user WHERE dong = ? AND ho = ?', [dong, ho], (error, results, fields) => {
            if (error) throw error;
            /** DB에 동과 호가 존재하지 않고 비밀번호와 비밀번호 확인이 일치하는지 확인 */
            if (results.length <= 0 && pw1 == pw2) {
                connection.query('INSERT INTO user (dong, ho, username, pw, phone1, phone2, movein) VALUES (?, ?, ?, ?, ?, ?, ?)', [dong, ho, username, pw1, phone1, phone2, movein], (error, data) => {
                    if (error) throw error;
                    /** 프론트엔드로 회원가입 성공 반환하는 코드 작성
                     *  1안 : 메시지만 전달해서 프론트엔드에서 alert
                     *  2안 : 백엔드에서 스크립트 전송해서 alert
                     *  프론트엔드 팀과 협의 필요
                     */
                });
            } else if (pw1 != pw2) {
                /** 프론트엔드로 비밀번호와 비밀번호 확인이 불일치 하다는 결과 반환하는 코드 작성
                 *  1안 : 메시지만 전달해서 프론트엔드에서 alert
                 *  2안 : 백엔드에서 스크립트 전송해서 alert
                 *  프론트엔드 팀과 협의 필요
                 */
            }
            else {
                /** 프론트엔드로 이미 존재하는 회원이라고 반환하는 코드 작성
                 *  1안 : 메시지만 전달해서 프론트엔드에서 alert
                 *  2안 : 백엔드에서 스크립트 전송해서 alert
                 *  프론트엔드 팀과 협의 필요
                 */
            }
        });
    }
    else {
        /** 프론트엔드로 입력되지 않은 정보가 있다고 반환하는 코드 작성
         *  1안 : 메시지만 전달해서 프론트엔드에서 alert
         *  2안 : 백엔드에서 스크립트 전송해서 alert
         *  프론트엔드 팀과 협의 필요
         */
    }
});

/** 로그인
 *  /user/signin으로 접속
 *  로그인 페이지 반환
 */
router.get('/signin', (req, res) => {
    const filePath = path.join('../', 'static', 'index2.html');
    res.sendFile(filePath);
})

/** 로그인
 *  /user/signin으로 POST 요청
 *  동, 호, 비밀번호 입력
 *  세션으로 로그인 유지 예정
 */
router.post('/signin', (req, res) => {
    /** 로그인 로직 처리 */
})

/** 로그아웃
 *  /user/signout으로 GET 요청
 *  세션 종료 후 /로 리다이렉트
 */
router.get('/signout', (req, res) => {
    /** 로그아웃 로직 처리 */
})

module.exports = router;