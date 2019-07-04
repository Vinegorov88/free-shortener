let Url = require('../models/Url');
let moment = require('moment');

//Showing abridged URLs
module.exports.browse = function(req, res){

    //We look at the database for user
    Url.find({userId: req.session.user._id}, function(err, items){

        //If there is an error, we redirect to page 404
        if(err) return error404(req, res);

        //Render and submit user records to views
        res.render('profile/links/browse', {items: items});
    });
}


module.exports.show = function(req, res){

    //We get from the base a record corresponding to the submitted ID
    Url.findOne({_id: req.params.id}, function(err, item){

        //If there is an error, we redirect to page 404
        if(err) return error404(req, res);

        //We define variables
        var visits = {}, reverseObject = {}, object;

        //Reverse array
        item.visits.reverse();

        //We rotate every item of the array
        item.visits.forEach(function(item){ 

            //We check that the length of the object is less than 30
            if(Object.keys(visits).length < 30){

                //We check if the date already exists, if there is an increase in the visit with one more
                visits[item.date] = (visits[item.date] || 0) + 1;
            }      
        });

        //A function that reverse object
        function reverse(visits) {

            //Reverses the elements in array
            object = Object.keys(visits).reverse();

            //We rotate the array and add each of the elements to the object
            object.forEach(function(i) { 
                reverseObject[i] = visits[i];
            });

            //Return reverseObject;
            return reverseObject;
        }

        //We rewrite visits with the new changes
        visits = reverse(visits);

        //Render and upload visits to the chart
        res.render('profile/links/show', {visits: visits});
    }); 
}


module.exports.edit = function(req, res){

    //We get from the base a record corresponding to the submitted ID
    Url.findOne({_id: req.params.id}, function(err, item){

        //If there is an error, we redirect to page 404
        if(err) return error404(req, res);

        //Render and submitting an item to the edit page
        res.render('profile/links/edit', {item: item})
    });
}


module.exports.change = function(req, res){

    //We get from the base a record corresponding to the submitted ID
    Url.findOne({_id: req.params.id}, function(err, item){

        //If there is an error, we redirect to page 404
        if(err) return error404(req, res);

        //We overwrite the old link with the new one
        item.url = req.body.url;

        //We rewrite the old date with the new one
        item.date = moment().format("YYYY-MM-DD");

        //We rewrite the old hour with the current one
        item.hour = moment().format("hh:mm:ss");

        //We saved
        item.save(function(err){

            //We check for an error if there is a redirect to page 404
            if (err) return error404(req, res);

            //If everything went wrong and there is no error we redirect to the profile page with the new changes
            return res.redirect('/profile/links/browse');
        });
    });
}