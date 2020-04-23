const router = require('express').Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const keys = require('../../config/keys')
const Mailer = require('../../services/Mailer')
const updateTemplate = require('../../services/email_templates/updateTemplate')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const User = require('../../models/User')
const Token = require('../../models/Token')

// @route     POST api/users/confirm
// @desc      Confirm email address
// @access    Public
router.post('/confirm', async (req, res) => {
  try {
    const response = await Token.findOne({ token: req.body.token })
    const user = await User.findById(response._userId)
    if (!user) throw new Error('User not found')
    user.isVerified = true
    await user.save()
    return res.status(200).json({
      _id: user.id,
      email: user.email,
      handle: user.handle,
      isVerified: user.isVerified
    })
  } catch (err) {
    throw err
  }
})

// @route         POST api/users/reconfirm-email
// @description   Resend email confirmation
// @access        Public
router.post('/reconfirm-email', async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body)
    if (!isValid) return res.status(400).json(errors)
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, async (error, hash) => {
          if (error) throw error
          user.password = hash
          const num = Math.floor(Math.random() * 10000000000 + 1)
          const token = new Token({
            _userId: user._id,
            token: num
          })
          await token.save()
          const emailInfo = {
            subject: 'Confirm your email',
            body: "Click on the link below to conifrm your email.",
            recipients: email,
            token: token.token
          }
          const mailer = new Mailer(emailInfo, updateTemplate(emailInfo))
          await mailer.send()
          return res.status(201).json(true)
        })
      })
    } else {
      errors.password = 'Password incorrect'
      return res.status(401).json(errors)
    }
  } catch (error) {
    throw error
  }
})


// @route         POST api/users/register
// @description   Register a user
// @access        Public
router.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body)
    const { name, handle, email, password } = req.body

    if (!isValid) {
      return res.status(400).json(errors)
    }

    const user = await User.findOne({ email })

    if (user) {
      errors.email = 'Email already exists'
      return res.status(400).json(errors)
    }

    const avatar = gravatar.url(email, {
      s: '200', // Size
      r: 'pg', // rating
      d: 'mm' // default
    })
    const newUser = new User({
      name: name.trim(),
      handle: handle[0] === '@' ? handle.slice(1).trim() : handle.trim(),
      email: email.trim(),
      avatar: req.body.avatar ? req.body.avatar : avatar,
      password: password.trim()
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (error, hash) => {
        if (error) throw error
        newUser.password = hash
        const savedUser = await newUser.save()
        const num = Math.floor(Math.random() * 10000000000 + 1)
        const token = new Token({
          _userId: savedUser._id,
          token: num
        })
        await token.save()
        const emailInfo = {
          subject: 'Confirm your email',
          body: "Click on the link below to conifrm your email.",
          recipients: email,
          token: token.token
        }
        const mailer = new Mailer(emailInfo, updateTemplate(emailInfo))
        await mailer.send()
        return res.status(201).json(true)
      })
    })
  } catch (error) {
    throw error
  }
})

// @route         POST api/users/login
// @description   Login User / Returning JWT Token
// @access        Public
router.post('/login', async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body)
    if (!isValid) return res.status(400).json(errors)
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }
    if (!user.isVerified) {
      errors.email = 'Confirm your email'
      return res.status(401).json(errors)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        handle: user.handle,
        isAdmin: user.isAdmin
      }
      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 10800 },
        (err, token) => {
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`
          })
        }
      )
    } else {
      errors.password = 'Password incorrect'
      return res.status(401).json(errors)
    }
  } catch (err) {
    throw err
  }
})

// @route         GET api/users/current
// @description   Return current user
// @access        Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      handle: req.user.handle
    })
  }
)
module.exports = router
