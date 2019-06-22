module.exports = function(req, res, next) {
    if(!req.session.lang) req.session.lang = "en";
    req.lang = require('../lang/'+ req.session.lang);
    next();
}