import { toast } from "react-toastify";

/**
 * Exibe uma lista de erros como toasts.
 * @param errors Um array de strings contendo as mensagens de erro.
 * @param options Opções adicionais para o toast (opcional).
 */
export function handleErrorMessages(errors: (string | { message: string })[]) {

  // Verifica se errors é um array
  if (!Array.isArray(errors)) {
    console.error("Erro: O parâmetro 'errors' deve ser um array.");
    return;
  }

  // Processa os erros
  errors.forEach((error) => {
    // Se for um objeto com a chave 'message', usamos o valor de 'message', senão, usamos a string diretamente
    const errorMessage = typeof error === "string" ? error : error.message || "Erro desconhecido";
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000, // Fecha automaticamente após 5 segundos
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  });
}
