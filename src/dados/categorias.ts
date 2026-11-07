export interface Categoria {
  id: number;
  nome: string;
  tipo: 'receita' | 'fixa' | 'variavel';
}

export const categorias: Categoria[] = [
  // RECEITAS

  {
    id: 1,
    nome: 'Salário',
    tipo: 'receita',
  },

  {
    id: 2,
    nome: 'Freelance',
    tipo: 'receita',
  },

  {
    id: 3,
    nome: 'Investimentos',
    tipo: 'receita',
  },

  // FIXAS

  {
    id: 4,
    nome: 'Internet',
    tipo: 'fixa',
  },

  {
    id: 5,
    nome: 'Energia',
    tipo: 'fixa',
  },

  {
    id: 6,
    nome: 'Água',
    tipo: 'fixa',
  },

  {
    id: 7,
    nome: 'Academia',
    tipo: 'fixa',
  },

  {
    id: 8,
    nome: 'Aluguel',
    tipo: 'fixa',
  },

  // VARIÁVEIS

  {
    id: 9,
    nome: 'Mercado',
    tipo: 'variavel',
  },

  {
    id: 10,
    nome: 'Transporte',
    tipo: 'variavel',
  },

  {
    id: 11,
    nome: 'Lazer',
    tipo: 'variavel',
  },

  {
    id: 12,
    nome: 'Restaurante',
    tipo: 'variavel',
  },
];
