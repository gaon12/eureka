const isOwner = (req, res) => {
    if (req.session.is_logined) {
        return true;
    } else {
        return false;
    }
};
const statusUI = (req, res) => {
    var authStatusUI = 'require signin'
    if (isOwner(req, res)) {
        authStatusUI = 'success';
    }
    res.json([{ "message": authStatusUI }]);
};

module.exports = {
    isOwner: isOwner,
    statusUI: statusUI
};