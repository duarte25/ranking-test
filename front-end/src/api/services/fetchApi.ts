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

export async function fetchApi<RequestData, ResponseData>({
  route,
  method,
  data,
  token,
  nextOptions,
}: FetchApiProps<RequestData | FormData>): Promise<ApiResponse<ResponseData>> {
  try {
    let bearerToken = token || undefined;

    if (!bearerToken && typeof window === "undefined") {
      const token = await getCookie("accessToken");
      bearerToken = token?.value;
    }

    const urlApi = getApiUrlEnv();
    let body: BodyInit | null = null;

    // Se for GET, transformar os parâmetros em query string
    if (method === "GET" && data) {
      let urlSearch;
      if (!(data instanceof FormData)) {
        urlSearch = createURLSearch({ route: route, data: { querys: data } });
        route = urlSearch || route;
      }
      route = urlSearch || route;
      body = null;
    } else if (method !== "GET" && data) {
      // Verifica se o dado é um FormData ou JSON
      body = data instanceof FormData ? data : JSON.stringify(data);
    }

    // Headers padrão
    const headers: HeadersInit = {
      Authorization: `Bearer ${bearerToken}`,
      accept: "application/json",
    };

    // Apenas adiciona "Content-Type" se NÃO for FormData
    if (data && !(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${urlApi}${route}`, {
      method: method,
      headers: headers,
      body: body,
      next: nextOptions,
    });

    // Verifica se a resposta foi bem-sucedida
    // if (!response.ok) {
    //   throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    // }

    const responseData: ApiResponse<ResponseData> = await response.json();
  
    return responseData;
  } catch (error) {
    let errorMessage = "A aplicação falhou ao tentar realizar a requisição para o servidor";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: [] as unknown as ResponseData,
      code: 500,
      error: true,
      message: errorMessage,
      errors: [{ message: errorMessage }],
    };
  }
}