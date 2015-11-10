
CTATTarget="OLI";

/**
 *
 */
function ctatPreload() {
	StatTutor.assign_dataset((flashVars.getRawFlashVars())["resource_spec"]);  // content of module-specific ctat_m?_stattutor.xml
	var pfile = oliDriver.translateOLIResourceFile (StatTutor.dataset["problem_description.xml"]);
	$.get(pfile, function(data) {
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
						$img.attr('src',oliDriver.resolveURL(src));
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

	var instructionsLocation=oliDriver.translateOLIResourceFile (StatTutor.dataset["instructions.xml"]);
	
	console.log ("Example OLI Resource location translation: "  + instructionsLocation);		
	
	StatTutor.set_data_tab(oliDriver.translateOLIResourceFile (StatTutor.dataset["json"]));
	
	$.get(instructionsLocation, function(data) 
	{
		console.log('Loading instructions ...',data);
		StatTutor.process_instructions(data);
	});
}

function download_data() {
	var selection = $('#package_select').val();
	console.log(selection,StatTutor.dataset[selection]);
	if (StatTutor.dataset.hasOwnProperty(selection)) {
		window.open(oliDriver.translateOLIResourceFile(StatTutor.dataset[selection]));
	}
}
