// Order for this is important as it needs to execute before easyui
// Because of that, this will not have any actual information about the
// problem so all that this does is make blank questions from the template to
// be filled in when more information is loaded.  There is some contingent
// things built into the template that end up getting controled by classes/css.

function number_words(val) {
    if (!this.name_map)
	this.name_map = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
    return this.name_map[parseInt(val)];
}

var MAX_NUMBER_QUESTIONS = 3;
$(function() { // needs to be wrapped so that #main is known to exist.
    // template should have been added by stattutor.py
    var question_template = _.template($("script#question-template").html());
    for (var i=1; i<=MAX_NUMBER_QUESTIONS; i++) 
    {
	$('#main').append(question_template({question_number: i}));
    }
    console.log ("Finished adding templated html.");
});
