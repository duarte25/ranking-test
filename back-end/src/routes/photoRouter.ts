import { handleMulterErrors } from '../middlewares/handleErrorMulter';
import photosController from '../controllers/photoController';
import { wrapException } from '../utils/wrapException';
import upload from '../middlewares/upload';
import express from 'express';

const router = express.Router();

// Definindo a rota para listar todos os fotos
router
  .post('/photos', upload.single('imagem'), wrapException(photosController.uploadFotoPerfil))
  .get('/photos/:id', wrapException(photosController.getPhotoPerfil))
  .patch('/photos/:id', upload.single('imagem'), wrapException(photosController.updateFotoPerfil))
  .delete('/photos/:id', wrapException(photosController.deletePhoto));

// Middleware de erro para capturar erros do Multer
router.use(handleMulterErrors);

export default router;