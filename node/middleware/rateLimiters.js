const rateLimit = require('express-rate-limit');

const standardHandler = (req, res, next, options) => {
    res.status(options.statusCode).json({
        status: options.statusCode,
        error: {
            errorCode: 'E429',
            message: options.message
        }
    });
};

const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    handler: standardHandler
});

const authLimiter = rateLimit({
    windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    handler: standardHandler
});

module.exports = {
    apiLimiter,
    authLimiter
};
