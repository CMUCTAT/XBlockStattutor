import os
import pprint
import pkg_resources
import base64
import glob
import re
import socket
import uuid

from string import Template

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Boolean, Any
from xblock.fragment import Fragment
from xblock.reference.user_service import XBlockUser

dbgopen=False;
tmp_file=None;

class StattutorXBlock(XBlock):
    """
    A XBlock providing a CTAT backed StatTutor.
    """
    ### xBlock tag variables
    width = Integer(help="Width of the StatTutor frame.", default=900, scope=Scope.content)
    height = Integer(help="Height of the StatTutor frame.", default=750, scope=Scope.content)

    ### Grading variables
    has_score = Boolean(default=True, scope=Scope.content)
    icon_class = String(default="problem", scope=Scope.content)
    score = Integer(help="Current count of correctly completed student steps", scope=Scope.user_state, default=0)
    max_score = Integer(help="Total number of steps", scope=Scope.user_state, default=1) # this may want to be a method
    attempted = Boolean(help="True if at least one step has been completed", scope=Scope.user_state, default=False)
    completed = Boolean(help="True if all of the required steps are correctly completed", scope=Scope.user_state, default=False)
    weight = Integer(default=1, scope=Scope.content)

    ### Basic interface variables
    src = String(help="The source html file for CTAT interface.",
                 default="public/html/StatTutor.html", scope=Scope.settings)
    brd = String(help="The behavior graph.",
                 default="public/problem_files/m1_survey/survey.brd",
                 scope=Scope.settings)
    problem_description = String(help="The problem description xml file.",
                                 default="public/problem_files/m1_survey/survey.xml",
                                 scope=Scope.settings)

    ### CTATConfiguration variables
    log_name = String(help="Problem name to log", default="CTATEdXProblem", scope=Scope.settings)
    log_dataset = String(help="Dataset name to log", default="edxdataset", scope=Scope.settings)
    log_level1 = String(help="Level name to log", default="unit1", scope=Scope.settings)
    log_type1 = String(help="Level type to log", default="unit", scope=Scope.settings)
    log_level2 = String(help="Level name to log", default="unit2", scope=Scope.settings)
    log_type2 = String(help="Level type to log", default="unit", scope=Scope.settings)
    log_url = String(help="URL of the logging service", default="http://pslc-qa.andrew.cmu.edu/log/server", scope=Scope.settings)
    logtype = String(help="How should data be logged", default="clienttologserver", scope=Scope.settings)
    log_diskdir = String(help="Directory for log files relative to the tutoring service", default=".", scope=Scope.settings)
    log_port = String(help="Port used by the tutoring service", default="8080", scope=Scope.settings)
    log_remoteurl = String(help="Location of the tutoring service (localhost or domain name)", default="localhost", scope=Scope.settings)

    ctat_connection = String(help="", default="javascript", scope=Scope.settings)

    ### user information
    saveandrestore = String(help="Internal data blob used by the tracer", default="", scope=Scope.user_state)
    skillstring = String(help="Internal data blob used by the tracer", default="", scope=Scope.user_info)
    ctat_user_id = String(help="Anonymous ID used for logging in DataShop.", default="", scope=Scope.user_info) # unclear how to get EdX's anonymous id, so use our own.

    def logdebug (self, aMessage):
        global dbgopen, tmp_file
        if (dbgopen==False):
            tmp_file = open("/tmp/edx-tmp-log-stattutor.txt", "a", 0)
            dbgopen=True
        tmp_file.write (aMessage + "\n")

    def resource_string(self, path):
        data = pkg_resources.resource_string(__name__, path)        
        return data.decode("utf8")

    def bind_path (self, text):
        tbase=self.runtime.local_resource_url (self,"public/ref.css")
        self.logdebug (self,'local_resource_url: ' + tbase)
        base=tbase[:-7]
        self.logdebug (self,'local_resource_url (adjusted): ' + base)
        return (text.replace ("[xblockbase]",base))

    def strip_local (self, url):
        """Returns the given url with //localhost:port removed."""
        return re.sub('//localhost(:\d*)?', '', url)

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

    def student_view(self, context=None):
        """
        Create a Fragment used to display a CTAT StatTutor xBlock to a student.

        Returns a Fragment object containing the HTML to display
        """
        #xblock_user = self.runtime.service(self,"user").get_current_user()
        #self.ctat_user_id=xblock_user.opt_attrs['edx-platform.user_id']
        if self.ctat_user_id=="":
            self.ctat_user_id = str(uuid.uuid4())

        # read in template html
        html = self.resource_string("static/html/ctatxblock.html")
        frag = Fragment (html.format(self=self, 
                                     stattutor_html=self.strip_local(self.runtime.local_resource_url(self, self.src)),
                                     question_file=self.strip_local(self.runtime.local_resource_url(self, self.brd)),
                                     problem_description=self.strip_local(self.runtime.local_resource_url(self, self.problem_description)),
                                     student_id=self.ctat_user_id,
                                     guid=str(uuid.uuid4())))
        frag.add_javascript (self.resource_string("static/js/CTATXBlock.js"))
        frag.initialize_js('Initialize_CTATXBlock')
        return frag

    @XBlock.json_handler
    def ctat_grade(self, data, suffix=''):
        self.logdebug ("ctat_grade ()")
        #print('ctat_grade:',data,suffix)
        self.attempted = True
        self.score = data['value']
        self.max_score = data['max_value']
        self.completed = self.score >= self.max_score
        event_data = {'value': self.score/self.max_score, 'max_value': 1}
        self.runtime.publish(self, 'grade', event_data);
        return {'result': 'success'}

    # -------------------------------------------------------------------
    # TO-DO: change this view to display your data your own way.
    # -------------------------------------------------------------------
    def studio_view(self, context=None):        
        self.logdebug ("studio_view ()")
        html = self.resource_string("static/html/ctatstudio.html")
        #problem_files = pkg_resources.resource_listdir(__name__, 'public/problem_files/')
        # pkg_resources.resource_isdir(__name__, prolem_files[i]) # filter on directories
        frag = Fragment(html.format(self=self))
	js = self.resource_string("static/js/ctatstudio.js")
	frag.add_javascript(unicode(js))
        #frag.add_javascript_url(self.runtime.local_resource_url (self,"public/js/ctatstudio.js"))
        #frag.add_css_url(self.runtime.local_resource_url (self,"public/css/ctatstudio.css"))
        frag.initialize_js('CTATXBlockStudio')        
        return frag

#    def author_view(self, context=None):
        # maybe add information from help and some info about the current module
#        frag = Fragment("""
#        <vertical_demo>
#        <div><img src="{logo}"></div>
#        </vertical_demo>
#        """.format(logo=self.strip_local(self.runtime.local_resource_url(self, 'public/images/logo.png'))))
#        return frag

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Called when submitting the form in Studio.
        """
        self.logdebug ("studio_submit ()")

        self.ctatmodule = data.get('module')
        self.problem = data.get('brd')
        self.description = data.get('description_file')
        self.problem_data = data.get('pData')
        
        return {'result': 'success'}

    @XBlock.json_handler
    def ctat_set_variable(self, data, suffix=''):
        self.logdebug ("ctat_set_variable ()")
        ### causes 500: INTERNAL SERVER ERROR ###
        #pp = pprint.PrettyPrinter(indent=4)
        #pp.pprint(data)

        for key in data:
            #value = base64.b64decode(data[key])
            value = data[key]
            self.logdebug("Setting ({}) to ({})".format(key, value))
            if (key=="href"):
               self.href = value
            elif (key=="ctatmodule"):
               self.ctatmodule = value
            elif (key=="name"):
               self.name = value
            elif (key=="problem"):
               self.problem = value
            elif (key=="dataset"):
               self.dataset = value
            elif (key=="level1"):
               self.level1 = value
            elif (key=="type1"):
               self.type1 = value
            elif (key=="level2"):
               self.level2 = value
            elif (key=="type2"):
               self.type2 = value
            elif (key=="logurl"):
               self.logurl = value
            elif (key=="logtype"):
               self.logtype = value
            elif (key=="diskdir"):
               self.diskdir = value
            elif (key=="port"):
               self.port = value
            elif (key=="remoteurl"):
               self.remoteurl = value
            elif (key=="connection"):
               self.connection = value
            #elif (key=="src"):
            #   self.src = value
            elif (key=="saveandrestore"):
               self.saveandrestore = value
            #elif (key=="skillstring"):
            #  self.skillstring = value

        return {'result': 'success'}

    @staticmethod
    def workbench_scenarios():
        return [
            ("StattutorXBlock",
             """<vertical_demo>
                <stattutor width="900" height="750"/>
                </vertical_demo>
             """),
        ]
