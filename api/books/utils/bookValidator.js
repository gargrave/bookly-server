'use strict'

const Joi = require('joi')

module.exports = {
  create: Joi.object({
    authorId: Joi.number().integer().min(1).required(),
    title: Joi.string().max(255).required()
  })
}
