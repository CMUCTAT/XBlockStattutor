import os
import pprint
import pkg_resources
import base64

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment

class StattutorXBlock(XBlock):

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    href = String(help="URL to a BRD file", default="http://augustus.pslc.cs.cmu.edu/stattutor/problem_files", scope=Scope.settings)
    module = String(help="The learning module to load from", default="m1_survey", scope=Scope.settings)
    name = String(help="Problem name to log", default="CTATEdXProblem", scope=Scope.settings)
    problem = String(help="The name of a BRD file", default="1416-worked.brd", scope=Scope.settings)
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

    # -------------------------------------------------------------------
    # TO-DO: change this view to display your data your own way.
    # -------------------------------------------------------------------

    def student_view(self, context=None):
        html = self.resource_string("static/html/ctatxblock.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/ctat.css"))
        frag.add_css(self.resource_string("static/css/ctatxblock.css"))
        frag.add_css(self.resource_string("static/css/stattutor.css"))
        frag.add_css(self.resource_string("static/css/icon.css"))
        frag.add_css(self.resource_string("static/css/easyui.css"))
        frag.add_javascript(self.resource_string("static/js/jsrender.min.js"))
        frag.add_javascript(self.resource_string("static/js/ctat.min.js"))
        frag.add_javascript(self.resource_string("static/js/fragment1.js"))
        frag.add_javascript(self.resource_string("static/js/fragment2.js"))
        frag.add_javascript(self.resource_string("static/js/ctatloader.js"))
        frag.add_javascript(self.resource_string("static/js/stattutor.js"))
        frag.add_javascript(self.resource_string("static/js/jsrenderbody.js"))
        frag.add_content (self.resource_string("static/html/body.html"));
        frag.initialize_js('')
        return frag
    
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
        print 'studio_submit()'
        #pp = pprint.PrettyPrinter(indent=4)
        #pp.pprint(data)
        self.src = data.get('src')
        return {'result': 'success'}

    @XBlock.json_handler
    def ctat_set_variable(self, data, suffix=''):
        print 'ctat_set_variable()'
        #pp = pprint.PrettyPrinter(indent=4)
        #pp.pprint(data)

        for key in data:
            #value = base64.b64decode(data[key])
            value = data[key]
            print("Setting ({}) to ({})".format(key, value))
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
