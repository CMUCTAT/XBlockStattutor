/**
 * We prefabricate a set of flashvars such that the
 * loader can do things more naturally. It doesn't seem to be the case that
 * edX automatically makes an object that contains all these variables.
 * They have to be replaced by the python script when the XBlock html page is
 * generated.
 */

var CTATConfig = {{
   class_name: "DefaultClass", // to replace with edx course code
   problem_name: "none",
   school_name: "none",
   student_problem_id: "none",

   'question_file': "{question_file}",
   'tutoring_service_communication': 'javascript',
   'user_guid': '{student_id}',
   'dataset': "edxdataset",
   'level1': "unit1",
   'type1': "unit",
   'level2': "unit2",
   'type2': "unit",
   'logtype': "clienttologserver",
   'distdir': ".",
   'remoteSocketPort': 8080,
   'remoteSocketURL': "{log_remoteurl}",
   'connection': "javascript",

   'saveandrestore': "{saveandrestore}",
   'skills': "",
   'problem_state_status': "{completed}"!=="False"?'complete':"{saveandrestore}"!==""?'incomplete':'empty',
    'session_id': 'xblockstattutor_'+"{guid}",
    'problem_description': "{problem_description}"
}};
