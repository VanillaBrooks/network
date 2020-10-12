import React from 'react';

import './App.css';
import { Graph } from 'react-d3-graph';
import randomColor from 'randomcolor';

class CustomGraph extends React.Component {
	constructor(props) {
		super(props)

		//const data = no_color_graph(props.graph_json);
		const data = nodesByFileGraph(props.graph_json);

		
		// the graph configuration, you only need to pass down properties
		// that you want to override, otherwise default ones will be used
		const myConfig = make_config();
		this.state = {
			data: data, 
			config: myConfig,
			isColorNodesSame: true,
			isColorNodesFile: false,
			isNodeSubroutine: false,
			isNodeFile: true,
			isNodeSubroutineAndFile: false,
			key: 1,
		};
	}

	onZoomChange(prevZoom, newZoom) {
		console.log(newZoom)
		this.setState({currentZoom: newZoom});
	}

	dontAllowColorOptions() {
		if (this.state.isNodeFile) {
			console.log("preventing options")
			return true
		}
		else {
			return false
		}
	}
	
	// makes a number associated with what option is selected for the type of graph
	// information being displayed
	//
	// 1 - nodes are subroutines
	// 2 - nodes are files
	// 3 - nodes are both subroutines and files
	graph_number() {
		if (this.state.isNodeSubroutine) {
			return 1
		}
		else if (this.state.isNodeFile) {
			return 2
		}
		else if (this.state.isNodeSubroutineAndFile) {
			return 3
		}
		else {
			window.alert("unhandled graph type")
		}
	}

	// redraw all the nodes with the same colors
	colorNodesSame() {
		console.log("nodes same")
		if (this.dontAllowColorOptions()) {
			return 
		}
		this.setState({
			isColorNodesSame: true, 
			isColorNodesFile: false,
			data:this.generateSubroutineGraph(true, this.graph_number())
		})
	}

	// redraw all the nodes with their colors corresponding to the colors of the parent file
	colorNodesFile() {
		console.log("nodes file")
		if (this.dontAllowColorOptions()) {
			return 
		}
		this.setState({
			isColorNodesSame: false, 
			isColorNodesFile: true, 
			data:this.generateSubroutineGraph(false, this.graph_number())
		});
	}

	// Nodes Setters
	nodesBySubroutine() {
		console.log("nodes by subroutine")
		this.setState({
			isNodeSubroutine: true,
			isNodeFile: false,
			isNodeSubroutineAndFile: false,
			data: this.generateSubroutineGraph(this.state.isColorNodesSame, 1)
		});

		this.restartSimulation()
	}

	nodesByFile() {
		console.log("nodes by file")
		this.setState({
			isNodeSubroutine: false,
			isNodeFile: true,
			isNodeSubroutineAndFile: false,
			data: this.generateSubroutineGraph(this.state.isColorNodesSame, 2)
		})
		this.restartSimulation()
	}

	nodesByFileAndSubroutine() {
		console.log("nodes by subroutine and file")
		this.setState({
			isNodeSubroutine: false,
			isNodeFile: false,
			isNodeSubroutineAndFile: true,
			data: this.generateSubroutineGraph(this.state.isColorNodesSame, 3)
		})

		this.restartSimulation()
	}

	generateSubroutineGraph(color_nodes_same, render_option) {
		console.log(this.state.isNodeSubroutine, this.state.isNodeFile, this.state.isNodeSubroutineAndFile);
		if (color_nodes_same === true) {
			if (render_option === 1) {
				console.log("same color subroutine only")
				return no_color_graph(this.props.graph_json)
			}
			else if (render_option === 2) {
				console.log("same color file only")
				return nodesByFileGraph(this.props.graph_json);
			}
			else if (render_option === 3) {
				console.log("same color file and subroutine")
				return nodesByFileAndSubroutineGraph(this.props.graph_json, false);
			}
		} else if (color_nodes_same === false) {
			if (render_option === 1){ 
				console.log("color files | subroutine only")
				return color_nodes_by_parent_file(this.props.graph_json)
			}
			else if (render_option === 2) {
				console.log("color files | file only")
				return nodesByFileGraph(this.props.graph_json);
			}
			else if (render_option === 3) {
				console.log("color files | file and subroutine")
				return nodesByFileAndSubroutineGraph(this.props.graph_json, true);
			}
		}
		else {
			window.alert("generateSubroutineGraph: Neither value true")
		}
	}
	
	// colors stuff
	colorNodesSameClass() {
		return this.genericButtonGroupColoring(this.state.isColorNodesSame, !this.state.isNodeFile)
	}
	colorNodesFileClass() {
		return this.genericButtonGroupColoring(this.state.isColorNodesFile, !this.state.isNodeFile)
	}

	// nodes stuff
	nodesBySubroutineClass() {
		return this.genericButtonGroupColoring(this.state.isNodeSubroutine, true);
	}
	nodesByFileClass() {
		return this.genericButtonGroupColoring(this.state.isNodeFile, true);
	}
	nodesByFileAndSubroutineClass() {
		return this.genericButtonGroupColoring(this.state.isNodeSubroutineAndFile, true);
	}


	// is active determines if this button should be active (its clicked)
	// allowed_active determines if these buttons are even allowed to be active (for example,
	// this node coloring options are not enabled if the nodes are files)
	genericButtonGroupColoring(is_active, allowed_active) {
		if (is_active === true) {
			if (allowed_active === true) {
				return "list-group-item list-group-item-action active"
			} else {
				return "list-group-item list-group-item-action"
			}
		} else if (is_active === false) {
			return "list-group-item list-group-item-action"
		}
		console.log("WARNING: genericButtonGroupColoring did not return a class")
	}

	restartSimulation() {
		this.setState({key: this.state.key + 1})
	}

	render() {
		let graph = <Graph
			key={this.state.key}
		    id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
			ref="graph"
		    data={this.state.data}
		    config={this.state.config}
			onZoomChange={this.onZoomChange}
		    onClickGraph={onClickGraph}
		    onClickNode={onClickNode}
		    onDoubleClickNode={onDoubleClickNode}
		    onRightClickNode={onRightClickNode}
		    onClickLink={onClickLink}
		    onRightClickLink={onRightClickLink}
		    onMouseOverNode={onMouseOverNode}
		    onMouseOutNode={onMouseOutNode}
		    onMouseOverLink={onMouseOverLink}
		    onMouseOutLink={onMouseOutLink}
			onNodePositionChange={onNodePositionChange}
			/>

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-9">
						{graph}
					</div>
					<div className="col-3 graph-settings shadow">
						<h3 className="mb-1">Settings</h3>

						<div className="row">
							<p class="pl-3 mt-1">Node Colors</p>
						</div>

						{
							this.dontAllowColorOptions() ?
								<div class="list-group">
									<button type="button" class={this.colorNodesSameClass()} disabled onClick={()=> this.colorNodesSame()}>Same Color</button>
									<button type="button" class={this.colorNodesFileClass()} disabled onClick={() => this.colorNodesFile()} >Color By File</button>
								</div>
								:
								<div class="list-group">
									<button type="button" class={this.colorNodesSameClass()} onClick={()=> this.colorNodesSame()}>Same Color</button>
									<button type="button" class={this.colorNodesFileClass()} onClick={() => this.colorNodesFile()} >Color By File</button>
								</div>
						}

						<div className="row">
							<p class="pl-3 mt-3">Node Options</p>
						</div>

						<div class="list-group">
							<button type="button" class={this.nodesBySubroutineClass()} onClick={()=> this.nodesBySubroutine()}>Nodes by Subroutines</button>
							<button type="button" class={this.nodesByFileClass()} onClick={() => this.nodesByFile()} >Nodes by File</button>
							<button type="button" class={this.nodesByFileAndSubroutineClass()} onClick={() => this.nodesByFileAndSubroutine()} >Include both subroutines and files</button>
						</div>

						<button type="button" class="btn btn-primary mt-3" onClick={() => this.restartSimulation()}>Restart Simulation</button>

					</div>
				</div>
			</div>
		)
	}
}

// Callback to handle click on the graph.
// @param {Object} event click dom event
const onClickGraph = function(event) {
	event.preventDefault();
     //window.alert('Clicked the graph background');
};

const onClickNode = function(nodeId) {
     //window.alert('Clicked node ${nodeId}');
};

const onDoubleClickNode = function(nodeId) {
     //window.alert('Double clicked node ${nodeId}');
};

const onRightClickNode = function(event, nodeId) {
	event.preventDefault();
     //window.alert('Right clicked node ${nodeId}');
};

const onMouseOverNode = function(nodeId) {
     //window.alert(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = function(nodeId) {
     //window.alert(`Mouse out node ${nodeId}`);
};

const onClickLink = function(source, target) {
     //window.alert(`Clicked link between ${source} and ${target}`);
};

const onRightClickLink = function(event, source, target) {
	event.preventDefault();
     //window.alert('Right clicked link between ${source} and ${target}');
};

const onMouseOverLink = function(source, target) {
     //window.alert(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function(source, target) {
     //window.alert(`Mouse out link between ${source} and ${target}`);
};

const onNodePositionChange = function(nodeId, x, y) {
     //window.alert(`Node ${nodeId} moved to new position x= ${x} y= ${y}`);
};

const make_config = function() {
	return {
	  "automaticRearrangeAfterDropNode": false,
	  "initialZoom": .3,
	  "collapsible": false,
	  "directed": true,
	  "focusAnimationDuration": 0.75,
	  "focusZoom": 1,
	  "height": 1000,
	  "highlightDegree": 1,
	  "highlightOpacity": 0.2,
	  "linkHighlightBehavior": false,
	  "maxZoom": 8,
	  "minZoom": 0.1,
	  "nodeHighlightBehavior": true,
	  "panAndZoom": false,
	  //"staticGraph": false,
	  //"staticGraphWithDragAndDrop": false,
	  "width": 1500,
	  "d3": {
	    "alphaTarget": 0.01,
	    "gravity": -2000,
	    "linkLength": 400,
	    "linkStrength": .1,
	    "disableLinkForce": false
	  },
	  "node": {
	    "color": "#d3d3d3",
	    "fontColor": "black",
	    "fontSize": 20,
	    "fontWeight": "normal",
	    "highlightColor": "red",
	    "highlightFontSize": 30,
	    "highlightFontWeight": "bold",
	    "highlightStrokeColor": "SAME",
	    "highlightStrokeWidth": 1.5,
	    "labelProperty": "name",
	    "mouseCursor": "pointer",
	    "opacity": 1,
	    "renderLabel": true,
	    "size": 450,
	    "strokeColor": "none",
	    "strokeWidth": 1.5,
	    "svg": "",
	    "symbolType": "circle"
	  },
	  "link": {
	    "color": "#d3d3d3",
	    "fontColor": "red",
	    "fontSize": 10,
	    "fontWeight": "normal",
	    "highlightColor": "blue",
	    "highlightFontSize": 8,
	    "highlightFontWeight": "bold",
	    "mouseCursor": "pointer",
	    "opacity": 1,
	    "renderLabel": false,
	    "semanticStrokeWidth": false,
	    "strokeWidth": 2,
	    "markerHeight": 6,
	    "markerWidth": 6,
		//"type": "CURVE_SMOOTH"
	  }
	}
}

// given some json generate a blank graph with each node using the default colors of the config
function no_color_graph(json_data) {
	// graph payload (with minimalist structure)
	const nodes = json_data.nodes.map(x => {
		return {id: x.self_subroutine_name}
	})
	const data = {
		nodes: nodes,
		links: generic_edges(json_data) 
	};
	return data
}

// common function to generate the links between nodes
function generic_edges(json_data) {
	const edges = json_data.edges.map(x => {
		let map = {
			source: x.self_subroutine_name,
			target: x.called_subroutine_name
		};
		return map
	})
	return edges
}


// make the color of each node dependent on the file that it came from
function color_nodes_by_parent_file(json_data) {
	let file_to_color = new Map();

	console.log("nodes")
	console.log(json_data.nodes)
	const nodes = json_data.nodes.map(node => {
		let color;
		if (file_to_color.has(node.parent_file_name)) {
			color = file_to_color.get(node.parent_file_name);
		}
		else {
			let new_color = randomColor();
			file_to_color.set(node.parent_file_name, new_color)
			color = new_color
		}

		return {
			id: node.self_subroutine_name,
			color: color
		}
	})

	const edges = generic_edges(json_data);

	return {
		nodes: nodes,
		links: edges
	}
}

function nodesByFileGraph(json_data) {
	let caller_callee_map = new Map();
	let subroutine_to_file_map = new Map();

	let nodes = json_data.nodes.map(node => {
		subroutine_to_file_map.set(node.self_subroutine_name, node.parent_file_name);

		return {
			id: node.parent_file_name
		}
	});

	// first we make a pass through all the edges and tally up all the occurances
	// of the files calling each other
	json_data.edges.forEach(edge => {
		let start_file = subroutine_to_file_map.get(edge.self_subroutine_name);
		let end_file = subroutine_to_file_map.get(edge.called_subroutine_name);

		if (caller_callee_map.has(start_file)) {
			let current = caller_callee_map.get(start_file);
			current.add(end_file);
			caller_callee_map.set(start_file, current)
		}
		else {
			let set = new Set();
			set.add(end_file);
			caller_callee_map.set(start_file, set);
		}
	})

	console.log("caller map");
	console.log(caller_callee_map);

	console.log("edges")

	let edges = []
	for (const [source_file, target_list] of caller_callee_map.entries()) {
		// map over the list of files each file calls
		target_list.forEach((target) => {
			edges.push( {
				source: source_file,
				target: target,
			})
		})
	}

	console.log(edges)

	return {
		nodes: nodes,
		links: edges
	}
}

// use_colors determines if we should use the default node color from the config (false) or 
// make all subroutines from the same file the same color (true)
function nodesByFileAndSubroutineGraph(json_data, use_colors) {
	// optionally stores colors that each file is associated with
	let file_to_color = new Map();

	let edges = []

	// generate nodes for the files
	let nodes_to_concat= json_data.nodes.map(node => {
		// first we make sure that every file has a color associated wtih it
		let color;
		if (file_to_color.has(node.parent_file_name)) {
			color = file_to_color.get(node.parent_file_name);
		}
		else {
			let new_color = randomColor();
			file_to_color.set(node.parent_file_name, new_color)
			color = new_color
		}

		if (use_colors) {
			return {
				id: node.parent_file_name,
				symbolType: "triangle",
				color: color
			}
		}
		else {
			return {
				id: node.parent_file_name,
				symbolType: "triangle",
			}
		}
	});

	// also generate nodes for the subroutines
	let nodes = nodes_to_concat.concat(json_data.nodes.map(node => {
		// make sure there is an edge between the file and and its subroutine
		edges.push( {
			source: node.parent_file_name,
			target: node.self_subroutine_name,
		})

		if (use_colors) {
			return {
				id: node.self_subroutine_name,
				symbolType: "circle",
				color: file_to_color.get(node.parent_file_name)
			}
		}
		else {
			return {
				id: node.self_subroutine_name,
				symbolType: "circle"
			}
		}
	}))


	// first we make a pass through all the edges and tally up all the occurances
	// of the files calling each other
	json_data.edges.forEach(edge => {
		// also add connections between subroutines
		edges.push( {
			source: edge.self_subroutine_name,
			target: edge.called_subroutine_name,
		})
	})

	return {
		nodes: nodes,
		links: edges
	}
}

export default CustomGraph;
