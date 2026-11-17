import { FIM, Gramatica } from "../logic/gramatica";
import type { Passo } from "../logic/analisador";
import "./ParsingTable.css";

type Props = {
  gramatica: Gramatica;
  passoAtual?: Passo;
};

export default function ParsingTable({ gramatica, passoAtual }: Props) {
  const colunas = [...gramatica.terminais, FIM];

  return (
    <div className="parsing-table">
      <h2>Tabela de Parsing</h2>

      <table className="parsing-table-table">
        <thead>
          <tr>
            <th></th>

            {colunas.map((terminal) => (
              <th key={terminal}>{terminal}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {gramatica.naoTerminais.map((nt) => (
            <tr key={nt}>
              <td>
                <strong>{nt}</strong>
              </td>

              {colunas.map((terminal) => {
                const producao = gramatica.tabela[nt][terminal];

                const isActive =
                  passoAtual?.celula?.naoTerminal === nt &&
                  passoAtual?.celula?.terminal === terminal;

                const cellClasses = ["parsing-table-cell"];

                if (isActive) {
                  cellClasses.push(
                    passoAtual?.erro
                      ? "parsing-table-cell-error"
                      : "parsing-table-cell-active"
                  );
                }

                return (
                  <td key={terminal} className={cellClasses.join(" ")}>
                    {producao ? gramatica.formatar(nt, producao) : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {gramatica.conflitos.length > 0 ? (
        <p className="parsing-table-aviso parsing-table-aviso-erro">
          Conflitos: {gramatica.conflitos.join(", ")}. A gramática não é LL(1).
        </p>
      ) : (
        <p className="parsing-table-aviso">
          Nenhuma célula com conflito: a gramática é LL(1).
        </p>
      )}
    </div>
  );
}
