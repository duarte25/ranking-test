import { CreateUserData, ViewUserData } from "../interfaces/user";
import { paginate, PaginationOptions } from "../utils/pagination";
import { prisma } from "../config/db_config.";

export class UserRepository {

  static async listUsers(where: any, options: PaginationOptions) {

    return paginate(prisma.usuario, where, options, {
      include: {
        foto: true
      }
    });
  }

  static async createUser(userData: CreateUserData): Promise<ViewUserData> {
    const { foto_id, ...rest } = userData;

    if (process.env.NODE_ENV == 'test') {
      (rest as any).conta_ativa = true;
    }

    const userCreated = await prisma.usuario.create({
      data: {
        ...rest,
        foto: foto_id
          ? { connect: { id: foto_id } } // Conectar ao grupo pelo ID
          : undefined,
      }
    });

    return userCreated;
  }

  static async findUserByID(id: string): Promise<ViewUserData | null> {
    return await prisma.usuario.findUnique({
      where: { id },
      include: {
        foto: true,
      }
    });
  }

  static async alterUser(id: string, userData: Partial<CreateUserData>): Promise<ViewUserData> {

  const { foto_id, ...restUserData } = userData;

    return await prisma.usuario.update({
      where: { id },
      data: {
        ...restUserData,
        foto: userData.foto_id
          ? { connect: { id: userData.foto_id } } // Conectar ao grupo pelo ID
          : undefined,
      },
      include: {
        foto: true,
      }
    });
  }
}