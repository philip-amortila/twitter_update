# Twitter Search 

## Description
Twitter searching web application with some data visualization and sentiment analysis

## Installation 
Make sure MongoDB is installed and mongod is running on port 27017
```
git clone git@github.com:philip-amortila/twitter_update.git
npm install
bower install
```

Replace your Twitter API keys in the following code block in tweetRoutes.js
```javascript 

	var client = new Twitter({
		consumer_key: 'xx',
		consumer_secret: 'xx',
		access_token_key: 'xx',
		access_token_secret: 'xx'
	});
```

##Usage

```
npm start
```
And then point your browser at http://localhost:3000 (mongod needs to be running in a separate terminal window)

## Tech Stack
- node.js 
- express
- ejs
- mongodb
- jquery
- d3/c3
- bootstrap
- materialize

## Demo
App is deployed on Red Hat Cloud [OpenShift](http://nodejs2-twitsearch.rhcloud.com) 

##To-Do
Support for mobile
Responsive web design
