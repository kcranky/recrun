//Router and routing

Router.configure({
    layoutTemplate: 'sidenav'
});


Router.route('/', function(){
    this.render('newrun');
});

Router.route('/oldrun', function () {
    this.render('oldrun');
});

Router.route('/stats', function () {
    this.render('stats');
});

Router.route('/account', function () {
    this.render('account');
});

Router.route('/directions', function() {
    this.render('directions');
});