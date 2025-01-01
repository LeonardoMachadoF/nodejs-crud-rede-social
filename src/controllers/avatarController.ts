import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug, saveUploadAvatar } from "../services/userService";
import { checkIfFileExists, removeFileFromFolder } from "../utils/multer";

export const uploadAvatar = async (req: ExtendedRequest, res: Response) => {
    const file = req.file?.filename;
    if (!file) {
        res.status(500).json({ error: "Erro ao fazer upload do arquivo." });
        return;
    }
    const user = await findUserBySlug(req.userSlug as string);
    const hasFile = await checkIfFileExists(user?.avatar as string);
    if (hasFile) {
        await removeFileFromFolder(hasFile);
    }

    await saveUploadAvatar(user?.slug as string, file);

    res.status(200).json({});
    return;
}