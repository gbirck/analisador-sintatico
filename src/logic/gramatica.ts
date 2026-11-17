export type Producao = string[];

type Regras = {
  [naoTerminal: string]: Producao[];
};

type Conjuntos = {
  [naoTerminal: string]: Set<string>;
};

type TabelaParsing = {
  [naoTerminal: string]: {
    [terminal: string]: Producao;
  };
};

export const EPSILON = "ε";
export const FIM = "$";

export class Gramatica {
  inicial = "S";

  regras: Regras = {
    S: [["A", "B"]],
    A: [["a", "A"], []],
    B: [["b", "C"], ["d"]],
    C: [["c", "C"], []],
  };

  naoTerminais: string[] = [];
  terminais: string[] = [];

  first: Conjuntos = {};
  follow: Conjuntos = {};

  tabela: TabelaParsing = {};
  conflitos: string[] = [];

  constructor() {
    this.naoTerminais = Object.keys(this.regras);

    this.descobrirTerminais();
    this.calcularFirst();
    this.calcularFollow();
    this.montarTabela();
  }

  ehNaoTerminal(simbolo: string) {
    return this.naoTerminais.includes(simbolo);
  }

  formatar(naoTerminal: string, producao: Producao) {
    return `${naoTerminal} → ${producao.length > 0 ? producao.join("") : EPSILON}`;
  }

  firstDaSequencia(sequencia: Producao) {
    const resultado = new Set<string>();

    for (const simbolo of sequencia) {
      if (!this.ehNaoTerminal(simbolo)) {
        resultado.add(simbolo);
        return resultado;
      }

      for (const s of this.first[simbolo]) {
        if (s !== EPSILON) resultado.add(s);
      }

      if (!this.first[simbolo].has(EPSILON)) {
        return resultado;
      }
    }

    resultado.add(EPSILON);

    return resultado;
  }

  private descobrirTerminais() {
    const encontrados = new Set<string>();

    for (const nt of this.naoTerminais) {
      for (const producao of this.regras[nt]) {
        for (const simbolo of producao) {
          if (!this.ehNaoTerminal(simbolo)) encontrados.add(simbolo);
        }
      }
    }

    this.terminais = [...encontrados].sort();
  }

  private calcularFirst() {
    for (const nt of this.naoTerminais) {
      this.first[nt] = new Set();
    }

    let mudou = true;

    while (mudou) {
      mudou = false;

      for (const nt of this.naoTerminais) {
        for (const producao of this.regras[nt]) {
          for (const s of this.firstDaSequencia(producao)) {
            if (!this.first[nt].has(s)) {
              this.first[nt].add(s);
              mudou = true;
            }
          }
        }
      }
    }
  }

  private calcularFollow() {
    for (const nt of this.naoTerminais) {
      this.follow[nt] = new Set();
    }

    this.follow[this.inicial].add(FIM);

    let mudou = true;

    while (mudou) {
      mudou = false;

      for (const nt of this.naoTerminais) {
        for (const producao of this.regras[nt]) {
          producao.forEach((simbolo, i) => {
            if (!this.ehNaoTerminal(simbolo)) return;

            const resto = this.firstDaSequencia(producao.slice(i + 1));

            for (const s of resto) {
              if (s !== EPSILON && !this.follow[simbolo].has(s)) {
                this.follow[simbolo].add(s);
                mudou = true;
              }
            }

            if (resto.has(EPSILON)) {
              for (const s of this.follow[nt]) {
                if (!this.follow[simbolo].has(s)) {
                  this.follow[simbolo].add(s);
                  mudou = true;
                }
              }
            }
          });
        }
      }
    }
  }

  private montarTabela() {
    for (const nt of this.naoTerminais) {
      this.tabela[nt] = {};
    }

    const colocar = (nt: string, terminal: string, producao: Producao) => {
      if (this.tabela[nt][terminal]) {
        this.conflitos.push(`M[${nt}, ${terminal}]`);
        return;
      }

      this.tabela[nt][terminal] = producao;
    };

    for (const nt of this.naoTerminais) {
      for (const producao of this.regras[nt]) {
        const primeiros = this.firstDaSequencia(producao);

        for (const t of primeiros) {
          if (t !== EPSILON) colocar(nt, t, producao);
        }

        if (primeiros.has(EPSILON)) {
          for (const t of this.follow[nt]) colocar(nt, t, producao);
        }
      }
    }
  }
}
