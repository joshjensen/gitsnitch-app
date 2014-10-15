var args = arguments[0] || {};

_.each(args, function(item, index) {
	if (index === 0) {
		$.fileName.setText(item.filePath);	
	}
	
	var conflictDevsView = Alloy.createController('conflictDevs', item).getView();
	$.developers.add(conflictDevsView);
});

$.row.setHeight((args.length * 20) + 50);