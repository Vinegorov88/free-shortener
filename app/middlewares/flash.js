module.exports = function(req, res, next){
    req.flash = (req.session.flash) ? JSON.parse(JSON.stringify(req.session.flash)) : {};
    req.session.flash = {};
    next();
}