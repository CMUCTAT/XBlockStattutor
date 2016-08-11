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
   'resource_spec': "{self.log_name}", // unsure if used
   'dataset': "{self.log_dataset}",
   'level1': "{self.log_level1}",
   'type1': "{self.log_type1}",
   'level2': "{self.log_level2}",
   'type2': "{self.log_type2}",
   'Logging': "{self.logtype}",
   'distdir': "{self.log_diskdir}",
   'remoteSocketPort': {self.log_port},
   'remoteSocketURL': "{self.log_remoteurl}",
   'connection': "{self.ctat_connection}",

   'saveandrestore': "{self.saveandrestore}",
   //'skills': "",
   'problem_state_status': "{self.completed}"!=="False"?'complete':"{self.saveandrestore}"!==""?'incomplete':'empty',
    'session_id': 'xblockstattutor_'+"{guid}",
    'problem_description': "{problem_description}"
}};
