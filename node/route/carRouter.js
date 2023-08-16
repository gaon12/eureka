const express = require('express');
const router = express.Router();
const db = require('../lib/db');

/** /POST, 차량 추가 등록 메서드 */
router.post('/regist', (req, res) => {
    /** 세션 정보를 이용해서 동, 호 추출하고 이를 기반으로 유저 고유 id 확인 */
    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];
    let userid = '';

    db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho], (err, result) => {
        userid = result[0].id
    })

    const carNumber = req.body.car_number;
    const guest = req.body.guest_car;
    const electric = req.body.electric_car;
    const disabled = req.body.disabled_car;

    /** 이미 등록 되어 있는 차량인지 확인 */
    db.query('SELECT * FROM car WHERE car_number = ?', [carNumber], (err, result) => {
        if (err)
            console.log(err);
        /** 이미 등록 되어 있는 차량일 때 */
        if (result.length > 0) {
            res.json({
                "status": 400,
                "message": "이미 등록 된 차량"
            })
        }
        /** 신규 등록 차량일 때 */
        else {
            db.query('INSERT INTO car (car_r_id, car_number, guest_car, electric_car, disabled_car) VALUES (?, ?, ?, ?, ?)', [userid, carNumber, guest, electric, disabled], (err, result) => {
                if (err)
                    console.log(err);
                if (result.length > 0) {
                    res.json({
                        "status": 201,
                        "message": "차량 등록 성공"
                    })
                }
            })
        }
    })
})

/** /GET, 차량 정보 요청 메서드
 *  차량 번호로 요청
 *  JSON 형식으로 http 상태 코드, 차량 등록 정보 반환
 */
router.get('/info', (req, res) => {
    const carNumber = req.body.car_number;

    /** 등록 되어 있는 차량인지 검색 */
    db.query('SELECT * FROM car WHERE car_number = ?', [carNumber], (err, result) => {
        if (err)
            console.log(err);
        /** 등록 되어 있는 차량일 때 */
        if (result.length > 0) {
            /** 차량 번호를 기반으로 사용자 정보와 차량 정보 검색 */
            db.query('SELECT u.username, u.dong, u.ho, u.phone1, u.phone2, c.car_number, c.guest_car, c.electric_car, c.disabled_car, c.registered FROM user u JOIN car c ON u.id = c.car_r_id WHERE c.car_number = ?', [carNumber], (err, result) => {
                // DB에서 차량과 관련된 정보 JSON으로 반환
                res.json({
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
                    "disabledCar": result[0].disabled_car,
                })
            })
        }
        /** 등록 되어 있지 않은 차량일 때 */
        else {
            res.json({
                "status": 404,
                "message": "미등록 차량"
            })
        }
    })
})

module.exports = router;