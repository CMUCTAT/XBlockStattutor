"""
This is a XBlock used to serve the CTAT based StatTutor problems originally
implemented for OLI (http://oli.cmu.edu/).
"""

import re
import uuid
import base64
import math
import pkg_resources
import bleach

# pylint: disable=import-error
# The xblock packages are available in the runtime environment.
from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Float, Boolean
from xblock.fragment import Fragment
# pylint: enable=import-error


class StattutorXBlock(XBlock):
    """
    A XBlock providing a CTAT backed StatTutor.
    """
    # pylint: disable=too-many-instance-attributes
    # All of the instance variables are required.

    display_name = String(
        help="Display name of the component",
        default="StatTutor",
        scope=Scope.content)  # required to prevent garbage name at the top

    # **** xBlock tag variables ****
    # The width must be at least 900 in order to accommodate some dynamically
    # loaded images and some of the interactive elements without causing
    # side scrolling scrollbars to appear.  They are set here instead of
    # hard coding them into ctatxblock.html to make it easier for EdX
    # administrators to modify them if they wish without having to scour
    # all of the code for where they are set.
    width = 900  # Width of the StatTutor frame.
    height = 750  # Height of the StatTutor frame.

    # **** Grading variables ****
    # All of the variable in this section are required to get grading to work
    # according to EdX's documentation.
    has_score = Boolean(default=True, scope=Scope.content)
    icon_class = String(default="problem", scope=Scope.content)
    score = Integer(help="Current count of correctly completed student steps",
                    scope=Scope.user_state, default=0)
    max_problem_steps = Integer(
        help="Total number of steps",
        scope=Scope.user_state, default=1)
    max_possible_score = 1

    def max_score(self):
        """ The maximum raw score of the problem. """
        # For some unknown reason, errors are thrown if the return value is
        # hard coded.
        return self.max_possible_score
    attempted = Boolean(help="True if at least one step has been completed",
                        scope=Scope.user_state, default=False)
    completed = Boolean(
        help="True if all of the required steps are correctly completed",
        scope=Scope.user_state, default=False)
    weight = Float(
        display_name="Problem Weight",
        help=("Defines the number of points each problem is worth. "
              "If the value is not set, the problem is worth the sum of the "
              "option point values."),
        values={"min": 0, "step": .1},
        scope=Scope.settings
    )  # weight needs to be set to something, errors will be thrown if it does
    # not exist.

    # **** Basic interface variables ****
    # All of the variable in this section are required to get the tutors to run
    src = "public/html/StatTutor.html"  # this is static in StatTutor
    # src can not be hard coded into static/html/ctatxblock.html because of the
    # relative path issues discussed elsewhere in this file.

    # Generate and store a dictionary of the available problems.
    # (AKA the problem whitelist)
    problems = {}
    for pf_dir in pkg_resources.resource_listdir(__name__,
                                                 'public/problem_files/'):
        pdir = 'public/problem_files/{}'.format(pf_dir)
        if pkg_resources.resource_isdir(__name__, pdir):
            pdir_files = [f for f in
                          pkg_resources.resource_listdir(__name__, pdir)]
            brds = [brd for brd in pdir_files if '.brd' in brd]
            desc = [dsc for dsc in pdir_files if '.xml' in dsc]
            if len(brds) > 0 and len(desc) > 0:
                problems[pf_dir] = {'name': pf_dir,
                                    'brd': pdir + '/' + brds[0],
                                    'description': pdir + '/' + desc[0]}
    problem = String(help="The selected problem from problems",
                     default="m1_survey", scope=Scope.settings)

    # **** CTATConfiguration variables ****
    # These should be the only variables needed to set up logging.

    # log_url should be the url of the logging service.
    # This should probably be hard coded or at least made to be one
    # of a few predefined log servers.
    log_url = String(help="URL of the logging service, used to indicate " +
                     "where the server is that will receive the log messages",
                     default="",
                     scope=Scope.settings)

    # None, ClientToService, ClientToLogServer or OLI
    # Set to "ClientToService" to activate logging.
    logtype = Boolean(help="Enable logging.",
                      default=True,
                      scope=Scope.settings)

    # **** User Information ****
    # This section includes variables necessary for storing partial
    # student answers so that they can come back and work on a problem
    # without worrying about loosing progress.
    saveandrestore = String(help="Internal data blob used by the tracer",
                            default="", scope=Scope.user_state)

    # **** Utility functions and methods ****
    @staticmethod
    def resource_string(path):
        """ Read in the contents of a resource file. """
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    @staticmethod
    def strip_local(url):
        """ Returns the given url with //localhost:port removed. """
        return re.sub(r'//localhost(:\d*)?', '', url)

    def get_local_resource_url(self, url):
        """ Wrapper for self.runtime.local_resource_url. """
        # It has been observed that self.runtime.local_resource_url(self, url)
        # prepends "//localhost:(port)" which makes accessing the Xblock in EdX
        # from a remote machine fail completely.
        return self.strip_local(self.runtime.local_resource_url(self, url))

    # **** XBlock methods ****

    # -------------------------------------------------------------------
    # Here we construct the tutor html page from various resources. This
    # is where all things go to hell. We can't use jsrender because the
    # XBlock API call add_resource doesn't support non-registered mime-
    # types and it doesn't support the addition of an id for the script
    # tag.
    # More information on this poor excuse for an API at:
    #
    # http://edx.readthedocs.org/projects/xblock/en/latest/fragment.html
    #
    # The XBlock developers seem to be confused as to what a relative url
    # is but have no problem accusing outside developers of not
    # understanding the concept. Also of course major documentation missing
    # or unclear on how to add static resources to XBLock html pages and
    # CSS files:
    #
    # https://groups.google.com/forum/#!topic/edx-code/MXWBNkE6gjU
    #
    # -------------------------------------------------------------------

    def student_view(self, dummy_context=None):
        """
        Create a Fragment used to display a CTAT StatTutor xBlock to a student.

        Args:
          dummy_context: unused but required as a XBlock.student_view.
        Returns:
          a Fragment object containing the HTML to display.
        """
        # read in template html
        html = self.resource_string("static/html/ctatxblock.html")
        brd = self.problems[self.problem]['brd']
        description = self.problems[self.problem]['description']
        frag = Fragment(html.format(
            # Until the iframe srcdoc attribute is universally supported
            # a valid xblock generated url has to be passed into
            # ctatxblock.html.  Internet Explorer does not support srcdoc.
            tutor_html=self.get_local_resource_url(self.src),
            width=self.width, height=self.height))
        config = self.resource_string("static/js/CTATConfig.js")
        usage_id = self.scope_ids.usage_id
        sdk_usage = isinstance(usage_id, basestring)
        frag.add_javascript(config.format(
            # meta
            guid=str(uuid.uuid4()),
            student_id=self.runtime.anonymous_student_id
            if hasattr(self.runtime, 'anonymous_student_id')
            else 'bogus-sdk-id',
            # class
            course=unicode(usage_id.course) if not sdk_usage else usage_id,
            org=unicode(usage_id.org) if not sdk_usage else usage_id,
            run=unicode(usage_id.run) if not sdk_usage else usage_id,
            # dataset
            course_key=unicode(usage_id.course_key)
            if not sdk_usage else usage_id,
            problem_name=self.problem,
            block_type=unicode(usage_id.block_type)
            if not sdk_usage else usage_id,
            # runtime
            logtype=self.logtype,
            log_url=self.log_url,
            question_file=self.get_local_resource_url(brd),
            saved_state_len=len(self.saveandrestore),
            completed=self.completed,
            usage_id=unicode(self.scope_ids.usage_id),
            problem_description=self.get_local_resource_url(description)
        ))
        # Add the xml2json library here because someone has a problem if it lives somewhere else instead
        frag.add_javascript(self.resource_string("static/js/xml2json.min.js"))		
        # Add javascript initialization code
        frag.add_javascript(self.resource_string("static/js/Initialize_CTATXBlock.js"))
        # Execute javascript initialization code
        frag.initialize_js('Initialize_CTATXBlock')
        return frag

    @XBlock.json_handler
    def ctat_log(self, data, dummy_suffix=''):
        """Publish log messages from a CTAT tutor to EdX log."""
        if data.get('event_type') is None or\
           data.get('action') is None or\
           data.get('message') is None:
            return {'result': 'fail',
                    'error': 'Log request message is missing required fields.'}
        data.pop('event_type')
        # pylint: disable=broad-except
        try:
            data['user_id'] = self.runtime.user_id
            data['component_id'] = unicode(self.scope_ids.usage_id)
            self.runtime.publish(self, "problem_check", data)
        # General mechanism to catch a very broad category of errors.
        except Exception as err:
            return {'result': 'fail', 'error': unicode(err)}
        # pylint: enable=broad-except
        return {'result': 'success'}

    @XBlock.json_handler
    def ctat_grade(self, data, dummy_suffix=''):
        """
        Handles updating the grade based on post request from the tutor.

        Args:
          self: the StatTutor XBlock.
          data: A JSON object.
          dummy_suffix: unused but required as a XBlock.json_handler.
        Returns:
          A JSON object reporting the success or failure.
        """
        self.attempted = True
        corrects = 0
        try:
            if data.get('value') is not None:
                corrects = int(data.get('value'))
                if math.isnan(corrects):
                    corrects = 0  # check for invalid value
            if data.get('max_value') is not None:
                max_val = int(data.get('max_value'))
                if not math.isnan(max_val) and max_val > 0:
                    # only update if a valid number
                    self.max_problem_steps = max_val
        except ValueError as int_err:
            return {'result': 'fail', 'error': 'Bad grading values:' +
                    unicode(int_err)}
        # only change score if it increases.
        # this is done because corrects should only ever increase and
        # it deals with issues EdX has with grading, in particular
        # the multiple identical database entries issue.
        if corrects > self.score:
            self.score = corrects
            self.completed = self.score >= self.max_problem_steps
            scaled = float(self.score)/float(self.max_problem_steps)
            # trying with max of 1. because basing it on max_problem_steps
            # seems to cause EdX to incorrectly report the grade.
            event_data = {'value': scaled, 'max_value': 1.0}
            # pylint: disable=broad-except
            # The errors that should be checked are django errors, but there
            # type is not known at this point. This exception is designed
            # partially to learn what the possible errors are.
            try:
                self.runtime.publish(self, 'grade', event_data)
            except Exception as err:
                return {'result': 'fail', 'Error': err.message}
            return {'result': 'success', 'finished': self.completed,
                    'score': scaled}
            # pylint: enable=broad-except
        return {'result': 'no-change', 'finished': self.completed,
                'score': float(self.score)/float(self.max_problem_steps)}

    def studio_view(self, dummy_context=None):
        """ Generate the Studio page contents. """
        html = self.resource_string("static/html/ctatstudio.html")
        problem_dirs = [
            '<option value="{0}"{1}>{0}</option>'.format(
                d, ' selected' if d == self.problem else '')
            for d in self.problems.keys()]
        problem_dirs.sort()
        frag = Fragment(html.format(
            problems=''.join(problem_dirs),
            logging='checked' if self.logtype else '',
            logserver=self.log_url))
        studio_js = self.resource_string("static/js/ctatstudio.js")
        frag.add_javascript(unicode(studio_js))
        frag.initialize_js('CTATXBlockStudio')
        return frag

    @XBlock.json_handler
    def studio_submit(self, data, dummy_suffix=''):
        """
        Called when submitting the form in Studio.

        Args:
          self: the StatTutor XBlock.
          data: a JSON object encoding the form data from
                static/html/ctatstudio.html
          dummy_suffix: unused but required as a XBlock.json_handler.
        Returns:
          A JSON object reporting the success of the operation.
        """
        status = 'success'
        messages = []
        statmodule = bleach.clean(data.get('statmodule'), strip=True)
        logserver = bleach.clean(data.get('logserver').strip(), strip=True)
        logging = bleach.clean(data.get('logging'), strip=True)
        if statmodule in self.problems.keys():
            self.problem = statmodule
        else:
            status = 'failure'
            messages.append("invalid module")
        if logging.lower() == "true":
            self.logtype = True
            self.log_url = logserver
        else:
            self.logtype = False
        ret = {'result': status}
        if len(messages) > 0:
            ret['message'] = "; ".join(messages)
        return ret

    @XBlock.json_handler
    def ctat_save_problem_state(self, data, dummy_suffix=''):
        """Called from CTATLMS.saveProblemState.
        This saves the current state of the tutor after each correct action.

        Args:
          self: the StatTutor XBlock.
          data: A JSON object with a 'state' field with a payload of the blob
                of 64 bit encoded data that represents the current
                state of the tutor.
          dummy_suffix: unused but required as a XBlock.json_handler.
        Returns:
          A JSON object with a 'result' field with a payload indicating the
          success status.
        """
        if data.get('state') is not None:
            self.saveandrestore = bleach.clean(data.get('state'))
            return {'result': 'success'}
        return {'result': 'failure'}

    @XBlock.json_handler
    def ctat_get_problem_state(self, dummy_data, dummy_suffix=''):
        """
        Return the stored problem state to reconstruct a student's progress.

        Args:
          self: the StatTutor XBlock.
          dummy_data: unused but required as a XBlock.json_handler.
          dummy_suffix: unused but required as a XBlock.json_handler.
        Returns:
          A JSON object with a 'result' and a 'state' field.
        """
        return {'result': 'success', 'state': self.saveandrestore}

    @staticmethod
    def workbench_scenarios():
        """ Prescribed XBlock method for displaying this in the workbench. """
        return [
            ("StattutorXBlock",
             """<vertical_demo>
                <stattutor width="900" height="750"/>
                </vertical_demo>
             """),
        ]
