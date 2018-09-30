import axios from 'axios' 
import { 
  GET_PROFILE, 
  PROFILE_LOADING, 
  CLEAR_CURRENT_PROFILE, 
  GET_ERRORS, 
  SET_CURRENT_USER, 
  GET_PROFILES } from './types' 

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading())
  axios.get('/api/profile').then(res => {
    dispatch({
      type: GET_PROFILE,
      payload: res.data 
    })
  })
  .catch(err => dispatch({
    type: GET_PROFILE,
    payload: {} 
  }))
}

// Get profile by handle
export const getProfileByHandle = (handle) => dispatch => {
  dispatch(setProfileLoading())
  axios.get(`/api/profile/handle/${handle}`).then(res => dispatch({
    type: GET_PROFILE,
    payload: res.data 
  }))
  .catch(err => dispatch({
    type: GET_PROFILE,
    payload: null  
  }))
}


// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
  .post('/api/profile', profileData) 
  .then(res => history.push('/dashboard')) 
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data 
  }))
}

// Add Venue
export const addVenue = (venueData, history) => dispatch => {
  axios.post('/api/profile/venues', venueData).then(res => history.push('/dashboard'))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data 
  }))
}

// Delete Venue
export const deleteVenue = id => dispatch => {
  axios.delete(`/api/profile/venues/${id}`).then(res => dispatch({
    type: GET_PROFILE,
    payload: res.data 
  }))
}

// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading())
  axios.get('/api/profile/all').then(res => dispatch({
    type: GET_PROFILES,
    payload: res.data 
  }))
  .catch(err => dispatch({
    type: GET_PROFILES,
    payload: null 
  }))
}


// Delete account & profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Are you sure? This can not be undone')) {
    axios.delete('/api/profile').then(res => dispatch({
      type: SET_CURRENT_USER,
      payload: {} 
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data 
    }))
  }
}

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}