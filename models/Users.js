import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import validator from "validator";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'Email already exist.'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    firstName: {
        type: String,
        required: [true, 'first_name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last_name is required']
    },
    surname: {
        type: String,
    },
    images: [{
        type: String,
    }],
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8,
        maxlength: 255,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'confirm_password is required'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'password and confirm_password are not same'
        },
        select: false
    },
    otpCode: String,
    otpCodeExpires: Date,
    otpVerified: Boolean,
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangeAt: Date,
    passwordChangeVerified: Boolean,
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    stripe_id: {
        type: String
    },
    isLoggedOut: {
        type: Boolean
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    this.confirm_password = undefined
    next()
})

UserSchema.methods.comparePassword = (password, compare_password) => {
    return bcrypt.compare(password, compare_password)
}

const User = mongoose.model('users', UserSchema)

export default User

