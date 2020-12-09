
// global variables for multi language
var language_eng = 'eng';
var language_de = 'de';

var current_language = language_eng;

/**
 * get language label by id
 * @param id
 * @returns string label
 */
function get_language__label_by_id(id) {
    var result = language_string.filter(function (obj) {
        return obj.id === id;
    });

    if (result.length === 0) {
        return id.replaceAll('_', ' ');
    } else {

        if (current_language === language_eng) {
            return result[0].eng;
        } else if (current_language === language_de) {
            return result[0].de;
        }
    }
}

const lang_id_heading_BN_development_validation = "lang_id_heading_BN_development_validation"
const lang_id_intro = "lang_id_intro";
const lang_id_upload_data = "lang_id_upload_data";
const lang_id_startScratch = "lang_id_startScratch";
const lang_id_openSession = "lang_id_openSession";

const lang_id_inspect_data_learn_structure = "lang_id_inspect_data_learn_structure";

const lang_id_data_overview = "lang_id_data_overview";
const lang_id_data_groups_workflow = "lang_id_data_groups_workflow";

const lang_id_preoperative_group = "lang_id_preoperative_group";
const lang_id_biomarkers_group = "lang_id_biomarkers_group";
const lang_id_demographic_group = "lang_id_demographic_group";
const lang_id_postoperative_group = "lang_id_postoperative_group";

// global variable of all used strings
var language_string = [
    {id: lang_id_heading_BN_development_validation, eng: 'Bayesian Network Development and Validation', de: "Erstellung und Validierung Bayes\'scher Netzwerke"},
    {id: lang_id_intro, eng: 'Welcome to our tool for Bayesian network development and validation in the medical field. Please start with either uploading data for data-driven baseline generation, directly start from scratch, or by loading in an earlier session.', de:''},
    {id: lang_id_upload_data, eng: 'upload data', de:'Lade Daten Hoch'},
    {id: lang_id_startScratch, eng: 'start from scratch', de:'Starte Neu'},
    {id: lang_id_openSession, eng: 'open session', de:'Öffne Session'},

    {id: lang_id_inspect_data_learn_structure, eng: 'Inspect Data and Learn Structure', de:'Untersuche die Daten und lerne die Struktur'},
    {id: lang_id_data_overview, eng: 'Data Overview', de:'Datenüberblick'},
    {id: lang_id_data_groups_workflow, eng: 'Clinical Workflow/Groups', de:'Klinische Arbeitsweise/Gruppierungen'},

    {id: lang_id_preoperative_group, eng: 'preoperative', de:'präoperativ'},
    {id: lang_id_biomarkers_group, eng: 'biomarkers', de:'Biomarker'},
    {id: lang_id_demographic_group, eng: 'demographic', de:'demografische Daten'},
    {id: lang_id_postoperative_group, eng: 'postoperativ', de:'postoperativ'},
];