require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api")

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var fs = require("fs");

var moment = require("moment");


var action = process.argv[2];
var value = process.argv[3];

if(!value && action === "movie-this"){
    value = "Mr. Nobody"
    console.log("Then you should click " +  "http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix")
    }

    if(value === undefined){
        value = "Believer"
    }

var omdbURL = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

var queryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";



switch (action) {

    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        obey();
        break;
}

// var helper = function(artist){
//     return artist.name;
// }


function spotifySong() {

    spotify.search({ type: 'track', query: value, limit: 1 })
        .then(function (response) {
            var items = response.tracks.items
            for (var i = 0; i < items.length; i++) {
                var itemsArr = items[i];
                console.log("Artists: " + itemsArr.album.artists);
                console.log("Song name: " + itemsArr.name)
                console.log("Preview here: " + itemsArr.external_urls.spotify)
                console.log("Album " + itemsArr.album.name)
                console.log(response)

            }
        })
    //   console.log(data); 
};


// create function for ombd to grab movie and spit out data
// call axios to request the info

function movie() {
  
    axios.get(omdbURL).then(function (response) {
        console.log("Movie: " + response.data.Title);
        console.log("Date of Release: " + response.data.Released);
        console.log("Rating: " + response.data.imdbRating);
        console.log("Country: " + response.data.Country);
        console.log("Rotten Tomatoes: " + response.data.Ratings[1].value);
        console.log("Studio of Shoot: " + response.data.Production);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    })
}

// create function for a concerts
// use axios to send requests and retrieve info back

function concert() {
    axios.get(queryUrl).then(function (response) {
        // var time = moment(tourArr.datetime).format('MMMM Do YYYY, h:mm:ss a')
        for (var i = 0; i < response.data.length; i++) {
            var tourArr = response.data[i];
            console.log("Venue: " + tourArr.venue.name);
            console.log("City: " + tourArr.venue.city);
            // console.log("Date of Tour: " + time);
            console.log(tourArr.datetime);
            //  console.log(response)

        }
        if (!response.data.length) {
            console.log("Sorry no tour for this artist");
        }
    }
    )
}

// function for read file
//
function obey() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        } else {

            data = data.split(", ");
            console.log(data);
            spotify.search({ type: 'track', query: data, limit: 1 })
                .then(function (response) {
                    var items = response.tracks.items;
                    // console.log(items);
                    for (var i = 0; i < items.length; i++) {
                        var itemsArr = items[i];
                        console.log("Artist: " + itemsArr.album.artists[0].name);
                        console.log("Song Name: " + itemsArr.name);
                        console.log("Spotify Link: " + itemsArr.external_urls.spotify);
                        console.log("Album: " + itemsArr.album.name);
                    }
                })
        }
    })
}