type Lista = {
  id: string;
  nome: string;
  corFundo: string;
  tarefas: Tarefa[];
};

type Tarefa = {
  id: string;
  descricao: string;
};
