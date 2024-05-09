import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/sprintschool")
        console.log("Database connected successfully")
    } catch (e) {
        console.log(e?.message)
    }
}

export default connectDatabase