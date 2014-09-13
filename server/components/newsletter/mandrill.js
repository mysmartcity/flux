#!/usr/bin/env node

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('vv-cFVrnZHnrCG1fqhKLdQ');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var frequency = null;
var program = require('commander');

var User = require("../../api/user/user.model");
var News = require("../../api/news/news.model");
var mongoose = require('mongoose');
var config = require('../../config/environment');


program
    .version('0.0.1')
    .option('-d, --daily', 'Send daily newsletter')
    .option('-w, --weekly', 'Send weekly newsletter')
    .option('-m, --monthly', 'Send monthly newsletter')
    .parse(process.argv);

if (program.daily) {
    frequency = "daily";
} else if (program.weekly) {
    frequency = "weekly";
} else if (program.monthly) {
    frequency = "monthly";
}
console.log("Sending " + frequency + " newsletter.");

if (frequency) {
    // Connect to database
    mongoose.connect(config.mongo.uri, config.mongo.options);

    var a = User.find({}, function (err, users) {
        var i;
        for (i=0; i < users.length; i++ ) {
            if ( users[i].frequencies.indexOf(frequency) !== -1 ) {

                News.find({category: {"$in": users[i].categories}}).exec(function(err, news) {
                    console.log(users[i])
//                    console.log(users[i].name + " will receive:");
//                    console.log(news)
                });



//                var params = {
//                    "message": {
//                        "from_email": "newsletter@flux.gov.ro",
//                        "to": [
//                            {"email": users[i].email}
//                        ],
//                        "subject": "Flux " + frequency + " Newsletter " + new Date(),
//                        "text": JSON.stringify(users[i].categories)
//                    }
//                };
//
//                mandrill_client.messages.send(params,
//                    function onSuccess(res) {
//                        console.log(res)
//                    },
//                    function onError(err) {
//                        console.log(err);
//                    }
//                );
            }
        }

        return;
    });
}