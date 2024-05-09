import BaseController from "./BaseController.js";
import Users from '../models/Users.js';
import AppError from "../utils/AppError.js";
import AuthenticationValidation from '../validators/AuthenticationValidation.js'
import {JwtDecode, JwtSignature, otpVerification} from "../services/authenticationServices.js";
import appError from "../utils/AppError.js";
import bcrypt from "bcryptjs";

class AuthenticationController extends BaseController {
    constructor() {
        super(Users)
    }

    registration = async (req, res, next) => {
        try {
            let body = await AuthenticationValidation.signupValidation.validateAsync(req.body)

            let userFind = await Users.findOne({email: body?.email})

            if (userFind) return next(new AppError('Email already exist', 400))

            let otp = '1234' || Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            // Email.userVerificationEmail(body?.email, otp)

            let user_data = {
                otpCode: otp,
                otpCodeExpires: new Date(new Date().getTime() + 60000),
                otpVerified: false,
                ...body
            }

            let data = await Users.create(user_data)

            let token = await JwtSignature(data?._id)

            this.apiResponse(res, 'User registered successfully', 201, data, undefined, token)
        } catch (e) {
            return next(new AppError(e.message, 400, e))
        }
    }

    signIn = async (req, res, next) => {
        try {
            let body = await AuthenticationValidation.signinValidation.validateAsync(req.body)

            let user = await Users.findOne({email: body?.email}).select('+password')

            if (!user) return next(new AppError('No user found with this email', 404))

            if (!user?.isVerified) return next(new AppError('Please verify you account.', 400))

            let compare = await user.comparePassword(body?.password, user?.password)

            if (!compare) return next(new AppError('Password is not correct', 400))

            let token = await JwtSignature(user?._id)

            await this.model.findOneAndUpdate({_id: user?._id}, {isLoggedOut: false})

            this.apiResponse(res, 'User successfully signed in', 200, user, undefined, token)
        } catch (e) {
            console.log(e)
            return next(new AppError(e.message, 400, e))
        }
    }

    verifyOtp = async (req, res, next) => {
        try {
            let body = await AuthenticationValidation.verifyUserValidation.validateAsync(req.body)

            let user = await this.model.findOne({email: body?.email})

            if (!user) return next(new AppError('No user found with this email', 404))

            if (user?.isVerified) return next(new AppError('User already verified', 400))

            let verify;

            verify = otpVerification(body?.otp, user?.otpCode)

            if (!verify) return next(new AppError('Invalid otp code entered.', 400))

            if (user?.otpVerified) return next(new AppError('Otp already verified', 400))

            let expire_date = new Date(user?.otpCodeExpires)
            let date_now = new Date(Date.now())

            if (date_now > expire_date) return next(new AppError('Otp verification time expired.', 400))

            let updatedUser

            // const createCustomer = await Stripe.customers.create({
            //     email: user?.email,
            // })
            updatedUser = await this.model.findOneAndUpdate({email: body?.email}, {
                isVerified: true,
                otpVerified: true,
                otpCode: null,
                otpCodeExpires: null,
                // stripe_id: createCustomer?.id
            }, {new: true})

            this.apiResponse(res, 'Otp code verification successful', 200, updatedUser)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }

    resendOtp = async (req, res, next) => {
        try {
            // let body = await AuthenticationValidation.resendOtp.validateAsync(req.body)
            let body = req.body
            let user = await this.model.findOne({email: body?.email})

            if (!user) return next(new AppError('No user found with this email', 404))

            if (user?.isVerified) return next(new AppError('User already verified', 400))

            let otp = '1234' || Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            // Email.userVerificationEmail(body?.email, otp)

            let updatedUser = await this.model.findOneAndUpdate({email: body?.email}, {
                otpCode: otp,
                otpCodeExpires: new Date(new Date().getTime() + 60000),
                otpVerified: false
            }, {new: true})

            this.apiResponse(res, 'Otp send to your email', 200, updatedUser)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }

    forgotPassword = async (req, res, next) => {
        try {
            let body = await AuthenticationValidation.forgotPasswordValidation.validateAsync(req.body)

            let user = await this.model.findOne({email: body?.email})

            if (!user) return next(new AppError('No user found with this email', 404))

            let otp = '1234' || Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            // Email.resetPasswordOtp(body?.email, otp)

            await this.model.findOneAndUpdate({email: body?.email}, {
                otpCode: otp,
                otpCodeExpires: new Date(new Date().getTime() + 60000),
                otpVerified: false,
                isVerified: false
            })

            this.apiResponse(res, 'Otp send to your email', 200, {email: user?.email})
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            let body = await AuthenticationValidation.resetPasswordValidation.validateAsync(req.body)

            let user = await this.model.findOne({email: body?.email})

            if (!user) return next(new AppError('No user found with this email', 404))

            if (!user.isVerified) return next(new AppError('Otp is not verified', 400))

            user.password = body?.password
            user.confirmPassword = body?.confirmPassword
            user.passwordChangeAt = new Date()

            await user.save();

            this.apiResponse(res, 'Password successfully reset', 200, user)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }

    changePassword = async (req, res, next) => {
        try {
            // passwords fetching from request body
            let {password, newPassword, confirmPassword} = req.body
            let user = req?.user

            // User find by user id
            let data = await this.model.findById(user?._id).select("password")

            console.log(password, data?.password)
            let comparePassword = await bcrypt.compare(password, data?.password)

            if (!comparePassword) return next(new appError("Current password is not correct", 400))

            if (newPassword !== confirmPassword) return next(new AppError("New password and confirm password are not same", 400))

            // hash password with salt 10
            let generateHash = await bcrypt.hash(newPassword, 10)

            // update password in user
            await this.model.findOneAndUpdate({_id: user?._id}, {
                password: generateHash
            })

            let userFind = await this.model.findOne({
                _id: req?.user?._id
            })

            // response
            return this.apiResponse(res, 'Password changed successfully', 200, userFind)
        } catch (e) {
            // error handling
            return next(new AppError(e.message, 500))
        }
    }

    logout = async (req, res, next) => {
        try {
            let token = req.headers.authorization.split(' ')[1]

            let {id} = JwtDecode(token)

            let data = await Users.findByIdAndUpdate(id, {
                isLoggedOut: true
            }, {new: true})

            this.apiResponse(res, 'User successfully logout', 200, data)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }
}

export default AuthenticationController
