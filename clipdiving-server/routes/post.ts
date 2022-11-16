import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from "../classes/file-system";

const postRoutes = Router();
const fileSystem = new FileSystem();

postRoutes.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip*10;
    const posts = await Post.find().sort({_id: -1}).skip(skip).limit(10).populate('usuario','-password').exec();
    res.json({ok: true, pagina, posts});
});

postRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const videos = fileSystem.sendVidtoPost(req.usuario._id);
    body.vids = videos;
    Post.create(body).then(async postDB => {
        await postDB.populate('usuario','-password');
        res.json({ok: true, post: postDB });
    }).catch (err => {
        res.json(err)
    });
});

postRoutes.post('/upload',[verificaToken], async (req: any, res: Response) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido ningún archivo'
        });
    }
    const file: FileUpload = req.files.video;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido ningún vídeo'
        });
    }
    if (!file.mimetype.includes('video')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido ningún vídeo'
        });
    }
    await fileSystem.tempVideoSave(file, req.usuario._id);
    res.json({
        ok: true, file: file.mimetype
    });
});

postRoutes.get('/video/:userid/:vid', (req: any, res: Response) => {
    const userId = req.params.userid;
    const vid = req.params.vid;
    const pathVideo = fileSystem.getVideoUrl(userId, vid);
    res.sendFile(pathVideo);
});

export default postRoutes;