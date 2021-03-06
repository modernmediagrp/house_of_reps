const Promo = require('../models/Promo')
const validatePromoInput = require('../validation/promo')

const promoController = {
  // @route   GET api/promos
  // @desc    Get Promos
  // @access  Public
  async getPromos(_, res) {
    try {
      const promos = await Promo.find()
      return res.status(200).json(promos)
    } catch (err) {
      res.status(404).json(err)
    }
  },
  // @route   POST api/promos
  // @desc    Create a promo
  // @access  Private
  async createPromo(req, res){
    try {
      if (!req.user.isAdmin) {
        return res.status(401).json({unauthorized: 'Unauthorized!'})
      }
      const { errors, isValid } = validatePromoInput(req.body)
      if (!isValid) return res.status(400).json(errors)
      const newPromo = new Promo({
        url: req.body.url,
        image: req.body.image,
        description: req.body.description,
        type: req.body.type,
        createdBy: req.user.name
      })
      await newPromo.save()
      return res.status(201).json(newPromo)
    } catch (err) {
      res.status(400).json(err)
    }
  },
  // @route   DELETE api/promos/:id
  // @desc    Delete promo
  // @access  Private
  async deletePromo(req, res){
    try {
      if (!req.user.isAdmin) {
        return res.status(401).json({unauthorized: 'Unauthorized!'})
      }
      const promo = await Promo.findById(req.params.id)
      promo.remove()
      return res.status(200).json({ success: true })
    } catch (err) {
      res.status(404).json({ notfound: 'Promo not found!' })
    }
  }
}

module.exports = promoController