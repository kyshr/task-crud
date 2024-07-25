import Joi from "joi";
import { validatePassword } from "./user.controller";

export const createUserCommonSchema = Joi.object({
    domain: Joi.string().trim().required().label("Domain"),
    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
    username: Joi.string().trim().required().label("Username"),
    password: Joi.string()
        .trim()
        .required()
        .custom((value, helper) => {
            if (!validatePassword(value)) {
                return helper.message({
                    custom: "Password must have at least eight characters, one lowercase letter, one uppercase letter, one special character, and one number."
                });
            }

            return true;
        })
        .label("Password"),
    contactNumber: Joi.string()
        .regex(/^[0-9]{11}$/)
        .messages({ "string.pattern.base": `Contact number should contain numbers only and must have 11 digits.` })
        .required()
        .label("Contact Number"),
    fullname: Joi.string().trim().required().label("Fullname")
});

export const loginUserByCredentialsSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
    password: Joi.string().trim().required().label("Password")
});

export const getUserByIdSchema = Joi.object({
    userId: Joi.string().trim().required()
});

export const updateUserSchema = Joi.object({
    userId: Joi.string().trim().required().label("userId"),
    domain: Joi.string().trim().allow(null, "").label("Domain"),
    email: Joi.string().trim().allow(null, "").label("Email"),
    username: Joi.string().trim().allow(null, "").label("Username"),
    password: Joi.string().trim().allow(null, "").label("Password"),
    fullname: Joi.string().trim().allow(null, "").label("Fullname"),
    status: Joi.boolean().valid(true, false).label("Status")
});

export const deleteUserSchema = Joi.object({
    userId: Joi.string().trim().required().label("userId"),
    isPermanent: Joi.boolean().label("isPermanent")
});
