App.info({
  id: 'com.arbdev.keegan.joggr',
  name: 'joggr',
  description: 'Plan new routes for running, cycling and walking',
  author: 'ArbDev',
  email: 'NA',
  website: 'NA'
});

//Access rules for dburles map plugin
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');

//For navigation
App.accessRule('*maps.google.com/*');
App.accessRule('*maps.google.com/*');
