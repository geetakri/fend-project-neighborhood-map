import React, { Component } from 'react';
import { Map,GoogleApiWrapper, InfoWindow} from 'google-maps-react';
import MapError from './MapError';

const GOOGLE_MAP_KEY = "AIzaSyBH4-Qg5dwK-OZKVY0qOSH3SXF5uD-i3XI";
const FS_CLIENT_ID = "TYKCLY2OO5JQK42WCYL5FUEGCIQRYMF14UDWGCWVYRUOP0OH";
const FS_CLIENT_SECRET = "P5KKM24HTB1D23V2VMNZDLVRXF0LKKUYGMOYZHRPML5ZOTZO";
const FS_VERSION = "20181231";

class MapContainer extends Component {

  state = {
       map: null,
       markers: [], // Marker Array
       markerProperties: [], // Properties of Each Marker
       activeMarker: null,  //Shows the active marker upon click
       activeMarkerProperties: null, // Properties of Active Marker
       showingInfoWindow: false,  //Hides or the shows the infoWindow
       apiErrorMessage:""
   };

   componentDidMount = () => {
   }

  componentWillReceiveProps = (props) => {

      // Locations are filtered, so update the markers
      if (this.state.markers.length !== props.locations.length) {
          this.closeInfoWindow();
          this.updateMarkers(props.locations);
          this.setState({activeMarker: null});

          return;
      }

      //The clicked marker is not the same as the active marker, so close the info window
      if (!props.clickedLocIndex || (this.state.activeMarker &&
        (this.state.markers[props.clickedLocIndex] !== this.state.activeMarker))) {
        this.closeInfoWindow();
      }

    //If there is no clicked index, return
       if (props.clickedLocIndex === null || typeof(props.clickedLocIndex) === "undefined") {
          return;
       };

       // Marker is clicked
       this.onMarkerClick(this.state.markerProperties[props.clickedLocIndex], this.state.markers[props.clickedLocIndex]);
     }

   updateMarkers = (locations) => {
       //if the location array is not valid , then return
       if (!locations)
           return;

       //if there is any exisitng marker on the map , clear them from the map
       this.state.markers.forEach(marker => marker.setMap(null));

       //iterating through all over my locations and
       //creating markers and the properties of each marker
       //Also, add markers to the map
       let markerProperties = [];
       let markers = locations.map((location, index) => {
           let mProperties = {
               key: index,
               index,
               name: location.name,
               position: location.coords,
               street:location.street
           };
           markerProperties.push(mProperties);

           let marker = new this.props.google.maps.Marker({
               position: location.coords,
               map: this.state.map,
               animation:this.props.google.maps.Animation.DROP
           });

           //Adding listener on marker click
           marker.addListener('click', () => {
               this.onMarkerClick(mProperties, marker, null);
           });
           return marker;
       })

       this.setState({markers, markerProperties});
   }

   //Return the matching location data in foursquare
   //against the Bakery Shops Locations that we already have
   getLocationMatch = (props, data) => {

       return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name));

   }

   onReady = (props, map) => {
       // Save the map reference in state and create the location markers
       this.setState({map});
       this.updateMarkers(this.props.locations);
   }

   onMarkerClick = (props, marker, e) => {
       // Close any info window already open
       this.closeInfoWindow();

       // Fetch the FourSquare data for the Clicked bakery location
       let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT_ID}&client_secret=${FS_CLIENT_SECRET}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;

       let request = new Request(url, {
           method: 'GET',
           headers: new Headers()
       });

       // Create properties for the active marker
       let activeMarkerProperties;
       fetch(request)
           .then(response => response.json())
           .then(result => {


               //for that specific marker which is clicked ,
               //gets the matching Bakery Shop from the FourSquare data
               //if the name of the bakery shop is in the Foursquare data
               let bakeryShop = this.getLocationMatch(props, result);

               activeMarkerProperties = {
                   ...props,
                   foursquareLoc: bakeryShop[0]
               };

               // Get the list of images for the bakery Shop if we got its FourSquare data, or just
               // set the state
               if (activeMarkerProperties.foursquareLoc) {
                   let url = `https://api.foursquare.com/v2/venues/${bakeryShop[0].id}/photos?client_id=${FS_CLIENT_ID}&client_secret=${FS_CLIENT_SECRET}&v=${FS_VERSION}`;
                   fetch(url)
                       .then(response => response.json())
                       .then(result => {
                           activeMarkerProperties = {
                               ...activeMarkerProperties,
                               images: result.response.photos
                           };
                           if (this.state.activeMarker)
                               this.state.activeMarker.setAnimation(null);
                           marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                           this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProperties});
                       })
               } else {
                   marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                   this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProperties});
               }
           }).catch((error) => {

              activeMarkerProperties = {
                  ...props
              };
              if (this.state.activeMarker)
                  this.state.activeMarker.setAnimation(null);
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
              this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProperties,apiErrorMessage:"Error occurred loading data from FourSquare API"});
        			 alert('Sorry! Error occurred whilst loading data from FourSquare API. Locations information will not be displayed ')
        	 })
   }

   closeInfoWindow = () => {
      if (this.state.showingInfoWindow) {
       // Disable any active marker animation and close the infowindow
       this.state.activeMarker && this.state.activeMarker.setAnimation(null);
       this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProperties: null});
     }
   }

   render = () => {
       const style = {
           width: '100%',
           height: '100%'
       }

       return (
           <Map
               role="application"
               aria-label="map"
               onReady={this.onReady}
               google={this.props.google}
               zoom={12}
               style={style}
               initialCenter={{ lat: 40.955162,lng: -74.234115}}
               onClick={this.closeInfoWindow}>
               <InfoWindow
                   marker={this.state.activeMarker}
                   visible={this.state.showingInfoWindow}
                   onClose={this.closeInfoWindow}>
                   <div>
                   {this.state.activeMarkerProperties &&
                     <>
                       <h3>{this.state.activeMarkerProperties.name}</h3>
                       <p>{this.state.activeMarkerProperties.street}</p>
                       {this.state.apiErrorMessage &&
                         <>
                         <p> {this.state.apiErrorMessage} </p>
                         </>
                       }
                       <div>
                            {this.state.activeMarkerProperties.images &&
                              <>
                           <img
                               alt={this.state.activeMarkerProperties.name + " bakery Image"}
                               src={this.state.activeMarkerProperties.images.items[0].prefix + "100x100" + this.state.activeMarkerProperties.images.items[0].suffix}
                            />
                               <p>Image from Foursquare</p>
                           </>
                         }
                       </div>
                    </>
                  }
                   </div>
               </InfoWindow>
           </Map>
       )
   }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAP_KEY,
  LoadingContainer: MapError
})(MapContainer);
