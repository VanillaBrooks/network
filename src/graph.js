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
		};
	}

	onZoomChange(prevZoom, newZoom) {
		console.log(newZoom)
		this.setState({currentZoom: newZoom});
	}

	dontAllowColorOptions() {
		if (this.state.isNodeSubroutineAndFile || this.state.isNodeFile) {
			console.log("preventing options")
			return true
		}
		else {
			return false
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
			data: no_color_graph(this.props.graph_json)
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
			data:color_nodes_by_parent_file(this.props.graph_json)
		});
	}


	// Nodes Setters
	nodesBySubroutine() {
		console.log("nodes by subroutine")
		this.setState({
			isNodeSubroutine: true,
			isNodeFile: false,
			isNodeSubroutineAndFile: false,
			data: this.generateSubroutineGraph(this.props.graph_json)
		})
		this.refs.graph.restartSimulation();
		this.refs.graph.resetNodesPositions();
	}

	nodesByFile() {
		console.log("nodes by file")
		this.setState({
			isNodeSubroutine: false,
			isNodeFile: true,
			isNodeSubroutineAndFile: false,
			data: nodesByFileGraph(this.props.graph_json),
		})
		console.log("restarting simulation");
		this.refs.graph.restartSimulation();
		console.log("resteting node positions");
		this.refs.graph.resetNodesPositions();
		console.log("graph reference:")
		console.log(this.refs.graph);
	}

	nodesByFileAndSubroutine() {
		console.log("nodes by subroutine and file")
		this.setState({
			isNodeSubroutine: false,
			isNodeFile: false,
			isNodeSubroutineAndFile: true,
			data: nodesByFileAndSubroutineGraph(this.props.graph_json),
		})
	}

	generateSubroutineGraph() {
		if (this.state.isColorNodesSame) {
			return no_color_graph(this.props.graph_json)
		} else if (this.state.isColorNodesFile){
			return color_nodes_by_parent_file(this.props.graph_json)
		}
		else {
			window.alert("generateSubroutineGraph: Neither value true")
		}
	}
	
	// colors stuff
	colorNodesSameClass() {
		return this.state.isColorNodesSame ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
	}
	colorNodesFileClass() {
		return this.state.isColorNodesFile ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
	}

	// nodes stuff
	nodesBySubroutineClass() {
		return this.state.isNodeSubroutine? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
	}
	nodesByFileClass() {
		return this.state.isNodeFile? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
	}
	nodesByFileAndSubroutineClass() {
		return this.state.isNodeSubroutineAndFile? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"
	}

	render() {
		let graph = <Graph
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
						<p className="mb-1">Settings</p>

						<div className="row">
							<p>Node Colors</p>
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
							<p>Node Options</p>
						</div>

						<div class="list-group">
							<button type="button" class={this.nodesBySubroutineClass()} onClick={()=> this.nodesBySubroutine()}>Nodes by Subroutines</button>
							<button type="button" class={this.nodesByFileClass()} onClick={() => this.nodesByFile()} >Nodes by File</button>
							<button type="button" class={this.nodesByFileAndSubroutineClass()} onClick={() => this.nodesByFileAndSubroutine()} >Include both subroutines and files</button>
						</div>

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
	  "collapsible": true,
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
	    "alphaTarget": 0.05,
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

		console.log("start_file: " + start_file)
		console.log("end_file: " + end_file)

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

function nodesByFileAndSubroutineGraph(json_data) {
	return no_color_graph(json_data)
}

export default CustomGraph;
