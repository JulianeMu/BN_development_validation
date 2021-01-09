function initialize_network_view__DAGRED3(data) {

    // Create the input graph
    let g = new dagreD3.graphlib.Graph({compound: true})
        .setGraph({rankdir: 'LR', align: 'UL', ranker: 'longest-path'})
        .setDefaultEdgeLabel(function () {
            return {};
        });

    const node_width = 50, node_height = 50;

    data.nodes.forEach(function (date) {
        g.setNode(date.id, {label: date.label, width: node_width, height: node_height});
    })

    initial_groups.forEach(function (d) {

        if (d.variables.length>0) {
            g.setNode(d.id, {
                label: d.label,
                clusterLabelPos: 'left',
                style: 'fill:' + color_clinical_workflow_groups(initial_groups.findIndex(x => x.id === d.id) + 1)
            });

            d.variables.forEach(function (variable) {
                g.setParent(variable, d.id);
            })
        }
    })

    data.edges.forEach(function (date) {
        date.edge_to.forEach(function (edge_to) {
            g.setEdge(date.edge_from, edge_to);
        })
    })

    dagre.layout(g);

    var render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
    let svg = d3.select('#' + id_learnt_model_div).select("svg");//.style('width', 1000 + 'px').style('height', 500 + 'px');
    let svgGroup = svg.select("g");

// Run the renderer. This is what draws the final graph.
    render(d3.select('#' + id_learnt_model_div).select("svg g"), g);

// Center the graph
    console.log(svg.style("width"))
    var xCenterOffset = (svg.node().getBoundingClientRect().width - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);

}


function initialize_network_dagred3(structure_learning_div) {

    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound: true})
        .setGraph({rankdir: 'LR', ranker: 'longest-path'})
        .setDefaultEdgeLabel(function () {
            return {};
        });

// Here we're setting the nodes
    g.setNode('a', {label: 'A'});
    g.setNode('b', {label: 'B'});
    g.setNode('c', {label: 'C'});
    g.setNode('d', {label: 'D'});
    g.setNode('e', {label: 'E'});
    g.setNode('f', {label: 'F'});
    g.setNode('g', {label: 'G'});
    g.setNode('h', {label: 'H'});

    //  g.setNode('group', {label: 'Group', clusterLabelPos: 'left', style: 'fill: #d3d7e8'});
    g.setNode('top_group', {height: 50, width: 300, style: 'fill: #ffd47f'});
    g.setNode('bottom_group', {height: 50, width: 100, style: 'fill: #5f9488'});
    g.setNode('third_group', {height: 50, width: 100, style: 'fill: #5f9488'});

// Set the parents to define which nodes belong to which cluster

    g.setParent('b', 'top_group');
    g.setParent('c', 'bottom_group');
    g.setParent('d', 'bottom_group');
    g.setParent('e', 'bottom_group');
    g.setParent('f', 'third_group');
    g.setParent('h', 'top_group');

// Set up edges, no special attributes.
    g.setEdge('a', 'b');
    g.setEdge('b', 'c');
    g.setEdge('c', 'd');
    g.setEdge('b', 'e');
    g.setEdge('d', 'f');
    g.setEdge('b', 'g');
    g.setEdge('c', 'g');
    g.setEdge('c', 'h');

    g.nodes().forEach(function (v) {
        var node = g.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    });


// Create the renderer
    var render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
    let svg = structure_learning_div.append("svg").style('width', 1000 + 'px').style('height', 500 + 'px');
    let svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
    render(structure_learning_div.select("svg g"), g);

// Center the graph
    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);


//     // Create the input graph
//     let g = new dagreD3.graphlib.Graph()
//         .setGraph({rankdir: 'LR', align: 'UL', ranker: 'longest-path'})
//         .setDefaultEdgeLabel(function () {
//             return {};
//         });
//
// // Here we're setting nodeclass, which is used by our custom drawNodes function
// // below.
//     g.setNode(0, {label: "TOP", class: "type-TOP"});
//     g.setNode(1, {label: "S", class: "type-S"});
//     g.setNode(2, {label: "NP", class: "type-NP"});
//     g.setNode(3, {label: "DT", class: "type-DT"});
//     g.setNode(4, {label: "This", class: "type-TK"});
//     g.setNode(5, {label: "VP", class: "type-VP"});
//     g.setNode(6, {label: "VBZ", class: "type-VBZ"});
//     g.setNode(7, {label: "is", class: "type-TK"});
//     g.setNode(8, {label: "NP", class: "type-NP"});
//     g.setNode(9, {label: "DT", class: "type-DT"});
//     g.setNode(10, {label: "an", class: "type-TK"});
//     g.setNode(11, {label: "NN", class: "type-NN"});
//     g.setNode(12, {label: "example", class: "type-TK"});
//     g.setNode(13, {label: ".", class: "type-."});
//     g.setNode(14, {label: "sentence", class: "type-TK"});
//
//     g.nodes().forEach(function (v) {
//         var node = g.node(v);
//         // Round the corners of the nodes
//         node.rx = node.ry = 5;
//     });
//
// // Set up edges, no special attributes.
//     g.setEdge(3, 4);
//     g.setEdge(2, 3);
//     g.setEdge(1, 2);
//     g.setEdge(6, 7);
//     g.setEdge(5, 6);
//     g.setEdge(9, 10);
//     g.setEdge(8, 9);
//     g.setEdge(11, 12);
//     g.setEdge(8, 11);
//     g.setEdge(5, 8);
//     g.setEdge(1, 5);
//     g.setEdge(13, 14);
//     g.setEdge(1, 13);
//     g.setEdge(0, 1)
//
// // Create the renderer
//     var render = new dagreD3.render();
//
//
// // Set up an SVG group so that we can translate the final graph.
//     let svg = structure_learning_div.append("svg").style('width', 1000 + 'px').style('height', 500 + 'px');
//     let svgGroup = svg.append("g");
//
// // Run the renderer. This is what draws the final graph.
//     render(structure_learning_div.select("svg g"), g);
//
// // Center the graph
//     var xCenterOffset = (svg.style("width") - g.graph().width) / 2;
//     svgGroup.style("transform", "translate(" + xCenterOffset + ", 20)");
//     svg.style("height", g.graph().height + 40);
}