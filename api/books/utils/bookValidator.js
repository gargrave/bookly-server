'use strict'

const Joi = require('joi')

const baseValidator = {
  authorId: Joi.number().integer().min(1).required(),
  title: Joi.string().max(255).required()
}

module.exports = {
  onCreate: Joi.object(baseValidator)
}
