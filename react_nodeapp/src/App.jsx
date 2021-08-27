import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './main/Main';

class App extends Component {
  state = {
    data: null
  };

    componentDidMount()
    {
      this.callBackendAPI()
          .then(res => this.setState({data: res.express}))
          .catch(err => console.log(err));
    }

    // fetching the GET route from the Express server which matches the GET route from server.js
    callBackendAPI = async () => {
      const response = await fetch('/notes');
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
    };

  render() {
    return (
        <div className="App">
          <Main
          />
          <Main />
        </div>
    );
  }
}

export default App;
