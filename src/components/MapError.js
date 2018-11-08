import React, {Component} from 'react';

class MapError extends Component {
    state = {
        hasError: false,
        timeout: null
    }

    componentDidMount = () => {
        let timeout = window.setTimeout(this.showMessage, 1000);
        this.setState({timeout});
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.state.timeout);
    }

    showMessage = () => {
        this.setState({hasError: true});
    }

    render = () => {
        return (
           <div>
                {this.state.hasError
                    ? (
                        <div>
                            <h1>Something went wrong loading the map.Try again later!</h1>
                        </div>
                    )
                    : (<div><h1>Loading</h1></div>)
            } </div>
        )
    }
}
export default MapError;
