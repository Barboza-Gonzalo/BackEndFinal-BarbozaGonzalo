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

const adminOnly = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
    }
};

const userOnly = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'usuario') {
        return next();
    } else {
        res.redirect('/products')
    }
};

module.exports = {
    aprob,
    notAprob,
    adminOnly,
    userOnly};