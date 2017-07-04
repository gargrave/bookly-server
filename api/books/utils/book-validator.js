'use strict'

const Joi = require('joi')

const baseValidator = {
  id: Joi.number().integer(),
  authorId: Joi.number().integer().min(1).required(),
  title: Joi.string().max(255).required()
}

module.exports = {
  create: Joi.object(baseValidator)
}
