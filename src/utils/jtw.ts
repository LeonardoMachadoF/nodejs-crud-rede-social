import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { findUserBySlug } from "../services/userService";
import { ExtendedRequest } from "../types/extended-request";
import { Role } from "@prisma/client";

export const createJWT = ({ slug, role }: { slug: string, role: Role }) => {
    return jwt.sign({ slug, role }, process.env.JWT_SECRET as string);
}


export const verifyJWT = (allowedRoles: Role[] = []) => {
    allowedRoles = allowedRoles.length === 0 ? ["User"] : allowedRoles;
    return (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
                    res.status(401).json({ error: "Acesso negado" });
                    return;
                }
                const user = await findUserBySlug(decoded.slug)
                if (!user) {
                    res.status(401).json({ error: "Acesso negado" });
                    return;
                }
                req.userSlug = user.slug;
                req.userRole = user.role;

                if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                    res.status(403).json({ error: "Permissão negada" });
                    return
                }
                next();
            }
        );
    }

}