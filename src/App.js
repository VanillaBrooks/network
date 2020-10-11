import React from 'react';
//import ReactDOM from "react-dom";
import CustomGraph from "./graph.js";
import JsonUpload from "./file_upload.js";

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {initialized_graph: false, uploaded_json: undefined};
	}

	// When the user chooses json data this callback fires and we set the json that we 
	// will pass to the graph
	onUpload(uploadedAndParsedJson) {
		console.log("json data has been uploaded");
		this.setState({uploaded_json: uploadedAndParsedJson, initialized_graph: true})
	}
	
	render() {
		if (this.state.initialized_graph === false) {
			return <JsonUpload onUpload={this.onUpload.bind(this)}/>
		} else {
			return <CustomGraph graph_json={this.state.uploaded_json}/>
		}
	}
}

export default App;
