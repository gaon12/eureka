const dbAuth = require('../secret/db.json');

var options = {
    host: dbAuth.host,
    user: dbAuth.user,
    password: dbAuth.password,
    database: dbAuth.database,
    port: dbAuth.port,

    // 만료된 세션 자동 확인 및 지우기 여부
    clearExpired: true,
    // 만료된 세션이 지워지는 빈도(ms)
    // 10초마다 확인
    checkExpirationInterval: 10000,
    // 유효한 세션의 최대 기간(ms)
    // 1시간
    expiration: 1000*60*60
};

module.exports = options;