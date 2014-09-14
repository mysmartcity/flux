/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var News = require('../api/news/news.model');

//News.find({}).remove(function(){
//console.log("done removing");
//});
////return;
//News.find(function(err, existingNews){
////    if (existingNews === '' || existingNews === []){
//        News.create({
//                date : new Date(),
//                category : "transport",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"Drum in constructie0",
//                content:"se lucreaza de zor0",
//                msk: "anMks"
//            },
//            {
//                date : new Date(),
//                category : "transport",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"Drum in constructie1",
//                content:"se lucreaza de zor1",
//                msk: "anMks"
//            },
//            {
//                date : new Date(),
//                category : "tineret",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"articol tineret 0",
//                content:"articol 0",
//                msk: "anMks"
//            },
//            {
//                date : new Date(2014,7,29),
//                category : "youth",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"articol tineret 1",
//                content:"articol1",
//                msk: "anMks"
//            },{
//                date : new Date(2014,1,2),
//                category : "transport",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"Drum in constructie0",
//                content:"se lucreaza de zor0",
//                msk: "anMks"
//            },
//            {
//                date : new Date(2014,1,3),
//                category : "transport",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"Drum in constructie3",
//                content:"se lucreaza de zor la apaosdap alskdal sdkas dkaskjdasbsa akjadskabsbaskbdakb  jasbdh as j",
//                msk: "anMks"
//            },
//            {
//                date : new Date(2014,1,4),
//                category : "youth",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"articol tineret asdasdaj kasj a jda vdsav das adv da vv sja",
//                content:"articol 0",
//                msk: "anMks"
//            },
//            {
//                date : new Date(2014,1,4),
//                category : "youth",
//                url:"http://www.mt.ro/web14/spatiul-media/evenimente/532-ministrul-transporturilor-ioan-rus-a-acordat-in-data-de-27-august-2014-un-interviu-pentru-adevarul-online",
//                title:"articol tineret 1",
//                content:"articol1  askbdab kb daab a sdhj hadj hdas hjdsbhj saaadb hjdas hjdas ",
//                msk: "anMks"
//            }
//            , function() {
//                console.log('finished populating news');
//            }
//        );
//    }else{
//        console.log("news already populated");
//    }
//});


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