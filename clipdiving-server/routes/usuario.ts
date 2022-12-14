import { Router, Request, Response } from "express";
import { Usuario, IUsuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({email: req.body.email}, (err: any, userDB: IUsuario) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDB._id, nombre: userDB.nombre, email: userDB.email, avatar: userDB.avatar
            });
            res.json({
                ok: true, token: tokenUser
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
    })
});

userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre, avatar: req.body.avatar, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)
    };
    Usuario.create(user).then(userDB => {
        const tokenUser = Token.getJwtToken({
            _id: userDB._id, nombre: userDB.nombre, email: userDB.email, avatar: userDB.avatar
        });
        res.json({
            ok: true, token: tokenUser
        });
    }).catch (err => {
        res.json({
            ok: false, err
        });
    });
});

userRoutes.post('/update', verificaToken, (req: any, res: Response) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }
    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No hay usuarios con este ID'
            });
        }
        const tokenUser = Token.getJwtToken({
            _id: userDB._id, nombre: userDB.nombre, email: userDB.email, avatar: userDB.avatar
        });
        res.json({
            ok: true, token: tokenUser
        });
    });
});

userRoutes.get('/',[verificaToken],(req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true, usuario
    });
});

export default userRoutes;