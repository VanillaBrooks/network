import React from 'react';
//import ReactDOM from "react-dom";
import CustomGraph from "./graph";
import JsonUpload from "./file_upload";
import {GraphJson} from './json';

class App extends React.Component<{}, AppState> {
	constructor(props: AppProps) {
		super(props)
		this.state = {uploaded_json: undefined};
	}

	// When the user chooses json data this callback fires and we set the json that we
	// will pass to the graph
	onUpload(uploadedAndParsedJson: GraphJson) {
		console.log("json data has been uploaded");
		this.setState({uploaded_json: uploadedAndParsedJson})
	}

	render() {
			if (this.state.uploaded_json === undefined) {

				return <JsonUpload onUpload={this.onUpload.bind(this)}/>
			} else {
				return <CustomGraph graph_json={this.state.uploaded_json}/>

			}
	}
}

interface AppState {
	uploaded_json: GraphJson | undefined,
}

interface AppProps {
}

export default App;
