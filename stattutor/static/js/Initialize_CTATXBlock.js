/**
 * Called by edX to initialize the xblock.
 * @param runtime - provided by EdX
 * @param element - provided by EdX
 */
function Initialize_CTATXBlock(runtime,element) {
    var post = {
	set_variable: function(variable_name,value) {
	    //console.log('CTATXBlock.js','set_variable',variable_name,value);
	    CTATConfig[variable_name] = value;
	    var data = {};
	    data[variable_name] = value;
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_set_variable'),
		    data: JSON.stringify(data),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"})
		.done(function () {
		    console.log('ctat_set_variable succeeded');
		});
	},
	save_problem_state: function(state) {
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_save_problem_state'),
		    data: JSON.stringify({state:state}),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"});
	},
	get_problem_state: function() {
	    return $.ajax({type: "POST",
			   url: runtime.handlerUrl(element, 'ctat_get_problem_state'),
			   data: JSON.stringify({}),
			   contentType: "application/json; charset=utf-8",
			   dataType: "json"});
	},
	report_grade: function(correct_step_count, total_step_count) {
	    $.ajax({type: "POST",
		    url: runtime.handlerUrl(element, 'ctat_grade'),
		    data: JSON.stringify({'value': correct_step_count,
					  'max_value': total_step_count}),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"});
	}
    };
    $('.stattutor').load(function() { // this is getting fired after initTutor
	this.contentWindow.CTATTarget = "XBlock"; // needed for ctatloader.js
	var lms = this.contentWindow.CTATLMS;
	lms.identifier = 'XBlock';
	lms.setValue = function(key,value) {
	    //console.log('CTATXBlock.setValue',key,value);
	    post.set_variable(key,value);
	};
	lms.getValue = function(key) { return CTATConfig[key]; };
	lms.saveProblemState = function (state) {
	    //console.log('CTATXBlock','saveProblemState',state);
	    post.save_problem_state(window.btoa(state.problem_state));
	};
	lms.getProblemState = function (handler) {
	    post.get_problem_state().done(function(data) {
		return handler(window.atob(data.state)); });
	};
	lms.gradeStudent = function (correct_step_count, total_step_count) {
	    post.report_grade(correct_step_count, total_step_count);
	};
	// CTATConfig is from CTATConfig.js which is a template that is filled
	// out by ctatxblock.py
	this.contentWindow.initialize_stattutor(CTATConfig);
    });
};
