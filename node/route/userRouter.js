const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const bcrypt = require('bcrypt');
const { isAdmin } = require('../middleware/isAdmin');
const { isSignin } = require('../middleware/isSignin');
const { isSignout } = require('../middleware/isSignout');

/** /GET, 관리자 여부 판단 메서드 */
router.get('/isAdmin', isSignin, async (req, res, next) => {
    try {
        const nickname = req.session.nickname.split('-');
        const dong = nickname[0];
        const ho = nickname[1];
        const isAdmin = await db.query('SELECT isAdmin FROM user WHERE dong = ? AND ho = ?', [dong, ho]);

        return res.json({
            "status": 200,
            "message": isAdmin[0][0].isAdmin
        })
    } catch (error) {
        console.error(error);
        return res.json({
            "status": 500,
            "error": {
                "errorCode": "E500",
                "message": "서버 에러"
            }
        })
    }
})

/** /GET, 유저 정보 조회 메서드 */
router.get('/info', isAdmin, async (req, res, next) => {
    try {
        const [users] = await db.query('SELECT dong, ho, username, movein, phone1, phone2 FROM user WHERE isAdmin != 1');

        return res.json({
            "status": 200,
            "results": users
        });
    } catch (err) {
        console.log(err);
        return res.json({
            "status": 500,
            "error": {
                "errorCode": "E500",
                "message": "서버 에러"
            }
        });
    }
});

/** /GET, 로그아웃 메서드
 *  세션 파괴
 *  JSON 형식으로 http 상태 코드, 메시지 반환
 */
router.get('/signout', isSignin, async (req, res, next) => {
    try {
        if (req.session.is_logined) {
            await new Promise((resolve, reject) => {
                res.clearCookie(process.env.SESSION_KEY);
                req.session.destroy(err => {
                    if (err) 
                        reject(err);
                    else 
                        resolve();
                });
            });
            
            return res.json({
                "status": 200,
                "message": "로그아웃 성공"
            });
        } else {
            return res.json({
                "status": 400,
                "error": {
                    "errorCode": "E404",
                    "message": "세션 정보 없음"
                }
            })
        }
    } catch(err) {
        return res.json({
            "status": 500,
            "error": {
                "errorCode": "E500",
                "message": "서버 에러"
            }
        });
    }
});

/** /POST, 로그인 메서드
 *  JSON 형식으로 http 상태코드, 메시지 반환
 */
router.post('/signin', isSignout, async (req, res, next) => {
    const dong = req.body.dong;
    const ho = req.body.ho;
    const pw = req.body.pw;

    try {
        // 동, 호, 비밀번호 입력되었는지 확인
        if (dong && ho && pw) {
            // DB에 일치하는 동과 호가 있는지 확인
            const [existUser] = await db.query('SELECT * FROM user WHERE dong = ? AND ho = ?', [dong, ho]);
                
            if (existUser.length > 0) {
                const isPwMatch = await bcrypt.compare(pw, existUser[0].pw);

                if (isPwMatch) {
                    if (req.session.is_logined) {
                        return res.json({
                            "status": 400,
                            "error": {
                                "errorCode": "E406",
                                "message": "이미 로그인 된 사용자"
                            }
                        })
                    }

                    req.session.is_logined = true;
                    req.session.nickname = dong + '-' + ho;
                    await new Promise((resolve, reject) => {
                        req.session.save(err => {
                            if (err) 
                                reject(err);
                            else 
                                resolve();
                        });
                    });

                    return res.json({
                        "status": 200,
                        "message": req.session.nickname + " 로그인 성공"
                    });
                } else {
                    return res.json({
                        "status": 400,
                        "error": {
                            "errorCode": "E401",
                            "message": "아이디 or 비밀번호 오류"
                        }
                    });
                }
            } else {
                return res.json({
                    "status": 400,
                    "error": {
                        "errorCode": "E403",
                        "message": "등록되지 않은 사용자"
                    }
                });
            }
        }
        // 입력되지 않은 값이 있는 경우
        else {
            return res.json({
                "status": 400,
                "error": {
                    "errorCode": "E400",
                    "message": "필수 항목 미입력"
                }
            });
        }
    } catch (err) {
        return res.json({
            "status": 500,
            "error": {
                "errorCode": "E500",
                "message": "서버 에러"
            }
        });
    }
});

/** /POST, 회원가입 메서드
 *  phone2 항목이 빈칸이면 NULL로 채움
 *  JSON 형식으로 http 상태 코드, 메시지 반환
 */
router.post('/signup', isSignout, async (req, res, next) => {
    const dong = req.body.dong;
    const ho = req.body.ho;
    const username = req.body.username;
    const pw1 = req.body.pw1;
    const pw2 = req.body.pw2;
    const phone1 = req.body.phone1;
    const phone2 = req.body.phone2;
    const movein = req.body.movein;

    try {
        // phone2 제외 모든 항목 입력 필수
        if (dong && ho && username && pw1 && pw2 && phone1 && movein) {
            const existUser = await db.query('SELECT * FROM user WHERE dong = ? AND ho = ?', [dong, ho]);
            // DB에 같은 동, 호가 없고 비밀번호와 비밀번호 확인이 일치할 때
            if (existUser[0].length <= 0 && pw1 === pw2) {
                const hasedPw = bcrypt.hashSync(pw1, 10);
                // phone2가 입력되었을 때
                if (phone2) {
                    await db.query('INSERT INTO user (dong, ho, username, pw, phone1, phone2, movein) VALUES(?, ?, ?, ?, ?, ?, ?)', [dong, ho, username, hasedPw, phone1, phone2, movein]);
                } else {
                    await db.query('INSERT INTO user (dong, ho, username, pw, phone1, movein) VALUES(?, ?, ?, ?, ?, ?)', [dong, ho, username, hasedPw, phone1, movein]);
                }

                req.session.save(() => {
                    return res.json({
                        "status": 201,
                        "message": "회원가입 성공"
                    });
                });
            } else if (pw1 !== pw2) {
                return res.json({
                    "status": 400,
                    "error": {
                        "errorCode": "E402",
                        "message": "비밀번호 불일치"
                    }
                });
            } else {
                return res.json({
                    "status": 400,
                    "error": {
                        "errorCode": "E405",
                        "message": "이미 존재하는 회원"
                    }
                });
            }
        } else {
            return res.json({
                "status": 400,
                "error": {
                    "errorCode": "E400",
                    "message": "필수 항목 미입력"
                }
            });
        } 
    } catch (err) {
        return res.json({
            "status": 500,
            "error": {
                "errorCode": "E500",
                "message": "서버 에러"
            }
        });
    }
});

module.exports = router;