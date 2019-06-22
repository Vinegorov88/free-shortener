let Url = require('../models/Url');

//Showing abridged URLs
module.exports.urls = function(req, res){

    //We look at the database for user
    Url.find({userId: req.session.user._id}, function(err, items){

        //If there is an error, we redirect to page 404
        if(err) return error404(req, res);

        //Render and submit user records to views
        res.render('profile/show', {items: items});
    });
}


module.exports.show = function(req, res){

    //We get from the base a record corresponding to the submitted ID
    Url.find({_id: req.params.id}, function(err, item){

        //If there is an error, we redirect to page 404
        if(err) return error404(req, res);

        //We define variables
        var visits = {}, reverseObject = {}, object;

        //Reverse array
        item[0].visits.reverse();

        //We rotate every item of the array
        item[0].visits.forEach(function(item){ 

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
        res.render('profile/link', {visits: visits});
    }); 
}