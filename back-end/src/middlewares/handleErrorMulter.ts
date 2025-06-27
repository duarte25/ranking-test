import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/messages';
import multer from 'multer';

export const handleMulterErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Erro do Multer (ex: "Too many files", "File too large")
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return sendError(res, 400, ['Apenas um arquivo pode ser enviado por vez!']);
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 400, ['O arquivo é muito grande! O limite é 5MB.']);
    }
    // Outros erros do Multer
    return sendError(res, 400, [err.message]);
  } else if (err) {
    return sendError(res, 400, [err.message || 'Erro ao processar o arquivo.']);
  }
  next();
};