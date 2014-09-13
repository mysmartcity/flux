/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var News = require('../api/news/news.model');
/*News.find({}).remove(function(){
 console.log("done removing");
 });
 return;*/
News.find(function(err, existingNews){
    if (existingNews == ''){
        News.create({
                date : new Date(),
                category : "transport",
                url:"not yet",
                title:"Drum in constructie0",
                content:"se lucreaza de zor0",
                msk: "anMks"
            },
            {
                date : new Date(),
                category : "transport",
                url:"not yet",
                title:"Drum in constructie1",
                content:"se lucreaza de zor1",
                msk: "anMks"
            },
            {
                date : new Date(),
                category : "tineret",
                url:"not yet",
                title:"articol tineret 0",
                content:"articol 0",
                msk: "anMks"
            },
            {
                date : new Date(),
                category : "tineret",
                url:"not yet",
                title:"articol tineret 1",
                content:"articol1",
                msk: "anMks"
            }, function() {
                console.log('finished populating news');
            }
        )
    }else{
        console.log("news already populated");
    }
});


/*User.find({}).remove(function(){
 console.log("done removing");
 });
 */

User.find(function(err, existingNews){
    if (existingNews == ''){
        User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test',
                categories: ['transport'],
                frequencies:['day', 'month']
            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin',
                categories: ['transport', 'tineret'],
                frequencies:['day', 'year']
            }, function() {
                console.log('finished populating users');
            }
        );
    }else{
        console.log('users were already created');
    }
});