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

const emailVal = {
  // email must be valid
  email: Joi.string()
    .trim()
    .email()
    .required()
}

const passwordVal = {
  password: Joi.string()
    .trim()
    .regex(/^[\w\d!@#$%^&*_]+$/)
    .min(8).max(72)
    .required()
    .options({
      language: {
        string: {
          regex: { base: 'Password contains illegal characters.' }
        }
      }
    })
}

const passwordConfirmVal = {
  // password confirm must match password
  passwordConfirm: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({
      language: {
        any: { allowOnly: 'Passwords do not match.' }
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

  passwordReset: Joi.object(Object.assign({},
    { token: Joi.string().required() },
    passwordVal,
    passwordConfirmVal
  )),

  onLogin: Joi.object(baseValidator)
}
