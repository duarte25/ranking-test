import { PhotoService } from '../services/photoService';
import { sendResponse } from '../utils/messages';
import { Request, Response } from 'express';

export default class PhotosController {
  static async uploadFotoPerfil(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ message: 'Nenhuma imagem enviada' });
      return;
    }

    if (Array.isArray(req.files) && req.files.length > 1) {
      sendResponse(res, 400, { message: 'Apenas uma imagem pode ser enviada por vez' });
      return;
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const result = await PhotoService.createPhoto(fileBuffer, mimeType);

    const { imagem, ...resultWithoutImage } = result;

    sendResponse(res, 200, { data: resultWithoutImage });
  }

  static async updateFotoPerfil(req: Request, res: Response): Promise<void> {

    const id = req.params.id; // ID da foto a ser atualizada

    if (!req.file) {
      sendResponse(res, 400, { message: 'Nenhuma imagem enviada' });
      return;
    }

    if (Array.isArray(req.files) && req.files.length > 1) {
      sendResponse(res, 400, { message: 'Apenas uma imagem pode ser enviada por vez' });
      return;
    }

    const fileBuffer = req.file.buffer; // Buffer da imagem
    const mimeType = req.file.mimetype; // Tipo MIME da imagem

    // Atualiza a foto no banco de dados
    const updatedPhoto = await PhotoService.updatePhoto(id, fileBuffer, mimeType);

    // Remove o atributo "imagem" do resultado
    const { imagem, ...resultWithoutImage } = updatedPhoto;

    // Envia a resposta sem o atributo "imagem"
    sendResponse(res, 200, { data: resultWithoutImage });

  }

  static async getPhotoPerfil(req: Request, res: Response): Promise<void> {

    const id = req.params.id;

    const photo = await PhotoService.findPhoto(id);

    const imageBuffer = Buffer.from(photo.imagem);

    res.set('Content-Type', photo.tipo_mime || "image/jpeg");

    sendResponse(res, 200, imageBuffer);

  }

  static async deletePhoto(req: Request, res: Response) {
    const { id } = req.params;

    const photo = await PhotoService.deletePhoto(id);

    const { imagem, ...resultWithoutImage } = photo;

    sendResponse(res, 200, { data: resultWithoutImage });
  }
}