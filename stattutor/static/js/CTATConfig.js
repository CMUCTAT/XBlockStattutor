/**
 * We prefabricate a set of flashvars such that the
 * loader can do things more naturally. It doesn't seem to be the case that
 * edX automatically makes an object that contains all these variables.
 * They have to be replaced by the python script when the XBlock html page is
 * generated.
 */

var CTATConfig = {{
    // meta
    'session_id': 'xblockstattutor_'+"{guid}",
    'user_guid': '{student_id}',

    // class
    'class_name': "{course}",
    'school_name': "{org}",
    'period_name': "{run}",
    'class_description': 'StatTutor in EdX',

    // dataset
    'dataset_name': "{course_key}",
    'problem_name': "{problem_name}",
    'dataset_level_name1': "{block_type}",
    'dataset_level_type1': "Unit",

    // runtime
    'connection': "javascript",

    // if window.$$course_id is undefined, then this is in an environment
    // that should forcibly disable logging (eg) in Studio or in the SDK
    'Logging': window.$$course_id?("{logtype}"=="True"?"ClientToService":"None"):"None",
    'log_service_url': "{log_url}",

    'question_file': "{question_file}", // BRD information
    'tutoring_service_communication': 'javascript',

    'saveandrestore': "{saved_state_len}",
    'problem_state_status': "{completed}"!=="False"?'complete':{saved_state_len}>0?'incomplete':'empty',
    'problem_description': "{problem_description}"
}};
