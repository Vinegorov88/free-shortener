module.exports = function login(req, res, user) {
    return new Promise(function(resolve, reject){
        req.session.user = user;
        req.session.save(function(err) {
            if(err) return reject(err);
            resolve();
        });
    });
}