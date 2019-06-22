let error404 = require('../services/error404');
let Url = require('../models/Url');
let config = require('../config/config');
let moment = require('moment');
let ip = require('ip');

//Short link shortened
module.exports.createURL = async function(req, res){

    //Regex to check a valid link
    let regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/; 
    
    //We check if we have a link
    if(!req.body.link){
        //We return status 500 with message
        return res.status(500).send(req.lang['errors.shorten.cannotBeEmpty']);
    }

    ////We return status 500 with message
    else if(!regex.test(req.body.link)) return res.status(500).send(req.lang['errors.shorten.invalidLink']); 

    try{     
        //We define variables
        let result, key, link, newItem, shorteningUrl;

        do {       
            //We generate a string of letters and numbers
            key = Math.random().toString(36).substring(7); 
    
            //We get all the records from the base
            result = await Url.findOne({key: key}).exec();
    
        } while(result != null) 

        //We accept the abridged URL
        link = req.body.link;

        //We check that there is a logged user
        if(req.session.user){

            //We're making a new record in the datebase
            newItem = new Url({
                userId: req.session.user._id,
                url: link,
                key: key,
                date: moment().format("YYYY-MM-DD"),
                hour: moment().format("hh:mm:ss"),
            });
        }
        else {
            
            //We're making a new record in the datebase
            newItem = new Url({
                url: link,
                key: key,
                date: moment().format("YYYY-MM-DD"),
                hour: moment().format("hh:mm:ss"),
                visits: [{}]
            });
        }
       
        //We record
        newItem.save();

        //We add the key to the page name
        shorteningUrl = config.app_url + key;

        //We send the shorted URL
        res.json(shorteningUrl);  

    } catch(err) {
        //If error, we return status 500 with message
        res.status(500).send('500 Internal Server Error');
    }
}



//Forward to the original link
module.exports.redirect = function(req, res){

    let key, date, ipAddress, visit;

    //We take the key of the submitted link
    key = req.params.key;

    //We check in the database whether there is a record with such a key
    Url.findOne({key: key}, function(err, url){

        //We check if there is an error and if there is such a url, if we do not refer to page 404
        if(err || !url) return error404(req, res);
        
        //Redirect to the original link
        else {

            //We take today's date
            date = moment().format("YYYY-MM-DD"),

            //We take today's time
            hour = moment().format("hh:mm:ss"),

            //We take ipAddress the visitor
            ipAddress = ip.address();

            //We create an array in which we add, date, userAgent, referer, ipAddress, to visit a link
            visit = {date: date, hour: hour, userAgent: req.headers['user-agent'], referer: req.headers['referer'], ipAddress: ipAddress}
                
            //Add the object to the data in the array
            url.visits.push(visit);

            //We saved
            url.save();

            //Redirect to the original link
            res.redirect(url.url);
        } 
    });
}