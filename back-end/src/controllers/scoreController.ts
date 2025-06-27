import { ListScoresParams } from '../interfaces/score';
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
      limite
    };

    const result = await ScoreService.listScores(params);

    // Retornar a resposta com os dados formatados
    sendResponse(res, 200, result);
  }

  // static async createUserController(req: Request, res: Response): Promise<void> {
  //   const user: CreateUserData = { ...req.body };

  //   const result = await UserService.createUser(user);

  //   // Retornar a resposta com os dados formatados
  //   sendResponse(res, 201, result);
  // }

  // static async findUser(req: Request, res: Response) {
  //   const { id } = req.params;

  //   const result = await UserService.findUser(id);
  //   sendResponse(res, 200, { data: result });
  // }

  // static async alterUser(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const updateData: Partial<CreateUserData> = { ...req.body };

  //   const result = await UserService.alterUser(id, updateData);

  //   sendResponse(res, 200, { data: result });
  // }
}