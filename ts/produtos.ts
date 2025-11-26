import { db } from './db';

export interface Produto {
  id?: string;
  categoria: string;
  nome: string;
  descricao?: string;
  preco: number;
  meta?: string;
}

// Gera os IDs dos produtos
function nid(prefix: string = ''): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return prefix + timestamp + random;
}

export async function cadastrarProduto(prod: Produto): Promise<Produto> {
  prod.id = prod.id ?? nid('P-');

  await db.query(
    `INSERT INTO produtos (id, categoria, nome, descricao, preco, meta)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      prod.id,
      prod.categoria,
      prod.nome,
      prod.descricao ?? null,
      prod.preco,
      prod.meta ?? null
    ]
  );

  console.log(`Produto cadastrado: ${prod.nome}`);
  return prod;
}

