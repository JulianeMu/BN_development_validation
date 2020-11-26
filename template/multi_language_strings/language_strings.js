
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

// global variable of all used strings
var language_string = [
    {id: lang_id_heading_BN_development_validation, eng: 'Bayesian Network Development and Validation', de: "Erstellung und Validierung Bayes\'scher Netzwerke"},
    {id: lang_id_intro, eng: 'Welcome to our tool for Bayesian network development and validation in the medical field. Please start with either uploading data for data-driven baseline generation, directly start from scratch, or by loading in an earlier session.', de:''}
];