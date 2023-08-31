exports.isSignout = async (req, res, next) => {
    if (!req.session.is_logined) {
        next();
    } else {
        res.json({
            "status": 400,
            "error": {
                "errorCode": "E406",
                "message": "이미 로그인 되어 있음"
            }
        });
    }
}