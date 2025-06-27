import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PhotoRepository {

  static async createPhoto(fileBuffer: Buffer, mimeType: string): Promise<any> {
    return await prisma.imagem.create({
      data: {
        imagem: fileBuffer,
        tipo_mime: mimeType
      },
    });
  }

  static async updatePhoto(id: string, fileBuffer: Buffer, mimeType: string): Promise<any> {
    return prisma.imagem.update({
      where: { id },
      data: {
        imagem: fileBuffer,
        tipo_mime: mimeType,
      }
    });
  }

  static async findPhotoID(id: string): Promise<any> {
    return await prisma.imagem.findUnique({
      where: { id },
    });
  }

  static async deletePhotoById(id: string): Promise<any> {
    return prisma.imagem.delete({
      where: { id }
    });
  }

}


// Função para rodar à meia-noite e deletar imagens órfãs
export async function DeleteOrphanImages() {
  await prisma.imagem.deleteMany({
    where: {
      // Verifica se não há usuários vinculados a esta imagem
      NOT: {
        users: {
          some: {}  // Se houver algum usuário associado a esta imagem, a imagem não será deletada
        }
      }
    }
  });

  console.log('Imagens órfãs deletadas com sucesso!');
}