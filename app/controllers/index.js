var pubnub = require('pubnub');
var config = require('config');

$.navigationBar.setTitle('GitSnitch'.toUpperCase());
$.navigationBar.setBackgroundColor('#555557');
$.navigationBar.setTitleColor('#fff');

pubnub.subscribe({
    channel: config.projectKey + '-filestat',
    callback: function(message) { Ti.API.log(message); }
});

$.index.open();
