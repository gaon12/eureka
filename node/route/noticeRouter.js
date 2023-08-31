const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../lib/db');
const { isAdmin } = require('../middleware/isAdmin');

/** /GET, 모든 공지사항 조회 메서드
 *  JSON으로 반환
 */
router.get('/', async (req, res) => {
    try {
        const notice = await db.query('SELECT * FROM notice ORDER BY notice_id DESC');
        return res.json({
            "status": 200,
            "message": "공지사항 조회 성공",
            "results": notice[0]
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

/** /POST, 공지사항 작성 메서드
 *  카테고리, 제목, 내용 입력
 *  내용 토대로 요약
 */
router.post('/write', isAdmin, async (req, res) => {
    const category = req.body.category;
    const title = req.body.title;
    const content = req.body.content;
    const content2 = req.body.content2;
    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];
    let userid = '';
    let summary = '';

    const userSearch = await db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho]);
    if (userSearch[0].length > 0) {
        userid = userSearch[0][0].id;
    }

    // 카테고리, 제목, 내용 입력되었는지 확인
    if (category && title && content && content2) {
        const requestSummary = {
            document: {
                title: title,
                content: content
            },
            option: {
                language: 'ko',
                model: 'general',
                tone: 3,
                summaryCount: 3
            }
        };
        try {
            /** 클로바 요약 API에 POST 요청 */
            const response = await axios.post('https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize', JSON.stringify(requestSummary), {
                headers: {
                    "X-NCP-APIGW-API-KEY-ID": process.env.CLOVA_KEY_ID,
                    "X-NCP-APIGW-API-KEY": process.env.CLOVA_KEY,
                    "Content-Type": 'application/json'
                }
            }).then((response) => {
                summary = response.data.summary;
                db.query('INSERT INTO notice (noti_category, noti_w_id, title, content, content2, summary) VALUES(?, ?, ?, ?, ?, ?)', [category, userid, title, content, content2, summary]);
                return res.json({
                    "status": 201,
                    "message": "공지사항 작성 완료"
                });
            });
        } catch (err) {
            db.query('INSERT INTO notice (noti_category, noti_w_id, title, content, content2) VALUES(?, ?, ?, ?, ?)', [category, userid, title, content, content2]);
            return res.json({
                "status": 201,
                "message": "요약 없이 작성"
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