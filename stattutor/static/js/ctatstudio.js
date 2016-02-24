/**
 *
 */
function CTATXBlockStudio(runtime, element)
{
    //console.log("CTATXBlockStudio ("+runtime+","+element+") (STUDIO)");

    $(element).find('.save-button').bind('click', function() {
	var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
	var data = {
	    module: $(element).find('input#module').val(),
	    brd: $(element).find('input#brd').val(),
	    description_file: $(element).find('input#description_file').val(),
	    pData: $(element).find('input#pData').val()
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

