const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../lib/db');
const clovaSummary = require('../secret/clovaSummary.json');

/** /GET, 최근 공지사항 조회 메서드(6개)
 *  JSON으로 반환
 */
router.get('/recent', (req, res) => {
    try {
        db.query('SELECT * FROM notice ORDER BY notice_id DESC LIMIT 5', (err, result, fields) => {
            res.json(result)
        })
    } catch (err) {
        res.json({
            "status": 500,
            "message": err
        })
    }
})

/** /POST, 공지사항 작성 메서드
 *  카테고리, 제목, 내용 입력
 *  내용 토대로 요약
 */
router.post('/write', async (req, res) => {
    const category = req.body.category;
    const title = req.body.title;
    const content = req.body.content;
    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];
    let userid = '';
    let summary = '';

    db.query('SELECT id FROM user WHERE dong = ? AND ho = ?', [dong, ho], (err, result, fields) => {
        userid = result[0].id
    })

    // 카테고리, 제목, 내용 입력되었는지 확인
    if (category && title && content) {
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
                    "X-NCP-APIGW-API-KEY-ID": clovaSummary["X-NCP-APIGW-API-KEY-ID"],
                    "X-NCP-APIGW-API-KEY": clovaSummary["X-NCP-APIGW-API-KEY"],
                    "Content-Type": 'application/json'
                }
            }).then((response) => {
                summary = response.data.summary
                db.query('INSERT INTO notice (noti_category, noti_w_id, title, content, summary) VALUES(?, ?, ?, ?, ?)', [category, userid, title, content, summary], (err, result, fields) => {
                    res.json({
                        "status": 201,
                        "message": "요약 성공",
                        "title": title,
                        "content": content,
                        "summary": summary
                    })
                });
            });
        } catch (err) {
            res.json({
                "message": err
            })
        }
    } else {
        res.json({
            "message": "필수 항목 입력 필요"
        })
    }
});

module.exports = router;