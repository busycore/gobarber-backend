// Criamos uma interface que diz que podemos ter dinamicamente
// As chaves(nome do campo) deverão ser uma string
// E o conteudo do campo deverá ser um número
interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

// variables : {name : 'blabla,link :'http:...',etc..}
