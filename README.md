# BN_development_validation

This work addresses the high need allowing medical experts to develop and validate Bayesian networks working as clinical decision support systems mainly independently.  

# Running the code
To run the application you need to do following steps:

- [ ] clone the github repository. 
- [ ] create a BayesFusion account (https://www.bayesfusion.com/) and download the python 3.7 wrapper for SMILE. (**free for academia**)
  - MacOS: pysmile-1.5.0-macosx-python-3.7-academic.tar.gz
  - Windows systems: pysmile-1.5.0-win-x64-python-3.7-academic.zip
  - Linux: pysmile-1.5.0-linux-x64-python-3.7-academic.tar.gz 
- [ ] download the *pysmile_license.py* from the BayesFusion 
- [ ] add the **pysmile wrapper**, e.g., pysmile.so for MacOS, and **pysmile_license.py** to the project like this:
![pysmile](images/pysmile.png?raw=true "Title") 
- [ ] open the project in a development environment, such as Intelli J
- [ ] install all required python packages for python 3.7 **except for pysmile**. We want to use our locally added one and not the one provided by python
- [ ] make sure you selected the correct R runtime environment (4.0.0) and install all needed libraries
- [ ] run the **app.py** using your development environment
- [ ] run the **index.html** (located in the templates folder). To avoid CORS erros, you have to either use your preferred development environment to run the *index.html* or navigate inside the templates folder in your terminal and run `python -m SimpleHTTPServer`
- [ ] have fun using our visual approach :) 
