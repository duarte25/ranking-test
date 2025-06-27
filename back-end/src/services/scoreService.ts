import { ScoreRepository } from "../repositories/scoreRepository";
import { ListScoresParams } from "../interfaces/score";

export class ScoreService {

  static async listScores(
    params: ListScoresParams
  ) {
    const { pagina, limite } = params;

    const where: Record<string, any> = {};

    return await ScoreRepository.listScores(where, {
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

  // static async createUser(userData: CreateUserData): Promise<ViewUserData> {

  //   let val = new Validator(userData);
  //   await val.validate("nome", v.required(), v.length({ min: 3, max: 100 }))
  //   await val.validate("cargo", v.required(), v.length({ min: 3, max: 100 }))

  //   await val.validate("foto_id", v.optional(), v.prismaUUID(), async (value: any) => {
  //     return v.exists({ model: "imagem" })(value, { path: "id" });
  //   });

  //   if (val.anyErrors()) throw new APIError(val.getErrors(), 422);

  //   const sanitizedData = val.getSanitizedBody();

  //   return await UserRepository.createUser(sanitizedData);
  // }

  // static async findUser(id: string) {

  //   const uuidPrismaTest = await v.prismaUUID({ model: "usuario" })(id, { path: "id" });

  //   if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

  //   const address = await UserRepository.findUserByID(id);

  //   return address;
  // }

  // static async alterUser(id: string, userData: Partial<CreateUserData>): Promise<ViewUserData> {

  //   let val = new Validator(userData);

  //   await val.validate("nome", v.optional(), v.length({ min: 3, max: 100 }))
  //   await val.validate("cargo", v.optional(), v.length({ min: 3, max: 100 }))

  //   await val.validate("foto_id", v.optional(), v.prismaUUID(), async (value: any) => {
  //     return v.exists({ model: "imagem" })(value, { path: "id" });
  //   });

  //   if (val.anyErrors()) throw new APIError(val.getErrors(), 422);

  //   const sanitizedData = val.getSanitizedBody();

  //   return await UserRepository.alterUser(id, sanitizedData);
  // }

}