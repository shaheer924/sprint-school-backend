import AppError from "../utils/AppError.js";

class BaseController {
    constructor(model, repos, validation) {
        this.model = model;
        this.repos = repos;
        this.validator = validation
    }

    getAll = async (req, res, next) => {
        try {
            let data = await this.model.find(req.query)

            return this.apiResponse(res, 'Records fetched successfully', 200, data)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }
    createRecord = async (req, res, next) => {
        try {
            let body = await this.validator.createRecord.validateAsync(req.body)

            let data = await this.model.create(body)

            return this.apiResponse(res, "Record created successfully", 201, data)
        } catch (e) {
            console.log(e)
            return next(new AppError(e.message, 500, e))
        }
    }
    createManyRecord = (req, res, next) => {
        try {

        } catch (e) {
            return next(new AppError(e.message, 400))
        }
    }
    getById = async (req, res, next) => {
        try {
            let {id} = req.params

            let data = await this.model.findById(id)

            return this.apiResponse(res, "Record fetched successfully", 200, data)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }
    updateRecord = async (req, res, next) => {
        try {
            let {id} = req.params

            let data = await this.model.findByIdAndUpdate(id, req.body, {new: true})

            return this.apiResponse(res, "Record fetched successfully", 200, data)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }
    deleteRecord = async (req, res, next) => {
        try {
            let {id} = req.params

            let data = await this.model.findByIdAndDelete(id)

            return this.apiResponse(res, "Record fetched successfully", 200, data)
        } catch (e) {
            return next(new AppError(e.message, 500, e))
        }
    }

    apiResponse = (res, message, statusCode = 200, data, pagination = undefined, token = undefined) => {
        res.status(statusCode).json({
            message,
            status: true,
            data,
            pagination,
            token: token ? `Bearer ${token}` : token
        })
    }
}

export default BaseController