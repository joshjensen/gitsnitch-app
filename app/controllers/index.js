var pubnub = require('pubnub');
var config = require('config');
var _s = require('vendor/underscore.string');

$.navigationBar.setTitle('GitSnitch'.toUpperCase());
$.navigationBar.setBackgroundColor('#555557');
$.navigationBar.setTitleColor('#fff');

var files = {};
var didConnect = false;

// function processEachChange(item, index, array) {
// 	console.log(item);
// }

// function onFileChange(data) {
// 	var head = data.head;
// 	var dev = data.dev;

// 	_.each(data.changes, function(item, index, array) {

// 	});
// }

function checkConnection() {
	if (!didConnect) {
		console.log('checkConnection()');
		setTimeout(function() {
			pubnub.publish({
				channel: config.projectKey + '-connections',
			 	message: "connection"
			});
		}, 1000);
	}
}

function addStatus(params) {
	switch (params.status) {
        case "modified":
        	params.labeltype = 'primary';
            break;
        case "deleted":
        	params.labeltype = 'danger';
            break;
        case "added":
        	params.labeltype = 'default';
            break;	            	            
        default:
    }

    return params;	
}

function updateFileStat(params) {
	params = addStatus(params);

	var uuid = _s.slugify(params.fileHash + params.gitHash + params.dev);

	// $("#" + uuid).remove();

	if (params.deleteItem) {
		updateConflicts(params);
	}

	params.uuid = uuid;

	if (!params.deleteItem) {
		// var template = Handlebars.compile($('#changed-files-template').text());
		// var html = template(params);
		// $('#changed_files').prepend(html);
	}
}

function buildConflictTableItem(params) {

	// console.log($.conflictSection.getRows());

	// var conflictRow = Alloy.createController('conflictRow', params).getView();
	// $.conflictSection.appendRow(conflictRow);
	// console.log($.conflictSection);

	// $('#' + params.fileHash + '-conflict').remove();

	// var template = Handlebars.compile($('#conflict-files-template').text());
	// var html = template({conflicts: files[params.fileHash]});
	// $('#conflict_files').prepend(html);	
}

function updateConflicts(params) {
	var fileArray = files[params.fileHash];

	for (var i = 0; i < fileArray.length; i++) {
		if (fileArray[i].dev === params.dev) {
			files[params.fileHash].splice(i, 1);
		}

		if (files[params.fileHash] && files[params.fileHash].length === 0) {
			delete files[params.fileHash];
		}
	}

	if (files[params.fileHash] && files[params.fileHash].length > 1) {
		buildConflictTableItem(params);
	} else {
		// $('#' + params.fileHash + '-conflict').remove();
	}
	
}

function checkForConflict(params) {
	var fileArray = files[params.fileHash];
	if (fileArray) {
		var isNew = true;
		for (var i = fileArray.length - 1; i >= 0; i--) {
			if (fileArray[i].dev === params.dev) {
				isNew = false;
			}
		}
		if (isNew) {
			files[params.fileHash].push(addStatus(params));
			buildConflictTableItem(params);
		}
	} else {
		files[params.fileHash] = [addStatus(params)];
	}

	updateFileStat(params);
}

function buildTableData() {
	console.log('buildTableData()');
	var data = [];
	var conflictItems = [];
	var changedItems = [];

	_.each(files, function(item, index) {
		if (item.length > 1) {
			conflictItems.push(item);
		} else {
			changedItems.push(item);
		}
	});

	console.log(conflictItems);
	console.log(changedItems);

	var conflictSection = Alloy.createController('conflictSection', conflictItems);
	data.push(conflictSection.getView());

	var changedSection = Alloy.createController('changedSection', changedItems);
	data.push(changedSection.getView());	

	$.commitTable.setData(data);
}

function sendPingRequest() {
	pubnub.publish({
		channel: config.projectKey + '-connections',
	 	message: "connection"
	});
}

function onMessageFileStat(data) {
	var changes = data.changes;

    for (var i = changes.length - 1; i >= 0; i--) {
    	var item = changes[i];
    	item.dev = data.dev;

    	// item.gitHash = data.gitHash;
    	checkForConflict(item);
    }
    // console.log("WTF?");
    // console.log(data);
	buildTableData();

	didConnect = true;
	$.pullToRefresh.endRefreshing();	
}

var onMessageFileStatThrottle = _.throttle(onMessageFileStat, 200, {leading: false});

pubnub.subscribe({
    channel: config.projectKey + '-filestat',
    callback: onMessageFileStatThrottle,
    connect: function() {
    	sendPingRequest();
    }
});

checkConnection();

$.pullToRefresh.addEventListener('refreshstart',function(e){
	sendPingRequest();
});

$.index.open();
