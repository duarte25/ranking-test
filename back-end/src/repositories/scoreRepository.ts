import { paginate, PaginationOptions } from "../utils/pagination";
import { prisma } from "../config/db_config.";
import { CreateScoreData, ViewScoreData } from "../interfaces/score";

export class ScoreRepository {

  static async listScores(where: any, options: PaginationOptions) {

    return paginate(prisma.pontuacao, where, options);
  }

  static async createScore(scoreData: CreateScoreData): Promise<ViewScoreData> {
    const { usuario_id, ...rest } = scoreData;

    return await prisma.pontuacao.create({
      data: {
        ...rest,
        usuario: {
          connect: { id: usuario_id }
        },
      },
      include: {
        usuario: true, // Incluir os dados do usuário relacionado
      }
    });
  }

  static async findScoreByID(id: string): Promise<ViewScoreData | null> {
    return await prisma.pontuacao.findUnique({
      where: { id },
      include: {
        usuario: true,
      }
    });
  }

  static async alterScore(id: string, scoreData: Partial<CreateScoreData>): Promise<ViewScoreData> {

    const { usuario_id, ...restScoreData } = scoreData;

    return await prisma.pontuacao.update({
      where: { id },
      data: {
        ...restScoreData,
        usuario: {
          connect: { id: usuario_id }
        },
      },
      include: {
        usuario: true,
      }
    });
  }
}