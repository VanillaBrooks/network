import json_data from './streams.json';
import React from 'react';
import ReactDOM from "react-dom";

import './App.css';
import { Graph } from 'react-d3-graph';

class App extends React.Component {

	constructor(props) {
		super(props)

		console.log(json_data)

		// graph payload (with minimalist structure)
		const nodes = json_data.nodes.map(x => {
			return {id: x.self_subroutine_name}
		})
		const edges = json_data.edges.map(x => {
			let map = {
				source: x.self_subroutine_name,
				target: x.called_subroutine_name
			};
			return map
		})
		console.log("nodes");
		console.log(nodes);
		console.log("edges");
		console.log(edges);

		const data = {
			nodes: nodes,
			links: edges
		};
		
		// the graph configuration, you only need to pass down properties
		// that you want to override, otherwise default ones will be used
		const myConfig = make_config();
		this.state = {data: data, config: myConfig};

	}

	onZoomChange(prevZoom, newZoom) {
		this.setState({currentZoom: newZoom});
	}
	
	render() {
		const graph = <Graph
		     id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
		     data={this.state.data}
		     config={this.state.config}
			 onZoomChange={this.onZoomChange}
		     //onClickGraph={onClickGraph}
		     //onClickNode={onClickNode}
		     //onDoubleClickNode={onDoubleClickNode}
		     //onRightClickNode={onRightClickNode}
		     //onClickLink={onClickLink}
		     //onRightClickLink={onRightClickLink}
		     //onMouseOverNode={onMouseOverNode}
		     //onMouseOutNode={onMouseOutNode}
		     //onMouseOverLink={onMouseOverLink}
		     //onMouseOutLink={onMouseOutLink}
			/>
		console.log(graph)
		return graph
	}
}

// Callback to handle click on the graph.
// @param {Object} event click dom event
const onClickGraph = function(event) {
     //window.alert('Clicked the graph background');
};

const onClickNode = function(nodeId) {
     //window.alert('Clicked node ${nodeId}');
};

const onDoubleClickNode = function(nodeId) {
     //window.alert('Double clicked node ${nodeId}');
};

const onRightClickNode = function(event, nodeId) {
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
	  "staticGraph": false,
	  "staticGraphWithDragAndDrop": false,
	  "width": 1600,
	  "d3": {
	    "alphaTarget": 0.05,
	    "gravity": -800,
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
	    //"svg": "",
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


export default App;
