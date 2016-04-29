import "./../templates/account.html"

//Account management
var myPostLogout = function(){
    //example redirect after logout
    Materialize.toast('Successfully logged out!', 2500);
};

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

AccountsTemplates.configure({
    onLogoutHook: myPostLogout,
    onSubmitHook: myPostLogin
});