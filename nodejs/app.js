/* * * * * * * * * * * * * * * * * * 
 *  Vera: Brewing over the air.
 * 
 * Author:  Tyler Petresky
 * Email:   hello@tylerpetresky.com
 * Date:    January 2016
 * * * * * * * * * * * * * * * * * */

var express         = require('express'),
    app             = express();
var nunjucks        = require('nunjucks');
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
