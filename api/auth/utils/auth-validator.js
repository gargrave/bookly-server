'use strict'

const Joi = require('joi')

const val = {
  // email must be valid
  email: {
    email: Joi.string()
      .trim()
      .email()
      .required()
  },

  // password must match length and regex
  password: {
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
  },

  // password confirm must match password
  passwordConfirm: {
    passwordConfirm: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({
        language: {
          any: { allowOnly: 'Passwords do not match.' }
        }
      })
  },

  // token, for use in routes that require it (e.g. password reset)
  token: {
    token: Joi.string().required()
  }
}

module.exports = {
  register: Joi.object(Object.assign({},
    val.email,
    val.password,
    val.passwordConfirm
  )),

  login: Joi.object(Object.assign({},
    val.email,
    val.password
  )),

  passwordResetRequest: Joi.object(Object.assign({},
    val.email
  )),

  passwordReset: Joi.object(Object.assign({},
    val.token,
    val.password,
    val.passwordConfirm
  ))
}
