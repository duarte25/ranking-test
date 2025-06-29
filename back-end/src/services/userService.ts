import { CreateUserData, ListUsersParams, ViewUserData } from "../interfaces/user";
import { ValidationFuncs as v, Validator } from "../utils/Validation";
import { UserRepository } from "../repositories/userRepository";
import { APIError } from "../utils/wrapException";

export class UserService {

  static async listUsers(
    params: ListUsersParams
  ) {
    const { pagina, limite, nome } = params;

    const where: Record<string, any> = {};

    if (nome) {
      where.nome = { contains: nome, mode: "insensitive" };
    }

    return await UserRepository.listUsers(where, {
      page: pagina,
      limit: limite,
      customLabels: {
        totalDocs: "resultados",
        docs: "data",
        limit: "limite",
        page: "pagina",
        totalPages: "totalPaginas",
      },
    });
  }

  static async listFirstRankUser() {

    return await UserRepository.listFirstRankUser()
  }

  static async createUser(userData: CreateUserData): Promise<ViewUserData> {

    let val = new Validator(userData);
    await val.validate("nome", v.required(), v.length({ min: 3, max: 100 }))
    await val.validate("cargo", v.required(), v.length({ min: 3, max: 100 }))

    await val.validate("foto_id", v.optional(), v.prismaUUID(), async (value: any) => {
      return v.exists({ model: "imagem" })(value, { path: "id" });
    });

    if (val.anyErrors()) throw new APIError(val.getErrors(), 422);

    const sanitizedData = val.getSanitizedBody();

    return await UserRepository.createUser(sanitizedData);
  }

  static async findUser(id: string) {

    const uuidPrismaTest = await v.prismaUUID({ model: "usuario" })(id, { path: "id" });

    if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

    const result = await UserRepository.findUserByID(id);

    if (!result) throw new APIError("Usuário não encontrado.", 404);

    return result;
  }

  static async alterUser(id: string, userData: Partial<CreateUserData>): Promise<ViewUserData> {

    let val = new Validator(userData);

    await val.validate("nome", v.optional(), v.length({ min: 3, max: 100 }))
    await val.validate("cargo", v.optional(), v.length({ min: 3, max: 100 }))

    await val.validate("foto_id", v.optional(), v.prismaUUID(), async (value: any) => {
      return v.exists({ model: "imagem" })(value, { path: "id" });
    });

    if (val.anyErrors()) throw new APIError(val.getErrors(), 422);

    const sanitizedData = val.getSanitizedBody();

    return await UserRepository.alterUser(id, sanitizedData);
  }

}