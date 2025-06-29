
export interface ViewScoreData {
  id: string;
  motivo: string;
  pontos: string;
  usuario_id: string ;
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