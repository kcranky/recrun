import { Meteor } from 'meteor/meteor';
import { Routes } from './imports/dbSetup';

Meteor.methods({

    'saveRun': function(saveObj){
        console.log("saverun");
        Routes.insert(saveObj, function(error, result){
            if(error){
                console.log ( error );
                console.log("Cannot save route. Please contact support.");
            }
            if(result){
                console.log("Route successfully saved!");
            }
        });
    },
    /**
     * Deltes a particular Run from the DB
     * @param dId : the id of the document to delete
     */
    'deleteRun': function(dId){
        console.log("Route deleted");
        return Routes.remove({_id:dId});
    }
});


Meteor.publish('Routes', function(){
    return Routes.find({userId: this.userId});
});