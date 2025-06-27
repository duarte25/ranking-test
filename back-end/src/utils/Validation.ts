import { isCPF, isCNPJ, isCNH } from "validation-br";
import { PrismaClient } from '@prisma/client';
import messages from "../utils/messages";

const prisma = new PrismaClient();

interface UniqueOptions {
  model?: keyof typeof prisma;
  query?: Record<string, any>;
  ignoreSelf?: boolean;
  message?: string;
  validateID?: boolean;
  valorMongo?: boolean | string;
  userId?: string;
}

interface ValidationContext {
  path: string;
  parent: { id?: any };
  setValue: (value: any) => void;
}

// Acessar objeto com caminho "a.b.c"
function getValueByPath(obj: any, path: string): any {
  return path.split(/[\.\[\]]+/).filter(Boolean).reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
}

const setValueByPath = (obj: any, path: string, value: any): void => {
  if (!path.includes(".")) {
    obj[path] = value;
    return;
  }
  let parts = path.split(".");
  let lastPart = parts.pop();
  let current = obj;
  for (let p of parts) {
    if (current[p] === undefined || current[p] === null) current[p] = {};
    current = current[p];
  }
  current[lastPart!] = value;
};

export class ValidationResult {
  path: string;
  body: any;
  error: boolean;

  constructor(path: string, body: any) {
    this.path = path;
    this.body = body;
    this.error = false;
  }

  hasError(): boolean {
    return this.error !== false;
  }

  getValue(): any {
    return getValueByPath(this.body, this.path);
  }

  setValue(newValue: any): void {
    setValueByPath(this.body, this.path, newValue);
  }

  toString(): string {
    return JSON.stringify({
      path: this.path,
      value: getValueByPath(this.body, this.path),
      error: this.error
    });
  }
}

interface ValidationOptions {
  message?: string;
}

export class Validator {
  validations: { [key: string]: ValidationResult };
  body: any;

  constructor(bodyObj: any) {
    if (bodyObj === undefined || typeof bodyObj !== "object" || bodyObj === null)
      throw new Error("O construtor de Validator deve receber um objeto body com os valores a serem validados!");
    this.validations = {};
    this.body = bodyObj;
  }

  async validate(path: string, ...funcoes: any[]): Promise<Validator> {
    let val = new ValidationResult(path, this.body);
    this.validations[path] = val;

    for (let funcao of funcoes) {
      let continuar = await funcao(val.getValue(), val);

      if (continuar !== true) {
        val.error = continuar;
        return this;
      }
    }
    return this;
  }

  anyErrors(): boolean {
    return Object.keys(this.validations).some((path) => !this.isValid(path));
  }

  getErrors(): any[] {
    const errosFiltrados = Object.keys(this.validations).filter((path) => !this.isValid(path));
    return errosFiltrados.length > 0 ? errosFiltrados.map((path) => this.validations[path].error) : [];
  }

  getSanitizedBody(): any {
    let sanitizedBody: any = {};

    Object.keys(this.validations).forEach((path) => {
      let value = this.validations[path].getValue();

      // Ignora completamente os campos undefined
      if (value === undefined) {
        return; // não faz nada, pula o campo
      }

      // Mantém string vazia como null (ou deixa como "", dependendo da sua regra)
      const finalValue = value === "" ? null : value;

      // Só então adiciona ao corpo sanitizado
      setValueByPath(sanitizedBody, path, finalValue);
    });

    return sanitizedBody;
  }

  getValue(path: string): any {
    if (this.validations[path] === undefined) return undefined;
    return this.validations[path].getValue();
  }

  isValid(path: string): boolean {
    return path in this.validations && this.validations[path]?.error === false;
  }
}

export class ValidationFuncs {
  static optional = (opcoes: Record<string, any> = {}) =>
    async (value: any): Promise<boolean> => {
      if (value == null || value === "") {
        return false;
      } else {
        return true;
      }
    };

  static required = (opcoes: ValidationOptions = {}): ((value: any, val: { path: string }) => Promise<boolean | string>) => {

    return async (value: any, val: { path: string }): Promise<boolean | string> => {
      if (value === undefined) {
        return opcoes.message || messages.validationGeneric.fieldIsRequired(val.path).message;
      }
      return true;
    };
  };

  static trim = (opcoes: { allowEmpty?: boolean, message?: string } = { allowEmpty: false }): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (typeof value?.trim !== "function") return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    value = value.trim();
    val.setValue(value);
    if (!opcoes.allowEmpty && !value) {
      return opcoes.message || messages.validationGeneric.fieldIsRequired(val.path).message;
    }
    return true;
  };

  static telephone = (opcoes: ValidationOptions = {}) => async (value: string): Promise<any> => {
    ValidationFuncs.regex({ regex: /^\d{11}$/, message: opcoes.message });
  }

  static toDateTime = (options: ValidationOptions = {}) => async (value: string): Promise<any> => {
    // Verifica se o valor está no formato ISO-8601 completo com o sufixo Z (UTC)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
      // Tenta converter a string para um timestamp
      const timestamp = Date.parse(value);
      // Verifica se o timestamp é válido
      if (!isNaN(timestamp)) {
        return true; // A data é válida
      }
    }

    // Retorna mensagem de erro caso a validação falhe
    return options.message || "Data inválida. Use o formato ISO-8601 UTC (YYYY-MM-DDTHH:mm:ss.sssZ).";
  };

  // Função para validar e converter datas para o formato UTC compatível com o Prisma
  static toUTCDate = (opcoes: ValidationOptions = {}) => async (value: string, val: ValidationResult): Promise<any> => {
    let dateString: string;
    // Verifica se o valor está no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      // Adiciona o horário UTC ajustado para Manaus (T04:00:00Z)
      dateString = value + "T04:00:00Z";
    }
    // Verifica se o valor está no formato YYYY-MM
    else if (/^\d{4}-\d{2}$/.test(value)) {
      // Assume o primeiro dia do mês e adiciona o horário UTC ajustado
      dateString = value + "-01T04:00:00Z";
    }
    // Se não corresponder a nenhum dos formatos aceitos, retorna mensagem de erro
    else {
      return opcoes.message || `Data campo ${val.path} inválida. Use o formato YYYY-MM-DD ou YYYY-MM.`;
    }

    // Tenta converter a string para um timestamp
    const timestamp = Date.parse(dateString);

    // Verifica se o timestamp é válido
    if (isNaN(timestamp)) {
      return opcoes.message || "Data inválida. Não foi possível converter para um objeto Date.";
    }

    // Retorna a data normalizada como um objeto Date
    return true;
  };

  static toLowerCase = (opcoes: ValidationOptions = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (typeof value?.toLowerCase !== "function") {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    val.setValue(value.toLowerCase());
    return true;
  };

  static toUpperCase = (opcoes: ValidationOptions = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (typeof value?.toUpperCase !== "function") {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    val.setValue(value.toUpperCase());
    return true;
  };

  static toFloat = (opcoes: ValidationOptions = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    value = parseFloat(value);
    if (isNaN(value)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    val.setValue(value);
    return true;
  };

  static isInt = (opcoes: ValidationOptions = {}): any =>
    async (value: any, val: ValidationResult): Promise<any> => {
      if (typeof value !== "number" || !Number.isInteger(value)) {
        return opcoes.message || messages.validationGeneric.invalid(val.path).message;
      }
      return true;
    };

  static toInt = (opcoes: ValidationOptions = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    value = parseInt(value);
    if (isNaN(value)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    val.setValue(value);
    return true;
  };

  static toBoolean = (opcoes: {} = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    val.setValue(value == true ? true : false);
    return true;
  };

  static isArray = () =>
  (value: any, val: { path: string }) => {
    if (!Array.isArray(value)) {
      return `O campo ${val.path} precisa ser um array.`;
    }
    return true;
  };

  static enum(opcoes: { values: any[], message?: string }) {
    return async (value: any, context: ValidationContext) => {
      if (!Array.isArray(opcoes.values) || opcoes.values.length === 0) {
        throw new Error("A função de validação enum deve receber um array values");
      }
      if (!opcoes.values.includes(value)) {
        return opcoes.message || `O valor do campo ${context.path} deve ser um dos seguintes: ${opcoes.values.join(', ')}`;
      }
      return true;
    };
  }

  static prismaUUID = (opcoes: UniqueOptions = {}) => {
    return async (value: any, val: { path: string }): Promise<any> => {
      // Pega o valor de valorMongo, se ele existir, ou usa o value
      const valorUUID = opcoes.valorMongo !== undefined ? opcoes.valorMongo : value;

      // Expressão regular para validar UUID
      const uuidRegex = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

      // Validação do UUID
      if (!uuidRegex(valorUUID)) {
        return opcoes.message || `O valor no campo ${val.path} não é um UUID válidooo.`;
      }

      return true;
    };
  };

  static arrayOf =
    (...validators: ((value: any, val: { path: string; parent?: any }) => Promise<any> | any)[]) =>
      async (value: any[], val: { path: string; parent?: any }): Promise<any> => {
        const path = val.path;

        if (!Array.isArray(value)) {
          return `O campo ${path} deve ser um array.`;
        }

        for (let i = 0; i < value.length; i++) {
          const item = value[i];

          for (const validator of validators) {
            const result = await validator(item, { path: `${path}[${i}]`, parent: val.parent });

            if (result !== true) {
              return `Erro no item ${path}[${i}]: ${result}`;
            }
          }
        }

        return true;
      };

  static exists = (opcoes: UniqueOptions) =>
    async (value: any, val: { path: string; parent?: { id?: any } }): Promise<any> => {
      const path = val.path;
      // Validação do formato do UUID
      const uuidRegex = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!uuidRegex(value)) {
        return opcoes.message || `O valor no campo ${path} não é um UUID válido.`;
      }

      // Verifica se o model foi fornecido
      if (!opcoes.model) {
        throw new Error("A função de validação exists deve receber o Model para pesquisa!");
      }

      // Define a query inicial
      let query = opcoes.query || { [path]: value };

      // Ignora o próprio registro, se necessário
      if (opcoes.ignoreSelf) {
        const ignoreId = val.parent?.id || opcoes.userId;
        if (ignoreId) {
          query["id"] = { not: ignoreId };
        }
      }

      // Acessa o modelo no Prisma Client de forma segura com tipagem
      const prismaModel = prisma[opcoes.model] as any; // Cast para any para evitar erros de tipo

      if (!prismaModel) {
        throw new Error(`O modelo '${opcoes}' não existe no Prisma Client.`);
      }

      // Executa a consulta no banco de dados usando findUnique
      const resultado = await prismaModel.findUnique({
        where: query
      });

      // Se o resultado NÃO existir, retorna a mensagem de erro
      if (!resultado) {
        return opcoes.message || `O valor para ${path} não foi encontrado no banco de dados.`;
      }

      // Se encontrou, a validação passa
      return true;
    };

  // EXEMPLO:    v.unique({
  //     model: "Endereco", // Nome do modelo no Prisma
  //     ignoreSelf: true, // Ignora se for ele mesmo ksks
  // })
  // await ValidationFuncs.unique({
  //     model: "Endereco", // Nome do modelo no Prisma
  //     ignoreSelf: true,
  //     // userId: "123" // ID do usuário a ser ignorado
  // })(addressData.cep, { path: "cep" });
  static unique = (opcoes: UniqueOptions) =>
    async (value: any, val: { path: string; parent?: { id?: any } }): Promise<any> => {
      const path = val.path;

      // Verifica se o model foi fornecido
      if (!opcoes.model) {
        throw new Error("A função de validação única deve receber o Model para pesquisa!");
      }

      // Define a query inicial
      let query: Record<string, any> = { [path]: value };

      // Ignora o próprio registro, se necessário
      if (opcoes.ignoreSelf) {
        const ignoreId = opcoes.userId || val.parent?.id; // Usa o ID fornecido ou o ID do registro
        if (ignoreId) {
          query = {
            AND: [
              { [path]: value }, // Condição para o campo atual (ex.: email)
              { id: { not: ignoreId } } // Ignora o próprio registro
            ]
          };
        }
      }

      // Validação de tipos para acessar o Prisma Client
      const prismaModel = prisma[opcoes.model] as any;
      if (!prismaModel) {
        throw new Error(`O modelo '${opcoes}' não existe no Prisma Client.`);
      }

      // Executa a consulta no banco de dados
      const resultado = await prismaModel.findFirst({ where: query });
      // Se o resultado existir, retorna a mensagem de erro
      if (resultado) {
        return opcoes.message || `O valor para ${path} já está em uso.`;
      }

      // Se não encontrou, a validação passa
      return true;
    };

  /**   
  * Verifica se o valor está entre min e max caracteres (Deve ser uma string, produz erro se o valor for undefined).
  */
  static length = (opcoes: { min?: number; max?: number; message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    // Validação das opções
    if (!opcoes.min && !opcoes.max) {
      throw new Error("A função de validação length deve receber um objeto com as propriedades min e/ou max.");
    }

    // Verifica se o valor é undefined
    if (value === undefined) {
      throw new Error("A função de validação length não consegue verificar o tamanho de um valor undefined.");
    }

    // Garante que o valor seja uma string
    if (typeof value !== "string") {
      return opcoes.message || messages.validationGeneric.invalidInputFormatForField(val.path).message;
    }

    // Verifica o comprimento mínimo
    if (opcoes.min !== undefined && value.length < opcoes.min) {
      return opcoes.message || `O campo ${val.path} deve ter no mínimo ${opcoes.min} caracteres.`;
    }

    // Verifica o comprimento máximo
    if (opcoes.max !== undefined && value.length > opcoes.max) {
      return opcoes.message || `O campo ${val.path} deve ter no máximo ${opcoes.max} caracteres.`;
    }

    // Se passou por todas as verificações, retorna true
    return true;
  };

  static CPF = (opcoes: { message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (!isCPF(value)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    return true;
  };

  static CNPJ = (opcoes: { message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (!isCNPJ(value)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    return true;
  };

  static CNH = (opcoes: { message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (!isCNH(value)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    return true;
  };

  static email(opcoes: { message?: string } = {}) {
    return ValidationFuncs.regex({
      regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      message: opcoes.message || "O formato do email é inválido."
    });
  }

  static passwordComplexity(opcoes: { message?: string } = {}) {
    return ValidationFuncs.regex({
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: opcoes.message || "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
    });
  }

  static regex = (opcoes: { regex: RegExp; message?: string } = { regex: /./ }) => async (value: string, val: { path: string }) => {
    if (opcoes.regex === undefined) {
      throw new Error("A função de validação regex deve receber um objeto com a propriedade regex");
    }
    if (!opcoes.regex.test(value)) {
      return opcoes.message || `Formato inválido para o campo ${val.path}`;
    } else {
      return true;
    }
  };

  static isNumber = (opcoes: { message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    // Verifica se o valor contém apenas dígitos (sem espaços, letras ou símbolos)
    if (typeof value !== "string" || !/^\d+$/.test(value)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }

    return true;
  };

  static isDigits = (opcoes: { message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    // Verifica se o valor é undefined ou null
    if (value === undefined || value === null) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }

    // Converte o valor para string (caso seja um número ou outro tipo)
    const stringValue = String(value);

    // Verifica se todos os caracteres são dígitos usando uma expressão regular
    if (!/^\d+$/.test(stringValue)) {
      return opcoes.message || `O campo ${val.path} deve conter apenas dígitos numéricos.`;
    }

    return true;
  };

  static isDate = (opcoes: { message?: string } = {}): any => async (value: any, val: ValidationResult): Promise<any> => {
    if (!(value instanceof Date)) {
      return opcoes.message || messages.validationGeneric.invalid(val.path).message;
    }
    return true;
  };
}

export default new ValidationFuncs();