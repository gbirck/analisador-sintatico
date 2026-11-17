import { Gramatica, EPSILON } from "../logic/gramatica";
import "./GrammarView.css";

type Props = {
  gramatica: Gramatica;
};

const formatarConjunto = (conjunto: Set<string>) =>
  `{ ${[...conjunto].join(", ")} }`;

export default function GrammarView({ gramatica }: Props) {
  return (
    <div className="grammar-view">
      <h2>Gramática</h2>

      <ul className="grammar-view-rules">
        {gramatica.naoTerminais.map((nt) => (
          <li key={nt} className="grammar-view-rule">
            {nt} →{" "}
            {gramatica.regras[nt]
              .map((p) => (p.length > 0 ? p.join("") : EPSILON))
              .join(" | ")}
          </li>
        ))}
      </ul>

      <h2>Conjuntos FIRST e FOLLOW</h2>

      <table className="grammar-view-table">
        <thead>
          <tr>
            <th>Não-terminal</th>
            <th>FIRST</th>
            <th>FOLLOW</th>
          </tr>
        </thead>

        <tbody>
          {gramatica.naoTerminais.map((nt) => (
            <tr key={nt}>
              <td>
                <strong>{nt}</strong>
              </td>
              <td>{formatarConjunto(gramatica.first[nt])}</td>
              <td>{formatarConjunto(gramatica.follow[nt])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
