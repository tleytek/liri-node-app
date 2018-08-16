require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var userRequest = process.argv[2];
var userRequestSpecifics = process.argv;

switch (userRequest) {
  case "my-tweets":
    runTwitter();
    break;
  case "spotify-this-song":
    runSpotify(userRequestSpecifics);
    break;
  case "movie-this":
    runOMDB(userRequestSpecifics);
}

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
