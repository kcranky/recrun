import './../templates/oldrun.html';
import { Routes }from './../../lib/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.oldrun.onCreated(function bodyOnCreated(){
   this.state = new ReactiveDict();
    Meteor.subscribe('routes');
});

Template.oldrun.events({
    'click .useRoute': function (){
        Session.set('oldRequest', this.request);
        console.log("session created");
    }
});


Template.oldrun.helpers({
    runs(){
        return Routes.find({ userId: Meteor.userId() });
    }
});

Template.registerHelper('formatDate', function(d) {
    var day = 0;
    switch(d.getDay()) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
    }
    return day + " " + d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();

});

Template.registerHelper('getDistance', function(r) {
    return totalDistance(r.routes[0].legs) + "m";
});


function totalDistance(legsArray) {

    var result = 0;
    for(var i=0; i<legsArray.length; i++) {
        result += legsArray[i].distance.value;
    }
    return result;
}