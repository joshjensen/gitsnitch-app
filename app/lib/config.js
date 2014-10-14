// remove when we add dynamic credentials.
var demoConfig = require('demo-config');

var config = {
	projectKey: '0fdc14bfa2ebf946bbc41844cc35a1d8',
	developer: {
		name: demoConfig.developer.name,
		githubUser: demoConfig.developer.githubUser
	},
	security: {
		password: demoConfig.security.password
	},
	pubnubKeys: {
		subKey: demoConfig.pubnubKeys.subKey,
		pubKey: demoConfig.pubnubKeys.pubKey
	}	
};

module.exports = config;