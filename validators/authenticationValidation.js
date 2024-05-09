import Joi from "joi";

const signupValidation = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string(),
    phone: Joi.string().required(),
    dialCode: Joi.string(),
    countryCode: Joi.string(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    deviceType: Joi.string(),
    deviceToken: Joi.string()
})

const signinValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    deviceType: Joi.string(),
    deviceToken: Joi.string()
})

const verifyUserValidation = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
    otp: Joi.string(),
})

const socialLoginValidation = Joi.object({
    socialToken: Joi.string(),
    socialType: Joi.string(),
    deviceToken: Joi.string(),
    deviceType: Joi.string(),
    phone: Joi.string(),
    dialCode: Joi.string(),
    countryCode: Joi.string(),
    email: Joi.string()
})

const forgotPasswordValidation = Joi.object({
    email: Joi.string()
})

const resetPasswordValidation = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    confirmPassword: Joi.string()
})

export default {
    signupValidation,
    signinValidation,
    verifyUserValidation,
    resetPasswordValidation,
    socialLoginValidation,
    forgotPasswordValidation
}