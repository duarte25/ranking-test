import { ViewUserData } from "./User";

export interface ViewScoreData {
  id: string;
  motivo: string;
  pontos: number;
  usuario_id: string ;
  usuario: ViewUserData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScoreData {
  usuario_id: string;
  pontos: number;
  motivo: string;
  createdAt: Date;
  updatedAt: Date;
}