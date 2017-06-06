'use strict'

const Joi = require('joi')

module.exports = {
  onCreate: Joi.object({
    // email must be valid
    email: Joi.string().email().required(),

    // password must be only alphanum with special chars
    password: Joi.string()
      .regex(/[\w\d!@#$%^&*]+/)
      .min(6).max(72)
      .required(),

    // password confirm must match password
    passwordConfirm: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({
        language: {
          any: { allowOnly: 'Passwords do not match.' }
        }
      })
  })
}
