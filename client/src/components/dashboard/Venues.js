import React, { Component } from 'react'
import { connect } from 'react-redux' 
import PropTypes from 'prop-types' 
import Moment from 'react-moment' 
import { deleteVenue } from '../../actions/profileActions'

import './Venue.css'

class Venues extends Component {
  onDeleteClick = id => {
    this.props.deleteVenue(id) 
  }

  render() {
    const venues = this.props.venues.map(venue => (
      <div key={venue._id} 
          style={{
            display: 'flex', 
            background: 'rgba(0,0,0,0.5)', 
            margin: '10px', 
            alignItems: 'center',
            flexWrap: 'wrap',
            maxWidth: '400px',
            minHeight: '200px',
            justifyContent: 'space-around', }}>
        <p style={{padding: '10px'}}><Moment format='MM/DD/YYYY'>{venue.date}</Moment></p>
        <p style={{padding: '10px'}}>{venue.title}</p>
        <p style={{padding: '10px'}}>{venue.location}</p>
        <p style={{padding: '10px'}}>{venue.description}</p>
        <div style={{padding: '10px'}}>
          <button
            id='venue-delete-btns'
            onClick={ this.onDeleteClick.bind(this, venue._id) }>
              Delete
          </button>
        </div>
      </div>
    ))
    return (
      <div>
        <h3 style={{ 
          textAlign: 'center', 
          padding: '10px', 
          color: '#fff', 
          background: 'rgba(0,0,0,0.5)', 
          margin: '10px auto', 
          width: '100px', }} 
          className=''>Venues
        </h3>
        { venues }
      </div>
    )
  }
}

Venues.propTypes = {
  deleteVenue: PropTypes.func.isRequired
}

export default connect(null, { deleteVenue })(Venues)