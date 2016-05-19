var StatTutor = {
    /** Values from dataset elements of ctat_m?_stattutor.xml; property names from package attributes */
    dataset: {},

    /**
     * Populate this object's dataset property with information from the module-specific ctat_m?_stattutor.xml.
     * Each dataset.property name will be the value of a dataset element's package attribute;
     * each dataset.property value will be the text of the dataset element.
     * @param {string} datasetXML text of ctat_m?_stattutor.xml, unparsed
     */
    assign_dataset: function (datasetXML) {
	var $dataset = $($.parseXML(datasetXML));
	$dataset.find('dataset').each(function () {
	    var $this = $(this);
	    StatTutor.dataset[$this.attr('package')] = $this.text();
	});
    },

    /**
     *
     */
    setup: function () {
	// When a component is Hint highlighted, make sure the active panel
	// contains it.
	$('div.work_area').on('CTAT_HIGHLIGHT', function(e) {
	    if (e.originalEvent.detail.isHighlighted
		&& $(this).panel('options').closed) {
		StatTutor.goto_panel(this.id);
	    }
	});
	// Make the tab-buttons look more like tabs
	$('.tab-button').css('background',$('#description_tabs a.tabs-inner').css('background')); // not working as well in Firefox
	$('.tab-button').css('color',$('#description_tabs a.tabs-inner').css('color'));
    },

    /** A simple array to translate numerals to words */
    number_words: ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'],

    /** Holds all the instructions from Instructions.xml */
    instructions: null,

    /** Callback for when Instructions.xml finishes loading */
    process_instructions: function (data) {
	this.instructions = data; // global storage of the instructions xml data
    },

    /** Stores the data from the problem description xml file */
    problem_data: null,

    /** A count of the number of questions specified in the problem description */
    question_count: 0,

    reveal_formal_extras: function () {
	var $this = $(this);
	var name = $this.attr('id');
	console.log('reveal_formal_extras',name,$this.val());
	switch ($this.find('select').val()) {
	case 'mu':
	case 'p':
	case 'mu1 - mu2':
	case 'p1 -p2':
	case 'mud':
	    $('#'+name+'_second').css('visibility','visible');
	    $('#'+name+'_third').css('visibility','visible');
	    break;
	default:
	    $('#'+name+'_second').css('visibility','hidden');
	    $('#'+name+'_third').css('visibility','hidden');
	}
    },
    /**
     * Callback for when the problem description xml file finishes loading.
     * Handles building the problem specific dynamic parts of the interface.
     */
    process_problem_data: function (data) {
	this.problem_data = data; // global storage of the xml data
	var $problem_data = $(data); // cast for easier jQuery access.
	$problem_data.find('dataset').each(function() {
	    var $this = $(this);
	    StatTutor.dataset[$this.attr('package')] = $this.text();
	});

	var make_thought_question = function (panel, name, $question_node) {
	    var q_id = name+'_question';
	    var $where = $('#'+panel).find('.ThoughtArea');
	    $where.append(
		'<h2>Thought Question</h2>'+
		    '<div id="'+q_id+'"></div>\n'+
		    '<h3 class="your_answer">Your Answer:</h3>\n'+
		    '<div id="'+name+'" class="CTATTextArea" data-ctat-tutor="false" data-ctat-show-feedback="false" data-ctat-tab-on-enter="false"></div>\n'+
		    '<div id="'+name+'_submit" class="CTATSubmitButton Submit_and_Reveal" data-ctat-target="'+name+'" data-ctat-show-feedback="false">Submit and Reveal Our Answer</div>\n'+
		    '<h3 class="our_answer">Our Answer:</h3>\n'+
		    '<div id="our_'+name+'" class="CTATTextField" data-ctat-tutor="false" data-ctat-enabled="false"></div>\n');
	    var $qs = $question_node.find('question');
	    if ($qs.length==1) {
		var q_text = $qs.first().text();
		$('#'+q_id).append('<p>'+q_text+'</p>');
	    } else {
		var $q = $('#'+q_id);
		$q.css('margin','5px');
		$q.css('width','90%');
		$q.tabs({plain:true})
		$qs.each(function() {
		    var $this = $(this);
		    $q.tabs('add', {title:$this.attr('package'),
				    content: $this.text()});
		});
		$('#'+panel).panel({onOpen: function() {
		    $q.tabs('select', $('#package_select').val());
		}});
	    }
	};

	// get the <title> (assumed to be singular)
	var title = $problem_data.find('title').text();
	if (title.length > 1) {
	    $('title').html('CTAT StatTutor - '+title);
	    $('#problem_data_title').html(title); // should just add tag
	}

	// put <background> information in the right place.
	$problem_data.find('background').each(function(){
	    var $bg = $(this);
	    var existing = $('#problem_data_background').html();
	    $('#problem_data_background').html(existing+'</p><p>'+$bg.text());
	});

	/********** Understand the problem *********/
	// Check Data Format Questions
	var $cdf = $('#cdf');
	var cdf_i = 0;
	$problem_data.find('cdf_question>text').each(function() {
	    $cdf_text = $(this);
	    var q = $cdf_text.text().trim();
	    if (q.length>0) {
		cdf_i++;
		$cdf.append('<p id="cdf_q'+cdf_i+'">'+q+'</p><div id="cdf'+cdf_i+'" class="CTATTextInput"></div><br/>');
	    }
	});

	// Consider Study Design
	var consider_study_design_active = false;
	$problem_data.find('consider_study_design').each(function() { // should only be one
	    var $consider_study_design= $(this);
	    var design = $consider_study_design.find('design answer').text();
	    if (design.length>0) { // if there are <design><answer>...
		consider_study_design_active = true;
	    } else {
		$('#ConsiderStudyDesign_design').css('display','none');
	    }
	    var sampling = $consider_study_design.find('sampling our_answer text').text();
	    if (sampling.length>0) { // if there are <sampling><our_answer><text>...
		consider_study_design_active = true;
	    } else {
		$('#ConsiderStudyDesign_sampling').css('display','none');
	    }
	    var design_thought = $consider_study_design.find('thought_question').each(function() {
		console.log('Found a design_thought');
		make_thought_question('ConsiderStudyDesign','design_thought',
				      $(this));
	    });
	});
	//var $consider_study_design =
	//var design = $problem_data.find('consider_study_design design answer').text();
	if (consider_study_design_active) {
	    $('#ConsiderStudyDesign_disabled').css('display','none');
	    var $utp_next = $('#UnderstandTheProblem_next');
	    $utp_next.linkbutton({text: 'Consider Study Design'});
	    $utp_next.bind('click', function(){StatTutor.goto_panel('ConsiderStudyDesign');});
	    $utp_next.attr('onclick',null);
	} else {
	    $('#ConsiderStudyDesign_enabled').css('display','none');
	}

	var get_icon = function(bool) { return bool?'icon-box':'icon-lock'; };
	var check_lock = function(node_name) {
	    return get_icon($problem_data.find(node_name).length>0);
	};
	var work_plan_tree =
	    [{text: 'Understand the Problem',
	      iconCls: check_lock('understand_the_problem'),
	      id: 'UnderstandTheProblem',
	      state: 'closed',
	      attributes:{level: 0},
	      children:
	      [{text: 'Check Data Format',
		id: 'CheckDataFormat',
		iconCls: get_icon(true),
		attributes:{level: 1}}, // should always be active for downloading data TODO: add check for datasets and check questions
	       {text: 'Consider Study Design',
		id:'ConsiderStudyDesign',
		iconCls: get_icon(consider_study_design_active),
		attributes:{level: 1, disabled:!consider_study_design_active}}
	      ]}];
	// get the main questions.
	var qn = 0; // question count
	$problem_data.find('main_question').each(function(){
	    qn+=1;
	    var q = 'q'+qn;
	    var $mq = $(this);

	    // Question text to be added to the Questions tab
	    var mqt = $mq.find('>text').text();
	    $('#problem_data_questions').append('<p class="QuestionText Q'+qn+'"><b>Q'+qn+'.</b> '+mqt+'</p>');

	    // <reflect_on_question><consider_questions><question>
	    $mq.find('consider_question>question').each(function() {
		$('#'+q+'consider_question').html($(this).text());
	    });

	    /***** Analyze data *****/
	    // relevant variables for Plan Analyses
	    var $qv = $('#q'+qn+'plan_classify_variables');
	    var rvs = $mq.find('relevant_variable');
	    var i = 0;
	    rvs.each(function() {
		// for each relevant variable for each question
		// add a classify (and roll if specified) question
		var $rv = $(this);
		var vname = $rv.find('name').text();
		var vrole = $rv.find('role').text().trim();
		// #q<n>plan_variable<i> text will be inserted after student has
		// selected them so that they can not get the information from
		// these entities.
		var str = '<div>The variable <span id="'+q+'plan_variable'+i+'" class="VariableName"></span> is ';
		if (vrole.length>0) {
		    str += '<div id="'+q+'plan_role'+i+'" class="CTATComboBox">';
		    str += '<option>----</option>';
		    str += '<option>explanatory</option>';
		    str += '<option>response</option>';
		    str += '</div> variable and is ';
		}
		str += '<div id="'+q+'plan_classify'+i+'" class="CTATComboBox">';
		str += '<option>----</option>';
		str += '<option>quantitative</option>';
		str += '<option>categorical</option>';
		str += '</div>';
		i++;
		if (i<vrole.length) str += '<p/>';
		$qv.append(str);
	    });


	    // <exploratory_analyses><report_results>...
	    // get <our_answer> and format properly.  This should be in brd, but images and package variance make it difficult

	    // <more_formal_analyses>
	    var more_formal_analyses_enabled=false;
	    $mq.find('more_formal_analyses').each(function(){
		var $mfa = $(this);
		if ($mfa.find('focus').text().trim().length > 0)
		    more_formal_analyses_enabled=true;
		$mfa.find('thought_question').each(function(){
		    // instructions? none in problems
		    make_thought_question('FormalMeasuresQ'+qn,q+'formal_measures_thought',$(this));
		});
	    });

	    if (more_formal_analyses_enabled) {
		$('.'+q+'formal_disabled').css('display','none');
		var $FA = $('#FormalAnalysisQ'+qn);
		$FA.panel({'onBeforeOpen': FormalAnalysisQn_onBeforeOpen});
		$('#q'+qn+'formal_h0').on('change', StatTutor.reveal_formal_extras);
		$('#q'+qn+'formal_ha').on('change', StatTutor.reveal_formal_extras);
	    } else {
		$('.'+q+'formal_enabled').css('display','none');
	    }
	    // <draw_conclusions>
	    $mq.find('draw_conclusions').each(function() {
		var $dc = $(this);
		$dc.find('consider_results').each(function () {
		    var $cr = $(this);
		    $('#'+q+'conclusions_question').html($cr.find('>question').text());

		    $cr.find('thought_question').each(function () {
			make_thought_question('ConclusionsConsiderQ'+qn,
					      q+'conclusions_thought',$(this));
		    });
		});
	    });
	    work_plan_tree.push(
		{text: 'Question '+qn, id: 'Question'+qn, iconCls: 'icon-box',
		 state: 'closed', attributes: {level:1},
		 children:
		 [{text: 'Reflect on Question', id: 'ReflectQ'+qn,
		   iconCls: 'icon-box',
		   state: 'closed', attributes: {level:0},
		   children: [{text:
			       'Consider Question '+StatTutor.number_words[qn],
			       id:'ConsiderQ'+qn, iconCls: 'icon-box',
			       attributes: {level:1}}]},
		  {text: 'Analyze Data', id:'AnalyzeQ'+qn, iconCls: 'icon-box',
		   state: 'closed', attributes: {level:0},
		   children: [
		       {text: 'Plan Analyses', id:'PlanQ'+qn,
			iconCls: 'icon-box', attributes: {level:1}},
		       {text: 'Exploratory Analysis', id:'ExploreQ'+qn,
			iconCls: 'icon-box', attributes: {level:1},
			children: [
			    {text: 'Determine display and measures',
			     id:'MeasuresQ'+qn, iconCls: 'icon-box',
			     attributes: {level:2}},
			    {text: 'Conduct Analysis', id: 'AnalysisQ'+qn,
			     iconCls: 'icon-help',
			     attributes: {level:2, complete:'info'}},
			    {text: 'Report Results', id: 'ResultsQ'+qn,
			     iconCls: 'icon-box', attributes: {level:2}}
			]},
		       {text: 'More Formal Analyses', id: 'FormalQ'+qn,
			iconCls: get_icon(more_formal_analyses_enabled),
			attributes:{level:1,
				    disabled:!more_formal_analyses_enabled},
			children: [
			    {text: 'Determine more formal analyses',
			     id:'FormalMeasuresQ'+qn,
			     iconCls: get_icon(more_formal_analyses_enabled),
			     attributes:{
				 level:2,
				 disabled:!more_formal_analyses_enabled}},
			    {text: 'Conduct Analysis',
			     id: 'FormalAnalysisQ'+qn,
			     iconCls: more_formal_analyses_enabled?'icon-help':'icon-lock',
			     attributes:{level:2,
					 disabled:!more_formal_analyses_enabled,
					 complete:'info'}},
			    {text: 'Report Results', id: 'FormalResultsQ'+qn,
			     iconCls: get_icon(more_formal_analyses_enabled),
			     attributes:{
				 level: 2,
				 disabled:!more_formal_analyses_enabled}}
			]}
		   ]},
		  {text: 'Draw Conclusions', id: 'ConclusionsQ'+qn,
		   iconCls: 'icon-box',
		   state: 'closed', attributes: {level:0},
		   children: [
		       {text: 'Consider what results mean',
			id: 'ConclusionsConsiderQ'+qn, iconCls: 'icon-box',
			attributes: {level:1}},
		       {text: 'Reflect on conclusions',
			id: 'ConclusionsReflectQ'+qn, iconCls: 'icon-box',
			attributes: {level:1}}
		   ]}
		 ]});
	});
	this.question_count = qn;
	$('.q'+qn+'last_question_true').css('display','block');
	$('.q'+qn+'last_question_false').css('display','none');

	var validate_study_enabled = false;
	var validate = $problem_data.find('summarize evaluate_validity our_answer').text();
	if (validate.length>0) { // if there are <design><answer>...
	    validate_study_enabled = true;
	}
	if (validate_study_enabled) {
	    $('.EvaluateStudy_disabled').css('display','none');
	    $('#EvaluateStudy').panel({'onOpen':this.populate_summary});
	} else {
	    $('.EvaluateStudy_enabled').css('display','none');
	}

	work_plan_tree.push(
	    {text: 'Summarize', id: 'Summarize', iconCls: 'icon-box',
	     state: 'closed', attributes: {level:0},
	     children: [
		 {text: 'Summarize Findings', id: 'SummarizeFindings',
		  iconCls: 'icon-box', attributes: {level:1}},
		 {text: 'Evaluate Study', id: 'EvaluateStudy',
		  iconCls: get_icon(validate_study_enabled),
		  attributes:{level:1, disabled:!validate_study_enabled}}
	     ]});
	$('#work_plan').tree({
	    ckeckbox:false, lines: true,
	    onSelect: function(node) {
		$('.easyui-panel').panel('close');
		if(node.id && $('#'+node.id).length>0) {
		    $('#'+node.id).panel('open');
		    $('#'+node.id).panel();
		} else {
		    $('#BlankPanel').panel('open');
		    $('#BlankPanel').panel();
		}
	    },
	    formatter: function(node) {
		var $wp = $('#work_plan');
		var s = node.text;
		var depth = 0;
		var classes = [];
		if (node.attributes && node.attributes.hasOwnProperty('level')) {
		    depth = node.attributes.level;
		    classes.push('WorkPlanLevel'+depth);
		}
		//console.log(node.text,depth);
		if (node.attributes && node.attributes.disabled) {
		    classes.push('WorkPlanDisabled');
		}
		if (classes.length>0) {
		    return '<span class="'+classes.join(' ')+'">'+s+'</span>';
		}
		return s;
	    },
	    data: work_plan_tree
	});

	// get some information about the <variable>'s
	var fields = [];
	var vn=0;
	var qn_re = /^q(\d+)plan_variables/;
	$problem_data.find('variable').each(function(){
	    var $v = $(this);
	    // May want to be adaptive to multiple names/descriptions
	    var name = $v.find('name').text();
	    $('#problem_data_variables').append('<dt style="font-weight:bold;">'
						+name+'</dt><dd>'
						+$v.find('description').text()
						+'</dd>');
	    fields.push({field:name,title:name})

	    $('div[id$="plan_variables"]').each(function() {
		var $pv = $(this);
		var id = qn_re.exec(this.id)[1]; // TODO: should check if worked
		$pv.append('<div id="q'+id+'plan_id'+vn+'" name="q'+id
			   +'plan_id" class="CTATCheckBox" data-ctat-tutor="false">'
			   +name+'</div>');
	    });
	    vn+=1;
	});
	$('#data-display').datagrid({
	    columns: [fields],
	    title: title,
	    rownumbers: true});
    },

    set_data_tab: function (data_file) {
	if (data_file.length>0) {
	    $.getJSON(data_file, function(data) {
		// json must be well formed or this will silently fail.
		// Use something like http://jsonlint.com/ to check files before making them live.
		$('#data-display').datagrid({data: data});
	    });
	}
    },

    /**
     * Opens the specified panel and make sure the proper tree navigator item
     * is selected.
     * @param name {String} The id of the desired panel.
     */
    goto_panel: function(name) {
	var node = $('#work_plan').tree('find',name);
	if (node) {
	    $('#work_plan').tree('expandTo',node.target);
	    $('#work_plan').tree('select',node.target);
	    $('#work_plan').tree('scrollTo',node.target);
	} else {
	    alert('There was a problem finding the next section, please use the tree on the left side to select the next section.');
	}
    },

    /**
     * Opens the specified panel in the Tabbed overview area.
     * @param name {String} the id of the desired tab.
     */
    goto_tab: function (name) {
	var node = $('#description_tabs').tabs('select',name);
    },

    /**
     * Calculates the status of any given node in the navigation tree.
     * @param node {Object} a tree node object.
     */
    check_complete: function (node) {
	if (node.attributes && node.attributes.disabled)
	    return 'disabled';
	if ($('#work_plan').tree('isLeaf',node.target)) {
	    if (node.attributes && node.attributes.complete) {
		return node.attributes.complete;
	    } else {
		return false;
	    }
	} else {
	    if (node.children) {
		if (node.children.every(function(c) {
		    var check = StatTutor.check_complete(c);
		    return check=='complete' || check=='disabled' || check=='info';
		})) return 'complete';
		else if (node.children.some(function(c) {
		    var check = StatTutor.check_complete(c);
		    return check=='complete' || check=='partial';
		})) return 'partial';
		else return false;
	    }
	}
	return false;
    },

    /**
     * Based on the given nodes status, update the icon used to represent completeness.
     * @param node {Object} a tree node object.
     */
    update_tree_icon: function (node) {
	if (node){
	    if (node.children) {
		node.children.forEach(function(n) {
		    StatTutor.update_tree_icon(n);
		});
	    }
	    var check = StatTutor.check_complete(node);
	    if (check=='complete'
		&& (!node.iconCls || node.iconCls!=='icon-ok')) {
		$('#work_plan').tree('update', {
		    target: node.target,
		    iconCls: 'icon-ok'
		});
	    } else if (check=='partial'
		       && (!node.iconCls || node.iconCls!=='icon-partial')) {
		$('#work_plan').tree('update', {
		    target: node.target,
		    iconCls: 'icon-partial'
		});
	    } else if (check===false
		       && (!node.iconCls || node.iconCls!=='icon-box')) {
		$('#work_plan').tree('update', {
		    target: node.target,
		    iconCls: 'icon-box'
		});
	    } else if (check=='info'
		       && (!node.iconCls || node.iconCls!=='icon-help')) {
		$('#work_plan').tree('update', {
		    target: node.target,
		    iconCls: 'icon-help'
		});
	    }
	}
    },

    /**
     * Walk the navigation tree and update completeness icons.
     */
    update_tree_icons: function () {
	var roots = $('#work_plan').tree('getRoots');
	roots.forEach(function(root) {
	    StatTutor.update_tree_icon(root);
	});
    },

    /**
     *
     */
    populate_summary: function () {
	var conclusions = [];
	for (var i = 1; i<=this.question_count; i++) {
	    var conc_i = "Question "+this.number_words[i]+" Conclusions:\n\n";
	    conc_i+=$('#q'+i+'conclusions').data('CTATComponent').getText();
	    conclusions.push(conc_i);
	}
	var ctext = conclusions.join('\n\n\n');
	$('#Summary').data('CTATComponent').setText(ctext);
	return true;
    },
    populate_validity: function () {
	var prev = $('#design_sampling').data('CTATComponent').getText();
	$('#evaluate_validity').data('CTATComponent').setText(prev);
	return true;
    },

    highlight_question: function (Qn) {
	$('.QuestionText').css('font-weight','normal');
	if (Qn) {
	    $('.'+Qn).css('font-weight','bold');
	    // This is BAD DESIGN to change something unexpected, but
	    // it is what is done in the original StatTutor...
	    StatTutor.goto_tab('Questions');
	}
    }
}
/**
 * Reveal the given our_answer section.
 * @param id [String]	id of the our_* to reveal
 */
function show_our_answer(id) {
    $('#'+id).css('visibility','visible');
}
/**
 * Marks a panel as complete in the tree navigator.
 * This is meant to be called as a TPA SAI(root,mark_complete,panel.id) from
 * the tutoring service.
 * @param node_name {String} the id of a panel, preferably a leaf in the tree.
 */
function mark_complete(node_name) {
    var node = $('#work_plan').tree('find',node_name);
    if (node) {
	if (!node.attributes) node.attributes = {};
	node.attributes.complete = 'complete';
	$('#work_plan').tree('expandTo',node.target); // necessary for updates to work.
    }
    StatTutor.update_tree_icons(); // update all of the tree completion icons.
}
/**
 * TPA for setting which variable(s) will require classification.
 * @param input [String]	"q<number>;<Input of related CTATRadioButton Group>"
 */
function set_classify_variables(input) {
    var inputs = input.split(';');
    var q = inputs.shift();
    var show = inputs.reduce(function(prev,cur) {
	var inps = cur.split(':');
	var present = inps[1].trim().toLowerCase();
	if (present==="true") {
	    var variable = inps[0].trim();
	    prev.push(variable);
	}
	return prev;
    },[]);
    show.forEach(function(variable,i,arr) {
	$('#'+q+'plan_variable'+i).text(variable);
    });
    $('#'+q+'plan_classify_variables').css('visibility','visible');
}
function populate_summary() { return StatTutor.populate_summary(); }
function populate_validity() { return StatTutor.populate_validity(); }
/**
 * In the Exploratory Analysis>Conduct Analysis panel, load and select
 * instructions based on student selections.
 */
function AnalysisQn_onBeforeOpen() {
    var i = this.id;
    var r = i.charAt(i.length-1);
    $('#ref_q'+r+'measure_display').html('----');
    $('[name="q'+r+'measure_display"]:checked').each(function() {
	var id = $(this).attr('id');
	$('#ref_q'+r+'measure_display').html($('label[for="'+id+'"]').text());
    });
    $('#ref_q'+r+'measure_num').html($('#q'+r+'measure_num>select').val());

    var analysis_type = $('#q'+r+'measure_plan>select').val();
    var package_select = $('#package_select').val();
    var $q_instructions = $('#q'+r+'instructions');
    while ($q_instructions.tabs('tabs').length>0) {
	$q_instructions.tabs('close',0);
    }
    $(StatTutor.instructions).find('task[id="'+analysis_type+'"]').each(function(){
	var $task = $(this);
	var $sys = $task.parent();
	var sys_id = $sys.attr("id");
	var inst = $task.text().trim();
	if (inst) {
	    var d = $("<div/>").addClass('instructions');
	    d.html(inst);
	    $q_instructions.tabs('add',
				 {title: sys_id,
				  selected: (sys_id.startsWith(package_select)),
				  content: d});
	}
    });
    return true;
}
/**
 * In the Formal Analysis>Conduct Analysis panel, add and select instructions
 * based on student selections.
 */
function FormalAnalysisQn_onBeforeOpen() {
    var i = this.id;
    var r = i.charAt(i.length-1);
    $('#ref_q'+r+'formal_test').html($('#q'+r+'formal_test option:selected').text());

    var analysis_type = $('#q'+r+'formal_test option:selected').val();
    var package_select = $('#package_select option:selected').val();
    var $q_instructions = $('#q'+r+'formal_instructions');
    while ($q_instructions.tabs('tabs').length>0) {
	$q_instructions.tabs('close',0);
    }
    $(StatTutor.instructions).find('task[id="'+analysis_type+'"]').each(function(){
	var $task = $(this);
	var $sys = $task.parent();
	var sys_id = $sys.attr("id");
	var inst = $task.text().trim();
	if (inst) {
	    $q_instructions.tabs('add',
				 {title:sys_id,
				  selected: (sys_id.startsWith(package_select)),
				  content: inst});
	}
    });
    return true;
}
/**
 * Add the package options based on the availability of the dataset and
 * the instructions for that dataset type.
 */
function package_options() {
    // moved to here so that it gets triggered on an openning of the CheckDataFormat
    // panel, which will happen well after the xml files are loaded.
    if (!this.package_options_set) {
	if (StatTutor.dataset && StatTutor.instructions) {
	    // add package selection options based on availability of datasets and instructions
	    $.each(StatTutor.dataset, function (pkg) {
		if ($(StatTutor.instructions).find('system[id^="'+pkg+'"]').length>0)
		    $('#package_select').append('<option>'+pkg+'</option>');
	    });
	    this.package_options_set = true;
	}
    }
}

/**
 * Top level function declarations of StatTutor.hightlight_question(...) for
 * each question so they can be used in easy-ui callbacks.
 */
function stattutor_highlight_q1() { return StatTutor.highlight_question('Q1'); }
function stattutor_highlight_q2() { return StatTutor.highlight_question('Q2'); }
function stattutor_highlight_q3() { return StatTutor.highlight_question('Q3'); }
function stattutor_highlight_q0() { return StatTutor.highlight_question(); }

/**
 * Reveals the thought question on the given panel.
 * @param panel (String)	The id of the panel where the thought question should be revealed
 */
function show_thought(panel) {
    var $where = $('#'+panel).find('.ThoughtArea');
    $where.css('visibility','visible');
}
