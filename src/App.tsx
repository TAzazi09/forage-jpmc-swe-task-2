import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  private interval: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false, // Initially hide graph until data streaming starts
    };
  }

  componentDidMount() {
    // No initial data fetching on component mount; starts only on button click
  }

  componentWillUnmount() {
    // Clean up: stop fetching data when component unmounts
    this.stopFetchingData();
  }

  startFetchingData() {
    // Start fetching data immediately when the button is clicked
    this.interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100); // Fetch data every 100 milliseconds

    // Update state to show graph once data fetching starts
    this.setState({ showGraph: true });
  }

  stopFetchingData() {
    // Clear the interval to stop fetching data
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    } else {
      return null; // Render nothing until data fetching starts
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => this.startFetchingData()}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
