import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		// console.log(req);
		if (!token) {
			return res.status(401).send({
				message: "Unathorized",
			});
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).send({
				message: "invalid token",
			});
		}
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(404).send({
				message: "user not found",
			});
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error, "error in protect Route");
	}
};
