# StatTutor XBlock

This is the [XBlock](https://github.com/edx/XBlock) implementation of
the StatTutor exercises originally developed for the
[Open Learning Initiative](http://oli.cmu.edu/) at
[Carnegie Mellon University](http://www.cmu.edu/) using the
[Cognitive Tutor Authoring Tools](http://ctat.pact.cs.cmu.edu).

StatTutor is a learning tool that provides students with a data analysis
problem and supports them as they attempt to solve it, giving hints
and feedback along the way. It assumes that the relevant data set is
open in the background.

One of the main ideas behind StatTutor is to demonstrate that when
solving data analysis problems we always go through the same set of
steps. Those steps are shown on the left side of StatTutor, and students
can click on them in sequence as they progress through the
lab. Clicking on each step will cause a new worksheet to appear for
students to complete.

Note that students must provide a correct answer to all questions in a
given step or provide a written response before being able to
proceed. The system will bounce them back to the step that does not
have all the questions correct or is missing an answer.

Students can ask for hints by clicking on the hint button.

## Installation

The steps to install all XBlocks can be found on
[edX's XBlocks integration page](https://github.com/edx/edx-documentation/blob/master/en_us/developers/source/extending_platform/xblocks.rst#testing).
Follow the instructions outlined in the `Testing` section if you're running
the devstack or scroll down to those outlined under
`Deploying your XBlock` if you're not.

## How to Configure

To add one of the available StatTutor exercises, navigate to a unit in
Studio, click `Advanced` and then click `stattutor`. This will add the
first exercise. To change the exercise, click on `Edit` and use the
drop down to select the desired exercise. A preview of the exercise
will be displayed in Studio.

### Configuring download types

The tutoring behavior is specified in a CTAT behavior recorder diagram (.brd)
file. Also, students can use data files for various statistical packages to
answer questions posed by StatTutor.  However, OpenEdX
does not recognize some of these file types by default.  To register
the various file types as valid mime types in OpenEdX, administrators must
list them explicitly in the add_mimetypes() function defined in
/edx/app/edxapp/edx-platform/[cms,lms]/startup.py by adding the following code:

```python
    mimetypes.add_type('text/xml', '.brd')  # CTAT behavior recorder diagram
    mimetypes.add_type('application/octet-stream', '.8xg')  # TI Calculator
    mimetypes.add_type('application/octet-stream', '.mtw')  # Minitab workbook
    mimetypes.add_type('application/octet-stream', '.RData')  # R uses .RData
```

### Adding new problems

To import new problems from OLI, place the problem specific files from
`content/webcontent/<problem directory>` in the corresponding directory in
`stattutor/public/problem_files/<problem directory>`.  Once the
XBlockStattutor is reinstalled in the OpenEdX server and it is restarted,
the new problem should be available in the list of problems in the Edit panel
for the xblock exercise in Studio.  See the 'README.md' file in
`stattutor/public/problem_files/` for important notes and restrictions.

## License

 This is made available under a [CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license by Carnegie Mellon University Open Learning Initiative.
