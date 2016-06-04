import "./../templates/account.html"

/**
 * Used when logging in
 */
let postLogin = function(){
    if(Router.current().route.path() == '/') {
        document.getElementById("save").className = "btn-floating green";
        //check if session variable is active
    }
    Router.go('/');
    Materialize.toast('Successfully logged in!', 2500);
};

Template.register.events({
    'click #register': function(event){
        event.preventDefault();
        if ($('#password').val() != $('#cPassword').val()) {
            Materialize.toast("Passwords do not match!", 4000);
        }
        else {

            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let email = "";

            if(username==null || username==""){
                Materialize.toast("All fields required", 4000);
                return;
            }

            let data = {
                username,
                password,
                email,
                profile: {
                }
            };

            Accounts.createUser(data, function(error){
                if(error){
                    Materialize.toast(error.reason, 4000);
                }
                else{
                    postLogin();
                }
            });
        }
    }
});

Template.login.events({
    'click #login': function(event){
        event.preventDefault();
        let id = document.getElementById("username").value;
        let pw = document.getElementById("password").value;

        if(id == "" || pw ==""){
            Materialize.toast("Both fields required", 4000);
            return;
        }

        Meteor.loginWithPassword(id, pw, function(error){
            if(!error){
                console.log('postlogin');
                postLogin();
            }
            else{
                Materialize.toast(error.reason, 4000);
            }
        });

    }
});