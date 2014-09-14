#!/usr/bin/env node

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('vv-cFVrnZHnrCG1fqhKLdQ');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var frequency = null;
var newsFilter= null;
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
    newsFilter = {date: new Date() }
//    newsFilter = {date: new Date(2014,1,4) }
} else if (program.weekly) {
    frequency = "weekly";
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    newsFilter = {date: {$gt: oneWeekAgo}}
} else if (program.monthly) {
    frequency = "monthly";
    var oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    newsFilter = {date: {$gt: oneMonthAgo}}
}

console.log("Sending " + frequency + " newsletter.");

if (frequency) {
    // Connect to database
    mongoose.connect(config.mongo.uri, config.mongo.options);


    News.find(newsFilter).exec(function(err, news) {
        console.log(news);
        User.find({frequencies: frequency}, function (err, users) {
            for (var i=0 ; i< users.length; i++) {
                var getTextBody = function() {
                    var result = "";
                    for ( var j=0; j< news.length; j++ ) {
                        // if the user is subscribed to this news category
                        if (users[i].categories.indexOf( news[j].category ) !== -1) {
                            result += "<a href='" + news[j].url + "'>" +
                                "<h3>" + news[j].title + "<h3>" +
                                "<p>" + news[j].content + "</p>" +
                                "</a>";
                        }
                    }
                    return result;
                };

                var mailMessage = getTextBody();

                if (mailMessage !== "") {

                    console.log("Sending mail to ", users[i].email);

                    var params = {
                        "message": {
                            "from_email": "newsletter@flux.gov.ro",
                            "to": [
                                {"email": users[i].email}
                            ],
                            "subject": "Flux " + frequency + " Newsletter " + new Date(),
                            "html": mailMessage
                        }
                    };

                    console.log(params);

                    mandrill_client.messages.send(params,
                        function onSuccess(res) {
//                            console.log(res)
                            console.log("Mail sent successfully!")
                        },
                        function onError(err) {
                            console.log(err);
                        }
                    );
                }

            }
        });

        return;
    });
}