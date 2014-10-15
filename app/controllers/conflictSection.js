var args = arguments[0] || {};

_.each(args, function(item, index) {
	var conflictRow = Alloy.createController('conflictRow', item);
	$.conflictSection.add(conflictRow.getView());	
});

