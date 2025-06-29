import { CreateUserData, ListUsersParams } from '../interfaces/user';
import { UserService } from '../services/userService';
import { sendResponse } from '../utils/messages';
import { Request, Response } from 'express';

export default class UserController {
  // Método estático para listar usuários
  static async listUserController(req: Request, res: Response): Promise<void> {

    // Extrair parâmetros da query
    const pagina = parseInt(req.query.pagina as string) || 1;
    const limite = parseInt(req.query.limite as string) || 10;

    const params: ListUsersParams = {
      pagina,
      limite,
      nome: req.query.nome as string | undefined
    };

    const result = await UserService.listUsers(params);

    // Retornar a resposta com os dados formatados
    sendResponse(res, 200, result);
  }

  // Método estático para listar usuários
  static async findFirstRankUser(req: Request, res: Response): Promise<void> {

    const result = await UserService.listFirstRankUser();

    // Retornar a resposta com os dados formatados
    sendResponse(res, 200, { data: result });
  }

  static async createUserController(req: Request, res: Response): Promise<void> {
    const user: CreateUserData = { ...req.body };

    const result = await UserService.createUser(user);

    // Retornar a resposta com os dados formatados
    sendResponse(res, 201, result);
  }

  static async findUser(req: Request, res: Response) {
    const { id } = req.params;

    const result = await UserService.findUser(id);
    sendResponse(res, 200, { data: result });
  }

  static async alterUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateData: Partial<CreateUserData> = { ...req.body };

    const result = await UserService.alterUser(id, updateData);

    sendResponse(res, 200, { data: result });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const result = await UserService.deleteUser(id);
    sendResponse(res, 200, { data: result });
  }
}