module.exports = function(req, res, next) {
    res.locals.session = req.session;
    res.locals.flash = req.flash;
    res.locals.lang = req.lang;
    res.locals.req = req;
    next();
}