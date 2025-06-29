import { CreateScoreData, ViewScoreData } from "../interfaces/score";
import { paginate, PaginationOptions } from "../utils/pagination";
import { APIError } from "../utils/wrapException";
import { prisma } from "../config/db_config.";

export class ScoreRepository {

  static async listScores(where: any, options: PaginationOptions) {

    return paginate(prisma.pontuacao, where, options);
  }

  static async createScore(scoreData: CreateScoreData): Promise<ViewScoreData> {
    const { usuario_id, pontos, ...rest } = scoreData;

    return await prisma.$transaction(async (tx) => {
      // Criar nova pontuação
      const novaPontuacao = await tx.pontuacao.create({
        data: {
          ...rest,
          pontos,
          usuario: { connect: { id: usuario_id } },
        },
      });

      // Atualizar o campo pontuacao do usuário somando o novo pontos
      const usuarioAtualizado = await tx.usuario.update({
        where: { id: usuario_id },
        data: {
          pontuacao: {
            increment: pontos,
          },
        },
      });

      // Retorna nova pontuação com usuário atualizado
      return {
        ...novaPontuacao,
        usuario: usuarioAtualizado,
      };
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

  static async deleteScoreById(id: string): Promise<ViewScoreData> {
    return await prisma.$transaction(async (tx) => {
      // Primeiro pegar a pontuacao para saber quantos pontos vamos subtrair do usuário
      const scoreToDelete = await tx.pontuacao.findUnique({
        where: { id },
        include: { usuario: true },
      });

      if (!scoreToDelete) {
        throw new APIError("Pontuação não encontrada", 404);
      }

      // Deletar a pontuacao
      const deletedScore = await tx.pontuacao.delete({
        where: { id },
        include: { usuario: true },
      });

      // Atualizar o usuário, subtraindo os pontos da pontuação deletada
      await tx.usuario.update({
        where: { id: scoreToDelete.usuario_id },
        data: {
          pontuacao: {
            decrement: scoreToDelete.pontos,
          },
        },
      });

      return deletedScore;
    });
  }

}