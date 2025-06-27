
export interface CreateUserData {
  nome: string;
  cargo: string;
  foto_id?: string | null;
}

export interface ViewUserData {
  id: string;
  nome: string;
  cargo: string;
  foto_id?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersParams {
  pagina: number;
  limite: number;
}