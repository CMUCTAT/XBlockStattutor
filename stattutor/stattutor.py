import os
import pprint
import pkg_resources
import base64

from string import Template

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Boolean, Any
from xblock.fragment import Fragment

class StattutorXBlock(XBlock):

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    score = Integer(help="Current count of correctly completed student steps", scope=Scope.user_state, default=0)
    max_score = Integer(help="Total number of steps", scope=Scope.user_state, default=1)
    attempted = Boolean(help="True if at least one step has been completed", scope=Scope.user_state, default=False)
    completed = Boolean(help="True if all of the required steps are correctly completed", scope=Scope.user_state, default=False)
    
    href = String(help="URL to a BRD file", default="http://augustus.pslc.cs.cmu.edu/stattutor/problem_files", scope=Scope.settings)
    module = String(help="The learning module to load from", default="m1_survey", scope=Scope.settings)
    name = String(help="Problem name to log", default="survey", scope=Scope.settings)
    problem = String(help="The name of a BRD file", default="survey.brd", scope=Scope.settings)
    dataset = String(help="Dataset name to log", default="edxdataset", scope=Scope.settings)
    level1 = String(help="Level name to log", default="unit1", scope=Scope.settings)
    type1 = String(help="Level type to log", default="unit", scope=Scope.settings)
    level2 = String(help="Level name to log", default="unit2", scope=Scope.settings)
    type2 = String(help="Level type to log", default="unit", scope=Scope.settings)
    logurl = String(help="URL of the logging service", default="http://pslc-qa.andrew.cmu.edu/log/server", scope=Scope.settings)
    logtype = String(help="How should data be logged", default="clienttologserver", scope=Scope.settings)
    diskdir = String(help="Directory for log files relative to the tutoring service", default=".", scope=Scope.settings)
    port = String(help="Port used by the tutoring service", default="8080", scope=Scope.settings)
    remoteurl = String(help="Location of the tutoring service (localhost or domain name)", default="localhost", scope=Scope.settings)
    connection = String(help="", default="javascript", scope=Scope.settings)

    src = String(help = "URL for MP3 file to play", scope = Scope.settings )

    saveandrestore = String(help="Internal data blob used by the tracer", default="", scope=Scope.content)
    skillstring = String(help="Internal data blob used by the tracer", default="", scope=Scope.content)

    def resource_string(self, path):
        data = pkg_resources.resource_string(__name__, path)        
        return data.decode("utf8")

    def bind_path (self, text):
        tbase=self.runtime.local_resource_url (self,"public/ref.css")
        base=tbase[:-7]
        return (text.replace ("[xblockbase]",base))

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
        baseURL=self.runtime.local_resource_url (self,"public/problem_files/ref.css");
        html = self.resource_string("static/html/ctatxblock.html")
        frag = Fragment (html.format(self=self))
        frag.add_css_url (self.runtime.local_resource_url (self,"public/css/themes/default/easyui.css"))
        frag.add_css_url (self.runtime.local_resource_url (self,"public/css/themes/icon.css"))
        frag.add_css_url (self.runtime.local_resource_url (self,"public/css/ctat.css"))
        frag.add_css_url (self.runtime.local_resource_url (self,"public/css/ctatxblock.css"))
        frag.add_css_url (self.runtime.local_resource_url (self,"public/css/stattutor.css"))
        frag.add_javascript_url (self.runtime.local_resource_url(self,"public/js/jsrender.min.js"))
        format_references = {
            'logo': self.runtime.local_resource_url(self, 'public/images/logo.png'),
            'boxplots': self.runtime.local_resource_url(self, 'public/images/boxplots.png'),
            'scatterplot': self.runtime.local_resource_url(self, 'public/images/scatterplot.png'),
            'table': self.runtime.local_resource_url(self, 'public/images/table.png'),
            'piechart': self.runtime.local_resource_url(self, 'public/images/piechart.png'),
            'histogram': self.runtime.local_resource_url(self, 'public/images/histogram.png'),
        }
        jsrenderbody = self.resource_string("static/js/jsrenderbody.js")
        frag.add_javascript (Template(jsrenderbody).safe_substitute(format_references))
        frag.add_javascript_url (self.runtime.local_resource_url(self,"public/js/jquery.easyui.min.js"))
        frag.add_javascript ("var baseURL=\""+(baseURL [:-7])+"\";")
        frag.add_javascript_url (self.runtime.local_resource_url(self,"public/js/ctatloader.js"))
        frag.add_javascript_url (self.runtime.local_resource_url(self,"public/js/ctat.min.js"))
        frag.add_javascript_url (self.runtime.local_resource_url(self,"public/js/stattutor.js"))
        frag.add_javascript (self.resource_string("static/js/load_resources.js"))
        body = self.resource_string("static/html/body.html")
        frag.add_content (body.format(**format_references))
        frag.initialize_js('CTATXBlock')
        return frag

    @XBlock.json_handler
    def ctat_grade(self, data, suffix=''):
        print('ctat_grade:',data,suffix)
        self.attempted = True
        self.score = data['value']
        self.max_score = data['max_value']
        self.completed = self.score >= self.max_score
        event_data = {'value': self.score, 'max_value': self.max_score}
        self.runtime.publish(self, 'grade', event_data);
        return {'result': 'success'}

    # -------------------------------------------------------------------
    # TO-DO: change this view to display your data your own way.
    # -------------------------------------------------------------------
    def studio_view(self, context=None):        
        html = self.resource_string("static/html/ctatstudio.html")
        frag = Fragment(html.format(src=self.src))
        frag.add_css(self.resource_string("static/css/ctatstudio.css"))
        frag.initialize_js('CTATXBlock')        
        return frag

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        print ('studio_submit()')
        #pp = pprint.PrettyPrinter(indent=4)
        #pp.pprint(data)
        self.src = data.get('src')
        return {'result': 'success'}

    @XBlock.json_handler
    def ctat_set_variable(self, data, suffix=''):
        print ('ctat_set_variable()')
        #pp = pprint.PrettyPrinter(indent=4)
        #pp.pprint(data)

        for key in data:
            #value = base64.b64decode(data[key])
            value = data[key]
            #print("Setting ({}) to ({})".format(key, value))
            if (key=="href"):
               self.href = value
            if (key=="module"):
               self.module = value
            if (key=="name"):
               self.name = value
            if (key=="problem"):
               self.problem = value
            if (key=="dataset"):
               self.dataset = value
            if (key=="level1"):
               self.level1 = value
            if (key=="type1"):
               self.type1 = value
            if (key=="level2"):
               self.level2 = value
            if (key=="type2"):
               self.type2 = value
            if (key=="logurl"):
               self.logurl = value
            if (key=="logtype"):
               self.logtype = value
            if (key=="diskdir"):
               self.diskdir = value
            if (key=="port"):
               self.port = value
            if (key=="remoteurl"):
               self.remoteurl = value
            if (key=="connection"):
               self.connection = value
            if (key=="src"):
               self.src = value
            if (key=="saveandrestore"):
               self.saveandrestore = value
            if (key=="skillstring"):
              self.skillstring = value

        return {'result': 'success'}

    @staticmethod
    def workbench_scenarios():
        return [
            ("StattutorXBlock",
             """<vertical_demo>
                <stattutor/>
                </vertical_demo>
             """),
        ]
