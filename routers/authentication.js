import express from "express";

const route = express.Router()

import AuthenticationController from "../controllers/AuthenticationController.js";
import {authenticationMiddleware} from "../middleware/authenticationMiddleware.js";

let authentication = new AuthenticationController()

route.post('/signup', authentication.registration)
route.post('/signin', authentication.signIn)
route.post('/verify-otp', authentication.verifyOtp)
route.post('/resend-otp', authentication.resendOtp)
route.post('/forgot-password', authentication.forgotPassword)
route.post('/reset-password', authentication.resetPassword)
route.get('/logout', authentication.logout)
route.post('/change-password', authenticationMiddleware, authentication.changePassword)
// route.post('/social-login', authentication.socialLogin)

export default route
