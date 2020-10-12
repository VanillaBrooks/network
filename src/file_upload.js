import {useDropzone} from 'react-dropzone'
import json_data from './streams.json';
import React, {useCallback} from 'react';

function JsonUpload(props) {
	const onDrop = useCallback(acceptedFiles => {
		let reader = new FileReader();
		reader.readAsText(acceptedFiles[0])

		reader.onload = function() {
			props.onUpload(JSON.parse(reader.result));
  		};
  	}, [props])

  	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

	const onClick = function(event) {
		props.onUpload(json_data)
	}
 
	// TODO: the padding in here is bad but ive spent like an hour trying to vertically
	// center in bootstrap so it is what it is
  	return (
		<div className="container">
			<div style={{"padding":"18% 0"}}/>
			<div className="row justify-content-center">
				<div className="col-5 align-self-center shadow shadow-lg rounded">
					<div {...getRootProps(
						{
							style: {
								"minHeight":"100px",
								"borderStyle":"dashed",
								"borderRadius":"3px",
								"borderWidth":"1px"
							},
							className: "p-2 mt-3"
						}
					)
					}>
						{/* This is the drag-to-upload a file*/}
						<input {...getInputProps()} />
						{
  	  				  	  isDragActive ?
  	  				  	    <p className="text-center">Drop Here</p> :
  	  				  	    <p className="text-center">Drag A Parsing Result to View</p>
						}

  	  				</div>

					<div className="row p-2">
						<div className="col">
							<p className="text-center">or:</p>
						</div>
					</div>

					{/* OTHERWISE: we can load a default file graph*/}
					<div className="row">
						<div className="col-md offset-md-3 pl-4">
							<button className="btn btn-primary mb-2" onClick={onClick}>Load Example Graph</button>
						</div>
					</div>

				</div>
			</div>
		</div>
  	)
}

export default JsonUpload;
