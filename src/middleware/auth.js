const aprob = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

const notAprob = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
};

module.exports = {aprob,notAprob};