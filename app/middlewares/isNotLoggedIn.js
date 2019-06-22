let error404 = require('../services/error404');

module.exports = function(req, res, next){
    if (typeof req.session.user != 'undefined') return error404(req, res);
    next();
}