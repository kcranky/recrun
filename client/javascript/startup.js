Meteor.startup(function() {
    //need to find a way of passing the maps key without sharing it
    GoogleMaps.load({key: ""});
});