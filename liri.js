require("dotenv").config();

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
// var omdbApiKey = keys.omdb;

var userRequest = process.argv[2];

var userRequestSpecifics = "";
for (i = 3; i < process.argv.length; i++) {
  userRequestSpecifics += process.argv[i] + " ";
}
function userInput(userRequest, userRequestSpecifics) {
  switch (userRequest) {
    case "my-tweets":
      runTwitter();
      break;
    case "spotify-this-song":
      runSpotify(userRequestSpecifics);
      break;
    case "movie-this":
      runOMDB(userRequestSpecifics);
      break;
    case "do-what-it-says":
      runFileSystem();
      break;
  }
}

userInput(userRequest, userRequestSpecifics);

//A function to run the twitter API call
function runTwitter() {
  var params = { screen_name: "nodejs", count: "20", include_rts: "false" };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (i = 0; i < tweets.length; i++) {
        console.log(JSON.stringify(tweets[i].created_at, null, 2));
        console.log(JSON.stringify(tweets[i].text, null, 2));
      }
    }
  });
}

function runSpotify(userRequestSpecifics) {
  if (userRequestSpecifics) {
    //Declare the song name variable and make it blank

    //Concatenate loop through argv's to make the song nam

    //Spotify API search with the songName variable created with the previous loop in the query parameter.
    spotify.search({ type: "track", query: userRequestSpecifics }, function(
      err,
      data
    ) {
      //Error catching
      if (err) {
        return console.log("Error occurred: " + err);
      }
      //A function that disects and picks out the content we want out of the JSON file given back to us from our API Query
      spotifyJSON(data);
    });
  } else {
    spotify.search({ type: "track", query: "The Sign" }, function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      spotifyRequest(data);
    });
  }
}

function spotifyJSON(data) {
  songNum = 1;
  for (i = 0; i < data.tracks.items.length; i++) {
    console.log("Song #" + songNum);
    songNum++;
    console.log("Song Name: " + data.tracks.items[i].name);
    console.log("By: ");
    data.tracks.items[i].artists.forEach(function(element) {
      console.log(element.name);
    });
    console.log("Album: " + data.tracks.items[i].album.name);
    console.log(
      "Check it out on Spotify: " + data.tracks.items[i].external_urls.spotify
    );
    console.log("");
  }
}

// Specific Spotify request for The Sign since my searches for the song, when I explicitly
// put The Sign as the query, would give me a result where the first 5 songs weren't the song I need
function spotifyRequest() {
  spotify
    .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
    .then(function(data) {
      console.log(data.name);
      console.log("By: " + data.artists[0].name);
    })
    .catch(function(err) {
      console.error("Error occurred: " + err);
    });
}

function runOMDB(userRequestSpecifics) {
  if (userRequestSpecifics) {
    request(
      "http://www.omdbapi.com/?t=" + userRequestSpecifics + "&apikey=973a27b5",
      function(error, response, body) {
        var movieData = JSON.parse(body);

        console.log("Title: " + movieData.Title);
        console.log("Year of release: " + movieData.Year);
        console.log("IMDB Rating: " + movieData.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
        console.log("Country of origin: " + movieData.Country);
        console.log("Language: " + movieData.Language);
        console.log("Plot: " + movieData.Plot);
        console.log("Actors: " + movieData.Actors);
      }
    );
  } else {
    request("http://www.omdbapi.com/?t=Mr.Nobody&apikey=973a27b5", function(
      error,
      response,
      body
    ) {
      var movieData = JSON.parse(body);

      console.log("Title: " + movieData.Title);
      console.log("Year of release: " + movieData.Year);
      console.log("IMDB Rating: " + movieData.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
      console.log("Country of origin: " + movieData.Country);
      console.log("Language: " + movieData.Language);
      console.log("Plot: " + movieData.Plot);
      console.log("Actors: " + movieData.Actors);
      console.log("");
      console.log(
        "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/"
      );
      console.log("");
      console.log("It's on Netflix!");
    });
  }
}

function runFileSystem() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");
    output.unshift(" ", " ");

    // Loop Through the newly created output array
    userInput(output[2], output[3]);
    // console.log(output[3]);
  });
}
