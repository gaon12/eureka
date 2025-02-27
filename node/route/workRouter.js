const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const rateLimit = require('express-rate-limit');

const { isAdmin } = require('../middleware/isAdmin');

// Configure rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

/** /GET, 업무일지 조회 메서드 */
router.get("/", isAdmin, limiter, async (req, res) => {
    try {
        const worklog = await db.query('SELECT * FROM worklog ORDER BY w_l_id DESC');
        return res.json({
            "status": 200, 
            "message": "업무일지 조회 성공", 
            "results": worklog[0]
        });
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

/** /POST, 업무일지 작성 메서드
 *  내용, 시작일(DATE), 종료일(DATE) 입력
 *  시작일과 종료일 예시 "20230815"
 */
router.post("/write", isAdmin, limiter, async (req, res) => {
    try {
        const content = req.body.content;
        const start = req.body.start;
        const end = req.body.end;

        /** 세션 정보를 이용해서 동, 호 추출하고 이를 기반으로 유저 고유 id 확인 */
        const nickname = req.session.nickname.split('-');
        const dong = nickname[0];
        const ho = nickname[1];

        const userSearch = await db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho])

        const userid = userSearch[0][0].id;

        if (content && start && end) {
            await db.query('INSERT INTO worklog (w_w_id, w_content, w_start, w_end) VALUES (?, ?, ?, ?)', [userid, content, start, end]);
            return res.json({
                "status": 201,
                "message": "업무일지 작성 완료"
            });
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