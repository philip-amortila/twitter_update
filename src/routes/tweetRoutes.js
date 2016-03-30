var express = require('express');
var querystring = require('querystring');
var Twitter = require('twitter');
var mongodb = require('mongodb').MongoClient;

var client = new Twitter({
	consumer_key: 'xx',
	consumer_secret: 'xx',
	access_token_key: 'xx',
	access_token_secret: 'xx'
});


var tweetsRouter = express.Router();

tweetsRouter.route('/')
	.get(function(req, res){
		var url = '127.0.0.1:27017/nodejs2';
		// if OPENSHIFT env variables are present, use the available connection info:
		if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
			url = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
			process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
			process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
			process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
			process.env.OPENSHIFT_APP_NAME;
		}
        url = 'mongodb://'+url;
		console.log("search req: " + req.query.text);
		client.get('search/tweets', {q:req.query.text}, function(error, tweets, response1){

			//db
			mongodb.connect(url, function(err, db){
				var collection = db.collection('tweets');
				collection.insertMany(tweets.statuses, function(err, results){
					//console.log(tweets);
					collection.mapReduce(
						function(){emit(this.lang, 1);},
						function(key, values){ return Array.sum(values);},
						{
							query:{},
							out: "tweet_langs"
						}
					);
					db.close();
				}
			);

		});

		res.send(tweets);
	});
});

tweetsRouter.route('/langstats')
	.get(function(req,res){
		var url = 'mongodb://localhost:27017/twitterApp';
		console.log('routing langstats');
		mongodb.connect(url, function(err, db){
			var collection = db.collection('tweet_langs');
			collection.find({'_id': {$in: ['en','fr','ja','es','ru','ko']}}).sort({_id:-1}).toArray(function(err,results){
				var arr = [];
				for(var i=0;i<results.length;i++){
					console.log(results[i]._id, results[i].value);
					arr.push([results[i]._id, results[i].value]);
				}
				//arr.sort();
				res.send(arr);
			});
		});
});


module.exports = tweetsRouter;
