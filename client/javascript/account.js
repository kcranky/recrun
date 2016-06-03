import "./../templates/account.html"

/**
 * Used when logging in
 */
var myPostLogin = function(){
    $('#loginModal').closeModal();

    if(Router.current().route.path() == '/'){
        document.getElementById("save").className = "btn-floating green";
        //check if session variable is active
        if(Session.get('logInSave')==true){
            $('#saveRunModal').openModal();
            Session.set('logInSave', false);
        }
    }

    Materialize.toast('Successfully logged in!', 2500);
};

/**
 * Just a simple toast to notify users they have been logged out
 */
var myPostLogout = function(){
    Materialize.toast('Successfully logged out!', 2500);
};

/**
 * Configure the hooks to user
 */
AccountsTemplates.configure({
    onLogoutHook: myPostLogout,
    onSubmitHook: myPostLogin
});