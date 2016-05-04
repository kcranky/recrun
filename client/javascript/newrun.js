/**
 * Created by LittlePanda on 06 Apr 2016.
 */
import './../templates/newrun.html'
import * as mapElements from './mapElements.js'
//import { Routes } from './../../server/routeManager.js';
//import '../../../server/routeManager.js';

var waypoints = [],
    origin,
    directionDisplay,
    home,
    directionsService,
    distance = 5,
    directionsResult,
    infowindow;

Template.newrun.onCreated(function() {
    Session.set('logInSave', false);
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('runMap', function(map) {

        //Create info window to show distance
        infowindow = new google.maps.InfoWindow();

        //Initialise the directions service and display service
        directionsService = new google.maps.DirectionsService();
        directionDisplay = new google.maps.DirectionsRenderer({
            draggable: false,
            suppressMarkers: true
        });
        directionDisplay.setMap(GoogleMaps.maps.runMap.instance);


        //See if we have a session variable
        if(Session.get('oldRequest')!=null){
            if (GoogleMaps.loaded()) {
                directionsService.route(Session.get('oldRequest'), function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionDisplay.setDirections(response);
                        infowindow.setContent("Total Distance: " + totalDistance(response.routes[0].legs) + "m");
                        infowindow.open(GoogleMaps.maps.runMap.instance, home);
                        Session.set('oldRequest', null);
                    }
                });
            }
        }

        //add custom elements
        var controls = document.createElement('div');

        //Create the "generate Map" button
        var genControl = new mapElements.genCtrl(controls, map, 'Generate new route', function () {
            infowindow.close();
            waypoints = [];
            directionDisplay.set('directions', null);
            route(home, distance);
            createRoute();
        });

        var routeSave = document.createElement('div');
        var saveBtn = new mapElements.saveRoute(routeSave, map);

        //Push the main control div to the map
        map.instance.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controls);
        map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(routeSave);

        // Add a marker to the map once it's ready
        var latLng = Geolocation.latLng();
        home = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: GoogleMaps.maps.runMap.instance,
            label: "A"
        });

        //set the initial location
        origin = home;

        //Disable the save route button if the user is not logged in
        if(!Meteor.userId()) {
            document.getElementById("save").className = document.getElementById("save").className + " disabled";
        }
    });
});

Template.newrun.onRendered( function () {
    document.getElementById("map-container").style.height = $('#map-container').height()-$('#navbar').height() + 'px';
});

window.onresize = function(e) {
    document.getElementById("map-container").style.height = window.innerHeight -$('#navbar').height() + 'px';
}

Template.newrun.events({
    'change input[name=distance]': function (event) {
       event.preventDefault();
       if (event.target.value > 0){
           distance = event.target.value;
       }
       else {
           event.target.value = distance;
           Materialize.toast('Route must be at least 1km', 4000);
       }
    },
    'click #saveRunBtn': function(event) {
        var saveObj = {
            userId: Meteor.userId(),
            name: $("#runName").val(),
            date: new Date(),
            distance: totalDistance(directionsResult.routes[0].legs),
            request: directionsResult.request
        };
        Meteor.call('saveRun', saveObj, function(e, r){
            if (!e){
                Materialize.toast("Run successfully saved!", 4000);
            }
            else{
                Materialize.toast("Error saving run. Please contact support.", 4000);
            }
        });
    },
    'click #save': function () {
        if(!Meteor.userId()){
            $('#loginModal').openModal();
            Session.set('logInSave', true);
        }
        else {
            if (directionsResult != undefined){
                $('#saveRunModal').openModal();
            }
            else {
                Materialize.toast("Generate a route to save", 4000);
            }
        }
    },
    'click #settings': function () {
        $('#distanceSelectModal').openModal();
    }
});

Template.newrun.helpers({
    distance: function () {
        return distance;
    },
    geolocationError: function() {
        var error = Geolocation.error();
        return error && error.message
    },
    runMapOptions: function() {
        var latLng = Geolocation.latLng();
        // Make sure the maps API has loaded and we have our location
        if (GoogleMaps.loaded() && latLng) {
            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: 15,
                streetViewControl: false,
                mapTypeControl: false,
                rotateControl: false,
                zoomControl: false
            };
        }
    }
});

Template.newrun.onRendered( function () {
    //document.getElementById("map-container").style.height = $('#map-container').height()-$('#navbar').height() + 'px';
});

//Get all the primary waypoint markers
function route(startPoint, distance) {
    if (GoogleMaps.loaded()) {
        var angle = Math.random() * 359;
        var noSides = 3;

        //create the initial marker and add it to the waypoints array
        var marker = new google.maps.Marker({
            position: destinationPoint(startPoint, angle, distance/noSides/Math.sqrt(2)),
        });
        waypoints.push(marker);

        //add the remaining markers
        for (i = 1; i < noSides-1; i++){
            angle = angle-180-(180/noSides);
            marker = new google.maps.Marker({
                position: destinationPoint(marker, angle, distance/noSides/Math.sqrt(2))
            });
            waypoints.push(marker);
        }
    }
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
}

//Get a new waypoint object
function destinationPoint(startPoint, brng, dist) {
    if (GoogleMaps.loaded()){
        dist = dist / 6371;
        brng = brng.toRad();

        var lat1 = startPoint.position.lat().toRad(), lon1 = startPoint.position.lng().toRad();

        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));

        if (isNaN(lat2) || isNaN(lon2)) return null;

        return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg())
    }
}

//get the total distance of the route
function totalDistance(legsArray) {

    var result = 0;
    for(var i=0; i<legsArray.length; i++) {
        result += legsArray[i].distance.value;
    }
    return result;
}

function createRoute() {
    directionDisplay.set('directions', null);
    directionDisplay.setMap(null);

    //build the waypoints array
    for (var i = 0; i < waypoints.length; i++) {
        var address = waypoints[i];
        waypoints[i] = {
            location: address.position.lat() + "," + address.position.lng()
        };
    }

    //build directions request
    var request = {
        origin: origin.position.lat() + "," + origin.position.lng(),
        destination: origin.position.lat() + "," + origin.position.lng(),
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };

    //get the route from the directions service
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsResult = response; //We store this incase the we can't find a better distance further on

            //if the total distance is outside of what's reasonable, we should generate another route
            var dist = totalDistance(directionsResult.routes[0].legs);

            if((dist > distance*1000+300) || (dist < distance*1000-300)){
                waypoints = [];
                directionDisplay.set('directions', null);
                route(home, distance);
                createRoute();
            }
            else {
                directionDisplay.setMap(GoogleMaps.maps.runMap.instance);
                directionDisplay.setDirections(directionsResult);
                infowindow.setContent("Total Distance: " + dist + "m");
                infowindow.open(GoogleMaps.maps.runMap.instance, home);
            };
        }
        else {
            console.log(status);
            //if we managed to get a successful request, use it
            if (directionsResult) {
                directionDisplay.setMap(GoogleMaps.maps.runMap.instance);
                directionDisplay.setDirections(directionsResult);
                infowindow.setContent("Total Distance: " + totalDistance(directionsResult.routes[0].legs) + "m");
                infowindow.open(GoogleMaps.maps.runMap.instance, home);
            }
        }
    });

}