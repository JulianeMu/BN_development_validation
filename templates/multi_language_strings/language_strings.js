
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
const lang_id_imaging_group = "lang_id_imaging_group";
const lang_id_follow_up_group = "lang_id_follow_up_group";
const lang_id_baseline_characteristics_group = "lang_id_baseline_characteristics_group";
const lang_id_primary_surgical_treatment_group = "lang_id_primary_surgical_treatment_group";
const lang_id_final_histology_group = "lang_id_final_histology_group";
const lang_id_adjuvant_therapy_group = "lang_id_adjuvant_therapy_group";

const lang_id_tooltip_header_backwards = "lang_id_tooltip_header_backwards";
const lang_id_tooltip_header_save = "lang_id_tooltip_header_save";

const lang_id_tooltip_add_clinical_workflow_group = "lang_id_tooltip_add_clinical_workflow_group";
const lang_id_tooltip_click_to_select = "lang_id_tooltip_click_to_select";

const lang_id_context_menu_remove_group = "lang_id_context_menu_remove_group";
const lang_id_context_menu_rename_group = "lang_id_context_menu_rename_group";
const lang_id_context_menu_move_left_group = "lang_id_context_menu_move_left_group";
const lang_id_context_menu_move_right_group = "lang_id_context_menu_move_right_group";

const lang_id_number_of_patients = "lang_id_number_of_patients";
const lang_id_available_data = "lang_id_available_data";

const lang_id_show_variables_in_group_only = "lang_id_show_variables_in_group_only";
const lang_id_clicking_on_workflow_step_glyph_to_select = "lang_id_clicking_on_workflow_step_glyph_to_select";

const lang_id_learn_structure = "lang_id_learn_structure";
const lang_id_include_preknowledge = "lang_id_include_preknowledge";
const lang_id_heading_data_driven_structure = "lang_id_heading_data_driven_structure";



// global variable of all used strings
var language_string = [
    {id: lang_id_heading_BN_development_validation, eng: 'Bayesian Network Development and Validation', de: "Erstellung und Validierung Bayes\'scher Netzwerke"},
    {id: lang_id_intro, eng: 'Welcome to our tool for Bayesian network development and validation in the medical field. Please start with either uploading data for data-driven baseline generation, directly start from scratch, or by loading in an earlier session.', de:''},
    {id: lang_id_upload_data, eng: 'upload data', de:'Lade Daten Hoch'},
    {id: lang_id_startScratch, eng: 'start from scratch', de:'Starte Neu'},
    {id: lang_id_openSession, eng: 'open session', de:'Öffne Session'},

    {id: lang_id_tooltip_header_backwards, eng: 'go back', de:'gehe zurück'},
    {id: lang_id_tooltip_header_save, eng: 'save current work', de:'speichere aktuelle Version'},

    {id: lang_id_inspect_data_learn_structure, eng: 'Inspect Data and Learn Structure', de:'Untersuche die Daten und lerne die Struktur'},
    {id: lang_id_data_overview, eng: 'Data Overview', de:'Datenüberblick'},
    {id: lang_id_number_of_patients, eng: 'Number of Patients:', de:'Anzahl der Patienten:'},

    {id: lang_id_data_groups_workflow, eng: 'Clinical Workflow Steps/Groups', de:'Klinische Arbeitsweise/Gruppierungen'},

    {id: lang_id_preoperative_group, eng: 'preoperative diagnostics', de:'präoperativ'},
    {id: lang_id_biomarkers_group, eng: 'Biomarkers', de:'Biomarker'},
    {id: lang_id_imaging_group, eng: 'Imaging', de:'Bildinformationen'},
    {id: lang_id_follow_up_group, eng: 'Follow-up', de:'Nachsorge'},
    {id: lang_id_baseline_characteristics_group, eng: 'Baseline characteristics', de:'Grundcharackteristika'},
    {id: lang_id_primary_surgical_treatment_group, eng:'Primary surgical treatment', de:'Erste chirurgische Behandlung'},
    {id: lang_id_final_histology_group, eng:'Final histology', de:'Finale Histologie'},
    {id: lang_id_adjuvant_therapy_group, eng: 'Adjuvant therapy', de:'Adjuvante Therapie'},

    {id: lang_id_tooltip_add_clinical_workflow_group, eng: 'add clinical workflow step/group', de:'füge klinischen Arbeitsschritt/Gruppierung hinzu'},
    {id: lang_id_context_menu_remove_group, eng: 'remove', de:'entfernen'},
    {id: lang_id_context_menu_rename_group, eng: 'rename', de:'umbenennen'},
    {id: lang_id_context_menu_move_left_group, eng: 'move left', de:'nach links'},
    {id: lang_id_context_menu_move_right_group, eng: 'move right', de:'nach rechts'},
    {id: lang_id_available_data, eng: "available data: ", de: "vorhandene Daten: "},
    {id: lang_id_show_variables_in_group_only, eng: "show variables contained in clinical workflow step/group only", de:"zeige nur Variablen, welche in dem klinischen Arbeitsschritt/Gruppe enthalten sind"},
    {id: lang_id_clicking_on_workflow_step_glyph_to_select, eng: "click on clinical workflow step/group to select variables", de:"Klicke auf klinischen Arbeitsschritt/Gruppe um Variablen zu selektieren"},

    {id: lang_id_learn_structure, eng: "learn structure", de: "Lerne die Struktur"},
    {id: lang_id_include_preknowledge, eng: "integrate prior knowledge", de: "integriere Vorwissen"},
    {id: lang_id_tooltip_click_to_select, eng: "click to include/exclude from structural learning", de: "Klicken um Variable in Strukturerlernung mit einzubeziehen/auszuschließen"},
    {id: lang_id_heading_data_driven_structure, eng:"Data-Driven Bayesian Network Structure", de:"Datenbasierte Struktur des Bayes'schen Netzwerkes"},
];