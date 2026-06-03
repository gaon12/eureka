exports.isSignin = async (req, res, next) => {
    if (req.session.is_logined) {
        next();
    } else {
        res.status(401).json({
            "status": 401,
            "error": {
                "errorCode": "E404",
                "message": "세션 정보 없음"
            }
        });
    }
}
