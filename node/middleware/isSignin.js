exports.isSignin = async (req, res, next) => {
    if (req.session.is_logined) {
        next();
    } else {
        res.json({
            "status": 400,
            "error": {
                "errorCode": "E404",
                "message": "세션 정보 없음"
            }
        });
    }
}