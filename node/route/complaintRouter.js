const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { isSignin } = require('../middleware/isSignin');
const { isAdmin } = require('../middleware/isAdmin');

/** /GET, 민원 조회 메서드 */
router.get('/', isAdmin, async (req, res) => {
    const complaint = await db.query('SELECT * FROM complaint ORDER BY complaint_id DESC');

    return res.json({
        "status": 200,
        "message": "민원 조회 성공",
        "results": complaint[0]
    });
})

/** /POST, 민원 작성 메서드 */
router.post('/write', isSignin, async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];
    let userid = '';

    const userSearch = await db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho]);
    if (userSearch[0].length > 0) {
        userid = userSearch[0][0].id;
    }

    if (title && content) {
        try {
            await db.query('INSERT INTO complaint (title, content, c_w_id) VALUES (?, ?, ?)', [title, content, userid]);
            return res.json({
                "status": 201,
                "message": "민원 제출 성공"
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
    } else {
        return res.json({
            "status": 400,
            "error": {
                "errorCode": "E400",
                "message": "필수 항목 미입력"
            }
        });
    }
});

module.exports = router;