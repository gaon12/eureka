module.exports = {
    isOwner: (req, res) => {
        if (req.session.is_logined) {
            return true;
        } else {
            return false;
        }
    },
    statusUI: (req, res) => {
        /** 관리자인지 입주민인지 확인
         *  프론트엔드에 JSON 형식으로 메시지 전달
         *  사용자에 맞게 페이지 반환
         */
    }
}