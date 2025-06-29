import { CreateScoreData, ListScoresParams, ViewScoreData } from "../interfaces/score";
import { ValidationFuncs as v, Validator } from "../utils/Validation";
import { ScoreRepository } from "../repositories/scoreRepository";
import { APIError } from "../utils/wrapException";

export class ScoreService {

  static async listScores(
    params: ListScoresParams
  ) {
    const { pagina, limite, idUsuario } = params;

    const where: Record<string, any> = {};

    if (idUsuario) {
      where.usuario_id = idUsuario;
    }

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

  static async createScore(scoreData: CreateScoreData): Promise<ViewScoreData> {

    let val = new Validator(scoreData);
    await val.validate("motivo", v.required(), v.length({ min: 3, max: 556 }))
    await val.validate("pontos", v.required(), v.isInt());

    await val.validate("usuario_id", v.optional(), v.prismaUUID(), async (value: any) => {
      return v.exists({ model: "usuario" })(value, { path: "id" });
    });

    if (val.anyErrors()) throw new APIError(val.getErrors(), 422);

    const sanitizedData = val.getSanitizedBody();

    return await ScoreRepository.createScore(sanitizedData);
  }

  static async findScore(id: string) {

    const uuidPrismaTest = await v.prismaUUID({ model: "usuario" })(id, { path: "id" });

    if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

    const result = await ScoreRepository.findScoreByID(id);
    if (!result) throw new APIError("Usuário não encontrado.", 404);
    return result;
  }

  static async alterScore(id: string, scoreData: Partial<CreateScoreData>): Promise<ViewScoreData> {

    let val = new Validator(scoreData);

    await val.validate("motivo", v.optional(), v.length({ min: 3, max: 556 }))
    await val.validate("pontos", v.optional(), v.isInt());

    await val.validate("usuario_id", v.optional(), v.prismaUUID(), async (value: any) => {
      return v.exists({ model: "usuario" })(value, { path: "id" });
    });
    if (val.anyErrors()) throw new APIError(val.getErrors(), 422);

    const sanitizedData = val.getSanitizedBody();

    return await ScoreRepository.alterScore(id, sanitizedData);
  }

  static async deleteScore(id: string) {

    const uuidPrismaTest = await v.prismaUUID({ model: "pontuacao" })(id, { path: "id" });

    if (uuidPrismaTest != true) throw new APIError(uuidPrismaTest, 404)

    const result = await ScoreRepository.deleteScoreById(id);
    if (!result) throw new APIError("Pontuação não encontrado.", 404);
    
    return result;
  }

}