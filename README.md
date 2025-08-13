# Visual Assistance in Development and Validation of Bayesian Networks for Clinical Decision Support

The development and validation of Clinical Decision Support Models (CDSM) based on Bayesian networks (BN) is commonly done in a collaborative work between medical researchers providing the domain expertise and computer scientists developing the decision support model. Although modern tools provide facilities for data-driven model generation, domain experts are required to validate the accuracy of the learned model and to provide expert knowledge for fine-tuning it while computer scientists are needed to integrate this knowledge in the learned model (hybrid modeling approach). This generally time-expensive procedure hampers CDSM generation and updating. To address this problem, we developed a novel interactive visual approach allowing medical researchers with less knowledge in CDSM to develop and validate BNs based on domain specific data mainly independently and thus, diminishing the need for an additional computer scientist. In this context, we abstracted and simplified the common workflow in BN development as well as adjusted the workflow to medical experts’ needs. 

![pysmile](paper_submission/BNDevelopmentValidationWorkflow2.png?raw=true "Title") 

# Running the code
To run the application you need to do following steps:

- [ ] clone the github repository. 
- [ ] have python 3.12 installed as well as the libraries listed in **requirements.txt**, **except for pysmile**. We want to use our locally added one and not the one provided by python
- [ ] install "R version 4.5.1 (2025-06-13)"
  - [ ] `install.packages("https://www.bnlearn.com/releases/bnlearn_latest.tar.gz", repos = NULL, type = "source")`
  - [ ] `install.packages('jsonlite')`
  - [ ] `install.packages('bnlearn')`
  - [ ] `install.packages('xml2')`
  - [ ] `install.packages('tidyverse')`
- [ ] create a BayesFusion account (https://www.bayesfusion.com/) and download the python 3.12 wrapper for SMILE. (**free for academia**)
  - MacOS: pysmile-academic-2.4.0-macosx-python-3.12.tar.gz
  - Windows systems: pysmile-academic-2.4.0-win-x64-python-3.12.zip
  - Linux: pysmile-academic-2.4.0-linux-x64-python-3.12.tar.gz
- [ ] download the *pysmile_license.py* from the BayesFusion 
- [ ] add the **pysmile wrapper**, e.g., pysmile.so for MacOS, and **pysmile_license.py** to the project like this:
![pysmile](images/pysmile.png?raw=true "Title") 
- [ ] open the project in a development environment, such as Intelli J or VS code
- [ ] run the **app.py** using your development environment via `python app.py`
- [ ] run the **index.html** (located in the templates folder). To avoid CORS erros, you have to either use your preferred development environment to run the *index.html* or navigate inside the templates folder in your terminal and run `python server.py`
- [ ] have fun using our visual approach :) 


- for windows users: comment out line 195 in app.py


# Publications

J. Müller-Sielaff et al., "Visual Assistance in Development and Validation of Bayesian Networks for Clinical Decision Support," in IEEE Transactions on Visualization and Computer Graphics, doi: 10.1109/TVCG.2022.3166071.

# Acknowledgements
The research leading to this work was supported by the Federal State of Saxony-Anhalt (FKZ: I 88). We use the python wrapper from GeNIe SMILE to run the reasoning process. 
