import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { findUserBySlug } from "../services/userService";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = ({ slug }: { slug: string }) => {
    return jwt.sign({ slug }, process.env.JWT_SECRET as string);
}

export const verifyJTW = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(201).json({ error: "Acesso negado" });
        return;
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (error, decoded: any) => {
            if (error) {
                res.status(201).json({ error: "Acesso negado" });
                return;
            }
            const user = await findUserBySlug(decoded.slug)
            if (!user) {
                res.status(201).json({ error: "Acesso negado" });
                return;
            }
            req.userSlug = user.slug;
            next();
        }
    );

}