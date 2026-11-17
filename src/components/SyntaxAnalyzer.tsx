import { useEffect, useState } from "react";

import { Gramatica } from "../logic/gramatica";
import {
  analisar,
  gerarSentenca,
  gerarSentencaInvalida,
} from "../logic/analisador";
import type { Passo, Resultado } from "../logic/analisador";

import StackTable from "./StackTable";
import "./SyntaxAnalyzer.css";

type Props = {
  gramatica: Gramatica;
  onPassoAtualChange: (passoAtual: Passo | undefined) => void;
};

export default function SyntaxAnalyzer({
  gramatica,
  onPassoAtualChange,
}: Props) {
  const [sentenca, setSentenca] = useState("");

  const [resultado, setResultado] = useState<Resultado | null>(null);
  
  const [mostrados, setMostrados] = useState(0);

  const iniciar = (passoAPasso: boolean) => {
    const limpa = sentenca.replace(/\s+/g, "");

    const novo = analisar(gramatica, limpa);

    setResultado(novo);

    setMostrados(
      passoAPasso ? Math.min(1, novo.passos.length) : novo.passos.length
    );
  };

  const reiniciar = () => {
    setSentenca("");
    setResultado(null);
    setMostrados(0);
  };

  const gerar = (valida: boolean) => {
    setSentenca(
      valida ? gerarSentenca(gramatica) : gerarSentencaInvalida(gramatica)
    );

    setResultado(null);
    setMostrados(0);
  };

  const passosVisiveis = resultado ? resultado.passos.slice(0, mostrados) : [];

  const terminou = resultado !== null && mostrados >= resultado.passos.length;
  const passoAtual = passosVisiveis[passosVisiveis.length - 1];

  useEffect(() => {
    onPassoAtualChange(passoAtual);
  }, [onPassoAtualChange, passoAtual]);

  return (
    <div className="syntax-analyzer">
      <h2>Analisador Sintático</h2>

      <div className="syntax-analyzer-form">
        <input
          className="syntax-analyzer-input"
          type="text"
          value={sentenca}
          onChange={(e) => setSentenca(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") iniciar(false);
          }}
          placeholder="Digite uma sentença (ex.: aaabc)"
        />

        <button
          className="syntax-analyzer-button"
          onClick={() => iniciar(false)}
        >
          Analisar
        </button>

        <button
          className="syntax-analyzer-button"
          onClick={() => iniciar(true)}
        >
          Passo a passo
        </button>
      </div>

      <div className="syntax-analyzer-form">
        <button
          className="syntax-analyzer-button syntax-analyzer-button-secondary"
          onClick={() => gerar(true)}
        >
          Gerar sentença válida
        </button>

        <button
          className="syntax-analyzer-button syntax-analyzer-button-secondary"
          onClick={() => gerar(false)}
        >
          Gerar sentença inválida
        </button>

        <button
          className="syntax-analyzer-button syntax-analyzer-button-secondary"
          onClick={reiniciar}
        >
          Nova análise
        </button>
      </div>

      {resultado && resultado.passos.length > 0 && (
        <StackTable
          gramatica={gramatica}
          passos={passosVisiveis}
          total={resultado.passos.length}
        />
      )}

      {resultado && resultado.passos.length > 0 && (
        <div className="syntax-analyzer-form">
          {mostrados > 0 && (
            <button
              className="syntax-analyzer-button syntax-analyzer-button-secondary"
              onClick={() => setMostrados((m) => m - 1)}
            >
              Passo anterior
            </button>
          )}

          {!terminou && (
            <button
              className="syntax-analyzer-button"
              onClick={() => setMostrados((m) => m + 1)}
            >
              Próximo passo
            </button>
          )}

          {!terminou && (
            <button
              className="syntax-analyzer-button syntax-analyzer-button-secondary"
              onClick={() => setMostrados(resultado.passos.length)}
            >
              Mostrar tudo
            </button>
          )}
        </div>
      )}

      {terminou && (
        <p
          className={
            resultado.aceita
              ? "syntax-analyzer-message syntax-analyzer-message-ok"
              : "syntax-analyzer-message syntax-analyzer-message-error"
          }
        >
          {resultado.mensagem}
        </p>
      )}

    </div>
  );
}
