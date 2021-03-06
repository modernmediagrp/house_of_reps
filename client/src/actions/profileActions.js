import axios from 'axios'
import jwt_decode from 'jwt-decode'

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES,
  LIKE_HIGHLIGHT,
  ADD_PROMO,
  LEAVE_CHATROOM
} from './types'
import { setCurrentUser } from './authActions'
import setAuthToken from '../utils/setAuthToken'

// Get current profile
export const getCurrentProfile = () => async dispatch => {
  try {
    dispatch(setProfileLoading())
    const res = await axios.get('/api/profile')
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: {}
    })
  }
}

// Get all profiles
export const getProfiles = () => async dispatch => {
  try {
    dispatch(setProfileLoading())
    const res = await axios.get('/api/profile/all')
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: GET_PROFILES,
      payload: null
    })
  }
}

// Get profile by handle
export const getProfileByHandle = handle => async dispatch => {
  try {
    dispatch(setProfileLoading())
    const res = await axios.get(`/api/profile/handle/${handle}`)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: null
    })
  }
}

// Search Profiles by handle || stageName
export const searchProfiles = userInput => async dispatch => {
  try {
    dispatch(setProfileLoading())
    const res = await axios.get(`/api/profile/search/${userInput}`)
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: GET_PROFILES,
      payload: null
    })
  }
}

// Create Profile
export const createProfile = (profileData, history) => async dispatch => {
  try {
    const res = await axios.post('/api/profile', profileData)
    const { token } = res.data
    localStorage.setItem('jwtToken', token)
    setAuthToken(token)
    const decoded = jwt_decode(token)
    dispatch(setCurrentUser(decoded))
    history.push('/dashboard')
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  }
}

// Add Venue
export const addVenue = (venueData, history) => async dispatch => {
  try {
    dispatch(setProfileLoading())
    const res = await axios.post('/api/profile/venues', venueData)
    dispatch({
      type: ADD_PROMO,
      payload: res.data
    })
    history.push('/dashboard')
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  }
}

// Like Venue
export const likeVenue = (venueId, userId) => async dispatch => {
  try {
    const profile = await axios.post(
      `/api/profile/venues/like/${venueId}/${userId}`
    )
    dispatch({
      type: LIKE_HIGHLIGHT,
      payload: {
        data: profile.data,
        venueId,
        userId
      }
    })
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  }
}

// Delete Venue
export const deleteVenue = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/venues/${id}`)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    console.log(err)
  }
}

// Delete account & profile
export const deleteAccount = () => async dispatch => {
  try {
    if (window.confirm('Are you sure? This can not be undone')) {
      await axios.delete('/api/profile')
      localStorage.clear()
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    }
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  }
}

// Leave Chatroom
export const leaveChatroom = (chatId, history) => async dispatch => {
  try {
    dispatch(setProfileLoading())
    history.push('/dashboard')
    const res = await axios.delete(`/api/chat/profile/${chatId}`)
    dispatch({
      type: LEAVE_CHATROOM,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: LEAVE_CHATROOM,
      payload: { err }
    })
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
