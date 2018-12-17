import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import CreateProfileTextFieldGroup from '../common/create-profile-inputs/CreateProfileTextFieldGroup'
import CreateProfileTextAreaFieldGroup from '../common/create-profile-inputs/CreateProfileTextAreaFieldGroup'
import { connect } from 'react-redux' 
import PropTypes from 'prop-types' 
import { addVenue } from '../../actions/profileActions'
// import classnames from 'classnames'
import './AddVenue.css'
// import { SET_CURRENT_USER } from '../../actions/types';

class AddVenue extends Component {
  state = {
    location: '',
    date: '',
    description: '',
    errors: {},
    title: ''
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
    
    const venueData = {
      date: this.state.date,
      location: this.state.location,
      description: this.state.description,
      title: this.state.title
    }

    this.props.addVenue(venueData, this.props.history)
  }

  render() {
    const { errors } = this.state 
    return (
      <div className='add-venue'>
        <Link to='/dashboard'>
          <i id='addvenue-back-button' className='fas fa-arrow-alt-circle-left' alt='back-button' />
        </Link>
        <h1 style={{ textAlign: 'center', color: '#ccc' }}>Add Event</h1>
        <p style={{ textAlign: 'center', color: '#777' }}>Add your upcoming events</p>
        <div style={{ }}>
          <form onSubmit={ this.onSubmit }>
            <CreateProfileTextFieldGroup 
              name='date'
              type='date'
              value={ this.state.date }
              onChange={ this.onChange }
              error={ errors.date }
            />
            <CreateProfileTextFieldGroup 
              placeholder='Title'
              name='title'
              value={ this.state.title }
              onChange={ this.onChange }
              error={ errors.title }
            />
            <CreateProfileTextFieldGroup 
              placeholder='* Location of Event'
              name='location'
              value={ this.state.location }
              onChange={ this.onChange }
              error={ errors.location }
            />
            <CreateProfileTextAreaFieldGroup 
              placeholder='Quick description'
              name='description'
              value={ this.state.description }
              onChange={ this.onChange }
              error={ errors.description }
            />
            <input type="submit" value='Submit' id='venue-submit-button' />
          </form>
        </div>
      </div>
    )
  }
}

AddVenue.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addVenue: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, { addVenue })(withRouter(AddVenue))