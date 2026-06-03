const db = require('../lib/db');

exports.isAdmin = async (req, res, next) => {
    if (!req.session?.is_logined || !req.session?.nickname) {
        return res.status(401).json({
            "status": 401,
            "error": {
                "errorCode": "E404",
                "message": "세션 정보 없음"
            }
        });
    }

    const nickname = req.session.nickname.split('-');
    const dong = nickname[0];
    const ho = nickname[1];

    const [userSearch] = await db.query('SELECT isAdmin FROM user WHERE dong = ? AND ho = ?', [dong, ho]);
    const isAdmin = userSearch[0]?.isAdmin;

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
