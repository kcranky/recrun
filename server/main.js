import { Meteor } from 'meteor/meteor';
import { Routes } from './imports/dbSetup';

Meteor.methods({
    /**
     * Allows a user to save a route
     * @param saveObj
     */
    'saveRun': function(saveObj){
        let r = null;
        Routes.insert(saveObj, function(error, result){
            if(error){
                return error;
            }
            if(result){
                return result;
            }
        });
    },
    /**
     * Deltes a particular Run from the DB
     * @param dId : the id of the document to delete
     */
    'deleteRun': function(dId){
        return Routes.remove({_id:dId});
    }
});

/**
 * Publishes the routes for the user to access
 */
Meteor.publish('Routes', function(){
    return Routes.find({userId: this.userId});
});