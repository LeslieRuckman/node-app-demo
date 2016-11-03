var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Herb = require("../models/model.js");

// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really for testing
router.get('/herb-data', function(req,res){
  res.render('herb-form.html')
})

// simple route to render an HTML page that pulls data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/show-herbs', function(req,res){
  res.render('show-pets.html')
})

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */

// router.get('/', function(req, res) {
//
//   var jsonData = {
//   	'name': 'node-express-api-boilerplate',
//   	'api-status':'OK'
//   }
//
//   // respond with json data
//   res.json(jsonData)
// });

// simple route to show an HTML page
router.get('/', function(req,res){
  res.render('herb-form.html')
})

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new herbs, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Herb
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var herb = req.body.herb;
    var botanicalName = req.body.botanicalName;
    var flavor = req.body.flavor;
    var heal = req.body.heal;
    var prepare = req.body.prepare;
    var recipe = req.body.recipe;
    var url = req.body.url;
    var tags = req.body.tags.split(","); // split string into array

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var herbObj = {
      herb: herb,
      botanicalName: botanicalName,
      flavor: flavor,
      prepare: prepare,
      recipe: recipe,
      url: url,
      tags: tags
    };

    // create a new herb model instance, passing in the object
    var herb = new Herb(herbObj);

    // now, save that animal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    herb.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving herb data'};
        return res.json(error);
      }

      console.log('You added to the Herb Library!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        herb: data
      }

      return res.json(jsonData);

    })
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the herb to get
//  * @param  {String} req.param('id'). The herbId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Herb.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that herb.'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      herb: data
    }

    return res.json(jsonData);

  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all herb details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Herb.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find anything'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      herbs: data
    }

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search an animal
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.name;
  console.log("we are searching for " + searchTerm);

  // let's find that animal
  Herb.find({name: searchTerm}, function(err,data){
    // if err, respond with error
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no animals, respond with no animals message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      herbs: data
    }

    res.json(jsonData);
  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the herb to update, updates db, responds back
//  * @param  {String} req.param('id'). The herbId to update
//  * @param  {Object} req. An object containing the different attributes of the Herb
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var herb, botanicalName, flavor, heal, prepare, recipe, url;

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.herb) {
      herb = req.body.herb;
      // add to object that holds updated data
      dataToUpdate['herb'] = herb;
    }
    if(req.body.botanicalName) {
      botanicalName = req.body.botanicalName;
      // add to object that holds updated data
      dataToUpdate['botanicalName'] = botanicalName;
    }
    if(req.body.flavor) {
      flavor = req.body.flavor;
      // add to object that holds updated data
      dataToUpdate['flavor'] = flavor;
    }
    if(req.body.heal) {
      heal = req.body.heal;
      // add to object that holds updated data
      dataToUpdate['heal'] = heal;
    }
    if(req.body.prepare) {
      prepare = req.body.prepare;
      // add to object that holds updated data
      dataToUpdate['prepare'] = prepare;
    }
    if(req.body.recipe) {
      recipe = req.body.recipe;
      // add to object that holds updated data
      dataToUpdate['recipe'] = recipe;
    }
    if(req.body.url) {
      url = req.body.url;
      // add to object that holds updated data
      dataToUpdate['url'] = url;
    }
    var tags = []; // blank array to hold tags
    if(req.body.tags){
      tags = req.body.tags.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that animal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Herb.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating herb'};
        return res.json(error);
      }

      console.log('updated the herb!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: 'OK',
        herb: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.param('id'). The herbId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Herb.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that herb to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;
