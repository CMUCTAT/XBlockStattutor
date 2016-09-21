/**
 * This function is called when the "Save" button in the studio edit
 * dialog is pressed.  It gathers the instructor set parameters in the
 * form and creates a JSON object that is sent to the StatTutor XBlock's
 * studio_submit method.
 * @param runtime: provided by EdX, used to communicate with the XBlock.
 * @param element: provided by EdX.
 * Side Effects: adds event listeners to the "Save" and "Cancel" buttons.
 */
function CTATXBlockStudio(runtime, element)
{
    // Add "Save" button click event listener.
    $(element).find('.save-button').bind('click', function() {
	var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
	// compose form data
	var data = {
	    statmodule: $(element).find('select#statmodule').val(),
	    dataset: $(element).find('input#dataset').val(),
	    logserver: $(element).find('input#logserver').val(),
	    logging: $(element).find('input#logging').is(':checked')
	};
	if (runtime.notify) // SDK does not seem to have runtime.notify
	    runtime.notify('save', {state: 'start'});
	else
	    console.log('WARNING: runtime.notify is not available.');
	// post form data as JSON to XBlock.
	$.post(handlerUrl, JSON.stringify(data)).done(function(response) {
	    if (runtime.notify)
		runtime.notify('save', {state: 'end'});
	});
    });
    // Add "Cancel" button click event listener.
    $(element).find('.cancel-button').bind('click', function() {
	if (runtime.notify)
	    runtime.notify('cancel', {});
    });
}
