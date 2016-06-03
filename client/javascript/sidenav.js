import { Template } from 'meteor/templating';

import './../templates/sidenav.html';

Template.sidenav.onRendered( function () {
    $('.button-collapse').sideNav({
        closeOnClick: true
    });
});

    Template.sidenav.events({
    "click .logout": function() {
        AccountsTemplates.logout();
        if(Router.current().route.path() == '/') {
            document.getElementById("save").className = document.getElementById("save").className + " disabled";
        }
    },
});
