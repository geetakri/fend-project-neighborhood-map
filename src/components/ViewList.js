import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

class ViewList extends Component {
  state = {
      drawerOpen: false,
      query: ""
  }

  styles = {
      listDivStyle: {
          width: "300px",
          padding: "0px 20px 0px"
      },
      listHeading: {
        color:"#2e3d49"
      },
      inputStyle: {
          border: "1px solid gray",
          padding: "5px",
          margin: "10px 0px 5px",
          width: "100%"
      },
      ulStyle: {
          listStyleType: "none",
          padding: 0
      },

      liStyle: {
          marginBottom: "20px"
      },
      buttonStyle: {
          background: "transparent",
          border: "none",
          color: "#2e3d49"
      }

  };

  updateQuery = (newQuery) => {

        // Set the state for the new Query and make the call back up the chain
      this.setState({ query: newQuery });
      this.props.updateQuery(newQuery);
  }

  render = () => {
    return (
      <div>
        <Drawer open={this.props.drawerOpen} onClose={this.props.toggleListDrawer}>
            <div style={this.styles.listDivStyle}>
              <h2 style={this.styles.listHeading}>Bakery Shops</h2>
              <input style={this.styles.inputStyle} type="text" placeholder="Filter Location"
                    name="filter"
                    onChange={e => this.updateQuery(e.target.value)} value={this.state.query} />
              <ul style={this.styles.ulStyle}>
                  {this.props.locations && this.props.locations.map((location, index) => {
                          return (
                            <li style={this.styles.liStyle} key={index}>
                                <button style={this.styles.buttonStyle}
                                        key={index}
                                        onClick={e => this.props.onClickListItem(index)}
                                >{location.name}</button>
                            </li>
                          )
                      })
                    }
              </ul>
            </div>
        </Drawer>
      </div>
    )
  }
}

export default ViewList;
