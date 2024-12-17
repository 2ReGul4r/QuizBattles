import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, email, username, isAdmin, daysToExpire, res) => {
    const token = jwt.sign({userID, email, username, isAdmin}, process.env.JWT_SECRET, {expiresIn: `${daysToExpire}d`});

    const cookieAge = daysToExpire * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * milliseconds

    res.cookie("userjwt", token, {
        maxAge: cookieAge,
        httpOnly: false,
        sameSite: "Lax",
        secure: process.env.NODE_ENV !== "development",
        path: "/"
    });
};

export default generateTokenAndSetCookie;
