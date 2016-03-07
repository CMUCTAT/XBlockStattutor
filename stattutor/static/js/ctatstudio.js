/**
 *
 */
function CTATXBlockStudio(runtime, element)
{
    //console.log("CTATXBlockStudio ("+runtime+","+element+") (STUDIO)");

    $(element).find('.save-button').bind('click', function() {
	var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
	var data = {
	    statmodule: $(element.find('select#statmodule').val(),
	    //src: $(element).find('input#interface').val(),
	    //brd: $(element).find('input#brd').val(),
	    //problem_description: $(element).find('input#description_file').val(),
	    width: $(element).find('input#maxwidth').val(),
	    height: $(element).find('input#maxheight').val()
	};
	runtime.notify('save', {state: 'start'});
	$.post(handlerUrl, JSON.stringify(data)).done(function(response) {
	    runtime.notify('save', {state: 'end'});
	});
    });

    $(element).find('.cancel-button').bind('click', function() {
	runtime.notify('cancel', {});
    });
}

