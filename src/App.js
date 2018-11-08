import React, {Component} from 'react';
import './App.css';
import MapContainer from './components/MapContainer';
import ViewList from './components/ViewList';

class App extends Component {

  state = {
     drawerOpen: false,
     filteredLocations: null,
  }

  //Bakery Shops locations in Wayne,NJ Neighborhood
  locations = [
        {
          "name": "Gencarelli's Bakery",
          "url":"https://www.gencarellisbakery.com",
          "street":"321 Valley Rd",
          "coords": {"lat":40.930777 , "lng": -74.218249}
        },
        {
          "name": "Packanack Bakery",
          "url":"",
          "street":"1488 NJ-23",
          "coords": {"lat":40.934889 , "lng": -74.268063}
        },
        {
          "name": "Bagel O's Inc",
          "url":"bageloswayne.com",
          "street":"154 Mountainview Blvd",
          "coords": {"lat":40.915128 , "lng": -74.266895}
        },
        {
          "name": "Panera Bread",
          "url":"https://www.panerabread.com",
          "street":"1619 NJ-23",
          "coords": {"lat":40.939074 , "lng": -74.270911}
        },
        {
          "name": "Einstein Bros. Bagels",
          "url":"https://www.einsteinbros.com/",
          "street":"300 Pompton Rd",
          "coords": {"lat":40.953801 , "lng": -74.185514}
        },
        {
          "name": "Carvel",
          "url":"https://www.carvel.com/",
          "street":"305 Valley Rd",
          "coords": {"lat":40.924300 , "lng": -74.235393}
        }

    ];

    //Style for the Hamburger button which toggle open/shut the drawer
    styles = {
      barButton: {
        marginLeft: 10,
        left: 10,
        padding: 10,
        position: "absolute",
        background: "white"
      }
    };

    componentDidMount = () => {
      this.setState({
        ...this.state,
        filteredLocations: this.filterLocations(this.locations, "")
      });

    }

    filterLocations = (locations, query) => {
      // Filter locations to match query string
      return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
    }

    updateQuery = (query) => {
      // Update the query value and filter the list of locations when user types in the query
      this.setState({
        ...this.state,
        clickedLocIndex: null,
        filteredLocations: this.filterLocations(this.locations, query)
      });
    }


    // Toggles the Drawer containing the Bakery Shop locations List
    toggleListDrawer = () => {
      this.setState({
        drawerOpen: !this.state.drawerOpen
      });
    }

    onClickListItem = (index) => {
        //set the state of index of the clicked location  in the locations array
        this.setState({clickedLocIndex:index, drawerOpen:!this.state.drawerOpen})
  }

  render() {
    return(
      <div className = "App">
          <div>
              <button onClick={this.toggleListDrawer} style={this.styles.barButton}>
                <i className="fa fa-bars"></i>
              </button>
              <h1>Bakery Shops in Wayne, New Jersey</h1>
          </div>
          <MapContainer locations={this.state.filteredLocations}
                        clickedLocIndex = {this.state.clickedLocIndex}
                        onClickListItem = {this.onClickListItem}/>
          <ViewList locations={this.state.filteredLocations}
                    drawerOpen={this.state.drawerOpen}
                    toggleListDrawer={this.toggleListDrawer}
                    updateQuery= {this.updateQuery}
                    clickedLocIndex = {this.state.clickedLocIndex}
                    onClickListItem = {this.onClickListItem}/>
      </div>
    );
}
}
export default App;
