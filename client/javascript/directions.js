import './../templates/directions.html'

let route;

Template.directions.onCreated(function () {
    route = Session.get('currentRoute');
});

Template.directions.helpers({
    instructions(){
        let instructions = [];
        for(let i=0; i<route.legs.length; i++){
            console.log(route.legs[i]);
            for(let j=0; j<route.legs[i].steps.length; j++){
                console.log(route.legs[i].steps[j].instructions);
                instructions.push({
                    instruction: route.legs[i].steps[j].instructions,
                    maneuver: route.legs[i].steps[j].maneuver,
                    distance: route.legs[i].steps[j].distance.value
                })
            }
        }
        return instructions;
    }
});