exports.isAdmin = (req, res, next) => {
    const nickname = req.session.nickname.split('-');
    const ho = nickname[1];

    if (ho === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
}