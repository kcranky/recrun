import './../templates/oldrun.html';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Routes } from './../dbSetup.js';

Meteor.subscribe('Routes');

Template.oldrun.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
});

Template.oldrun.events({
    'click .useRoute': function (){
        Session.set('oldRequest', this.request);
    },
    'click .delRoute': function (){
        Meteor.call('deleteRun', this._id, function(e){
            if (!e){
                Materialize.toast("Route deleted.", 4000);
            }
        });

    }
});


Template.oldrun.helpers({
    runs(){
       return Routes.find();
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



function totalDistance(legsArray) {
    var result = 0;
    for(var i=0; i<legsArray.length; i++) {
        result += legsArray[i].distance.value;
    }
    return result;
}