var keys = require("./key.js");
var inquirer = require('inquirer');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var omdbAPIKey = keys.OMDBKeys.APIKey;

var spotify = new Spotify({
    id: keys.spotifyKeys.clientid,
    secret: keys.spotifyKeys.client_secret

})

var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
})

function switchCases() {

    switch (action) {
        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            spot();
            break;

        case "movie-this":
            movie();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            console.log("Plese use one of the following commands: my-tweets, spotify-this-song, movie-this, do-what-it-says.")
            break;

    }

}

var action = process.argv[2];
console.log(action);
var query = "";

function inputToString() {
    for (var i = 3; i < process.argv.length; i++) {
        if (i > 3 && i < process.argv.length) {
            query = query + "+" + process.argv[i];
        } else {
            query += process.argv[i];
        }
    }
}


function getMovieInfo(movieName) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    console.log(queryUrl);
    request(queryUrl, function(error, response, body) {
        if (response.statusCode === 200) {

            console.log("----------------------------------");
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            if (JSON.parse(body).Ratings[1].Value) {
                console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            } else {
                console.log("Rotten Tomatoes Rating Not Available");
            }
            console.log("Produced In: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("----------------------------------");
        }
    });

}

function getTweets() {
    var params = { screen_name: 'HomeworkPractic' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }
        for (var i = 0; i < 20; i++) {
            if (tweets[i]) {
                console.log("Tweets: " + tweets[i].text);
                console.log("Created: " + tweets[i].created_at);
            } else {
            	console.log("No tweets were found!");
            }
        }
    });
}

function spotifySearch(query) {
    spotify.search({ type: 'track', query: query }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("----------------------------------");
        console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        if (data.tracks.items[0].preview_url) {
            console.log("Preview URL: " + data.tracks.items[0].preview_url);
        } else {
            console.log("Preview URL: Not Available");
        }
        console.log("Album Name: " + data.tracks.items[0].album.name);
        console.log("----------------------------------");
    });

}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err);
        }

        randomTextArray = data.split(",");
        action = randomTextArray[0];
        process.argv[3] = randomTextArray[1];
        switchCases();

    });
}

function spot() {

    inputToString();
    console.log(query);
    if (!query) {
        query = "The Sign";
    }
    spotifySearch(query);
}



function movie() {
    inputToString();
    console.log(query);
    if (!query ) {
        query = "Mr.+Nobody";
    }
    getMovieInfo(query);

}
switchCases();