CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    endereco TEXT
);

CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    categoria TEXT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    meta TEXT
);

CREATE TABLE IF NOT EXISTS pedidos (
    id TEXT PRIMARY KEY,
    cliente_id TEXT REFERENCES clientes(id),
    cliente_nome TEXT,
    total NUMERIC(10,2),
    forma_pagamento TEXT,
    troco_para NUMERIC(10,2),
    data_iso TEXT
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id TEXT REFERENCES pedidos(id),
    produto_id TEXT,
    nome TEXT,
    quantidade INTEGER,
    preco_unit NUMERIC(10,2),
    observacao TEXT
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    cliente_nome TEXT,
    nota INT,
    data_hora TEXT
);
