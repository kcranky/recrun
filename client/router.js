//Router and routing

Router.configure({
    layoutTemplate: 'sidenav'
});

Router.route('/', function() {
    this.render('newrun')
    },
    {
        name: 'newrun',
        onBeforeAction: function (){

            if (!GoogleMaps.loaded()) {
                this.render('loading');
            }
            this.next();
        }
});

Router.route('/oldrun', function() {
        this.render('oldrun')
    }, {
        name:'oldrun',
        onBeforeAction: function() {
            if (!Meteor.userId()){
                Router.go('login');
            }
            this.next();
        }
    }
);

Router.route('/account', function () {
    this.render('account');
});

Router.route('/login', function() {
    this.render('login')
},
    {
        name: 'login'
    }
);

Router.route('/register', function() {
        this.render('register')
    },
    {
        name: 'register'
    }
);