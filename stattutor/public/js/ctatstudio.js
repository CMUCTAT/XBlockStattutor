
var xblockRuntime=null;
var xblockElement=null;
var xblockpointer=null;

function applyValues ()
{
    console.log ("applyValues ()");
	
	$("#logtype").val(logtype);
	
	$("#connection").val(connection);
}

/**
 *
 */
function setVariable (aVariable,aContent)
{
	console.log ("setVariable ("+aVariable+","+aContent+")");

	var jsonString="{\""+ aVariable + "\": \"" + aContent + "\"}";
	
	$.ajax({
		type: "POST",
		url: xblockRuntime.handlerUrl(xblockElement, "ctat_set_variable"),
		data: jsonString,
		//data: JSON.stringify({aVariable:encoded}), 
		success: function(result)
		{
			console.log ("success");
			//introspect ("xblockresult",result," ",2);
		},
		error: function (obj,textStatus,errorThrown)
		{
			console.log ("Error calling XBlock handler: " + errorThrown);
		}
	});
}

/**
 *
 */
function CTATXBlockStudio(runtime, element)
{
	console.log("CTATXBlockStudio ("+runtime+","+element+") (STUDIO)");

	xblockRuntime=runtime;
	xblockElement=element;
	xblockpointer=this;

	var pointer=this;
	
	applyValues ();
	
	$("#diskdir").prop( "disabled", true);
	$("#port").prop( "disabled", true);
	$("#remoteurl").prop( "disabled", true);

	$("#logtype").change(function () 
	{
        var logsetting = $('#logtype option:selected').val();
		
		console.log ("Log setting chosen: " + logsetting);
		
		setVariable ("logtype",$('#logtype').val ());
		
		if (logsetting=="javascript")
		{
			$("#diskdir").prop( "disabled", true);
			$("#port").prop( "disabled", true);
			$("#remoteurl").prop( "disabled",true);
		}
		else		
		{
			$("#diskdir").prop( "disabled", false);
			$("#port").prop( "disabled", false);
			$("#remoteurl").prop( "disabled", false);
		}
    });	
	
	$("#connection").change(function () 
	{
		var connectionsetting = $('#connection option:selected').val();
		
		setVariable ("connection",$('#connection').val ());
	});
	
	$('#brd').on('input', function() 
	{
		console.log ("Setting brd to: " + $('#brd').val ());
		
		setVariable ("href",$('#brd').val ());
	});
		
	$('#ctatmodule').on('input', function() 
	{
		console.log ("Setting ctatmodule to: " + $('#ctatmodule').val ());
		
		setVariable ("ctatmodule",$('#ctatmodule').val ());
	});	
	
	$('#problem').on('input', function() 
	{
		console.log ("Setting problem to: " + $('#problem').val ());
		
		setVariable ("problem",$('#problem').val ());
	});	
	
	$('#dataset').on('input', function() 
	{
		console.log ("Setting dataset to: " + $('#dataset').val ());
		
		setVariable ("dataset",$('#dataset').val ());
	});		

	$('#level1').on('input', function() 
	{
		console.log ("Setting level1 to: " + $('#level1').val ());
		
		setVariable ("level1",$('#level1').val ());
	});	
	
	$('#type1').on('input', function() 
	{
		console.log ("Setting type1 to: " + $('#type1').val ());
		
		setVariable ("type1",$('#type1').val ());
	});	

	$('#level2').on('input', function() 
	{
		console.log ("Setting level2 to: " + $('#level2').val ());
		
		setVariable ("level2",$('#level2').val ());
	});	

	$('#type2').on('input', function() 
	{
		console.log ("Setting type2 to: " + $('#type2').val ());
		
		setVariable ("type2",$('#type2').val ());
	});		
	
	$('#logurl').on('input', function() 
	{
		console.log ("Setting logurl to: " + $('#logurl').val ());
		
		setVariable ("logurl",$('#logurl').val ());
	});		

	$('#slog').on('input', function() 
	{
		console.log ("Setting slog to: " + $('#slog').val ());
		
		setVariable ("slog",$('#slog').val ());
	});
	
	$('#diskdir').on('input', function() 
	{
		console.log ("Setting slog to: " + $('#diskdir').val ());
		
		setVariable ("diskdir",$('#diskdir').val ());
	});

	$('#port').on('input', function() 
	{
		console.log ("Setting port to: " + $('#port').val ());
		
		setVariable ("port",$('#port').val ());
	});

	$('#remoteurl').on('input', function() 
	{
		console.log ("Setting remoteurl to: " + $('#remoteurl').val ());
		
		setVariable ("remoteurl",$('#remoteurl').val ());
	});	
}
