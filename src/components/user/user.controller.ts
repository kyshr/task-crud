import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import {
    createUserCommonSchema,
    deleteUserSchema,
    loginUserByCredentialsSchema,
    updateUserSchema
} from "./user.schema";
import { extractErrorMessage } from "../../utils/extractJoiError";
import User from "./user.model";
import { generateToken } from "../../utils/jwtHelper";

/*
 * Extra Handlers
 */
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.query.userId });

        if (user) {
            return jsonResponse(res, { status: 200, message: "User fetched successfully", data: user });
        }
        return next(errorResponse(400, "User not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        if (users) {
            return jsonResponse(res, { status: 200, message: "Users fetched successfully", data: users });
        }
        return next(errorResponse(400, "No users found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Get user by Id
 * @route GET /api/users?userId=id
 * @params QUERY userId:string
 *
 * Get users
 * @route GET /api/users
 */

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    if (userId) {
        return getUserById(req, res, next);
    }

    return getUsers(req, res, next);
};

/*
 * Get user by bearer token
 * @route GET /api/users/byToken
 */

export const getUserByToken = async (req: Request, res: Response, next: NextFunction) => {
    return jsonResponse(res, { status: 200, message: "User fetched successfully", data: { user: req.user } });
};

/*
 * Register or create new user global
 * @route POST /api/users
 * @params BODY createUserSchema
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = createUserCommonSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages: object = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        // Email must be unique
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return next(errorResponse(400, "Email already taken by another user"));
        }

        // Username must be unique
        const usernameExists = await User.findOne({ username: req.body.username, domain: req.body.domain });
        if (usernameExists) {
            return next(errorResponse(400, "Username already taken by another user"));
        }

        // //Check if password is valid
        // const validPwd = validatePassword(req.body.password);
        // if (!validPwd) {
        //     return next(
        //         errorResponse(
        //             400,
        //             "Password must have at least eight characters, one lowercase letter, one uppercase letter, one special character, and one number."
        //         )
        //     );
        // }

        const newUser = await User.create(req.body);

        if (newUser) {
            const token: string = generateToken({ _id: newUser._id });
            return jsonResponse(res, {
                status: 201,
                message: "User created successfully",
                data: {
                    newUser,
                    token
                }
            });
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Login user by email and password
 * @route POST /api/users/login
 * @params BODY loginUserByCredentialsSchema
 */
export const loginUserByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginUserByCredentialsSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages: object = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const validPassword = await user.isValidPassword(req.body.password);

            if (validPassword) {
                const token: string = generateToken({ _id: user._id });
                return jsonResponse(res, { status: 200, message: "Login successful", data: { token, user } });
            }

            return next(errorResponse(401, "Invalid email or password"));
        }
        return next(errorResponse(401, "Account doesn't exist"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Update user
 * @route PUT /api/users
 * @params updateUserSchema
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages: object = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.body.userId;
        delete req.body._id;

        const updatedUser = await User.findOneAndUpdate({ _id: id, status: true }, req.body, { new: true });

        if (updatedUser) {
            return jsonResponse(res, { status: 200, message: "User updated successfully", data: updatedUser });
        }

        return next(errorResponse(400, "User not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Delete/Soft Delete user
 * @route DELETE /api/users
 * @params updateUserSchema
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = deleteUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages: object = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.body.userId;

        let deletedUser;

        if (req.body.isPermanent) {
            deletedUser = await User.findOneAndDelete({ _id: id });
        } else {
            deletedUser = await User.findOneAndUpdate({ _id: id }, { status: false }, { new: true });
        }

        if (deletedUser) {
            return jsonResponse(res, { status: 200, message: "User deleted successfully", data: deletedUser });
        }

        return next(errorResponse(400, "User not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

// Validate password characters
export const validatePassword = (password: string) => {
    // Regular expressions for the required characters
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasEightCharacters = password.length >= 8;

    // Check all conditions
    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && hasEightCharacters;
};
