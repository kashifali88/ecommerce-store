import { errorHandler } from "../utils/errorHandler.js"


export const verifyAdmin = (req, res, next)=>{
    if (!req.user){ 
        return next(errorHandler(401, "Not authorized"))
    }
    if (req.user.role !== "admin") {
        return next(errorHandler(403, "Only admin can access"))
    }
    next();
}