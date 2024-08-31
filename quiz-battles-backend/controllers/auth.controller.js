import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/jwttoken.js";

const passwordMinLength = 8;

export const signup = async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({error: "Passwords do not match"});
        }

        if (password.length < passwordMinLength) {
            return res.status(400).json({error: "Password is too short! (8 characters minimum)"});
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({error: "Email is not valid"});
        }

        if (validator.isEmail(username)) {
            return res.status(400).json({error: "Username cannot be an email"});
        }

        const user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if(user) {
            return res.status(400).json({error: "Email or username does already exist!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            isAdmin: false
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, newUser.email, newUser.username, newUser.isAdmin, 30, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                isAdmin: newUser.isAdmin
            })
        } else {
            res.status(400).json({error: "Invalid user-data!"})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const login = async (req, res) => {
    try {
        const { userIdentifier, password } = req.body;

        const user = await User.findOne({
            $or: [
                { username: userIdentifier },
                { email: userIdentifier }
            ]
        });

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid credentials!"});
        }

        generateTokenAndSetCookie(user._id, user.email, user.username, user.isAdmin, 30, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }

};

export const logout = (req, res) => {
    try {
        res.cookie("userjwt", "deleted", {
            maxAge: 0,
            httpOnly: false,
            sameSite: "Lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/"
        })
        res.status(200).json({message: "Logged out successfully!"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
