
var selectedLanguage = "en";

var $translations = {
    contents: {
        "#titleConf": {
            fr: "Assistant de configuration",
            en: "Configuration assistant"
        },
        "#affAg .textContent": {
            fr: "Affecter des agences",
            en: "Agencies insertion"
        },
        "#affLF .textContent": {
            fr: "Affecter les lieux de formation",
            en: "Training centers insertion"
        },
        "#reinitMap .textContent": {
            fr: "Réinitialiser la carte",
            en: "Map reset"
        },
        "#maskClose[data-hide='hide'] .textContent": {
            fr: "Masquer les lieux de formation fermés",
            en: "Hide closed training centers"
        },
        "#maskClose[data-hide='show'] .textContent": {
            fr: "Afficher tous les lieux de formation",
            en: "Show all training centers"
        },
        "#titleAlgo": {
            fr: "Algorithmes",
            en: "Algorithms"
        },
        "#execAlgoHand .textContent": {
            fr: "Lancer l'algorithme hand-made",
            en: "Launch hand-made algorithm"
        },
        "#execAlgoTab .textContent": {
            fr: "Lancer l'algorithme tabou",
            en: "Launch tabou algorithm"
        },
        "#titleInfo": {
            fr: "Informations",
            en: "Information"
        },
        "#licenseLi .textContent": {
            fr: "Licence Optidis",
            en: "Optidis Licence"
        },
        "#expAlgoHM .textContent": {
            fr: "Informations sur l'algorithme hand-made",
            en: "Hand-made algorithm explanation"
        },
        "#expAlgoTab .textContent": {
            fr: "Informations sur l'algorithme tabou",
            en: "Tabou algorithm explanation"
        },
        "#centerMap .textContent": {
            fr: "CENTRER LA MAP",
            en: "CENTER MAP"
        },
        ".selectedLanguage": {
            fr: "Français",
            en: "English"
        }
    },
    attributes: {
        "#inputsearch": {
            "placeholder": {
                fr: "Rechercher",
                en: "Search"
            }
        },
        "#inputKey": {
            "placeholder": {
                fr: "Entrez votre clé ici...",
                en: "Enter your key here..."
            }
        }
    },
    classes: {
        ".protag, .protagen": {
            fr: "protag",
            en: "protagen",
            remove: "protag, protagen"
        }
    },
    texts: {
        "RESULTS": {
            fr: "RESULTATS",
            en: "RESULTS"
        },
        "results": {
            fr: "Résultats",
            en: "Results"
        },
        "btnMaskClosedOn": {
            fr: "Masquer les lieux de formation fermés",
            en: "Hide closed training centers"
        },
        "btnMaskClosedOff": {
            fr: "Afficher tous les lieux de formation",
            en: "Show all training centers"
        },
        "iterations": {
            fr: "itération(s)",
            en: "iteration(s)"
        },
        "personstotrain": {
            fr: "personnes à former",
            en: "people to train"
        },
        "affichageDonnees": {
            fr: "Affichage des données...",
            en: "Rendering data..."
        },
        "coutTotal": {
            fr: "Coût total",
            en: "Total cost"
        },
        "lieuxFormationOuverts": {
            fr: "Lieux de formation ouverts",
            en: "Opened training centers"
        },
        "agencesTraitees": {
            fr: "agences traitées",
            en: "processed agencies"
        },
        "tooMuchRessource": {
            fr: "Le traitement coté serveur a duré plus de temps qu'autorisé (120 secondes) ou a pris plus de mémoire qu'allouée. Baissez le nombre d'itérations ou d'objets à calculer.",
            en: "The server processing lasts more than authorized (120 seconds) or has taken more memory than allowed. Lower the amount of iterations of the amount of objects to process."
        },
        "dataProcessiong": {
            fr: "Traitement des données...",
            en: "Data processing..."
        }
    }
}

function changerLangue(language) {
    console.log("Langue changée vers : " + language);
    selectedLanguage = language;

    for(var contentSelector in $translations.contents) {
        $(contentSelector).html($translations.contents[contentSelector][selectedLanguage]);
    }

    for(var attributeSelector in $translations.attributes) {
        for(var attribute in $translations.attributes[attributeSelector]) {
            $(attributeSelector).attr(attribute, $translations.attributes[attributeSelector][attribute][selectedLanguage]);
        }
    }

    for(var cssClass in $translations.classes) {
        $(cssClass).removeClass($translations.classes[cssClass].remove).addClass($translations.classes[cssClass][selectedLanguage]);
    }
}

function getTraduction(text) {
    return $translations.texts[text][selectedLanguage];
}

function getSelectedLanguage() {
    return selectedLanguage;
}