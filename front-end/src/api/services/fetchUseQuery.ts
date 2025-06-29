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

export interface ApiErrorQuery {
  message: string;
  errors: string[];
  code: number;
  data: unknown[]; 
}

export async function fetchUseQuery<RequestData, ResponseData>({
  route,
  method,
  data,
  token,
  nextOptions,
}: FetchApiProps<RequestData | FormData>): Promise<ApiResponse<ResponseData>> {

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

  // *** AQUI ESTÁ A MUDANÇA ESSENCIAL ***
  // Se a resposta NÃO for OK (status 2xx), lance um erro
  if (!response.ok) {
    // console.log("RESPONS aqui dentro", response)
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || "Erro desconhecido",
      errors: errorData.errors || [],
      code: response.status,
      data: [],
    } as ApiErrorQuery;
  }

  // Se a resposta for OK, aí sim retorna os dados como ApiResponse
  const responseData: ApiResponse<ResponseData> = await response.json();

  // *** NOVA LÓGICA AQUI: Se a resposta for 2xx mas contiver um erro de negócio ***
  if (responseData.error) {
    throw {
      message: responseData.message || "Erro de negócio desconhecido",
      errors: responseData.errors || [],
      code: responseData.code || response.status, // Use o code da resposta ou o status HTTP
      data: responseData.data || [],
    } as ApiErrorQuery;
  }

  return responseData;
}