const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const bcrypt = require('bcrypt');

/** /GET, 로그아웃 메서드
 *  세션 파괴
 *  JSON 형식으로 http 상태 코드, 메시지 반환
 */
router.get('/signout', (req, res) => {
    try {
        if (req.session.is_logined) {
            req.session.destroy(() => {
                res.json({
                    "status": 200,
                    "message": "로그아웃 성공"
                })
            })
        } else {
            res.json({
                "status": 401,
                "message": "로그인 되지 않음"
            })
        }
    } catch(err) {
        res.json({
            "status": 500,
            "message": err.message
        })
    }
})

/** /POST, 로그인 메서드
 *  JSON 형식으로 http 상태코드, 메시지 반환
 */
router.post('/signin', (req, res) => {
    const dong = req.body.dong;
    const ho = req.body.ho;
    const pw = req.body.pw;

    // 동, 호, 비밀번호 입력되었는지 확인
    if (dong && ho && pw) {
        // DB에 일치하는 동과 호가 있는지 확인
        db.query('SELECT * FROM user WHERE dong = ? AND ho = ?', [dong, ho], (err, result) => {
            if (err)
                console.log(err);
            // 일치하는 동과 호가 있을 때
            if (result.length > 0) {
                // 입력된 비밀번호와 해시된 값이 일치하는지 비교
                bcrypt.compare(pw, result[0].pw, (err, result) => {
                    // 비밀번호가 일치한다면
                    if (result === true) {
                        // 세션 갱신
                        req.session.is_logined = true;
                        req.session.nickname = dong + '-' + ho;
                        req.session.save(() => {
                            res.json({
                                "status": 200,
                                "message": req.session.nickname + " 로그인 성공"
                            });
                        });
                    }
                    // 비밀번호가 일치하지 않는다면
                    else {
                        res.json({
                            "status": 401,
                            "message": "비밀번호 불일치"
                        });
                    }
                })
            } else { // DB에 아이디가 없다면
                res.json({
                    "status": 401,
                    "message": "등록되지 않은 사용자"
                });
            }
        });
    }
    // 입력되지 않은 값이 있는 경우
    else {
        res.json({
            "status": 400,
            "message": "필수 항목 입력 필요"
        });
    }
});

/** /POST, 회원가입 메서드
 *  phone2 항목이 빈칸이면 NULL로 채움
 *  JSON 형식으로 http 상태 코드, 메시지 반환
 */
router.post('/signup', (req, res) => {
    const dong = req.body.dong;
    const ho = req.body.ho;
    const username = req.body.username;
    const pw1 = req.body.pw1;
    const pw2 = req.body.pw2;
    const phone1 = req.body.phone1;
    const phone2 = req.body.phone2;
    const movein = req.body.movein;

    // phone2 제외 모든 항목 입력 필수
    if (dong && ho && username && pw1 && pw2 && phone1 && movein) {
        // DB에 같은 동, 호가 있는지 확인
        db.query('SELECT * FROM user WHERE dong = ? AND ho = ?', [dong, ho], (err, result) => {
            if (err)
                console.log(err);
            // DB에 같은 동, 호가 없고 비밀번호와 비밀번호 확인이 일치할 때
            if (result.length <= 0 && pw1 === pw2) {
                const hasedPw = bcrypt.hashSync(pw1, 10);
                // phone2가 입력되었을 때
                if (phone2) {
                    db.query('INSERT INTO user (dong, ho, username, pw, phone1, phone2, movein) VALUES(?, ?, ?, ?, ?, ?, ?)', [dong, ho, username, hasedPw, phone1, phone2, movein], (err) => {
                        if (err)
                            console.log(err);
                        req.session.save(() => {
                            res.json({
                                "status": 201,
                                "message": "회원가입 성공"
                            });
                        });
                    });
                }
                // phone2가 빈칸일 때
                else {
                    db.query('INSERT INTO user (dong, ho, username, pw, phone1, movein) VALUES(?, ?, ?, ?, ?, ?)', [dong, ho, username, hasedPw, phone1, movein], (err) => {
                        if (err)
                            console.log(err);
                        req.session.save(() => {
                            res.json({
                                "status": 201,
                                "message": "회원가입 성공"
                            });
                        });
                    });
                }
            }
            // 비밀번호와 비밀번호 확인이 일치하지 않을 때
            else if (pw1 !== pw2) {
                res.json({
                    "status": 400,
                    "message": "비밀번호 재확인 필요"
                });
            }
            // 이미 존재하는 회원일 때
            else {
                res.json({
                    "status": 409,
                    "message": "이미 존재하는 회원"
                });
            }
        });
    }
    // 필수 항목이 입력되지 않았을 때
    else {
        res.json({
            "status": 400,
            "message": "필수 항목 입력 필요"
        });
    }
});

module.exports = router;