"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
mongoose_1.default.connect('mongodb+srv://NerFerM:<password>@clipdiving.c2i7ngo.mongodb.net/clipdiving?retryWrites=true&w=majority', (err) => {
    if (err)
        throw err;
    console.log('Base de datos funciona');
});
server.start(() => {
    console.log('Servidor funcionando en puerto', server.port);
});
