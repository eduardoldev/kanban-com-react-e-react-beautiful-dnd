import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const listasExemplo: Lista[] = [
  {
    id: "a0b2a4a6-b419-4bf9-a7ee-c79ed74b2be9",
    nome: "A Fazer",
    corFundo: "#4C90F0",
    tarefas: [],
  },
  {
    id: "fd39e75b-e04c-43a5-a95c-398d692cb9c7",
    nome: "Fazendo",
    corFundo: "#9881F3",
    tarefas: [],
  },
  {
    id: "cbbf87ed-d7fb-45e5-b5e9-23dcc0880147",
    nome: "Feito",
    corFundo: "#32A467",
    tarefas: [],
  },
];

function App() {
  const [listas, setListas] = useState<Lista[]>(listasExemplo);

  const handleAdicionarTarefa = () => {
    let descricao = window.prompt("Digite a descrição da tarefa:");
    if (descricao) {
      const newListas = [...listas];
      newListas[0].tarefas.push({
        descricao: descricao,
        id: uuidv4(),
      });
      return setListas(newListas);
    }
    alert("Descrição inválida!");
  };

  const handleRemoverTarefa = (indexLista: number, indexTarefa: number) => {
    const newListas = [...listas];
    newListas[indexLista] = {
      ...newListas[indexLista],
      tarefas: newListas[indexLista].tarefas.filter(
        (_, i) => i !== indexTarefa
      ),
    };
    return setListas(newListas);
  };

  const handleDragDrop = (result: DropResult) => {
    const { source, destination, type } = result;
    if (destination) {
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;
      const newListas = [...listas];
      const sourceIndex = source.index;
      const destinationIndex = destination?.index;
      if (type === "group") {
        const [listaRemovida] = newListas.splice(sourceIndex, 1);
        newListas.splice(destinationIndex, 0, listaRemovida);
        return setListas(newListas);
      }

      const indexListaSource = newListas.findIndex(
        (lista) => lista.id === source.droppableId
      );
      const indexListaDestination = newListas.findIndex(
        (lista) => lista.id === destination.droppableId
      );

      const [itemRemovido] = newListas[indexListaSource].tarefas.splice(
        sourceIndex,
        1
      );

      newListas[indexListaDestination].tarefas.splice(
        destination.index,
        0,
        itemRemovido
      );

      return setListas(newListas);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div>
        <h1>Kanban com React e react-beautiful-dnd</h1>
      </div>
      <DragDropContext onDragEnd={handleDragDrop}>
        <Droppable droppableId="ROOT" type="group" direction="horizontal">
          {(provided) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  flex: 1,
                }}
              >
                {listas.map((lista: Lista, indexLista: number) => (
                  <Draggable
                    draggableId={lista.id}
                    key={lista.id}
                    index={indexLista}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        key={indexLista}
                      >
                        <div
                          style={{
                            backgroundColor: lista.corFundo,
                            border: "1px solid #c2c2c2",
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <h3>{lista.nome}</h3>
                          <div
                            style={{
                              padding: 16,
                              width: 300,
                              minHeight: 300,
                              height: "100%",
                            }}
                          >
                            <Droppable droppableId={lista.id}>
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 4,
                                      flex: 1,
                                    }}
                                  >
                                    {lista.tarefas.map(
                                      (tarefa, indexTarefa) => (
                                        <Draggable
                                          draggableId={tarefa.id}
                                          key={tarefa.id}
                                          index={indexTarefa}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.dragHandleProps}
                                              {...provided.draggableProps}
                                            >
                                              <div
                                                style={{
                                                  backgroundColor: "white",
                                                  border: "1px solid #c2c2c2",
                                                  padding: 8,
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "space-between",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <div>{tarefa.descricao}</div>
                                                  <button
                                                    onClick={() => {
                                                      handleRemoverTarefa(
                                                        indexLista,
                                                        indexTarefa
                                                      );
                                                    }}
                                                    style={{
                                                      width: 32,
                                                      height: 32,
                                                    }}
                                                  >
                                                    x
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
              <button
                style={{ padding: 16 }}
                onClick={() => {
                  handleAdicionarTarefa();
                }}
              >
                Adicionar Tarefa
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
