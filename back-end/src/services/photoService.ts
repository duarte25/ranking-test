import { ValidationFuncs as v, Validator } from '../utils/Validation';
import { PhotoRepository } from '../repositories/photoRepository';
import { APIError } from '../utils/wrapException';
import imageType from 'image-type';

export class PhotoService {
  static async createPhoto(fileBuffer: Buffer, mimeType: string) {

    const image = await imageType(fileBuffer);
    
    if (!image) throw new APIError("Arquivo enviado não é uma imagem válida", 422)

    const newPhoto = await PhotoRepository.createPhoto(fileBuffer, mimeType);

    return newPhoto;
  }

  static async updatePhoto(id: string, fileBuffer: Buffer, mimeType: string) {

    const valor = { fileBuffer: fileBuffer, mimeType: mimeType }
    let val = new Validator(valor);

    val.body.id = id;

    await val.validate("id",
      v.prismaUUID(),
      v.exists({ model: "imagem" })
    );

    if (val.anyErrors()) throw new APIError(val.getErrors(), 404);

    const uuidPrismaTest = await v.prismaUUID({ model: "imagem" })(id, { path: "id" });

    if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

    const newPhoto = await PhotoRepository.updatePhoto(id, fileBuffer, mimeType);

    return newPhoto;

  }

  static async findPhoto(id: string) {

    const uuidPrismaTest = await v.prismaUUID({ model: "imagem" })(id, { path: "id" });

    if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

    const photo = await PhotoRepository.findPhotoID(id);

    if (!photo) throw new APIError("Imagem não encontrada.", 404)

    return photo;
  }

  static async deletePhoto(id: string) {

    const uuidPrismaTest = await v.prismaUUID({ model: "imagem" })(id, { path: "id" });

    if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

    const photo = await PhotoRepository.deletePhotoById(id);

    return photo;
  }

};