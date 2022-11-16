import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    constructor() {};

    tempVideoSave (file: FileUpload, userId: string) {
        return new Promise<void> (( resolve, reject ) => {
            const path = this.userFolder(userId);
            const archiveName = this.generarName(file.name);
            file.mv(`${path}/${archiveName}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private generarName (original: string) {
        const arrayName = original.split('.');
        const extension = arrayName[arrayName.length -1];
        const uniqueId = uniqid();
        return `${uniqueId}.${extension}`;
    }

    private userFolder (userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const exists = fs.existsSync(pathUser);
        if (!exists) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    sendVidtoPost (userId: string) {
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }
        const videosTemp = this.obtenerTempVid(userId);
        videosTemp.forEach(video => {
            fs.renameSync(`${pathTemp}/${video}`, `${pathPost}/${video}`)
        });
        return videosTemp;
    }

    private obtenerTempVid (userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }

    getVideoUrl (userId: string, vid: string) {
        const pathVideo = path.resolve(__dirname, '../uploads', userId, 'posts', vid);
        const exists = fs.existsSync(pathVideo);
        if (!exists) {
            return path.resolve(__dirname, '../assets/default.png');
        }
        return pathVideo;
    }
}