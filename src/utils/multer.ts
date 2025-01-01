import fs from 'fs';
import { unlink } from "fs";
import multer from 'multer';
import path from "path";

export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '../../public/uploads')); // Caminho absoluto
        },
        filename: (req, file, cb) => {
            // Adiciona timestamp para evitar conflitos de nome
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
    }),
});

export const checkIfFileExists = async (file: string) => {
    const getFileName = file.split('/');
    const dir = path.join(__dirname, '../../public');
    if (fs.existsSync(dir + '/' + getFileName[getFileName.length - 1])) {
        return getFileName[getFileName.length - 1];
    }
    return '';
}
export const removeFileFromFolder = async (file: string) => {
    const dir = path.join(__dirname, '../../public');
    unlink(dir + '/' + file, (err) => {
        if (err) throw err;
    });
}