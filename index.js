const Eris = require("eris");
const axios = require('axios');
const fs = require("fs").promises;

// Replace TOKEN with your bot account's token // FIXME: Dont push this token to github, saved in Documents
const bot = new Eris("", {
    intents: [
        "guildMessages"
    ] // Seems like I need guildMessages intent to be able to interact with commands
});

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"

    // Get on startup
    getLatestTweet();
    
    // Runs every hour
    setInterval(() => {
        console.log("this is a timeout check");
        getLatestTweet();
    }, 3600000); // 1 hour in ms 3600000
});

bot.on("error", (err) => {
    console.error(err); // or your preferred logger
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "!ping") { // If the message content is "!ping"
        bot.createMessage(msg.channel.id, "Pong!");
        // Send a message in the same channel with "Pong!"
    } else if(msg.content === "!pong") { // Otherwise, if the message is "!pong"
        bot.createMessage(msg.channel.id, "Ping!");
        // Respond with "Ping!"
    }
});

bot.connect(); // Get the bot to connect to Discord

// Set a timer to keep fetching from my twitter once per hour
const getLatestTweet = async() => {
    let response = await axios("https://api.twitter.com/2/users/1395646524458258435/tweets?exclude=retweets,replies&max_results=5", {
        method: "GET",
        headers: {
            "Authorization": "Bearer "
        }
    });
    //console.log(response.data.data[0]); // Latest tweet

    let tweet = response.data.data[0];
    let oldTweet;

    // Wait for file to get read first
    try{
        oldTweet = await fs.readFile("oldtweet.json");
        oldTweet = JSON.parse(oldTweet); // Parse from Buffer
        console.log(oldTweet);
        // If file could be read, and the old tweet is not the same or if no file existed
        if(oldTweet !== undefined && oldTweet !== tweet){
            createNew(tweet);
            return;
        }
        // Early return should avoid this error
        console.error("Old tweet was the same as now, not updating!");
    } catch(e){
        console.error(e);
        // create new file if no file was found
        createNew(tweet);
    }
}

const createNew = (tweet) => {
    console.log("sending message to server...");
    // Send message to discord server channel
    //bot.createMessage("699022284945358860", `https://twitter.com/ignurof/status/${tweet.id}`); // channel id is first param https://twitter.com/ignurof/status/${tweet.id}

    // Save latest to file
    fs.writeFile("oldtweet.json", JSON.stringify(tweet), (err) => {
        console.log("wrote to file");
    });
}