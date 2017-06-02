'use strict'

const Joi = require('joi')

module.exports = {
  create: Joi.object({
    firstName: Joi.string().alphanum().max(128).required(),
    lastName: Joi.string().alphanum().max(128).required()
  })
}
