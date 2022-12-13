import Server from './classes/server';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';

const server = new Server();

server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json() );

server.app.use(fileUpload({useTempFiles: true}));

server.app.use(cors({origin: true, credentials: true}));

server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

mongoose.connect('mongodb+srv://NerFerM:W8zlvLodnZDPk8lk@clipdiving.c2i7ngo.mongodb.net/clipdiving?retryWrites=true&w=majority', (err) => {
    if (err) throw err;
    console.log('Base de datos funciona');
});

server.start(() => {
    console.log('Servidor funcionando en puerto', server.port);
});