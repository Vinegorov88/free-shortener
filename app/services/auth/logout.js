module.exports = function logout(req, res, user, success){
    user.save(function(err){
        if(!err){    
            delete req.session.user;
            req.session.save(function() {
                success();
            });       
        }
    });     
}