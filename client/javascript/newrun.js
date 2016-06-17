/**
 * Created by Keegan Crankshaw on 06 Apr 2016.
 */
import './../templates/newrun.html'
import * as mapElements from './mapElements.js'
import * as loader from './loader';

var waypoints = [],
    directionDisplay,
    directionsService,
    home,
    distance = 5,
    directionsResult,
    infowindow,
    drag;

Template.newrun.onCreated(function() {
    loader.showLoader();
    /**
     * When the map is ready, do all the initialization
     */
    GoogleMaps.ready('runMap', function(map) {

        /**
         * Initialise all the Google Map objects we'll be using
         */
        infowindow = new google.maps.InfoWindow();

        directionsService = new google.maps.DirectionsService();

        directionDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        directionDisplay.setMap(GoogleMaps.maps.runMap.instance);

        var latLng = Geolocation.latLng();
        home = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: GoogleMaps.maps.runMap.instance
        });

        /**
         * Called when Dragging the map
         * Used for the user to change their location
         */
        var moveListener = GoogleMaps.maps.runMap.instance.addListener('drag', function() {
            if(drag){
                if(directionsResult){
                    directionDisplay.set('directions', null);
                    directionsResult = null;
                }
                infowindow.close();
                home.setPosition(GoogleMaps.maps.runMap.instance.getCenter());
            }
            else{
                return;
            }
        });
        drag = false;

        /**
         * Check if a user is restoring a previously saved route
         */
        if(Session.get('oldRequest')!=null){
            if (GoogleMaps.loaded()) {
                directionsService.route(Session.get('oldRequest'), function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsResult = response;
                        directionDisplay.setDirections(response);
                        infowindow.setContent("Total Distance: " + totalDistance(response.routes[0].legs) + "m");
                        document.getElementById("directions_run").className = "btn-floating green";
                        let latLngStr = Session.get('oldRequest').origin;
                        let lat = latLngStr.substring(0, latLngStr.indexOf(','));
                        let lng = latLngStr.substring(latLngStr.indexOf(',')+1);
                        home.setPosition(new google.maps.LatLng(lat, lng));
                        infowindow.open(GoogleMaps.maps.runMap.instance, home);
                        Session.set('oldRequest', null);
                        drag = false;
                    }
                });
            }
        }
        else{
            directionsResult = null;
        }

        /**
         * Add the elements to the map.
         */
        let controls = document.createElement('div');

        //Create the "generate Map" button
        var genControl = new mapElements.genCtrl(controls, map, 'Generate new route', function () {
            drag = false;
            infowindow.close();
            waypoints = [];
            directionDisplay.set('directions', null);
            route(home, distance);
            createRoute();
        });

        let routeSave = document.createElement('div');
        let saveBtn = new mapElements.saveRoute(routeSave, map);

        //Push the main control div to the map
        map.instance.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controls);
        map.instance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(routeSave);

        //Disable the accept run button as there are not yet any generated runs
        document.getElementById("directions_run").className = document.getElementById("directions_run").className + " disabled";

        //Disable the save route button if the user is not logged in
        if(!Meteor.userId()) {
            document.getElementById("save").className = document.getElementById("save").className + " disabled";
        }

        //Resize the map
        document.getElementById("map-container").style.height = $('#map-container').height()-$('#navbar').height() + 'px';

        loader.hideLoader();
    });
});

Template.newrun.onRendered(function(){
    $('.modal-trigger').leanModal({
        dismissible: true
    });
    if(Session.get('logInSave')==true){
        $('#saveRunModal').openModal();
        Session.set('logInSave', false);
    }
});

window.onresize = function(e) {
    document.getElementById("map-container").style.height = window.innerHeight -$('#navbar').height() + 'px';
};

Template.newrun.events({
    /**
     * For the user to change their distance
     * @param event
     */
    'click #settings': function () {
        $('#distanceSelectModal').openModal();
    },
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
    /**
     * Checks if there is a route to save. If so, opens the modal
     * If not, tells the user to generate a route
     * If route generated, ensures user is logged in
     */
    'click #save': function () {
        event.preventDefault();
        if(directionsResult == null){
            Materialize.toast("Generate a route to save", 4000);
            return;
        }
        if(!Meteor.userId()){
            Router.go('/login');
            Session.set('logInSave', true);
            Session.set('routeToSave', directionsResult);
        }
        else if (directionsResult != undefined){
            Session.set('routeToSave', directionsResult);
            $('#saveRunModal').openModal();
        }
        else {
            Materialize.toast("Generate a route to save", 4000);
        }
    },
    /**
     * When the user clicks the save button in the modal
     * @param event
     */
    'click #saveRunBtn': function(event) {
        event.preventDefault();
        var saveObj = {
            userId: Meteor.userId(),
            name: $("#runName").val(),
            date: new Date(),
            distance: totalDistance(Session.get('routeToSave').routes[0].legs),
            request: Session.get('routeToSave').request
        };
        Meteor.call('saveRun', saveObj, function(e, r){
            if (!e){
                Materialize.toast("Run successfully saved!", 4000);
                Router.go('/oldroutes');
                Session.set('logInSave', false);
                Session.set('routeToSave', null);
            }
            else{
                Materialize.toast("Error saving run. Please contact support.", 4000);
            }
        });
    },
    /**
     * Creates a string and opens up the appropriate map client with the generated route
     */
    'click #directions_run': function(){
        event.preventDefault();
        if(Meteor.isCordova){

            let str = "http://maps.google.com/maps?f=d&source=s_d&saddr=" + strOut(directionsResult.request);
            cordova.InAppBrowser.open(str, '_system');
        }
        else{
            let str = "http://maps.google.com/maps?f=d&source=s_d&saddr=" + strOut(directionsResult.request);
            window.open(str);
        }
    },
    /**
     * If maps times out, or there is an error, we reload the page
     */
    'click #retry': function(){
        document.location.reload(true);
        Router.render('loading');
    },
    /**
     * Enabled the drag map functionality for a user to change their location
     */
    'click #my_location': function(event){
        event.preventDefault();
        drag = true;
        Materialize.toast('Drag the map to change your location', 4000);
    }
});

Template.newrun.helpers({
    /**
     * Returns the distance the user selects in the modal
     */
    distance: function () {
        return distance;
    },
    /**
     * Returns the geolocation error
     * @returns {*|PositionError|string}
     */
    geolocationError: function() {
        var error = Geolocation.error();
        return error && error.message
    },
    /**
     * Options used to initialize the map object
     * @returns {{center: google.maps.LatLng, zoom: number, disableDefaultUI: boolean}}
     */
    runMapOptions: function() {
        var latLng = Geolocation.latLng();
        // Make sure the maps API has loaded and we have our location
        if (GoogleMaps.loaded() && latLng) {
            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: 15,
                disableDefaultUI: true
            };
        }
    },
    /**
     * Returns whether or not the map object has laoded
     */
    mapReady: function(){
        return GoogleMaps.loaded();
    }
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

/**
 * Generates a new route based on all user input
 */
function createRoute() {
    loader.showLoader();
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
        origin: home.position.lat() + "," + home.position.lng(),
        destination: home.position.lat() + "," + home.position.lng(),
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.WALKING,
        avoidHighways: true
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
                document.getElementById("directions_run").className = "btn-floating green";
                loader.hideLoader();
            };
        }
        else {
            //if we managed to get a successful request, use it
            if (directionsResult) {
                directionDisplay.setMap(GoogleMaps.maps.runMap.instance);
                directionDisplay.setDirections(directionsResult);
                infowindow.setContent("Total Distance: " + totalDistance(directionsResult.routes[0].legs) + "m");
                infowindow.open(GoogleMaps.maps.runMap.instance, home);
                loader.hideLoader();
            }
        }
    });
}

/**
 * Build the request URL to open in external maps service
 * @param json
 * @returns {string}
 */
function strOut(json){
    let str = '';
    str = json.origin + "&daddr=";
    //add the waypoints
    for(let i=0; i<json.waypoints.length; i++){
        str = str + json.waypoints[i].location + '+to:';
    }
    str = str+json.origin + "&dirflg=w";
    return str;
}
