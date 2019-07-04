let error404 = require('../services/error404');
let login = require('../services/auth/login');
let logout = require('../services/auth/logout');
let User = require('../models/User');

module.exports.register = function(req, res){
    res.render('auth/register');
}

module.exports.login = function(req, res){
    res.render('auth/login');
}

//Check before registration
module.exports.handleRegister = function(req, res){

    //We define variables
    let errors = {}, lastIntroduced = {}, date, newUser;

    //We are looking at the user base that responds to the submitted username
    User.findOne({username: req.body.username}, async function(err, user){

        //If there is already a registered user with such a username, we add text that responds to the error
        if(user) errors.username = req.lang["errors.register.usernameExists"];

        //If no username is added, we add text that responds to the error
        if(!req.body.username) errors.username = req.lang['errors.cannotBeEmpty'];

        //Add a username in lastIntroduced
        else lastIntroduced.username = req.body.username;

        //If no password is added, we add text that responds to the error
        if(!req.body.password) errors.password = req.lang['errors.cannotBeEmpty'];

        //If the password is shorter than 6 characters and longer than 20 characters, we add text that responds to the error
        else if(req.body.password.length < 6 || req.body.password.length > 20) errors.password = req.lang["errors.register.passwordTooShort"];

        //If no repeatPassword is added, we add text that responds to the error
        if(!req.body.repeatPassword) errors.repeatPassword = req.lang['errors.cannotBeEmpty'];

        //If the repeating password is different, we add text that responds to the error
        else if(req.body.password != req.body.repeatPassword) errors.repeatPassword = req.lang['errors.register.invalidPassword'];

        //If no email is added, we add text that responds to the error
        if(!req.body.email) errors.email = req.lang['errors.cannotBeEmpty'];

        //Add a email in lastIntroduced
        else lastIntroduced.email = req.body.email;

        //If no agreeTerm is added, we add text that responds to the error
        if(!req.body.agreeTerm) errors.agreeTerm = req.lang['errors.register.isNotTicked'];

        //Check to see if there are any errors added
        if(Object.keys(errors).length != 0) {

            //Add errors to session.flash
            req.session.flash = { errors: errors, lastIntroduced: lastIntroduced};

            //Redirect to the corresponding page
            return res.redirect('/auth/register');
        }

        //We take today's date and time
        date = new Date();

        //We are making a new record in the database with the necessary information
        newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,     
            date: date.toLocaleString(),
        });

        //We record
        newUser.save(function(err){

            //We check for an error if there is a redirect to page 404
            if (err) return error404(req, res);

            //If everything went wrong and there is no error we redirect to the login page
            return res.redirect('/auth/login');
        });
    });
}


//Check logging
module.exports.handleLogin = async function(req, res){

    //We define variables
    let user, errors = {}, lastIntroduced = {};

    try {
        //If no username is added, we add text that responds to the error
        if(!req.body.username) errors.username = req.lang['errors.cannotBeEmpty'];

        //Add a username in lastIntroduced
        else lastIntroduced.username = req.body.username;

        //If no password is added, we add text that responds to the error
        if(!req.body.password) errors.password = req.lang['errors.cannotBeEmpty'];

        //We check if we have username and password entered
        if(req.body.username && req.body.password) { 

            //We check that there is a user with such a username and password
            user = await User.findOne({username: req.body.username, password: req.body.password});

            //If there is no such user, we add text that responds to the error
            if(!user) errors.username = req.lang['errors.login.failedLoggingIn'];
        }

        //Check to see if there are any errors added
        if(Object.keys(errors).length != 0) {

            //Add errors to session.flash
            req.session.flash = {errors: errors, lastIntroduced: lastIntroduced};

            //If everything went wrong and there is no error we redirect to the login page
            return res.redirect('/auth/login');
        }

        //We wait for answers from servecies login
        await login(req, res, user);  

        //If everything went wrong and there is no error we redirect to the profile page
        res.redirect('/profile/links/browse');
    }
    catch (e){

        //If there is a redirect error on page 404
        return error404(req, res);
    }
}



//User logout
module.exports.logout = function(req, res){

    //Searches in user base by session ID
    User.findOne({_id: req.session.user._id}, function(err, user){

        //We check whether there is an error and whether there is such a user
        if(!err && user){

            //We wait for answers from servecies logout
            logout(req, res, user, function(){

                //If everything went wrong and there is no error we redirect to the home page
                res.redirect('/');
            });    
        } 
        else {
            //If there is a redirect error on page 404
            return error404(req, res);
        }
    });
}