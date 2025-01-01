import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug, saveUploadCover } from "../services/userService";
import { checkIfFileExists, removeFileFromFolder } from "../utils/multer";

export const uploadCover = async (req: ExtendedRequest, res: Response) => {
    const file = req.file?.filename;
    if (!file) {
        res.status(500).json({ error: "Erro ao fazer upload do arquivo." });
        return;
    }
    const user = await findUserBySlug(req.userSlug as string);
    const hasFile = await checkIfFileExists(user?.cover as string);
    if (hasFile) {
        await removeFileFromFolder(hasFile);
    }

    await saveUploadCover(user?.slug as string, file);

    res.status(200).json({});
    return;
}