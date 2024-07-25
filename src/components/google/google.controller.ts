import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/jwtHelper";
import User from "../user/user.model";

// Google signup or login
export const authenticateGoogle = async (req: Request | any, res: Response, next: NextFunction) => {
    const {
        _json: { email, given_name, family_name }
    } = req.user;

    console.log("JSON", req.user._json);

    let token: string = "";
    const userExist = await User.findOne({ email: email });

    if (userExist && !userExist.status) {
        const error: string = "Account was soft deleted";
        return res.redirect(`http://localhost:3000?googleAuthSuccess=false&error=${error}`);
    }

    if (userExist && userExist.status) {
        token = generateToken({ _id: userExist._id });
        return res.redirect(`http://localhost:3000?googleAuthSuccess=true&token=${token}`);
    }

    const data = {
        fullname: `${given_name} ${family_name}` ?? "",
        email: email
    };

    const newUser = await User.create(data);

    if (newUser) {
        token = generateToken({ _id: newUser._id });
        return res.redirect(`http://localhost:3000?googleAuthSuccess=true&token=${token}`);
    }
};

export const authenticateGoogleFailure = async (req: Request | any, res: Response, next: NextFunction) => {
    return res.redirect(`http://localhost:3000?googleAuthSuccess=false`);
};
