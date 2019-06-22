module.exports = function(req, res, next){
    if (typeof req.session.user == 'undefined'){
        return res.redirect('/auth/login');
    }
    next();
}