//Router and routing

Router.configure({
    layoutTemplate: 'sidenav'
});

Router.route('/', function () {
    this.render('newrun');
});

Router.route('/oldrun', function () {
    this.render('oldrunhome');
});

Router.route('/stats', function () {
    this.render('stats');
});

Router.route('/account', function () {
    this.render('account');
});