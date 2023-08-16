const express = require('express');
const router = express.Router();
const db = require('../lib/db');

/** /GET, 업무일지 조회 메서드 */
router.get("/", (req, res) => {
    db.query('SELECT * FROM worklog ORDER BY w_l_id DESC', (err, result) => {
        res.json(result);
    })
})

/** /POST, 업무일지 작성 메서드
 *  내용, 시작일(DATE), 종료일(DATE) 입력
 *  시작일과 종료일 예시 "20230815"
 */
router.post("/write", (req, res) => {
    const content = req.body.content;
    const start = req.body.start;
    const end = req.body.end;

    /** 세션 정보를 이용해서 동, 호 추출하고 이를 기반으로 유저 고유 id 확인 */
    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];
    let userid = '';

    db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho], (err, result) => {
        userid = result[0].id
    })

    if (content && start && end) {
        db.query('INSERT INTO worklog (w_w_id, w_content, w_start, w_end) VALUES (?, ?, ?, ?)', [userid, content, start, end], () => {
            res.json({
                "status": 201,
                "message": "업무일지 작성 완료"
            })
        })
    } else {
        res.json({
            "status": 400,
            "message": "필수 항목 입력 필요"
        })
    }
})

module.exports = router;