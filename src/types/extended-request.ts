import { Role } from "@prisma/client";
import { Request } from "express";

export type ExtendedRequest = Request & {
    userSlug?: string;
    userRole?: Role;
}