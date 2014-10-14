/*
 * Copyright (c) 2014 Pixel Flavor LLC. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

var pubnub = require('vendor/pubnub');
var config = require('config');

module.exports = pubnub({
    publish_key: config.pubnubKeys.pubKey,
    subscribe_key: config.pubnubKeys.subKey,
    ssl               : false,
    native_tcp_socket : false,
    origin            : 'pubsub.pubnub.com'    
});