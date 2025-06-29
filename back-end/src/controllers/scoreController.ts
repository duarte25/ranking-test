import { CreateScoreData, ListScoresParams } from '../interfaces/score';
import { ScoreService } from '../services/scoreService';
import { sendResponse } from '../utils/messages';
import { Request, Response } from 'express';

export default class ScoreController {
  static async listScoresController(req: Request, res: Response): Promise<void> {

    // Extrair parâmetros da query
    const pagina = parseInt(req.query.pagina as string) || 1;
    const limite = parseInt(req.query.limite as string) || 10;

    const params: ListScoresParams = {
      pagina,
      limite,
      idUsuario: req.query.idUsuario as string | undefined,
    };

    const result = await ScoreService.listScores(params);

    // Retornar a resposta com os dados formatados
    sendResponse(res, 200, result);
  }

  static async createPontuacaoController(req: Request, res: Response): Promise<void> {
    const user: CreateScoreData = { ...req.body };

    const result = await ScoreService.createScore(user);

    // Retornar a resposta com os dados formatados
    sendResponse(res, 201, result);
  }

  static async findScore(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ScoreService.findScore(id);
    sendResponse(res, 200, { data: result });
  }

  static async alterScore(req: Request, res: Response) {
    const { id } = req.params;
    const updateData: Partial<CreateScoreData> = { ...req.body };

    const result = await ScoreService.alterScore(id, updateData);

    sendResponse(res, 200, { data: result });
  }


  static async deleteScore(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ScoreService.deleteScore(id);
    sendResponse(res, 200, { data: result });
  }
}