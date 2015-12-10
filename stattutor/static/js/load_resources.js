/**
 *
 */
function ctatPreload() {
    $.get("$problem_description", function(data) { // Substituted by stattutor.py
	StatTutor.process_problem_data(data);
	StatTutor.setup();
	initTutor (flashVars.getRawFlashVars());

	// Add event listener to our_answer components so that the img tag
	// src attributes can be modified based on the environment.
	$('[id^=our_]').on('CTAT_EXECUTE_SAI', function (e) {
	    //console.log('CTAT_EXECUTE_SAI', $(this).data('CTATComponent').getText(),e);
	    $(this).find('img').each(function () {
		var $img = $(this);
		var src = $img.attr('src');
		if (src) {
		    if (src.indexOf('http')!==0) { // not a full url
			$img.attr('src', translateResourceFile(src));
		    }
		}
	    });
	});
    });
}
/**
 * This function is called from the ctatloader javascript file whenever the tutor
 * has finished it's startup phase. The tutor might still be loading but at this
 * point the page is ready and can be interacted with.
 */
function ctatOnload()
{
    console.log ("ctatOnload ()");

    var instructionsLocation = "$Instructions"; // substituted by stattutor.py

    //StatTutor.set_data_tab(translateResourceFile (StatTutor.dataset["json"]));
    StatTutor.set_data_tab('$data_json'); // substituted by stattutor.py

    $.get(instructionsLocation, function(data) {
	//console.log('Loading instructions ...',data);
	StatTutor.process_instructions(data);
    });
}

/**
 *
 */
function download_data() 
{
    var selection = $('#package_select').val();

    //console.log(selection,StatTutor.dataset[selection]);
    if (StatTutor.dataset.hasOwnProperty(selection)) 
    {
	window.open(translateResourceFile(StatTutor.dataset[selection]));
    }
}
