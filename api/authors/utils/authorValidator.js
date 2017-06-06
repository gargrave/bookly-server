'use strict'

const Joi = require('joi')

const baseValidator = {
  firstName: Joi.string().max(255).required(),
  lastName: Joi.string().max(255).required()
}

module.exports = {
  onCreate: Joi.object(baseValidator)
}
