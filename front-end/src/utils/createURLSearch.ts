import { ZodError, ZodSchema } from "zod";

interface QuerySchemaProps<T> {
  querys: Record<string, T>;
  hiddenQuerys?: Record<string, T>;
  schema?: ZodSchema<T>;
}

interface URLSearchProps<T> {
  route: string;
  data: QuerySchemaProps<T>;
}

export function createURLSearch<T>({ route, data }: URLSearchProps<T>): string {
  const searchParams = new URLSearchParams();

  const querys = data.querys;
  const hiddenQuerys = data.hiddenQuerys;
  const schema = data.schema;

  // Função para adicionar querys
  const addQuery = (key: string, value: unknown) => {
    // Verifica se o valor é vazio, null, undefined ou "all", e se for, remove o parâmetro
    if (value === undefined || value === "" || value === null || value === "all") {
      if (searchParams.has(key)) {
        searchParams.delete(key);
      }
      return;
    }

    // Se houver um schema, valida o valor antes de adicionar à URL
    if (schema) {
      try {
        schema.parse({ [key]: value });
        searchParams.set(key, value as string);
      } catch (error) {
        if (error instanceof ZodError) {
          console.error(`Query "${key}" não é válida de acordo com o schema: ${error.errors[0].message}`);
          return;
        }
      }
    } else {
      // Se não houver schema, apenas adiciona a query
      searchParams.set(key, value as string);
    }
  };

  // Adiciona as querys visíveis
  for (const query in querys) {
    addQuery(query, querys[query]);
  }

  // Adiciona as querys ocultas, se existirem
  if (hiddenQuerys) {
    for (const query in hiddenQuerys) {
      addQuery(query, hiddenQuerys[query]);
    }
  }

  // Gera a URL final, incluindo as querys
  return `${route}?${searchParams.toString()}`;
}
