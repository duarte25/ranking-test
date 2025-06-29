import { ApiResponse, FetchApiProps } from "../../types/api";
import { createURLSearch } from "../../utils/createURLSearch";
import { getCookie } from "@/actions/handleCookie";

export const getApiUrlEnv = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL;
  } else {
    return process.env.API_URL;
  }
};

export async function fetchPhotoApi<RequestData, ResponseData>({
  route,
  method,
  data,
  token,
  nextOptions,
}: FetchApiProps<RequestData>): Promise<ApiResponse<ResponseData>> {
  try {
    let bearerToken = token || undefined;

    if (!bearerToken && typeof window === "undefined") {
      const token = await getCookie("accessToken");

      bearerToken = token?.value;
    }

    const urlApi = getApiUrlEnv();

    let body: BodyInit | null = null;

    if (method === "GET" && data) {
      const urlSearch = createURLSearch({ route: route, data: { querys: data } });
      route = urlSearch;
      body = null;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${bearerToken}`,
      accept: "application/json",
    };

    // Caso seja uma requisição GET e estamos lidando com uma imagem
    if (method === "GET") {
      // Alterando o tipo de resposta para não tentar converter para JSON
      const response = await fetch(`${urlApi}${route}`, {
        method: method,
        headers: headers,
        body: body,
        next: nextOptions,
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar a foto");
      }

      // Se for uma imagem, retornamos a resposta de forma binária ou base64
      const imageBlob = await response.blob(); // Aqui estamos pegando o blob da imagem
      const imageUrl = URL.createObjectURL(imageBlob); // Criando a URL do objeto

      return {
        data: imageUrl as unknown as ResponseData, // A URL da imagem é o que estamos retornando
        code: response.status,
        error: false,
        message: "Imagem carregada com sucesso",
        errors: [],
      };
    }

    return {
      data: [] as ResponseData,
      code: 500,
      error: true,
      message: "Método não permitido",
      errors: [
        {
          message: "Somente o método GET é suportado para imagens",
        },
      ],
    };
  } catch (error) {
    let errorMessage = "A aplicação falhou ao tentar realizar a requisição para o servidor";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: [] as ResponseData,
      code: 500,
      error: true,
      message: errorMessage,
      errors: [
        {
          message: errorMessage,
        },
      ],
    };
  }
}
