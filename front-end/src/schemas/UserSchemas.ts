import { applyZodInitialConfig } from "@/utils/zod";
import { z } from "zod";

applyZodInitialConfig();

export class UserSchemas {
  static criar = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    cargo: z.string().min(1, "O cargo é obrigatório"),
    imagem: z
      .instanceof(File) // Verifica se é uma instância de File
      .refine((file) => file.type.startsWith('image/'), {
        message: "O arquivo deve ser uma imagem", // Validação do tipo de arquivo
      })
      .refine((file) => file.size <= 15 * 1024 * 1024, {
        message: "O arquivo deve ter no máximo 15MB",
      }).optional(),
  })

}