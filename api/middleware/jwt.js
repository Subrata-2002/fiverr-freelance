import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {

    const token = req.cookies.acessToken;
    // console.log(token);

    if (!token) {
        return next(createError(401, "You are not authenticated.."));
    }
    

    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        

        if (err) {
            return next(createError(403, "Token is not valid"))
        }
        req.userId = payload.id;
        req.isSeller = payload.isSeller;
        // console.log("jwt userid is "+req.userId+" and "+req.isSeller);
        next()  // if we dont use next() here then would'nt able to go next function deleteuser in user.route.js
    });
}
