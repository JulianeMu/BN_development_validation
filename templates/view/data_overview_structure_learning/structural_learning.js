function initialize_structural_learning_view(structure_learning_div) {
    structure_learning_div.append('p').attr('class', 'h2')
        .text(get_language__label_by_id(lang_id_heading_data_driven_structure));

    // Set up an SVG group so that we can translate the final graph.
    structure_learning_div.append("svg").style('width', 100 + '%').style('height', 100 + 'vh').append("g");
}


function initialize_network_view(data) {

    // Create a new directed graph
    let g = new dagre.graphlib.Graph();

    const node_width = 50, node_height = 50;
    // Set an object for the graph label
    g.setGraph({rankdir: 'LR', align: 'UL', ranker: 'longest-path'});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () {
        return {};
    });


    data.nodes.forEach(function (date){
        g.setNode(date.id, {label: date.label, width: node_width, height: node_height});
    })

    data.edges.forEach(function (date) {
        date.edge_to.forEach(function (edge_to) {
            g.setEdge(date.edge_from, edge_to);
        })
    })

    dagre.layout(g);

    // g.nodes().forEach(function (v) {
    //      console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
    //      console.log(g.node(v))
    //  });
    // g.edges().forEach(function (e) {
    //     console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
    //     console.log(g.edge(e))
    // });

 //   console.log(g.graph().width)
   // console.log(g.graph().height)

    let svg_g = d3.select('#' + id_learnt_model_div).select('svg').select('g');

    svg_g.selectAll("circle")
        .data(g.nodes())
        .enter()
        .append("circle")
        .style("stroke", "gray")
        .style("fill", "black")
        .attr("r", 20)
        .attr("cx", function (d) {
            return g.node(d).x;
        })
        .attr("cy", function (d) {
            return g.node(d).y;
        })
        .on('mouseover', function (d, i) {
            console.log(i)
        });


    let line = d3.line()
        .x(function (d) {return d.x; })
        .y(function (d) { return d.y; });

    for (let i=0; i < g.edges().length; i++) {
        svg_g.append("path")
            .style('stroke', 'black')
            .style('stroke-width', "2")
            .style('fill', 'none')
            .attr("d", line(g.edge(g.edges()[i]).points));
    }
}

// function initialize_network_dagred3(structure_learning_div) {
//     // Create the input graph
//     var g = new dagreD3.graphlib.Graph()
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
// }