import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { db } from './ts/db';

const app = express();
const PORT = 3000;

// Configurações
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir HTML do frontend/
app.use(express.static(path.join(__dirname, "frontend")));

// ROTAS PRODUTOS
app.get('/api/produtos', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM produtos ORDER BY nome');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const { categoria, nome, preco, meta } = req.body;
    const id = "P-" + Date.now().toString(36);

    const r = await db.query(
      'INSERT INTO produtos (id, categoria, nome, preco, meta) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [id, categoria, nome, preco, meta]
    );

    res.json(r.rows[0]);

  } catch (err) {
    console.error("ERRO EM /api/produtos (POST):", err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { categoria, nome, preco, meta } = req.body;

    await db.query(
      'UPDATE produtos SET categoria=$1, nome=$2, preco=$3, meta=$4 WHERE id=$5',
      [categoria, nome, preco, meta, req.params.id]
    );

    res.json({ message: "Produto atualizado" });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM produtos WHERE id=$1', [req.params.id]);
    res.json({ message: "Produto excluído" });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});


// ROTAS CLIENTES
app.get('/api/clientes', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM clientes ORDER BY nome');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, telefone, email, endereco } = req.body;
    const id = 'C-' + Date.now().toString(36);

    await db.query(
      'INSERT INTO clientes (id, nome, telefone, email, endereco) VALUES ($1,$2,$3,$4,$5)',
      [id, nome, telefone, email, endereco]
    );

    res.json({ id, nome, telefone, email, endereco });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar cliente' });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nome, telefone, email, endereco } = req.body;

    await db.query(
      `UPDATE clientes SET nome=$1, telefone=$2, email=$3, endereco=$4 WHERE id=$5`,
      [nome, telefone, email, endereco, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM clientes WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});


// ROTAS PEDIDOS
app.post('/api/pedidos', async (req, res) => {
  try {
    const pedido = req.body;

    await db.query(
      `INSERT INTO pedidos (id, cliente_id, cliente_nome, total, forma_pagamento, troco_para, data_iso)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        pedido.id,
        pedido.clienteId ?? null,
        pedido.clienteNome ?? null,
        pedido.total,
        pedido.formaPagamento,
        pedido.trocoPara ?? null,
        pedido.dataISO
      ]
    );

    for (const item of pedido.itens) {
      await db.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, nome, quantidade, preco_unit, observacao)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          pedido.id,
          item.produtoId ?? null,
          item.nome,
          item.quantidade,
          item.precoUnit,
          item.observacao ?? null
        ]
      );
    }

    res.json({ success: true, pedidoId: pedido.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gravar pedido' });
  }
});

app.get('/api/pedidos', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM pedidos ORDER BY data_iso DESC');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

app.get('/api/pedidos/:id/itens', async (req, res) => {
  try {
    const r = await db.query(
      'SELECT * FROM itens_pedido WHERE pedido_id=$1',
      [req.params.id]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar itens do pedido' });
  }
});

// RELATÓRIOS

// Vendas por período
app.get('/api/relatorios/vendas', async (req, res) => {
  try {
    const { inicio, fim } = req.query;

    const r = await db.query(
      `SELECT * FROM pedidos 
       WHERE data_iso >= $1 AND data_iso <= $2
       ORDER BY data_iso DESC`,
      [inicio, fim]
    );

    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar vendas por período' });
  }
});

// Produtos mais vendidos
app.get('/api/relatorios/produtos', async (req, res) => {
  try {
    const r = await db.query(
      `SELECT 
         nome,
         SUM(quantidade) AS qtd_vendida,
         SUM(quantidade * preco_unit) AS total_vendido
       FROM itens_pedido
       GROUP BY nome
       ORDER BY qtd_vendida DESC`
    );

    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos mais vendidos' });
  }
});

// Clientes que mais compraram
app.get('/api/relatorios/clientes', async (req, res) => {
  try {
    const r = await db.query(
      `SELECT 
        COALESCE(cliente_nome, 'Cliente não identificado') AS cliente,
        COUNT(*) AS total_pedidos,
        SUM(total) AS valor_total
       FROM pedidos
       GROUP BY cliente_nome
       ORDER BY valor_total DESC`
    );

    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes que mais compraram' });
  }
});


// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
