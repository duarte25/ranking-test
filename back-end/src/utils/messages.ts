const messages = {
  // Mensagens para respostas via rotas da API
  httpCodes: {
    200: "Requisição bem sucedida!",
    201: "Requisição bem sucedida, recurso foi criado!",
    202: "Requisição aceita para processamento em andamento!",
    204: "Requisição bem sucedida, sem conteúdo para retornar!",
    205: "Requisição precisa de mais dados para ser processada!",
    206: "Requisição bem sucedida, porém apenas parte do recurso foi retornada!",
    207: "Requisição bem sucedida, mas a resposta possui mais de um recurso associado!",
    208: "Requisição bem sucedida, mas o conteúdo retornado não é mais válido!",

    300: "Requisição bem sucedida, mas requisição tem múltiplas respostas possíveis, cliente deve escolher uma!",
    301: "O recurso solicitado foi movido permanentemente para um novo endereço!",
    302: "O recurso solicitado foi encontrado, mas foi movido temporariamente para um novo endereço!",
    303: "Recurso encontrado, mas atenção a referência mais adequada a seguir!",
    304: "A requisição foi bem sucedida, cliente possui a versão mais atualizada!",
    305: "Recurso solicitado só está disponível por meio do proxy",
    307: "O recurso solicitado foi temporariamente movido para um novo endereço!",
    308: "O recurso solicitado foi permanentemente movido para um novo endereço!",

    400: "Requisição com sintaxe incorreta ou outros problemas!",
    401: "Cliente sem credenciais para acessar o recurso solicitado!",
    403: "Sem permissão para atender a requisição!",
    404: "O recurso solicitado não foi encontrado no servidor!",
    405: "O método HTTP não é suportado para o recurso solicitado!",
    408: "O servidor terminou a conexão, requisição levou muito tempo!",
    409: "A requisição do cliente em conflito com o estado atual do servidor!",
    410: "O recurso solicitado não está mais disponível no servidor!",
    413: "O servidor recusou a requisição porque o corpo da requisição é muito grande!",
    422: "A requisição foi mal sucedida, falha na validação!",
    423: "Recurso bloqueado!",
    431: "Cabeçalhos da requisição são muito grandes!",
    451: "Acesso negado por motivos legais!",
    498: "Acesso negado devido o token ser inválido!",

    500: "Servidor encontrou um erro interno!",
    501: "Funcionalidade não suportada!",
    502: "O servidor atuando como gateway ou proxy recebeu uma resposta inválida!",
    503: "O servidor está temporariamente indisponível, em manutenção ou em sobrecarga!"
  },

  // Mensagens informativas
  info: {
    welcome: "Bem-vindo à nossa aplicação!",
    userLoggedIn: (username: string) => `Usuário ${username} logado com sucesso!`,
  },

  success: {
    success: "Operação concluída com sucesso!",
  },

  error: {
    error: "Ocorreu um erro ao processar a solicitação!",
    serverError: "Erro interno do servidor, Tente novamente mais tarde!",
    invalidRequest: "Requisição inválida, Verifique os parâmetros fornecidos!",
    unauthorizedAccess: "Acesso não autorizado, Faça login para continuar!",
    invalidURL: "URL inválida, Verifique a URL fornecida!",
    unsupportedOperation: "Operação não suportada neste contexto!",
    dataParsingError: "Erro ao analisar os dados recebidos!",
    externalServiceError: "Erro ao se comunicar com um serviço externo!",
    invalidApiKey: "Chave de API inválida!",
    operationCanceled: "Operação cancelada pelo usuário!",
    resourceNotFound: (id: string) => `O campo ${id} não foi encontrado!`,
    invalidID: "O ID informado deve estar em um formato válido (12 bytes)!"
  },

  // Mensagens de validação genéricas
  validationGeneric: {
    fieldIsRequired: (fieldName: string) => {
      return { message: `O campo ${fieldName} é obrigatório!` };
    },
    fieldIsRepeated: (fieldName: string) => {
      return { message: `O campo ${fieldName} informado já está cadastrado!` };
    },
    invalidInputFormatForField: (fieldName: string) => {
      return { message: `Formato de entrada inválido para o campo ${fieldName}!` };
    },
    lessSum: (fieldName: string) => {
      return { message: `Valor menor que a data de hoje ${fieldName}!` };
    },
    resourceInUse: (fieldName: string) => {
      return { message: `Recurso em uso em ${fieldName}!` };
    },
    invalid: (fieldName: string) => {
      return { message: `Valor informado em ${fieldName} é inválido!` };
    },
    mascCamp: (campo: string) => {
      return { message: `${campo} não encontrado!` };
    },
    femCamp: (campo: string) => {
      return { message: `${campo} não encontrada!` };
    },
    notFound: (fieldName: string) => {
      return { message: `Nenhum registro encontrado com este ${fieldName}.` };
    },
    mustBeOneOf: (fieldName: string, values: string[]) => {
      return { message: `O campo ${fieldName} deve ser um dos seguintes valores: ${values.join(", ")}` };
    }
  },

  // Mensagens de validação personalizadas
  customValidation: {
    invalidCPF: "CPF inválido, Verifique o formato e tente novamente!",
    invalidCNPJ: "CNPJ inválido, Verifique o formato e tente novamente!",
    invalidPhoneNumber: "Número de telefone inválido, Verifique o formato e tente novamente!",
    invalidMail: "Email no formato inválido!",
    invalidYear: "Ano inválido, Verifique o formato e tente novamente!",
    invalidDate: "Data inválida, Verifique o formato e tente novamente!",
    invalidDatePast: "Data do inicio deve ser uma data atual ou futura!",
    invalidDateFuture: "A data de conclusão deve ser maior do que a data de inicio!",
    invalidDateCurrent: "Data do inicio deve ser uma data atual ou passada!",
    invalidDateMonths: "A data final da vigência não pode ser um período maior que 12 meses após a data de início da vigência!",
    invalidDataNascimento: "Data de nascimento deve ser uma data passada e maior que 18!",
    inventarioAndamento: "Inventario em andamento.",
    itemCadastrado: "Item já foi conferido!",
    statusFinalizado: "Status finalizado.",
  },

  auth: {
    authenticationFailed: "Falha na autenticação! Credenciais inválidas!",
    userNotFound: (userId: string) => `Usuário com ID ${userId} não encontrado!`,

    invalidPermission: "Permissão insuficiente para executar a operação!",
    duplicateEntry: (fieldName: string) => `Já existe um registro com o mesmo ${fieldName}!`,

    accountLocked: "Conta bloqueada! Entre em contato com o suporte!",
    invalidToken: "Token inválido, Faça login novamente!",

    timeoutError: "Tempo de espera excedido, Tente novamente mais tarde!",
    databaseConnectionError: "Erro de conexão com o banco de dados, Tente novamente mais tarde!",
    emailAlreadyExists: (email: string) => `O endereço de e-mail ${email} já está em uso!`,

    invalidCredentials: "Credenciais inválidas! Verifique seu usuário e senha!",
  },
};

export const sendError = (res: any, code: number, errors: any[] | object | string = []): any => {
  let _errors: any[] | undefined = undefined;

  if (Array.isArray(errors)) {
    _errors = errors;
  } else if (typeof errors === "object" && errors !== undefined) {
    _errors = [errors];
  } else {
    _errors = [errors];
  }

  // Verifica se o código é uma chave válida no objeto httpCodes
  const httpMessage = messages.httpCodes[code as keyof typeof messages.httpCodes] || "Mensagem de erro desconhecida";

  return res.status(code).json({
    data: [],
    error: true,
    code: code,
    message: httpMessage,
    errors: _errors,
  });
};

// export const sendResponse = (res: any, code: number, resp: object = {}): any => {
//     // Verifica se o código é uma chave válida no objeto httpCodes
//     const httpMessage = messages.httpCodes[code as keyof typeof messages.httpCodes] || "Mensagem de sucesso desconhecida";

//     return res.status(code).json({
//         ...{
//             data: [],
//             error: false,
//             code: code,
//             message: httpMessage,
//             errors: []
//         }, ...resp
//     });
// };

export const sendResponse = (res: any, code: number, resp: any = {}): any => {
  const httpMessage = messages.httpCodes[code as keyof typeof messages.httpCodes] || "Mensagem de sucesso desconhecida";

  // Verifica se os dados são binários (Buffer)
  if (resp instanceof Buffer) {
    return res.status(code).send(resp); // Envia dados binários
  }

  // Caso contrário, envia como JSON
  return res.status(code).json({
    ...{
      data: [],
      error: false,
      code: code,
      message: httpMessage,
      errors: []
    }, ...resp
  });
};

export default messages;