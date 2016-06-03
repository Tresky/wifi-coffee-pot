/* * * * * * * * * * * * * * * * * * 
 *  Vera: Brewing over the air.
 * 
 * Author:  Tyler Petresky
 * Email:   hello@tylerpetresky.com
 * Date:    January 2016
 *
 * Please direct all questions to
 * the email provided.
 * * * * * * * * * * * * * * * * * */

var express         = require('express'),
    app             = express();
var nunjucks        = require('nunjucks');

// This aREST package was modified by yours truly
// to work a little bit better. If you install arest
// using npm, your front end won't work correctly.
// See my fork of the aREST package in my Github page
// for a modified version:
// 
// https://github.com/Tresky/node-aREST
//
// To use my package, simply download it and place the
// 'index.js' file inside of node_modules/arest. You
// can them import it into your NodeJS server.
var arest           = require('arest')(app);
var colors          = require('colors');

// Request a heartbeat over the REST api every 5 seconds
arest.heartBeat(5000);

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'nunjucks');
app.use(express.static(__dirname + '/public'));

// Anytime an AJAX request comes in from the front-end,
// we need to handle it. The only AJAX we should receive 
// is requests to "connect" to the coffee pot.
var HandleAjax = function(req, res, next) {
    if (req.xhr) {
        console.log('Ajax Detected');

        if (req.query.comm == 'connect') {
            // Check and see if the device is already registered
            if (arest.getDevice('vera'))
                res.send('exists');

            // If not, register the device on HTTP as vera.local.
            // See the Arduino implementation for slightly more info
            // what 'vera.local' means.
            else 
                arest.addDevice('http', 'vera.local', 115200);
        }
    }
    else
        next();
}

app.get('/', [HandleAjax], function(req, res) {
    res.render('view');
});

// Sick nasty ASCII art
app.listen(1337, function() {
    console.log('\t  Welcome to the Vera Coffee System'.yellow);
    console.log('\t\tby Goatbucks Coffee'.blue);
    console.log("                        (".grey);
    console.log("                      )     (".grey);
    console.log("               ___...(-------)-....___".grey);
    console.log("           .-\"\"       )    (          \"\"-.".grey);
    console.log("     .-'``'|-._             )         _.-|".grey);
    console.log("    /  .--.|   `\"\"---...........---\"\"`   |".grey);
    console.log("   /  /    |                             |".grey);
    console.log("   |  |    |         _))                 |".grey);
    console.log("    \\  \\   |      > *\\     _~            |".grey);
    console.log("     `\\ `\\ |      `;'\\\\__-' \\_'          |".grey);
    console.log("       `\\ `|          | )  _ \\ \\         |".grey);
    console.log("       _/ /\\         / / ``   w w        /".grey);
    console.log("      (__/  \\       w w                 /".grey);
    console.log("   _..---\"\"` \\                         /`\"\"---.._".grey);
    console.log(".-'           \\                       /          '-.".grey);
    console.log(":               `-.__             __.-'              :".grey);
    console.log(":                  ) \"\"---...---\"\" (                 :".grey);
    console.log("'._               `\"--...___...--\"`              _.'".grey);
    console.log("  \\\"\"--..__                              __..--\"\"/".grey);
    console.log("   '._     \"\"\"----.....______.....----\"\"\"     _.'".grey);
    console.log("      `\"\"--..,,_____            _____,,..--\"\"`".grey);
    console.log("                    `\"\"\"----\"\"\"`".grey);
    console.log("------------------------------------------------------".grey);
});
