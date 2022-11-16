"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    tempVideoSave(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.userFolder(userId);
            const archiveName = this.generarName(file.name);
            file.mv(`${path}/${archiveName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarName(original) {
        const arrayName = original.split('.');
        const extension = arrayName[arrayName.length - 1];
        const uniqueId = (0, uniqid_1.default)();
        return `${uniqueId}.${extension}`;
    }
    userFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const exists = fs_1.default.existsSync(pathUser);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    sendVidtoPost(userId) {
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const videosTemp = this.obtenerTempVid(userId);
        videosTemp.forEach(video => {
            fs_1.default.renameSync(`${pathTemp}/${video}`, `${pathPost}/${video}`);
        });
        return videosTemp;
    }
    obtenerTempVid(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getVideoUrl(userId, vid) {
        const pathVideo = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', vid);
        const exists = fs_1.default.existsSync(pathVideo);
        if (!exists) {
            return path_1.default.resolve(__dirname, '../assets/default.png');
        }
        return pathVideo;
    }
}
exports.default = FileSystem;
