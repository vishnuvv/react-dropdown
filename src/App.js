import React from 'react';
import logo from './logo.svg';
import { Button, Toast, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      fileUploaded: false,
      loading: false,
      dropdownData: []
    }
    this.fileUploaded = false;
  }
  // File change handler  
  onFileChange = event => { 
    this.setState({ selectedFile: event.target.files[0] }); 
  }; 

  // File upload handler
  onFileUpload = () => { 
    const formData = new FormData(); 
    formData.append( 
      "data", 
      this.state.selectedFile, 
      this.state.selectedFile.name 
    ); 
    
    axios.post("http://localhost:3200/upload", formData).then(() => {
      console.log('file uploaded');
      this.setState({fileUploaded: true});
      //this.successNotification();
    });
    console.log(this.state.selectedFile);
  };

  // fetched airport list
  getAirportList = () => {
    this.setState({loading: true});
    axios.get("http://localhost:3200/getAirportList").then((result) => {
      this.setState({dropdownData: result.data.airports, loading: false});
    });
  }

  render(){
    const fileUploaded = this.state.fileUploaded;
    let dropdownContainer = '';
    if (this.state.fileUploaded) {
      dropdownContainer =  (
         <div className="airports-display mt-4">
            <h3>Airports list</h3>
            <div className="d-flex">
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Airports (name, city, code)
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {this.state.dropdownData.map(item => <Dropdown.Item key={item.code}>{item.name} ({item.city}) ({item.code})</Dropdown.Item>)}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" className="ml-3" onClick={this.getAirportList}>Get Airport List</Button>
              {this.state.loading && <img className="ml-3" width="30" height="30" src="/loading.gif" />}
            </div>
        </div>)
    }
    return (
      <div className="m-4">
        <h3> 
                Upload Airports list
        </h3> 
        <div>
          <input type="file" onChange={this.onFileChange} /> 
          <Button variant="primary" onClick={this.onFileUpload}>Upload</Button>
        </div>
        {this.state.fileUploaded && <Toast style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '50%'
                  }}>
                  <Toast.Body>File uploaded sucessfully</Toast.Body>
                </Toast>
              }
        {dropdownContainer}
      </div>
    );
  }
}

export default App;
