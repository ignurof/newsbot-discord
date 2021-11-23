const Eris = require("eris");
const axios = require('axios');

// Replace TOKEN with your bot account's token // FIXME: Dont push this token to github, saved in Documents
const bot = new Eris("", {
    intents: [
        "guildMessages"
    ] // Seems like I need guildMessages intent to be able to interact with commands
});

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"

    GetLatestTweet();
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
const GetLatestTweet = async() => {
    try{
        let response = await axios("https://api.twitter.com/2/users/1395646524458258435/tweets?exclude=retweets,replies&max_results=5", {
            method: "GET",
            headers: {
                "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAADNyWAEAAAAAhyYXX3zHYbevbnmP%2Fs8WzjVmjIg%3DDCQNTbCL1l4dmC4ws8X5eb9zqam2eLNAQBk02J5I9eT9J8wf2S"
            }
        });
        console.log(response.data.data[0]); // Latest tweet
        let tweet = response.data.data[0];
        bot.createMessage("699022284945358860", `https://twitter.com/ignurof/status/${tweet.id}`); // channel id is first param
    } catch(e){
        console.error(e);
    }
}