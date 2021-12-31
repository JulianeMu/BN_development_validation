
const agrigulture_relations = [
    ["Water_Application", "Yield"],
    ["Soil", "Yield"],
    ["Weather", "Yield"],
    ["Weeds", "Yield"],
    ["Fertilizer_Application", "Yield"],
    ["Pests_and_Disease", "Yield"],

    ["Fungicide_Application", "Pests_and_Disease"],
    ["Pesticide_Application", "Pests_and_Disease"],
    ["Heat_Treatment", "Pests_and_Disease"],
    ["Trash_Burning", "Pests_and_Disease"],

    ["Herbicide_Application", "Weeds"],
    ["Hand_Weeding", "Weeds"],
    ["Mechanical_Cultivation", "Weeds"],

    ["Potash", "Fertilizer_Application"],
    ["Manure", "Fertilizer_Application"],
    ["Filter_Cake", "Fertilizer_Application"],
    ["Nitrogen", "Fertilizer_Application"],
    ["Single_Supers", "Fertilizer_Application"],
    ["Compound_D", "Fertilizer_Application"],

    ["Type_of_N_Fertilizer", "Nitrogen"],
    ["Amount_of_N_Fertilizer", "Nitrogen"],
    ["Timing_of_Dressings", "Nitrogen"],

]

function create_agrigulture_net() {

    for(let j=0; j< learned_structure_data.edges.length;j++) {
        learned_structure_data.nodes.find(x => x.id === learned_structure_data.edges[j].edge_from).children = [];
        learned_structure_data.nodes.find(x => x.id === learned_structure_data.edges[j].edge_to).parents = [];
    }
    learned_structure_data.edges=[];

    console.log(learned_structure_data)

    for (let i = 0; i< agrigulture_relations.length; i++) {
        learned_structure_data.edges.push({
            edge_from: agrigulture_relations[i][0],
            edge_strength: 1,
            edge_to: agrigulture_relations[i][1]
        });
        learned_structure_data.nodes.find(x => x.id === agrigulture_relations[i][0]).children.push(agrigulture_relations[i][1]);
        learned_structure_data.nodes.find(x => x.id === agrigulture_relations[i][1]).parents.push(agrigulture_relations[i][0]);
    }

    console.log(learned_structure_data)
}

const agrigulture_study_net = {
    "edges": [
        {
            "edge_from": "Fertilizer_Application",
            "edge_strength": 1,
            "edge_to": "Yield"
        },
        {
            "edge_from": "Water_Application",
            "edge_strength": 1,
            "edge_to": "Yield"
        },
        {
            "edge_from": "Weather",
            "edge_strength": 1,
            "edge_to": "Yield"
        },
        {
            "edge_from": "Soil",
            "edge_strength": 1,
            "edge_to": "Yield"
        },
        {
            "edge_from": "Amount_of_N_Fertilizer",
            "edge_strength": 1,
            "edge_to": "Nitrogen"
        },
        {
            "edge_from": "Type_of_N_Fertilizer",
            "edge_strength": 1,
            "edge_to": "Nitrogen"
        },
        {
            "edge_from": "Hand_Weeding",
            "edge_strength": 1,
            "edge_to": "Weeds"
        }
    ],
        "nodes": [
        {
            "children": [
                "Yield"
            ],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "favourable",
                            "prob": 0.519
                        },
                        {
                            "outcome": "unfavourable",
                            "prob": 0.481
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 0,
            "id": "Weather",
            "label": "Weather",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "favourable",
                    "label": "favourable",
                    "original": true
                },
                {
                    "id": "unfavourable",
                    "label": "unfavourable",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.515
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.485
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 1,
            "id": "Herbicide_Application",
            "label": "Herbicide_Application",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.501
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.499
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 2,
            "id": "Manure",
            "label": "Manure",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "clean",
                            "prob": 0.504
                        },
                        {
                            "outcome": "dirty",
                            "prob": 0.496
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 3,
            "id": "Weeds",
            "label": "Weeds",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "clean",
                    "label": "clean",
                    "original": true
                },
                {
                    "id": "dirty",
                    "label": "dirty",
                    "original": true
                }
            ],
            "parents": [
                "Hand_Weeding"
            ],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.458
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.542
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 4,
            "id": "Fungicide_Application",
            "label": "Fungicide_Application",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "effective",
                            "prob": 0.5
                        },
                        {
                            "outcome": "not_effective",
                            "prob": 0.5
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 5,
            "id": "Nitrogen",
            "label": "Nitrogen",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "effective",
                    "label": "effective",
                    "original": true
                },
                {
                    "id": "not_effective",
                    "label": "not_effective",
                    "original": true
                }
            ],
            "parents": [
                "Amount_of_N_Fertilizer",
                "Type_of_N_Fertilizer"
            ],
            "structure_validated": false
        },
        {
            "children": [
                "Yield"
            ],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "effective",
                            "prob": 0.511
                        },
                        {
                            "outcome": "not_effective",
                            "prob": 0.489
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 0,
            "id": "Fertilizer_Application",
            "label": "Fertilizer_Application",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "effective",
                    "label": "effective",
                    "original": true
                },
                {
                    "id": "not_effective",
                    "label": "not_effective",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.51
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.49
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 6,
            "id": "Filter_Cake",
            "label": "Filter_Cake",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [
                "Nitrogen"
            ],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "x_0_999__250_75_",
                            "prob": 0.25
                        },
                        {
                            "outcome": "x_250_75__500_5_",
                            "prob": 0.25
                        },
                        {
                            "outcome": "x_500_5__750_25_",
                            "prob": 0.25
                        },
                        {
                            "outcome": "x_750_25__1000_0_",
                            "prob": 0.25
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 5,
            "id": "Amount_of_N_Fertilizer",
            "label": "Amount_of_N_Fertilizer",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "x_0_999__250_75_",
                    "label": "x_0_999__250_75_",
                    "original": true
                },
                {
                    "id": "x_250_75__500_5_",
                    "label": "x_250_75__500_5_",
                    "original": true
                },
                {
                    "id": "x_500_5__750_25_",
                    "label": "x_500_5__750_25_",
                    "original": true
                },
                {
                    "id": "x_750_25__1000_0_",
                    "label": "x_750_25__1000_0_",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [
                "Nitrogen"
            ],
            "cpt": [
                {
                    "parents": [
                        {
                            "parent_node": "Fertilizer_Application",
                            "parent_state": "effective"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "AN",
                            "prob": 0.446184
                        },
                        {
                            "outcome": "urea",
                            "prob": 0.553816
                        }
                    ]
                },
                {
                    "parents": [
                        {
                            "parent_node": "Fertilizer_Application",
                            "parent_state": "not_effective"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "AN",
                            "prob": 0.5337423
                        },
                        {
                            "outcome": "urea",
                            "prob": 0.4662577
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 5,
            "id": "Type_of_N_Fertilizer",
            "label": "Type_of_N_Fertilizer",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "AN",
                    "label": "AN",
                    "original": true
                },
                {
                    "id": "urea",
                    "label": "urea",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.492
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.508
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 7,
            "id": "Mechanical_Cultivation",
            "label": "Mechanical_Cultivation",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "free",
                            "prob": 0.5
                        },
                        {
                            "outcome": "infested",
                            "prob": 0.5
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 8,
            "id": "Pests_and_Disease",
            "label": "Pests_and_Disease",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "free",
                    "label": "free",
                    "original": true
                },
                {
                    "id": "infested",
                    "label": "infested",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [
                "Yield"
            ],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "good",
                            "prob": 0.487
                        },
                        {
                            "outcome": "poor",
                            "prob": 0.513
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 0,
            "id": "Soil",
            "label": "Soil",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "good",
                    "label": "good",
                    "original": true
                },
                {
                    "id": "poor",
                    "label": "poor",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "x0_to_70",
                            "prob": 0.313
                        },
                        {
                            "outcome": "x70_to_100",
                            "prob": 0.363
                        },
                        {
                            "outcome": "x___100",
                            "prob": 0.324
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 0,
            "id": "Yield",
            "label": "Yield",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "x0_to_70",
                    "label": "x0_to_70",
                    "original": true
                },
                {
                    "id": "x70_to_100",
                    "label": "x70_to_100",
                    "original": true
                },
                {
                    "id": "x___100",
                    "label": "x___100",
                    "original": true
                }
            ],
            "parents": [
                "Fertilizer_Application",
                "Water_Application",
                "Weather",
                "Soil"
            ],
            "structure_validated": false
        },
        {
            "children": [
                "Yield"
            ],
            "cpt": [
                {
                    "parents": [
                        {
                            "parent_node": "Amount_of_N_Fertilizer",
                            "parent_state": "x_0_999__250_75_"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "x_0_999__250_75_",
                            "prob": 0.304
                        },
                        {
                            "outcome": "x_250_75__500_5_",
                            "prob": 0.352
                        },
                        {
                            "outcome": "x_500_5__750_25_",
                            "prob": 0.204
                        },
                        {
                            "outcome": "x_750_25__1000_0_",
                            "prob": 0.14
                        }
                    ]
                },
                {
                    "parents": [
                        {
                            "parent_node": "Amount_of_N_Fertilizer",
                            "parent_state": "x_250_75__500_5_"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "x_0_999__250_75_",
                            "prob": 0.2
                        },
                        {
                            "outcome": "x_250_75__500_5_",
                            "prob": 0.16
                        },
                        {
                            "outcome": "x_500_5__750_25_",
                            "prob": 0.324
                        },
                        {
                            "outcome": "x_750_25__1000_0_",
                            "prob": 0.316
                        }
                    ]
                },
                {
                    "parents": [
                        {
                            "parent_node": "Amount_of_N_Fertilizer",
                            "parent_state": "x_500_5__750_25_"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "x_0_999__250_75_",
                            "prob": 0.304
                        },
                        {
                            "outcome": "x_250_75__500_5_",
                            "prob": 0.312
                        },
                        {
                            "outcome": "x_500_5__750_25_",
                            "prob": 0.18
                        },
                        {
                            "outcome": "x_750_25__1000_0_",
                            "prob": 0.204
                        }
                    ]
                },
                {
                    "parents": [
                        {
                            "parent_node": "Amount_of_N_Fertilizer",
                            "parent_state": "x_750_25__1000_0_"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "x_0_999__250_75_",
                            "prob": 0.192
                        },
                        {
                            "outcome": "x_250_75__500_5_",
                            "prob": 0.176
                        },
                        {
                            "outcome": "x_500_5__750_25_",
                            "prob": 0.292
                        },
                        {
                            "outcome": "x_750_25__1000_0_",
                            "prob": 0.34
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 0,
            "id": "Water_Application",
            "label": "Water_Application",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "x_0_999__250_75_",
                    "label": "x_0_999__250_75_",
                    "original": true
                },
                {
                    "id": "x_250_75__500_5_",
                    "label": "x_250_75__500_5_",
                    "original": true
                },
                {
                    "id": "x_500_5__750_25_",
                    "label": "x_500_5__750_25_",
                    "original": true
                },
                {
                    "id": "x_750_25__1000_0_",
                    "label": "x_750_25__1000_0_",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [
                "Weeds"
            ],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "less",
                            "prob": 0.503
                        },
                        {
                            "outcome": "lots",
                            "prob": 0.497
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 3,
            "id": "Hand_Weeding",
            "label": "Hand_Weeding",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "less",
                    "label": "less",
                    "original": true
                },
                {
                    "id": "lots",
                    "label": "lots",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.498
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.502
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 9,
            "id": "Potash",
            "label": "Potash",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.523
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.477
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 10,
            "id": "Compound_D",
            "label": "Compound_D",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.471
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.529
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 11,
            "id": "Single_Supers",
            "label": "Single_Supers",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "right",
                            "prob": 0.512
                        },
                        {
                            "outcome": "wrong",
                            "prob": 0.488
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 12,
            "id": "Timing_of_Dressings",
            "label": "Timing_of_Dressings",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "right",
                    "label": "right",
                    "original": true
                },
                {
                    "id": "wrong",
                    "label": "wrong",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.506
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.494
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 13,
            "id": "Trash_Burning",
            "label": "Trash_Burning",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [
                        {
                            "parent_node": "Hand_Weeding",
                            "parent_state": "less"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.44334
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.55666
                        }
                    ]
                },
                {
                    "parents": [
                        {
                            "parent_node": "Hand_Weeding",
                            "parent_state": "lots"
                        }
                    ],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.5352113
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.4647887
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 14,
            "id": "Heat_Treatment",
            "label": "Heat_Treatment",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        },
        {
            "children": [],
            "cpt": [
                {
                    "parents": [],
                    "probability": [
                        {
                            "outcome": "no",
                            "prob": 0.49
                        },
                        {
                            "outcome": "yes",
                            "prob": 0.51
                        }
                    ]
                }
            ],
            "cpt_validated": false,
            "data_type": "",
            "graph": 15,
            "id": "Pesticide_Application",
            "label": "Pesticide_Application",
            "notes_comments": "",
            "outcomes": [
                {
                    "id": "no",
                    "label": "no",
                    "original": true
                },
                {
                    "id": "yes",
                    "label": "yes",
                    "original": true
                }
            ],
            "parents": [],
            "structure_validated": false
        }
    ]
}