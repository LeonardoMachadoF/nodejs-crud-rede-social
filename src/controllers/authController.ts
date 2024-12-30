import { RequestHandler } from "express";
import { signupSchema, validadesignupSchema } from "../schemas/signupSchema";
import { createUser, findUserByEmail, findUserBySlug } from "../services/userService";
import slug from "slug";
import { hash } from "bcrypt-ts";
import { createJWT } from "../utils/jtw";

export const signup: RequestHandler = async (req, res) => {
    const data = validadesignupSchema(req.body);
    if (data.error) {
        res.json(data);
        return;
    }

    const hasEmail = await findUserByEmail(data.email);
    if (hasEmail) {
        res.json({ error: "E-mail já existente" })
        return;
    }

    let genSlug = true;
    let userSlug = slug(data.name);
    while (genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if (hasSlug) {
            let slugSuffix = Math.floor(Math.random() * 9999).toString();
            userSlug = slug(data.name + slugSuffix);
        } else {
            genSlug = false;
        }
    }

    const hashPassword = await hash(data.password, 10);

    const newUser = await createUser({
        slug: userSlug,
        name: data.name,
        email: data.email,
        password: hashPassword
    })

    const token = createJWT({ slug: userSlug });

    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            slug: newUser.slug,
            avatar: newUser.avatar
        }
    });
}