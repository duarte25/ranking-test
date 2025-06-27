import { ViewUserData } from "./user";

export interface ListScoresParams {
  pagina: number;
  limite: number;
}

export interface CreateScoreData {
  usuario_id: string;
  pontos: number;
  motivo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewScoreData {
  id: string;
  usuario_id: string;
  pontos: number;
  motivo: string;
  usuario: ViewUserData
  createdAt: Date;
  updatedAt: Date;
}