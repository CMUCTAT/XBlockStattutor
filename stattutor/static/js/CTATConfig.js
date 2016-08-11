/**
 * We prefabricate a set of flashvars such that the
 * loader can do things more naturally. It doesn't seem to be the case that
 * edX automatically makes an object that contains all these variables.
 * They have to be replaced by the python script when the XBlock html page is
 * generated.
 */

var CTATConfig = {{
    'class_name': window.$$course_id || "SDK",
    'connection': "javascript",
    'problem_name': "{problem_name}",
    'dataset_level_name1': "{usage_id}",
    'dataset_level_type1': "Unit",
    'dataset_name': window.$$course_id || "SDK",

    'Logging': "{logtype}", // ClientToService
    'log_service_url': "{log_url}",
    

    'school_name': window.location.hostname,

    'question_file': "{question_file}", // BRD information
    'tutoring_service_communication': 'javascript',
    'user_guid': '{student_id}',

    'saveandrestore': "{saved_state}",
    'problem_state_status': "{completed}"!=="False"?'complete':"{saved_state}"!==""?'incomplete':'empty',
    'session_id': 'xblockstattutor_'+"{guid}",
    'problem_description': "{problem_description}"
}};
