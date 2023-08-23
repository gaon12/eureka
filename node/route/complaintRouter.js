const express = require('express');
const router = express.Router();
const db = require('../lib/db');

/** /POST, 민원 작성 메서드 */
router.post('/write', async (req, res) => {
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
                "message": "제출 성공"
            });
        } catch (err) {
            return res.json({
                "status": 500,
                "message": "Server Error"
            });
        }
    } else {
        return res.json({
            "status": 400,
            "message": "필수 항목 입력 필요"
        });
    }
});

module.exports = router;