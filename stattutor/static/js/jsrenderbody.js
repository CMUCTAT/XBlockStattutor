var question_template = `<div id="Question{{:#index+1}}" class="easyui-panel work_area"
	title="Question {{word:#getIndex()+1}}" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
  {{if #index==0 }}<p>Now that we have completed the first part, where we 
	examined some general features of the problem, it is
	time to look at the questions that we are trying to
	answer using the data.</p>
	<p>In the <b>Work Plan</b> on the left, note that, for 
	each question, we will repeat three steps:
	Reflect on Question, Analyze Data, and Draw Conclusions.
	Once we have completed these three steps for <em>each</em>
	question, we will move on to the last part, Summarize.</p>
	<p>To get started with the first question, read the question
	marked <b>Q{{:#getIndex()+1}}</b> above in the 
  {{else}}
	<p>Now that we are done with Question {{word:#getIndex()}}, we are going to
	repeat the same three steps (Reflect on Question, Analyze Data, and
	Draw Conclusions) for question {{word:#getIndex()+1}}.</p>
	<p>Read the question marked <b>Q{{:#getIndex()+1}}</b> above in the 
  {{\/if}}
	<a class="easyui-linkbutton tab-button" onclick="javascript:StatTutor.goto_tab('Questions')">Questions</a> tab, 
	and then click on 
	<a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ReflectQ{{:#index+1}}')">Reflect on Question</a>
	to continue.</p>
</div>

<div id="ReflectQ{{:#index+1}}" class="easyui-panel work_area" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}"
	 title="Reflect on Question (Question {{word:#getIndex()+1}})">
	<p>In this first step, we think about the question and use our
	intuition and/or experience to try and predict what the results
	will show. Later, we will compare what we initially thought to
	what we actually find when we analyze the data.</p>

	<p>Note that we will repeat the middle three steps in the work
	plan (Reflect on Question, Analyze Data, and Draw Conclusions)
	for each of the questions in the analysis.</p>

	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConsiderQ{{:#index+1}}')">Consider Question {{word:#getIndex()+1}}</a> to continue.
	</p>
</div>

<div id="ConsiderQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Consider Question {{word:#getIndex()+1}}" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p id="q{{:#index+1}}consider_question"></p>
	<h3 class="your_answer">Your Answer:</h3>
	<div id="q{{:#index+1}}consider" class="CTATTextArea" data-ctat-tutor="false" data-ctat-show-feedback="false" data-ctat-tab-on-enter="false"></div>
	<div id="q{{:#index+1}}consider_submit" class="CTATSubmitButton Submit_and_Reveal" data-ctat-target="q{{:#index+1}}consider" data-ctat-show-feedback="false">Submit and Reveal Our Answer</div>
	<br />
	<h3 class="our_answer">Our Answer:</h3>
	<div id="our_q{{:#index+1}}consider" class="CTATTextField" data-ctat-tutor="false" data-ctat-enabled="false"></div>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('AnalyzeQ{{:#index+1}}')">Analyze Data</a> to continue.
	</p>
</div>
					
<div id="AnalyzeQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Analyze Data (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p>In this step, we choose and conduct the analyses that
	are needed in order to address the current question.</p>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('PlanQ{{:#index+1}}')">Plan Analyses</a> to continue.</p>
</div>
<div id="PlanQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Plan Analyses (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p>Before choosing the appropriate analyses, it is helpful to:</p>
	<h3>Identify the relevant variables:</h3>
	<p>Which variable(s) among those listed below is/are
	particularly relevant to the current question?</p>
	<div id="q{{:#index+1}}plan_variables"></div>
	<div id="q{{:#index+1}}plan_submit" class="CTATSubmitButton" data-ctat-target="q{{:#index+1}}plan_id" style="margin:5px;">Submit</div>
	<br/>
	<div id="q{{:#index+1}}plan_classify_variables" style="visibility:hidden; min-height: 8em;">
		<h3>Classify the relevant variables:</h3>
	</div>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ExploreQ{{:#index+1}}')">Exploratory Analyses</a> to continue.</p>
</div>
<div id="ExploreQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Exploratory Analysis (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p>Now that we have identified and classified the relevant
	variable(s), we use exploratory data analysis methods
	to help us make important features of the data visible.</p>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('MeasuresQ{{:#index+1}}')">Determine Displays and Measures</a> to 
	continue.</p>
</div>
<div id="MeasuresQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Determine Displays and Measures (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p>A meaningful display is:</p>
	<div class="meaningful_display"><img src="$boxplots" style="height:16px;"/><div id="q{{:#index+1}}measure_box" name="q{{:#index+1}}measure_display" class="CTATRadioButton meaningful_display_radio">Side-by-side boxplots</div></div>
	<div class="meaningful_display"><img src="$scatterplot" style="height:16px;"/><div id="q{{:#index+1}}measure_scatter" name="q{{:#index+1}}measure_display" class="CTATRadioButton meaningful_display_radio">Scatterplot</div></div>
	<div class="meaningful_display"><img src="$table" style="height:16px;"/><div id="q{{:#index+1}}measure_2table" name="q{{:#index+1}}measure_display" class="CTATRadioButton meaningful_display_radio">Two-way Table</div></div>
	<div class="meaningful_display"><img src="$piechart" style="height:16px;"/><div id="q{{:#index+1}}measure_pie" name="q{{:#index+1}}measure_display" class="CTATRadioButton meaningful_display_radio">Piechart</div></div>
	<div class="meaningful_display"><img src="$histogram" style="height:16px;"/><div id="q{{:#index+1}}measure_hist" name="q{{:#index+1}}measure_display" class="CTATRadioButton meaningful_display_radio">Histogram</div></div>
	<br/>
	<p>A meaningful numerical summary to supplement the above display is</p>
	<div id="q{{:#index+1}}measure_num" class="CTATComboBox" style="width:auto;">
		<option>----</option>
		<option>descriptive statistics</option>
		<option>group (category) percentages</option>
		<option>correlation r (if appropriate)</option>
		<option>conditional percentages</option>
	</div>
	<br/>
	<p>Using this display and numerical summary, I will</p>
	<div id="q{{:#index+1}}measure_plan" class="CTATComboBox" style="width:auto;">
		<option>----</option>
		<option value="OneQuant">describe the features of a single quantitative distribution</option>
		<option value="OneCat">describe the features of a single categorical distribution</option>
		<option value="TwoQuant">describe the relationship between two quantitative variables</option>
		<option value="TwoCat">examine the relationship between two categorical variables</option>
		<option value="TwoMixed">compare the distribution of a quantitative variable across several groups</option>
	</div>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('AnalysisQ{{:#index+1}}')">Conduct Analysis</a> to continue.</p>
</div>
<div id="AnalysisQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Conduct Analysis (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true,
	  onOpen:function(){
		stattutor_highlight_q{{:#index+1}};
		var i=this.id;
		var r = i.charAt(i.length-1);
		if ($('#ref_q'+r+'measure_display').text() &&
			$('#ref_q'+r+'measure_display').text().replace(/\\s|-/gm,'').length>0 &&
            $('#ref_q'+r+'measure_num').text().replace(/\\s|-/gm,'').length>0)
		  mark_complete('AnalysisQ{{:#index+1}}');},
	  onBeforeOpen:AnalysisQn_onBeforeOpen">
	<p>Remember...<br/>
	You selected <span id="ref_q{{:#index+1}}measure_display" style="font-weight: bold;"></span>
	and <span id="ref_q{{:#index+1}}measure_num" style="font-weight: bold;"></span>
	as the meaningful display and measure for the current question.</p>
	<p> Now use the instructions below to graph your selections
	using your selected tool.</p>
	<div id="q{{:#index+1}}instructions" class="easyui-tabs" data-options="plain:true"
		 style="margin:5px;width:90%;"></div>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ResultsQ{{:#index+1}}')">Report Results</a> to continue.</p>
</div>
<div id="ResultsQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Results (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p>Remember, using the display and numerical summary, you need
	to describe the features of a single quantitative distribution.</p>
	<p>Do that by describing the key features of the display and by
	supporting your description with numerical measures.</p>
	<p>Keep in mind that the appropriate numerical measures for
	the current situation (i.e., measures of center and spread)
	will depend on the shape of the distribution you find.</p>
	<h3 class="your_answer">Your Answer:</h3>
	<div id="q{{:#index+1}}results" class="CTATTextArea" data-ctat-tutor="false" data-ctat-show-feedback="false" data-ctat-tab-on-enter="false"></div>
	<div id="q{{:#index+1}}results_submit" class="CTATSubmitButton Submit_and_Reveal" data-ctat-target="q{{:#index+1}}results" data-ctat-show-feedback="false">Submit and Reveal Our Answer</div>
	<h3 class="our_answer">Our Answer:</h3>
	<div id="our_q{{:#index+1}}results" class="CTATTextField" data-ctat-tutor="false" data-ctat-enabled="false"></div>

	<p class="q{{:#getIndex()+1}}formal_enabled">Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('FormalQ{{:#index+1}}')">More Formal Analyses</a> to continue.</p>
	<p class="q{{:#getIndex()+1}}formal_disabled">Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsQ{{:#index+1}}')">Draw Conclusions</a> to continue.</p>
</div>
<div id="FormalQ{{:#index+1}}" class="easyui-panel work_area"
	 title="More Formal Analyses (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<div class="q{{:#getIndex()+1}}formal_enabled">
		<p>Now that we have made the important features of
		the data visible using exploratory data analysis,
		we move on to assessing the <em>strength</em> of
		evidence provided by the data using formal
		statistical tests.</p>
		<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('FormalMeasuresQ{{:#getIndex()+1}}')">Determine More Formal Analyses (Question {{word:#getIndex()+1}})</a> to continue.</p>
	</div>
	<p class="q{{:#getIndex()+1}}formal_disabled">This node is not active for this lab exercise. Click on
		<a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsQ{{:#getIndex()+1}}')">Draw Conclusions</a> to continue.</p>
</div>
<div id="FormalMeasuresQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Determine More Formal Analyses (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<div class="q{{:#getIndex()+1}}formal_enabled">
		<div>The formal analysis part for the current question will focus on<br/>
			<div id="q{{:#getIndex()+1}}formal_focus" class="CTATComboBox" style="width:auto">
				<option>----</option>
				<option>exploring the population mean</option>
				<option>exploring the population proportion</option>
				<option>comparing two population means</option>
				<option>exploring the mean of differences</option>
				<option>comparing two population proportions</option>
				<option>comparing more than two means</option>
				<option>examining the relationship between two categorical variables</option>
				<option>examining the relationship between two quantitative variables</option>
			</div>
		</div>
		<br/>
		<div>The appropriate statistical test is<br/>
			<div id="q{{:#getIndex()+1}}formal_test" class="CTATComboBox" style="width:auto;">
				<option>----</option>
				<option value="OneZOneMean">one sample z-test for the mean (&mu;)</option>
				<option value="OneTOneMean">one sample t-test for the mean (&mu;)</option>
				<option value="OneZOneProportion">one sample z-test for the proportion (p)</option>
				<option value="TwoTTwoMeans">two sample t-test for two means (&mu;1, &mu;2)</option>
				<option value="TwoZTwoProportions">two sample z-test for two proportions (p1, p2)</option>
				<option value="PairedT">paired t-test for &mu;d</option>
				<option value="ChiSquare">Chi-square test for independence</option>
				<option value="AnovaF">ANOVA F test</option>
				<option value="RegressionT">regression t-test for the slope</option>
			</div>
		</div>
		<br/><br/>
		<div>Null hypotheses - H<sub>0</sub>:
			<div id="q{{:#getIndex()+1}}formal_h0" class="CTATComboBox" style="width:auto; display:inline-block;">
				<option>-------</option>
				<option value="mu">&mu;</option>
				<option value="p">p</option>
				<option value="mu1 - mu2">&mu;1 - &mu;2</option>
				<option value="p1 - p2">p1 - p2</option>
				<option value="mud">&mu;d</option>
				<option value="mu1 = mu2 = mu3 = ... = muk">&mu;1 = &mu;2 = &mu;3 = &hellip; = &mu;k</option>
				<option value="not all mui are equal">not all &mu;<sub>i</sub> are equal</option>
				<option value="a linear relationship exists">a linear relationship exists</option>
				<option value="no linear relationship exists">no linear relationship exists</option>
				<option value="two cat vars are independent">two categorical variables are independent</option>
				<option value="two cat vars are not independent">two categorical variables are not independent</option>
			</div>
			<div id="q{{:#getIndex()+1}}formal_h0_second" class="CTATComboBox" style="width:auto; display:inline-block; visibility:hidden;">
				<option></option>
				<option value="=">=</option>
				<option value="ne">&ne;</option>
				<option value="lt">&lt;</option>
				<option value="gt">&gt;</option>
			</div>
			<div id="q{{:#getIndex()+1}}formal_h0_third" class="CTATTextInput" style="display:inline-block; visibility:hidden;"></div>
		</div>
		<br/>
		<div>Alternative hypothesis - H<sub>a</sub>:
			<div id="q{{:#getIndex()+1}}formal_ha" class="CTATComboBox" style="width:auto; display:inline-block;">
				<option>-------</option>
				<option value="mu">&mu;</option>
				<option value="p">p</option>
				<option value="mu1 - mu2">&mu;1 - &mu;2</option>
				<option value="p1 - p2">p1 - p2</option>
				<option value="mud">&mu;d</option>
				<option value="mu1 = mu2 = mu3 = ... = muk">&mu;1 = &mu;2 = &mu;3 = &hellip; = &mu;k</option>
				<option value="not all mui are equal">not all &mu;i are equal</option>
				<option value="a linear relationship exists">a linear relationship exists</option>
				<option value="no linear relationship exists">no linear relationship exists</option>
				<option value="two cat vars are independent">two categorical variables are independent</option>
				<option value="two cat vars are not independent">two categorical variables are not independent</option>
			</div>
			<div id="q{{:#getIndex()+1}}formal_ha_second" class="CTATComboBox" style="width:auto; display:inline-block; visibility: hidden;">
				<option></option>
				<option value="=">=</option>
				<option value="ne">&ne;</option>
				<option value="lt">&lt;</option>
				<option value="gt">&gt;</option>
			</div>
			<div id="q{{:#getIndex()+1}}formal_ha_third" class="CTATTextInput" style="display:inline-block; visibility: hidden;"></div>
		</div>
		<div id="FormalMeasuresQ{{:#index+1}}_Thought" class="ThoughtArea"></div>
		<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('FormalAnalysisQ{{:#getIndex()+1}}')">Conduct Analysis</a> to continue.</p>
	</div>
	<p class="q{{:#getIndex()+1}}formal_disabled">This node is not active for this lab exercise. Click on
		<a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsQ{{:#getIndex()+1}}')">Draw Conclusions</a> to continue.</p>
</div>
<div id="FormalAnalysisQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Conduct Analysis (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<div class="q{{:#getIndex()+1}}formal_enabled">
		<p><i>Remember...</i><br/>
		You selected <span id="ref_q{{:#getIndex()+1}}formal_test" style="font-weight:bold;"></span>.<br/>
		Now use the instructions below to graph you selections using your selected tool:</p>
		<div id="q{{:#getIndex()+1}}formal_instructions" class="easyui-tabs" data-options="plain:true"></div>
		<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('FormalResultsQ{{:#getIndex()+1}}')">Report Results</a> to continue.
		</p>
	</div>
	<p class="q{{:#getIndex()+1}}formal_disabled">This node is not active for this lab exercise. Click on
		<a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsQ{{:#getIndex()+1}}')">Draw Conclusions</a> to continue.
	</p>
</div>
<div id="FormalResultsQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Report Results (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<div class="q{{:#getIndex()+1}}formal_enabled">
		<p>State the p-value of the test:</p>
		<h3 class="your_answer">Your Answer:</h3>
		<div id="q{{:#index+1}}formal_results" class="CTATTextArea" data-ctat-tutor="false" data-ctat-show-feedback="false" data-ctat-tab-on-enter="false"></div>
		<div id="q{{:#index+1}}formal_results_submit" class="CTATSubmitButton Submit_and_Reveal" data-ctat-target="q{{:#index+1}}formal_results" data-ctat-show-feedback="false">Submit and Reveal Our Answer</div>
		<h3 class="our_answer">Our Answer:</h3>
		<div id="our_q{{:#getIndex()+1}}formal_results" class="CTATTextField" data-ctat-tutor="false" data-ctat-enabled="false"></div>
		<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsQ{{:#getIndex()+1}}')">Draw Conclusions</a> to continue.</p>
	</div>
	<p class="q{{:#getIndex()+1}}formal_disabled">This node is not active for this lab exercise. Click on
		<a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsQ{{:#getIndex()+1}}')">Draw Conclusions</a> to continue.</p>
</div>
					
<div id="ConclusionsQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Draw Conclusions (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p>In this step, Draw Conclusions, we interpret the
	results we got from out analyses in the context of the
	current question.</p>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsConsiderQ{{:#index+1}}')">Consider what results mean</a> to continue.</p>
</div>
<div id="ConclusionsConsiderQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Consider what results mean (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true, onOpen:stattutor_highlight_q{{:#index+1}}">
	<p id="q{{:#index+1}}conclusions_question"></p>
	<h3 class="your_answer">Your Answer:</h3>
	<div id="q{{:#index+1}}conclusions" class="CTATTextArea" data-ctat-tutor="false" data-ctat-show-feedback="false" data-ctat-tab-on-enter="false"></div>
	<div id="q{{:#index+1}}conclusions_submit" class="CTATSubmitButton Submit_and_Reveal" data-ctat-target="q{{:#index+1}}conclusions" data-ctat-show-feedback="false">Submit and Reveal Our Answer</div>
	<h3 class="our_answer">Our Answer:</h3>
	<div id="our_q{{:#index+1}}conclusions" class="CTATTextField" data-ctat-tutor="false" data-ctat-enabled="false"></div>
	<div id="ConclusionsConsiderQ{{:#index+1}}_Thought" class="ThoughtArea"></div>
	<p>Click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConclusionsReflectQ{{:#index+1}}')">Reflect on conclusions</a> to continue.</p>
</div>
<div id="ConclusionsReflectQ{{:#index+1}}" class="easyui-panel work_area"
	 title="Reflect on Conclusions (Question {{word:#getIndex()+1}})" data-options="closed:true, fit:true,
	   onOpen:function(){
		if ($('#q{{:#index+1}}consider').data('CTATComponent').getText().length>0)
		  $('#q{{:#index+1}}reflect_prev').html($('#q{{:#index+1}}consider').data('CTATComponent').getText().replace(/\\n/g,'<br/>'));
		stattutor_highlight_q{{:#index+1}}();}">
	<p>Remember...<br/>Under <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('ConsiderQ{{:#index+1}}')">Consider Question {{word:#getIndex()+1}}</a> you said:
	<div class="ReminderText" id="q{{:#index+1}}reflect_prev"></div>
	<p>Relate the comments you made before analyzing the data
	(these appear in the textbox above) by commenting on
	<b>both</b> of the following:</p>
	<ul><li>how your expectations differ (or do not differ) from the actual results</li>
		<li>if it is relevant or meaningful in context, think of
			a way that these results could be used in practice</li>
	</ul>
	<h3 class="your_answer">Your Answer:</h3>
	<div id="q{{:#index+1}}reflect" class="CTATTextArea" data-ctat-tutor="false" data-ctat-show-feedback="false" data-ctat-tab-on-enter="false"></div>
	<div id="q{{:#index+1}}reflect_submit" class="CTATSubmitButton Submit_and_Reveal" data-ctat-target="q{{:#index+1}}reflect" data-ctat-show-feedback="false">Submit and Reveal Our Answer</div>
	<h3 class="our_answer">Our Answer:</h3>
	<div id="our_q{{:#index+1}}reflect" class="CTATTextField" data-ctat-tutor="false" data-ctat-enabled="false"></div>

	<p class="q{{:#index+1}}last_question_false">Now that you have completed the three steps in the
	the Work Plan for Question {{word:#getIndex()+1}}, click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('Question{{:#getIndex()+2}}')">Question {{:#getIndex()+2}}.</a></p>
	<p class="q{{:#index+1}}last_question_true" style="display:none;">Now that you have completed all three steps in the Work Plan for each question,
	click on <a class="easyui-linkbutton" onclick="javascript:StatTutor.goto_panel('Summarize')">Summarize</a>.</p>
</div>
`;

// Order for this is important as it needs to execute before easyui
// Because of that, this will not have any actual information about the
// problem so all that this does is make blank questions from the template to
// be filled in when more information is loaded.  There is some contingent
// things built into the template that end up getting controled by classes/css.
// This no longer needs to be wrapped in $(function(){...}); because it no
// longer needs to wait for the page to load to get the template.

var MAX_NUMBER_QUESTIONS = 3;
var question_init_data = [];

for (var i=0; i<MAX_NUMBER_QUESTIONS; i++) 
{
    question_init_data.push({});
}
$(function() {
    $.views.converters("word", function(val) { return ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][parseInt(val)];});
    var template = $.templates(question_template);
    var question_panels = template.render(question_init_data);
    $('#main').append(question_panels);
});

console.log ("Finished adding templated html.");

