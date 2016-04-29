//Router and routing

Router.configure({
    layoutTemplate: 'sidenav'
});

Router.route('/', function () {
    this.render('newrun');
    this.layout('sidenav');
});

Router.route('/oldrun', function () {
    this.render('oldrunhome');
    this.layout('sidenav');
});

Router.route('/stats', function () {
    this.render('stats');
    this.layout('sidenav');
});

Router.route('/account', function () {
    this.render('account');
    this.layout('sidenav');
});