import { Mongo } from 'meteor/mongo';

export const Routes = new Mongo.Collection('routes');

if (Meteor.isServer) {
    Meteor.publish('routes', function tasksPublication() {
        return Routes.find();
    });
}