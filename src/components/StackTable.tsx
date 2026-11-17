import { Gramatica } from "../logic/gramatica";
import type { Passo } from "../logic/analisador";
import "./StackTable.css";

type Props = {
  gramatica: Gramatica;
  passos: Passo[];
  total: number;
};

function colorir(gramatica: Gramatica, texto: string) {
  return texto.split(" ").map((simbolo, i) => {
    const ehTerminal =
      simbolo !== "$" && !gramatica.ehNaoTerminal(simbolo);

    return (
      <span
        key={i}
        className={ehTerminal ? "stack-table-terminal" : undefined}
      >
        {simbolo}{" "}
      </span>
    );
  });
}

export default function StackTable({ gramatica, passos, total }: Props) {
  return (
    <div className="stack-table">
      <h2>Passos da pilha</h2>

      <table className="stack-table-table">
        <thead>
          <tr>
            <th>Pilha</th>
            <th>Entrada</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {passos.map((passo, i) => {
            const ultimo = i === total - 1;

            const rowClasses = [];

            if (ultimo) rowClasses.push("stack-table-row-final");
            else if (i === passos.length - 1) {
              rowClasses.push("stack-table-row-atual");
            }

            return (
              <tr key={i} className={rowClasses.join(" ")}>
                <td>{colorir(gramatica, passo.pilha)}</td>
                <td>{colorir(gramatica, passo.entrada)}</td>
                <td>{passo.acao}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
