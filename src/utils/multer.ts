import fs from 'fs';
import { unlink } from "fs";
import path from "path";

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