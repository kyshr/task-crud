import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/jwtHelper";
import User from "../user/user.model";

// Facebook signup or login
export const authenticateFacebook = async (req: Request | any, res: Response, next: NextFunction) => {
    const {
        _json: { email, name, picture, id }
    } = req.user;

    console.log("JSON", req.user);

    let token: string = "";
    const userExist = await User.findOne({ facebookId: id });

    if (userExist && !userExist.status) {
        const error: string = "Account was soft deleted";
        return res.redirect(`http://localhost:3000?facebookAuthSuccess=false&error=${error}`);
    }

    if (userExist && userExist.status) {
        token = generateToken({ _id: userExist._id });
        return res.redirect(`http://localhost:3000?facebookAuthSuccess=true&token=${token}`);
    }

    const data = {
        fullname: name ?? "",
        facebookId: id
    };

    const newUser = await User.create(data);

    if (newUser) {
        token = generateToken({ _id: newUser._id });
        return res.redirect(`http://localhost:3000?facebookAuthSuccess=true&token=${token}`);
    }
};

export const authenticateFacebookFailure = async (req: Request | any, res: Response, next: NextFunction) => {
    return res.redirect(`http://localhost:3000?facebookAuthSuccess=false`);
};
