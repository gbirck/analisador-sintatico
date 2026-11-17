import "./App.css";
import { useState } from "react";

import GrammarView from "./components/GrammarView";
import ParsingTable from "./components/ParsingTable";
import SyntaxAnalyzer from "./components/SyntaxAnalyzer";

import type { Passo } from "./logic/analisador";
import { Gramatica } from "./logic/gramatica";

const gramatica = new Gramatica();

export default function App() {
  const [passoAtual, setPassoAtual] = useState<Passo | undefined>();

  return (
    <div className="app">
      <h1 className="app-title">Analisador Sintático LL(1)</h1>

      <section className="app-section">
        <GrammarView gramatica={gramatica} />
      </section>

      <section className="app-section">
        <ParsingTable gramatica={gramatica} passoAtual={passoAtual} />
      </section>

      <section className="app-section">
        <SyntaxAnalyzer
          gramatica={gramatica}
          onPassoAtualChange={setPassoAtual}
        />
      </section>
    </div>
  );
}
