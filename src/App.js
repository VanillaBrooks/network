import React from 'react';
import ReactDOM from "react-dom";

import logo from './logo.svg';
import './App.css';
import Graph from "react-graph-vis";

//import "./styles.css";
//// need to import the vis network css in order to show tooltip
//import "./network.css";
//

function load_options() {
	let options = {
		nodes: {
			shape: "dot",
			scaling: {
				min:10,
				max:30
			},
			label: {
        	  min: 8,
        	  max: 30,
        	  drawThreshold: 12,
        	  maxVisible: 20,
        	},
		}, 
		edges: {
    	  color: { inherit: true },
    	  width: 0.15,
    	  smooth: {
    	    type: "continuous",
    	  },
    	},
		height: "1000px",
		
		physics: {
    	  forceAtlas2Based: {
    	    gravitationalConstant: -35,
    	    centralGravity: 0.005,
    	    springLength: 230,
    	    springConstant: 0.18,
    	  },
    	  maxVelocity: 146,
    	  solver: "forceAtlas2Based",
    	  timestep: 0.35,
    	  stabilization: { iterations: 150 },
    	},
  	};
	return options
}

function App() {

	var request = new XMLHttpRequest();
	request.open('GET', 'streams.json', false);  
	request.send(null);

	console.log(request.responseText);
	
	let json_data = JSON.parse(request.responseText);

	console.log(json_data);
	
	let label_map = new Map();
	let counter = 0;
	const nodes = json_data.file_nodes.map(x => {
		counter += 1;
		label_map.set(x.file_name, counter);
		return {id: counter, label: x.file_name, title: x.file_name}
	})

	const edges = json_data.file_edges.map(edge => {
		console.log(edge.base_file    +" id:"  +label_map.get(edge.base_file))
		console.log(edge.called_file  + " id:" + label_map.get(edge.called_file))
		return {
			from: label_map.get(edge.base_file),
			to: label_map.get(edge.called_file),
			value: edge.occurances
		}
	})

	const graph = {
		nodes: nodes,
		edges: edges
	};


	console.log(nodes)
	console.log(edges)
	let options = load_options();

	const events = {
	  select: function(event) {
	    var { nodes, edges } = event;
	    console.log("Selected nodes:");
		  console.log(nodes.entries())//.forEach(x => console.log(x));
	    console.log(nodes);
	    console.log("Selected edges:");
	    console.log(edges);
	  }
	};

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {}}
    />
  );
}

export default App;
