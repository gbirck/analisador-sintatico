import { FIM, Gramatica } from "./gramatica";
import type { Producao } from "./gramatica";

export type Passo = {
  pilha: string;
  entrada: string;
  acao: string;
  celula?: { naoTerminal: string; terminal: string };
  erro?: boolean;
};

export type Resultado = {
  passos: Passo[];
  aceita: boolean;
  mensagem: string;
};

export function analisar(gramatica: Gramatica, sentenca: string): Resultado {
  const invalido = [...sentenca].find((c) => !gramatica.terminais.includes(c));

  if (invalido) {
    return {
      passos: [],
      aceita: false,
      mensagem: `ERRO LÉXICO: símbolo "${invalido}" não pertence ao alfabeto {${gramatica.terminais.join(", ")}}`,
    };
  }

  const entrada = [...sentenca, FIM];
  const pilha = [FIM, gramatica.inicial];
  const passos: Passo[] = [];

  let i = 0;

  const registrar = (
    acao: string,
    celula?: Passo["celula"],
    erro = false
  ) => {
    passos.push({
      pilha: pilha.join(" "),
      entrada: entrada.slice(i).join(" "),
      acao,
      celula,
      erro,
    });
  };

  while (true) {
    const topo = pilha[pilha.length - 1];
    const atual = entrada[i];

    if (topo === FIM && atual === FIM) {
      registrar(`Aceito em ${passos.length + 1} passos`);

      return {
        passos,
        aceita: true,
        mensagem: `SENTENÇA ACEITA: ${sentenca || "(vazia)"}`,
      };
    }

    if (!gramatica.ehNaoTerminal(topo)) {
      if (topo === atual) {
        registrar(`Ler ${topo}`);
        pilha.pop();
        i++;
        continue;
      }

      registrar("Erro", undefined, true);

      return {
        passos,
        aceita: false,
        mensagem: `SENTENÇA REJEITADA: esperado "${topo}", encontrado "${atual}"`,
      };
    }

    const celula = { naoTerminal: topo, terminal: atual };
    const producao = gramatica.tabela[topo]?.[atual];

    if (!producao) {
      registrar("Erro", celula, true);

      const esperados = Object.keys(gramatica.tabela[topo]).join(", ");

      return {
        passos,
        aceita: false,
        mensagem: `SENTENÇA REJEITADA: M[${topo}, ${atual}] está vazia (esperado: ${esperados})`,
      };
    }

    registrar(gramatica.formatar(topo, producao), celula);

    pilha.pop();

    for (let k = producao.length - 1; k >= 0; k--) {
      pilha.push(producao[k]);
    }
  }
}

function escolher<T>(lista: T[]) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function profundidadeMinima(gramatica: Gramatica) {
  const profundidade: { [nt: string]: number } = {};

  for (const nt of gramatica.naoTerminais) profundidade[nt] = 99;

  const custo = (producao: Producao) =>
    1 +
    Math.max(
      0,
      ...producao.map((s) => (gramatica.ehNaoTerminal(s) ? profundidade[s] : 0))
    );

  for (let k = 0; k < 20; k++) {
    for (const nt of gramatica.naoTerminais) {
      for (const producao of gramatica.regras[nt]) {
        profundidade[nt] = Math.min(profundidade[nt], custo(producao));
      }
    }
  }

  return { custo };
}

export function gerarSentenca(gramatica: Gramatica) {
  const { custo } = profundidadeMinima(gramatica);

  const derivar = (simbolo: string, nivel: number): string[] => {
    if (!gramatica.ehNaoTerminal(simbolo)) return [simbolo];

    let opcoes = gramatica.regras[simbolo];

    if (nivel > 4) {
      const menor = Math.min(...opcoes.map(custo));
      opcoes = opcoes.filter((p) => custo(p) === menor);
    }

    return escolher(opcoes).flatMap((s) => derivar(s, nivel + 1));
  };

  return derivar(gramatica.inicial, 0).join("");
}

export function gerarSentencaInvalida(gramatica: Gramatica) {
  let sentenca = "";

  for (let tentativa = 0; tentativa < 50; tentativa++) {
    const simbolos = [...gerarSentenca(gramatica)];
    const posicao = Math.floor(Math.random() * (simbolos.length + 1));

    if (Math.random() < 0.5 && simbolos.length > 0) {
      simbolos.splice(Math.min(posicao, simbolos.length - 1), 1);
    } else {
      simbolos.splice(posicao, 0, escolher(gramatica.terminais));
    }

    sentenca = simbolos.join("");

    if (!analisar(gramatica, sentenca).aceita) break;
  }

  return sentenca;
}
