# Analisador Sintático LL(1)

Analisador sintático top-down preditivo tabular (pilha, sem recursão) para uma GLC LL(1).

## Gramática

```
S → AB
A → aA | ε
B → bC | d
C → cC | ε
```

Linguagem gerada: `a* (b c* | d)`. Exemplos aceitos: `aaabc`, `bcc`, `ad`, `d`.

## Como rodar

1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
3. Abra http://localhost:5173 no navegador

## Como funciona

### GrammarView
Mostra a gramática e os conjuntos FIRST e FOLLOW, calculados automaticamente.

### SyntaxAnalyzer
Recebe a sentença (ou gera uma válida/inválida), executa a análise e mostra o resultado (aceita ou rejeitada). Permite ver tudo de uma vez ou passo a passo, e reiniciar com "Nova análise".

### StackTable
Mostra cada passo da pilha: conteúdo da pilha, entrada restante e ação (`Ler a`, `A → aA`, ...).

### ParsingTable
Tabela de parsing M[N, t]. A célula usada no passo atual fica destacada (verde, ou vermelho em caso de erro).

## Estrutura

```
src/
├── App.tsx                  # Componente principal
├── components/
│   ├── GrammarView.tsx      # Gramática, FIRST e FOLLOW
│   ├── SyntaxAnalyzer.tsx   # Entrada, botões e resultado
│   ├── StackTable.tsx       # Passos da pilha
│   └── ParsingTable.tsx     # Tabela de parsing
├── logic/
│   ├── gramatica.ts         # GLC, FIRST, FOLLOW e tabela
│   └── analisador.ts        # Parser LL(1) e geração de sentenças
└── index.css                # Estilos globais
```

## Para trocar a gramática

Edite apenas o objeto `regras` em `src/logic/gramatica.ts` (e o símbolo `inicial`). FIRST, FOLLOW e a tabela são recalculados sozinhos.

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Verifica os tipos e gera a versão de produção
