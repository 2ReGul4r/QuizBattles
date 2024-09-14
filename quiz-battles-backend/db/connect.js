import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:sxKg8N2SN7fPQZ7UazJoKe7WLKMNaOUVEWeITiyEvxQoyaOJ@quizbattles-cluster.olr9e.mongodb.net/quiz-battles?retryWrites=true&w=majority&appName=QuizBattles-Cluster");
        console.log("Connected to Database.");
    } catch (error) {
        console.log("Error while trying to connected to Database.", error.message);
    }
}

export default connectDB;
