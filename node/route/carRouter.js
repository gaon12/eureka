const express = require('express');
const router = express.Router();
const db = require('../lib/db');

const { isAdmin } = require('../middleware/isAdmin');

/** 차량 등록 거부 메서드 */
router.delete('/deny', async (req, res) => {
    const car_number = req.body.car_number;

    try {
        await db.query('DELETE FROM car WHERE car_number = ?', [car_number]);

        return res.json({
            "status": 201,
            "message": "차량 등록 거부"
        })
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

/** 차량 등록 승인 메서드 */
router.put('/approve', async (req, res) => {
    const car_number = req.body.car_number;

    try {
        await db.query('UPDATE car SET registered = 1, application_datetime = NOW() WHERE car_number = ?', [car_number]);

        return res.json({
            "status": 201,
            "message": "차량 등록 성공"
        })
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

/** /GET, 모든 차량 조회 메서드 */
router.get('/registered', async (req, res) => {
    try {
        const [rcars] = await db.query('SELECT * FROM car WHERE registered != 0');
        const [nrcars] = await db.query('SELECT * FROM car WHERE registered != 1');

        return res.json({
            "status": 200,
            "results": {
                "rcars": rcars,
                "nrcars": nrcars
            }
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

/** /POST, 차량 추가 등록 메서드 */
router.post('/regist', async (req, res) => {
    try {
        if (!req.session.nickname) {
            return res.json({
                "status": 400,
                "error": {
                    "errorCode": "E404",
                    "message": "세션 정보 없음"
                }
            });
        }

        /** 세션 정보를 이용해서 동, 호 추출하고 이를 기반으로 유저 고유 id 확인 */
        const nickname = req.session.nickname.split('-');
        const dong = nickname[0];
        const ho = nickname[1];

        const userSearch = await db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho])

        const userid = userSearch[0][0].id;

        const carNumber = req.body.car_number;
        const guest = req.body.guest_car;
        const electric = req.body.electric_car;
        const disabled = req.body.disabled_car;

        /** 이미 등록 되어 있는 차량인지 확인 */
        const existCar = await db.query('SELECT * FROM car WHERE car_number = ?', carNumber);
        if (existCar[0].length > 0) {
            return res.json({
                "status": 400,
                "error": {
                    "errorCode": "E411",
                    "message": "이미 등록 된 차량"
                }
            });
        }

        /** 차량 등록 메서드 */
        const insertCar = await db.query('INSERT INTO car (car_number, guest_car, electric_car, disabled_car, car_r_id) VALUES (?, ?, ?, ?, ?)', [carNumber, guest, electric, disabled, userid]);

        if (insertCar.length > 0) {
            return res.json({
                "status": 201,
                "message": "차량 등록 성공"
            });
        } else {
            return res.json({
                "status": 500,
                "error": {
                    "errorCode": "E501",
                    "message": "차량 등록 실패"
                }
            });
        }
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

/** /POST, 차량 정보 요청 메서드
 *  차량 번호로 요청
 *  JSON 형식으로 http 상태 코드, 차량 등록 정보 반환
 */
router.post('/info', isAdmin, async (req, res) => {
    try {
        const carNumber = req.body.car_number;

        const existCar = await db.query('SELECT * FROM car WHERE car_number = ?', [carNumber]);

        if (existCar.length > 0) {
            const carInfo = await db.query('SELECT u.username, u.dong, u.ho, u.phone1, u.phone2, c.car_number, c.guest_car, c.electric_car, c.disabled_car FROM user u JOIN car c ON u.id = c.car_r_id WHERE c.car_number = ?', [carNumber]);

            if (carInfo.length > 0) {
                return res.json({
                    "status": 200,
                    "message": "차량 정보 조회 성공",
                    "dong": result[0].dong,
                    "ho": result[0].ho,
                    "username": result[0].username,
                    "phone1": result[0].phone1,
                    "phone2": result[0].phone2,
                    "carNumber": result[0].car_number,
                    "guestCar": result[0].guest_car,
                    "electricCar": result[0].electric_car,
                    "disabledCar": result[0].disabled_car
                });
            } else {
                return res.json({
                    "status": 500,
                    "error": {
                        "errorCode": "E500",
                        "message": "서버 에러"
                    }
                });
            }
        } else {
            return res.json({
                "status": 400,
                "error": {
                    "errorCode": "E410",
                    "message": "등록되지 않은 차량"
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