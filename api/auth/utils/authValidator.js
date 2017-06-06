'use strict'

const Joi = require('joi')

const baseValidator = {
  // email must be valid
  email: Joi.string()
    .trim()
    .email()
    .required(),

  // password must be only alphanum with special chars
  password: Joi.string()
    .trim()
    .regex(/^[\w\d!@#$%^&*_]+$/)
    .min(6).max(72)
    .required()
    .options({
      language: {
        string: {
          regex: { base: 'Password contains illegal characters.' }
        }
      }
    })
}

module.exports = {
  onRegister: Joi.object(Object.assign({},
    baseValidator, {
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
  ),

  onLogin: Joi.object(baseValidator)
}
