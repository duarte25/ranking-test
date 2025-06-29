import { applyZodInitialConfig } from "@/utils/zod";
import { z } from "zod";

applyZodInitialConfig();

export class ScoreSchemas {
  static criar = z.object({
    motivo: z.string().min(1, "O motivo é obrigatório"),
    pontos: z.coerce.number().int("O campo pontos deve ser um número inteiro"),
    usuario_id: z.string().min(1, "O colaborador é obrigatório"),
  })

}