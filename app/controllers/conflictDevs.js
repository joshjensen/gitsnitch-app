var args = arguments[0] || {};

console.log(args);

$.name.setText((args.dev) ? args.dev : '');
$.status.setText((args.status) ? args.status : '');

console.log(args.labelType);

switch (args.labelType) {
    case "primary":
    	$.statusWrapper.setBackgroundColor("#428bca");
        break;
    case "default":
    	$.statusWrapper.setBackgroundColor("#777777");
        break;
    case "danger":
    	$.statusWrapper.setBackgroundColor("#777777");
        break;        
    default:
}