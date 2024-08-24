import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, daysToExpire, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: `${daysToExpire}d`});

    const cookieAge = daysToExpire * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * milliseconds

    res.cookie("userjwt", token, {
        maxAge: cookieAge,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
};

export default generateTokenAndSetCookie;
