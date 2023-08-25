const db = require('../lib/db');

exports.isAdmin = async (req, res, next) => {
    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];

    const userSearch = await db.query('SELECT isAdmin FROM user WHERE dong = ? AND ho = ?', [dong, ho]);
    const isAdmin = userSearch[0][0].isAdmin;

    if (isAdmin == 1) {
        next();
    } else {
        res.status(403).json({
            "status": 403,
            "error": {
                "errorCode": "E420",
                "message": "관리자 권한 필요"
            }
        });
    }
}