import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDoc extends Document {
    isValidPassword(password: string): boolean;
    domain: string;
    email: string;
    facebookId: string;
    username: string;
    password: string;
    fullname: string;
    contactNumber: string;
    status: boolean;
}

const UserSchema = new Schema<UserDoc>(
    {
        domain: { type: String, default: null },
        email: { type: String, default: null, unique: true },
        facebookId: { type: String, default: null, unique: true },
        password: { type: String, default: null },
        username: { type: String, default: null, unique: true },
        fullname: { type: String, default: null },
        contactNumber: { type: String, default: null },
        status: { type: Boolean, default: true }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

UserSchema.pre("save", async function (next) {
    if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

export default model<UserDoc>("User", UserSchema);
