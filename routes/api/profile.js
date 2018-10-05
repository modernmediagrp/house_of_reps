const router = require('express').Router() 
const mongoose = require('mongoose') 
const passport = require('passport') 

// Load Validation
const validateProfileInput = require('../../validation/profile')
const validateVenuesInput = require('../../validation/venues')

// Load Profile Model
const Profile = require('../../models/Profile')
// Load User Model
const User = require('../../models/User')

// @route         GET api/profile/test
// @description   Tests profile route
// @access        Public 
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' })) 


// @route         GET api/profile
// @description   GET current users profile
// @access        Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {} 

  Profile.findOne({ user: req.user.id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile) 
  })
  .catch(err => res.status(404).json(err))
}) 


// @route         GET api/profile/all
// @description   Get all profiles
// @access        Private
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {} 

  Profile.find()
  .populate('user', [ 'name', 'avatar' ])
  .then(profiles => {
    if(!profiles) {
      errors.noprofile = 'No profiles yet'
      return res.status(404).json(errors)
    }

    res.json(profiles) 
  })
  .catch(err => res.status(404).json({ profile: 'No profiles yet'}))
}) 


// @route         GET api/profile/handle/:handle
// @description   Get profile by handle
// @access        Private
  router.get('/handle/:handle', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {} 

  Profile.findOne({ handle: req.params.handle })
  .populate('user', [ 'name', 'avatar' ])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user'
      res.status(404).json(errors) 
    }

    res.json(profile) 
  })
  .catch(err => res.status(404).json(err)) 
})


// @route         GET api/profile/user/:user_id
// @description   Get profile by user id
// @access        Private
router.get('/user/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {} 

  Profile.findOne({ user: req.params.user_id })
  .populate('user', [ 'name', 'avatar' ])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user'
      res.status(404).json(errors) 
    }

    res.json(profile) 
  })
  .catch(err => res.status(404).json({profile: 'There is no profile for this user'})) 
})


// @route         POST api/profile
// @description   Create or edit user profile
// @access        Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body) 

  // Check Validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }
  
  // Get fields
  const profileFields = {}
  profileFields.user = req.user.id 
  if(req.body.handle) profileFields.handle = req.body.handle 
  if(req.body.company) profileFields.company = req.body.company 
  if(req.body.website) profileFields.website = req.body.website 
  if(req.body.location) profileFields.location = req.body.location 
  if(req.body.bio) profileFields.bio = req.body.bio 
  if(req.body.venues) profileFields.venues = req.body.venues 
  if(req.body.stageName) profileFields.stageName = req.body.stageName
  if(req.body.style) profileFields.style = req.body.style
  if(req.body.phoneNumber) profileFields.phoneNumber = req.body.phoneNumber

  // Social
  profileFields.social = {}
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter 
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram 
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook 
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin 
  if(req.body.soundcloud) profileFields.social.soundcloud = req.body.soundcloud 
  if(req.body.spotify) profileFields.social.spotify = req.body.spotify 
  if(req.body.mixcloud) profileFields.social.mixcloud = req.body.mixcloud 
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube 

  Profile.findOne({ user: req.user.id })
  .then(profile => {
    if(profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true } 
      ).then(profile => res.json(profile)) 
    } else {
      // Create

      // Check if handle exists 
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if(profile) {
          errors.handle = 'That username already exists'
          res.status(400).json(errors) 
        }

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile))
      })
    }
  })
}) 

// @route        POST api/profile/venues
// @description  Add upcoming venues to profile
// @access       Private
router.post('/venues', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateVenuesInput(req.body) 

  // Check Validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors) 
  }
  
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newVenue = {
      title: req.body.title,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description
    }

    // Add to venues array
    profile.venues.unshift(newVenue) 
    profile.save().then(profile => res.json(profile)) 
  })
})


// @route        DELETE api/profile/venues/:venue_id
// @description  Delete venue from profile
// @access       Private
router.delete('/venues/:venue_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.venues.map(item => item.id).indexOf(req.params.venue_id) 

    // Splice out of array
    profile.venues.splice(removeIndex, 1) 

    // Save
    profile.save().then(profile => res.json(profile))  
  }).catch(err => res.status(404).json(err)) 
})


// @route        DELETE api/profile
// @description  Delete user and profile
// @access       Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }))
  })
})



module.exports = router  