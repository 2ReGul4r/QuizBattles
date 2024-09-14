import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, email, username, isAdmin, daysToExpire, res) => {
    const token = jwt.sign({userID, email, username, isAdmin}, "mJ3huG1vm70RAD66tpjYmc/xVNmEb4PGZtls7jMzdAc=", {expiresIn: `${daysToExpire}d`});

    const cookieAge = daysToExpire * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * milliseconds

    res.cookie("userjwt", token, {
        maxAge: cookieAge,
        httpOnly: false,
        sameSite: "strict",
        secure: t,
        path: "/"
    })
};

export default generateTokenAndSetCookie;
