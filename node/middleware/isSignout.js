exports.isSignout = async (req, res, next) => {
    if (!req.session.is_logined) {
        next();
    } else {
        res.status(409).json({
            "status": 409,
            "error": {
                "errorCode": "E406",
                "message": "이미 로그인 되어 있음"
            }
        });
    }
}
