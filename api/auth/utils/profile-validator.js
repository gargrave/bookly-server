'use strict'

const Joi = require('joi')

const val = {
  firstName: Joi.string().max(255),
  lastName: Joi.string().max(255)
}

module.exports = {
  update: Joi.object(Object.assign({},
    val.firstName,
    val.lastName
  ))
}
