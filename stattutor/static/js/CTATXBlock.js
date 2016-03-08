var CTATXBlock = {};

CTATXBlock.make = function (runtime, element) {
    return {
	set_variable: function(variable_name,value) {
	    console.log('CTATXBlock.js set_variable');
	    var data = {};
	    data[variable_name] = window.btoa(value);
	    $.post(runtime.handlerUrl(element, 'ctat_set_variable'),
		   JSON.stringify(data)).success(function () {
		       console.log('ctat_set_variable succeeded');
		   });
	},
	report_grade: function(correct_step_count, total_step_count) {
	    console.log('CTATXBlock.js report_grade');
	    $.post(runtime.handlerUrl(element, 'ctat_grade'),
		   JSON.stringify({'value': correct_step_count,
				   'max_value': total_step_count})).success(function () {
				       console.log('ctat_grade succeeded');
				   });
	}
    }
};

function Initialize_CTATXBlock(runtime,element) {
    CTATXBlock.post = CTATXBlock.make(runtime,element);
};
