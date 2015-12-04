// Order for this is important as it needs to execute before easyui
// Because of that, this will not have any actual information about the
// problem so all that this does is make blank questions from the template to
// be filled in when more information is loaded.  There is some contingent
// things built into the template that end up getting controled by classes/css.
$(function() 
{
	console.log ("Setting up fragment1.js...");
		
	//CTATTarget="XBlock";
	
	var MAX_NUMBER_QUESTIONS = 3;
	$.views.converters("word", function(val) { return ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][parseInt(val)];});
	var template = $.templates(question_template);
	var question_init_data = [];
	
	for (var i=0; i<MAX_NUMBER_QUESTIONS; i++) 
	{
		question_init_data.push({});
	}
	var question_panels = template.render(question_init_data);
	
	console.log ("Executing fragment1.js...");
	
	$('#main').append(question_panels);
});
