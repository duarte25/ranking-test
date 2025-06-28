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
  foto?: foto | null;
  pontuacao: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersParams {
  pagina: number;
  limite: number;
}

interface foto {
  id: string;
  imagem: Buffer;
  tipo_mime: string;
  createdAt: Date;
  updatedAt: Date;
}