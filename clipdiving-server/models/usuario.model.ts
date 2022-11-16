import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    avatar: {
        type: String,
        default: 'default1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
});

usuarioSchema.method('compararPassword', function(password: string = ''): boolean {
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
});

export interface IUsuario extends Document {
    nombre: string;
    avatar: string;
    email: string;
    password: string;
    compararPassword (password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);