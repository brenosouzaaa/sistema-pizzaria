  import * as path from 'path';
  import { promises as fs } from 'fs';
  import { stdin as input, stdout as output } from 'process';
  import * as readline from 'readline';

  import "dotenv/config";
  import { db } from "./db";

  export type { Produto, Cliente, ItemCarrinho, Pedido };
  export { lerClientes, lerProdutos, adicionarAoCarrinho, gravarPedido };


  const DATA_DIR = path.join(__dirname, 'src'); 
  const ARQ = {
    clientes: path.join(DATA_DIR, 'clientes.csv'),
    produtos: path.join(DATA_DIR, 'produtos.csv'),
    pedidos: path.join(DATA_DIR, 'pedidos.csv'),
    resumo: path.join(DATA_DIR, 'resumo.txt'),
    comprovante: path.join(DATA_DIR, 'comprovante.txt'),
    avaliacoes: path.join(DATA_DIR, 'avaliacoes.txt'),
  };

  type FormaPagamento = 'Pix' | 'Cartão' | 'Dinheiro' | 'Vale-alimentacao';

  interface Cliente {
    id: string; // uuid simples (timestamp)
    nome: string;
    telefone: string;
    email?: string;
    endereco?: string;
  }

  interface Produto {
    id: string;
    categoria: 'Pizza' | 'Bebida' | 'Outros';
    nome: string; // exemplo: "Frango com catupiry"
    descricao?: string;
    preco: number; // preço padrão (p/ pizza pode ser preço da inteira)
    meta?: string; // por ex. "12 pedaços" ou "Lata"
  }

  interface ItemCarrinho {
    produtoId: string;
    nome: string;
    quantidade: number;
    precoUnit: number;
    observacao?: string;
  }

  interface Pedido {
    id: string;
    clienteId?: string;
    clienteNome?: string;
    itens: ItemCarrinho[];
    total: number;
    formaPagamento: FormaPagamento;
    trocoPara?: number; // se pagou em dinheiro
    dataISO: string;
  }

  // util simples para criar ids
  function nid(prefix = '') {
    return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  }

  // ---------- I/O CSV helpers ----------
  async function ensureFiles() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true});
    } catch (e) {
      console.error("Erro ao criar pasta CSV:", e);
    }

    // cria arquivos se não existirem
    const files = Object.values(ARQ);
    for (const f of files) {
      try {
        await fs.access(f);
      } catch {
        // criar arquivo vazio
        await fs.writeFile(f, '', 'utf8');
      }
    }
  }

  async function lerCSV<T>(file: string, parser: (cols: string[]) => T): Promise<T[]> {
    try {
      const raw = await fs.readFile(file, 'utf8');
      const linhas = raw.split(/\r?\n/).filter(Boolean);
      return linhas.map(l => parser(l.split(',')));
    } catch {
      return [];
    }
  }

  async function appendCSV(file: string, line: string) {
    await fs.appendFile(file, line + '\n', 'utf8');
  }

  async function writeCSV(file: string, lines: string[]) {
    await fs.writeFile(file, lines.join('\n'), 'utf8');
  }

  // ---------- Clientes ----------

  //Usando o banco de dados
  async function cadastrarCliente(
  nome: string, telefone: string, email?: string, endereco?: string
): Promise<Cliente> {

  const clientes = await lerClientes();

  const existente = clientes.find(c =>
    c.telefone === telefone.trim() ||
    (email && c.email === email.trim())
  );

  if (existente) {
    console.log(`Cliente já cadastrado: ${existente.nome} (ID: ${existente.id})`);
    return existente;
  }

  const cliente: Cliente = {
    id: nid("C-"),
    nome: nome.trim(),
    telefone: telefone.trim(),
    email: email?.trim(),
    endereco: endereco?.trim()
  };

  await db.query(
    `INSERT INTO clientes (id, nome, telefone, email, endereco)
     VALUES ($1, $2, $3, $4, $5)`,
    [cliente.id, cliente.nome, cliente.telefone, cliente.email, cliente.endereco]
  );

  console.log(`Cliente cadastrado: ${cliente.nome} (ID: ${cliente.id})`);
  return cliente;
}


  async function lerClientes(): Promise<Cliente[]> {
  const r = await db.query("SELECT * FROM clientes ORDER BY nome");
  return r.rows;
}


  //Usando o banco de dados
  async function consultarCliente(idOrNome: string): Promise<Cliente | null> {
  const chave = idOrNome.trim();

  const r = await db.query(
    `SELECT * FROM clientes
     WHERE id = $1 OR LOWER(nome) LIKE LOWER($2)
     LIMIT 1`,
    [chave, `%${chave}%`]
  );

  return r.rows[0] || null;
}

  //Usando o banco de dados
  async function atualizarCliente(id: string, updates: Partial<Cliente>): Promise<boolean> {
  const campos: string[] = [];
  const valores: any[] = [];
  let idx = 1;

  for (const k in updates) {
    campos.push(`${k} = $${idx++}`);
    valores.push((updates as any)[k]);
  }

  if (campos.length === 0) return false;

  valores.push(id);

  const r: any = await db.query(
    `UPDATE clientes SET ${campos.join(', ')} WHERE id = $${idx}`,
    valores
  );

  return r.rowCount > 0;
}

  //Usando o banco de dados
  async function excluirCliente(id: string): Promise<boolean> {
  const r: any = await db.query("DELETE FROM clientes WHERE id = $1", [id]);
  return r.rowCount > 0;
}


  // ---------- Produtos ----------

  async function cadastrarProduto(prod: Produto): Promise<Produto> {
  prod.id = prod.id ?? nid("P-");

  await db.query(
    `INSERT INTO produtos (id, categoria, nome, descricao, preco, meta)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [prod.id, prod.categoria, prod.nome, prod.descricao, prod.preco, prod.meta]
  );

  console.log(`Produto cadastrado: ${prod.nome} (R$ ${prod.preco.toFixed(2)})`);
  return prod;
}


  async function lerProdutos(): Promise<Produto[]> {
  const r = await db.query("SELECT * FROM produtos ORDER BY nome");

  return r.rows.map(p => ({
    ...p,
    preco: Number(p.preco) || 0
  }));
}


async function procurarProdutos(chave: string): Promise<Produto[]> {
  const r = await db.query(
    `SELECT * FROM produtos WHERE LOWER(nome) LIKE $1`,
    [`%${chave.toLowerCase()}%`]
  );
  return r.rows;
}

  // ---------- Pedidos / Carrinho ----------
  let CARRINHO: ItemCarrinho[] = [];

  function verCarrinho() {
    if (CARRINHO.length === 0) {
      console.log('\n-- Carrinho vazio --');
      return;
    }
    console.log('\n--- Carrinho ---');
    let i = 1;
    for (const it of CARRINHO) {
      console.log(`${i}) ${it.nome} x${it.quantidade} - R$ ${(it.precoUnit * it.quantidade).toFixed(2)} ${it.observacao ? `(${it.observacao})` : ''}`);
      i++;
    }
    const total = CARRINHO.reduce((s, it) => s + it.precoUnit * it.quantidade, 0);
    console.log(`Total parcial: R$ ${total.toFixed(2)}`);
  }

  function adicionarAoCarrinho(item: ItemCarrinho) {
    // se já existe mesmo produto sem observação, soma quantidade
    const existente = CARRINHO.find(ci => ci.produtoId === item.produtoId && (ci.observacao ?? '') === (item.observacao ?? ''));
    if (existente) {
      existente.quantidade += item.quantidade;
    } else {
      CARRINHO.push({ ...item });
    }
    console.log(`Adicionado ao carrinho: ${item.nome} x${item.quantidade}`);
  }

  function removerDoCarrinho(idx: number) {
    if (idx < 1 || idx > CARRINHO.length) {
      console.log('Índice inválido.');
      return false;
    }
    const it = CARRINHO.splice(idx - 1, 1)[0];
    console.log(`Removido do carrinho: ${it.nome}`);
    return true;
  }

  async function finalizarPedido(clienteIdOpt?: string): Promise<Pedido | null> {
    if (CARRINHO.length === 0) {
      console.log('Carrinho vazio. Não é possível finalizar pedido.');
      return null;
    }
    const clientes = await lerClientes();
    const cliente = clienteIdOpt ? clientes.find(c => c.id === clienteIdOpt) : undefined;

    const total = CARRINHO.reduce((s, it) => s + it.precoUnit * it.quantidade, 0);
    console.log(`Total do pedido: R$ ${total.toFixed(2)}`);

    // escolher forma pagamento (interação deverá ser feita pelo menu principal)
    // Aqui apenas preparamos o pedido e retornamos para o fluxo interativo tratar o pagamento
    const pedido: Pedido = {
      id: nid('O-'),
      clienteId: cliente?.id,
      clienteNome: cliente?.nome,
      itens: JSON.parse(JSON.stringify(CARRINHO)),
      total,
      formaPagamento: 'Dinheiro',
      dataISO: new Date().toISOString(),
    };
    return pedido;
  }

  async function gravarPedido(pedido: Pedido) {
  // Insere o pedido na tabela 'pedidos'
  await db.query(
    `INSERT INTO pedidos (id, cliente_id, cliente_nome, total, forma_pagamento, troco_para, data_iso)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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

  // Insere os itens na tabela 'itens_pedido'
  for (const item of pedido.itens) {
    await db.query(
      `INSERT INTO itens_pedido (pedido_id, produto_id, nome, quantidade, preco_unit, observacao)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        pedido.id,
        item.produtoId || null,
        item.nome,
        item.quantidade,
        item.precoUnit,
        item.observacao || null
      ]
    );
  }

  // Limpa o carrinho
  CARRINHO = [];
  console.log(`Pedido ${pedido.id} gravado no banco. Total R$ ${pedido.total.toFixed(2)}. Forma: ${pedido.formaPagamento}`);
}



// ---------- Relatórios ----------
async function gerarRelatorios() {
  const pedidos = await lerPedidos();
  if (pedidos.length === 0) {
    console.log('Nenhum pedido registrado.');
    return;
  }

  // total de vendas
  const totalVendas = pedidos.reduce((s, p) => s + p.total, 0);
  console.log(`Total vendas: R$ ${totalVendas.toFixed(2)} (${pedidos.length} pedidos)`);

  // vendas por cliente (nome)
  const vendasPorCliente = new Map<string, { total: number; qty: number }>();
  for (const p of pedidos) {
    const key = p.clienteNome ?? 'Cliente não informado';
    const cur = vendasPorCliente.get(key) ?? { total: 0, qty: 0 };
    cur.total += p.total;
    cur.qty += 1;
    vendasPorCliente.set(key, cur);
  }
  console.log('\nVendas por cliente:');
  vendasPorCliente.forEach((v, nome) => {
    console.log(`Cliente: ${nome}, Quantidade: ${v.qty}, Total: R$ ${v.total.toFixed(2)}`);
  });

  // produtos mais vendidos
  const contagemProdutos = new Map<string, number>();
  for (const p of pedidos) {
    for (const it of p.itens) {
      const cur = contagemProdutos.get(it.nome) ?? 0;
      contagemProdutos.set(it.nome, cur + it.quantidade);
    }
  }
  const ordenado = Array.from(contagemProdutos.entries()).sort((a, b) => b[1] - a[1]);
  console.log('\nProdutos mais vendidos (por unidades):');
  for (const [nome, q] of ordenado.slice(0, 10)) {
    console.log(`- ${nome}: ${q}`);
  }

  const pizzasPorDia = new Map<string, number>();
  let totalPizzasMes = 0;

  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  for (const p of pedidos) {
    for (const it of p.itens) {
      const nome = it.nome.toLowerCase();
      if (
        nome.includes("inteira") ||
        nome.includes("meia") || 
        nome.includes("pizza")
      ) { 
        const dataPedido = p.dataISO ? new Date(p.dataISO) : new Date();
        const chaveDia = dataPedido.toLocaleDateString('pt-BR');

        // pizzas por dia
        const qtdDia = pizzasPorDia.get(chaveDia) ?? 0;
        pizzasPorDia.set(chaveDia, qtdDia + it.quantidade);

        // pizzas no mês atual
        if (dataPedido.getMonth() === mesAtual && dataPedido.getFullYear() === anoAtual) {
          totalPizzasMes += it.quantidade;
        }
      }
    }
  }

  console.log("\nQuantidade de pizzas vendidas por dia:");
  pizzasPorDia.forEach((qtd, dia) => {
    console.log(`${dia}: ${qtd} pizzas`);
  });
  console.log(`\nQuantidade de pizzas vendidas no mês: ${totalPizzasMes}`);

  // export resumo em arquivo resumo.txt
  const linhasResumo = [
    `Resumo de Vendas - ${new Date().toLocaleString()}`,
    `Total pedidos: ${pedidos.length}`,
    `Total vendas: R$ ${totalVendas.toFixed(2)}`,
    '',
    'Top produtos:',
    ...ordenado.slice(0, 10).map(([n, q]) => `${n}: ${q}`),
    '',
    'Vendas por cliente:',
    ...Array.from(vendasPorCliente.entries()).map(([n, s]) => `${n}: ${s.qty} pedidos - R$ ${s.total.toFixed(2)}`),
    '',
    'Pizza por dia:',
    ...Array.from(pizzasPorDia.entries()).map(([dia, qtd]) => `${dia}: ${qtd} pizzas`),
    '',
    `Pizzas no mês: ${totalPizzasMes}`
  ];
  await fs.writeFile(ARQ.resumo, linhasResumo.join('\n'), 'utf8');
}

async function lerPedidos(): Promise<Pedido[]> {
  // Consulta todos os pedidos
  const pedidosRes = await db.query(`SELECT * FROM pedidos ORDER BY data_iso`);

  const pedidos: Pedido[] = [];

  for (const p of pedidosRes.rows) {
    // Consulta os itens de cada pedido
    const itensRes = await db.query(
      `SELECT * FROM itens_pedido WHERE pedido_id = $1`,
      [p.id]
    );

    const itens: ItemCarrinho[] = itensRes.rows.map(it => ({
      produtoId: it.produto_id ?? '',
      nome: it.nome,
      quantidade: it.quantidade,
      precoUnit: Number(it.preco_unit) || 0,
      observacao: it.observacao ?? undefined
    }));

    pedidos.push({
      id: p.id,
      clienteId: p.cliente_id ?? undefined,
      clienteNome: p.cliente_nome ?? undefined,
      itens,
      total: Number(p.total) || 0,
      formaPagamento: p.forma_pagamento as FormaPagamento || 'Dinheiro',
      trocoPara: p.troco_para !== null ? Number(p.troco_para) : undefined,
      dataISO: p.data_iso
    });
  }

  return pedidos;
}

  // ---------- FILTRO DE PEDIDOS POR DATA ----------

async function filtrarPedidosPorData() {
  const pedidos = await lerPedidos();
  if (pedidos.length === 0) {
    console.log('Nenhum pedido registrado.');
    return;
  }

  // Pergunta o período
  const dataIniStr = await ask('Data inicial (DD/MM/AAAA): ');
  const dataFimStr = await ask('Data final (DD/MM/AAAA): ');

  // Converte strings para Date (invertendo dia/mês/ano)
  const [diaIni, mesIni, anoIni] = dataIniStr.split('/').map(Number);
  const [diaFim, mesFim, anoFim] = dataFimStr.split('/').map(Number);
  const dataIni = new Date(anoIni, mesIni - 1, diaIni);
  const dataFim = new Date(anoFim, mesFim - 1, diaFim);

  // Filtra pedidos no período
  const filtrados = pedidos.filter(p => {
    const dt = new Date(p.dataISO);
    return dt >= dataIni && dt <= dataFim;
  });

  if (filtrados.length === 0) {
    console.log('Nenhum pedido encontrado nesse período.');
    return;
  }

  console.log(`\nPedidos de ${dataIniStr} até ${dataFimStr}:`);
  filtrados.forEach(p => {
    const data = new Date(p.dataISO);
    const dataFormatada = `${String(data.getDate()).padStart(2,'0')}/${String(data.getMonth()+1).padStart(2,'0')}/${data.getFullYear()}`;
    console.log(`ID: ${p.id}, Cliente: ${p.clienteNome ?? 'Não informado'}, Total: R$ ${p.total.toFixed(2)}, Data: ${dataFormatada}`);
  });

  const totalPeriodo = filtrados.reduce((s, p) => s + p.total, 0);
  console.log(`Total de pedidos no período: ${filtrados.length}`);
  console.log(`Total em vendas: R$ ${totalPeriodo.toFixed(2)}`);
}


  // ---------- Console interativo (menu) ----------
  const rl = readline.createInterface({ input, output });

  function ask(q: string): Promise<string> {
    return new Promise<string>((resolve) => rl.question(q, resolve));
  }

  async function menuPrincipal() {
  await ensureFiles();

  let loop = true;
  while (loop) {
    console.log('\n===== PIZZARIA - MENU PRINCIPAL =====');
    console.log('1) Clientes');
    console.log('2) Produtos');
    console.log('3) Carrinho');
    console.log('4) Finalizar pedido');
    console.log('5) Relatórios');
    console.log('6) Sair');

    const op = (await ask('Escolha: ')).trim();

    if (op === '1') {
      await menuClientes();
    } else if (op === '2') {
      await menuProdutos();
    } else if (op === '3') {
      await menuCarrinho();
    } else if (op === '4') {
      await fluxoFinalizarPedido();
    } else if (op === '5') {
      // Sub-menu de relatórios
      let sub = true;
      while (sub) {
        console.log('\n--- RELATÓRIOS ---');
        console.log('1) Relatório completo');
        console.log('2) Filtrar por período/data');
        console.log('3) Voltar');

        const subOp = (await ask('Escolha: ')).trim();

        switch (subOp) {
          case '1':
            await gerarRelatorios();
            break;
          case '2':
            await filtrarPedidosPorData();
            break;
          case '3':
            sub = false;
            break;
          default:
            console.log('Opção inválida.');
        }

        if (sub) console.log('');
      }
    } else if (op === '6') {
      loop = false;
      console.log('Encerrando sistema.');
    } else {
      console.log('Opção inválida.');
    }
  }
  rl.close();
}

  async function menuClientes() {
    let sub = true;
    while (sub) {
      console.log('\n--- CLIENTES ---');
      console.log('1) Cadastrar cliente');
      console.log('2) Consultar cliente (por ID ou nome)');
      console.log('3) Atualizar cliente');
      console.log('4) Excluir cliente');
      console.log('5) Listar todos');
      console.log('6) Voltar');

      const op = (await ask('Escolha: ')).trim();

      if (op === '1') {
        const nome = await ask('Nome: ');
        const tel = await ask('Telefone: ');
        const email = await ask('Email (opcional): ');
        const end = await ask('Endereço: ');
        await cadastrarCliente(nome, tel, email || undefined, end || undefined);
      } else if (op === '2') {
        const chave = await ask('ID ou nome: ');
        const c = await consultarCliente(chave);
        if (c) console.log(`Encontrado: ID=${c.id} | ${c.nome} | ${c.telefone} | ${c.email ?? ''} | ${c.endereco ?? ''}`);
        else console.log('Cliente não encontrado.');
      } else if (op === '3') {
        const id = await ask('ID do cliente a atualizar: ');
        const nome = await ask('Nome (enter p/ manter): ');
        const tel = await ask('Telefone (enter p/ manter): ');
        const email = await ask('Email (enter p/ manter): ');
        const end = await ask('Endereço (enter p/ manter): ');
        const updates: Partial<Cliente> = {};
        if (nome) updates.nome = nome;
        if (tel) updates.telefone = tel;
        if (email) updates.email = email;
        if (end) updates.endereco = end;
        const ok = await atualizarCliente(id, updates);
        console.log(ok ? 'Atualizado.' : 'Cliente não encontrado.');
      } else if (op === '4') {
        const id = await ask('ID do cliente a excluir: ');
        const ok = await excluirCliente(id);
        console.log(ok ? 'Excluído.' : 'Cliente não encontrado.');
      } else if (op === '5') {
        const clientes = await lerClientes();
        if (clientes.length === 0) console.log('Nenhum cliente cadastrado.');
        else clientes.forEach(c => console.log(`${c.id} | ${c.nome} | ${c.telefone} | ${c.email ?? ''} | ${c.endereco ?? ''}`));
      } else if (op === '6') {
        sub = false;
      } else {
        console.log('Opção inválida.');
      }
    }
  }

  async function menuProdutos() {
  let sub = true;

  while (sub) {
    console.log('\n--- PRODUTOS ---');
    console.log('1) Cadastrar produto');
    console.log('2) Listar produtos');
    console.log('3) Procurar por nome');
    console.log('4) Voltar');

    const op = (await ask('Escolha: ')).trim();

    if (op === '1') {
      const cat = (await ask('Categoria (Pizza/Bebida/Outros): ')).trim() as any;
      const nome = await ask('Nome do produto: ');
      const desc = await ask('Descrição (opcional): ');
      const precoStr = await ask('Preço (ex: 45.00): ');
      const meta = await ask('Meta (opcional): ');
      const preco = parseFloat(precoStr.replace(',', '.')) || 0;

      await cadastrarProduto({
        id: nid("P-"),
        categoria: cat,
        nome,
        descricao: desc || undefined,
        preco,
        meta: meta || undefined
      });

    } else if (op === '2') {
      const produtos = await lerProdutos();
      if (produtos.length === 0) {
        console.log('Nenhum produto cadastrado.');
      } else {
        produtos.forEach(p =>
          console.log(`${p.id} | ${p.categoria} | ${p.nome} | R$ ${p.preco.toFixed(2)} | ${p.meta ?? ''}`)
        );
      }

    } else if (op === '3') {
  const chave = (await ask('Nome (ou parte): ')).toLowerCase();

  const produtos = (await lerProdutos())
    .filter(p => p.nome.toLowerCase().includes(chave))
    .map(p => ({
      ...p,
      preco: Number(p.preco)
    }));

  if (produtos.length === 0) console.log('Nenhum produto encontrado.');
  else
    produtos.forEach(p =>
      console.log(`${p.id} | ${p.categoria} | ${p.nome} | R$ ${p.preco.toFixed(2)} | ${p.meta ?? ''}`)
    );
} else if (op === '4') {
      sub = false;

    } else {
      console.log('Opção inválida.');
    }
  }
}

  async function menuCarrinho() {
    let sub = true;
    while (sub) {
      console.log('\n--- CARRINHO ---');
      console.log('1) Adicionar produto ao carrinho');
      console.log('2) Ver carrinho');
      console.log('3) Remover item (por índice)');
      console.log('4) Limpar carrinho');
      console.log('5) Voltar');

      const op = (await ask('Escolha: ')).trim();

      if (op === '1') {
        const produtos = await lerProdutos();

          produtos.forEach((p, i) => {
            const preco = Number(p.preco);
            console.log(`${i + 1}) ${p.nome} - R$ ${preco.toFixed(2)} (${p.meta ?? p.categoria})`);
          });

        const sel = parseInt(await ask('Escolha o número do produto: '), 10);
        if (isNaN(sel) || sel < 1 || sel > produtos.length) {
          console.log('Selecionado inválido.');
          continue;
        }
        const p = produtos[sel - 1];
        const qtd = parseInt(await ask('Quantidade: '), 10) || 1;
        let obs: string | undefined;
        if (p.categoria === 'Pizza') {
          obs = await ask('Observação (ex: meia com outro sabor) (opcional): ');
        }

        adicionarAoCarrinho({
          produtoId: p.id,
          nome: p.nome,
          quantidade: qtd,
          precoUnit: Number(p.preco),
          observacao: obs || undefined
        });

      } else if (op === '2') {
        verCarrinho();
      } else if (op === '3') {
        verCarrinho();
        const idx = parseInt(await ask('Índice do item a remover: '), 10);
        removerDoCarrinho(idx);
      } else if (op === '4') {
        CARRINHO = [];
        console.log('Carrinho limpo.');
      } else if (op === '5') {
        sub = false;
      } else {
        console.log('Opção inválida.');
      }
    }
  }

async function avaliarExperiencia(clienteNome?: string) {
  console.log('\n===== AVALIAÇÃO =====');
  console.log(`Cliente: ${clienteNome || 'Cliente não identificado'}`);
  console.log('Nos avalie de 1 a 5 estrelas (1 = ruim, 5 = excelente)');

  const notaStr = await ask('Sua nota: ');
  const nota = parseInt(notaStr.trim(), 10);

  if (isNaN(nota) || nota < 1 || nota > 5) {
    console.log('Nota inválida. Avaliação ignorada.');
    return;
  }

  const data_hora = new Date().toISOString();

  // Inserir no banco
  await db.query(
    `INSERT INTO avaliacoes (cliente_nome, nota, data_hora)
     VALUES ($1, $2, $3)`,
    [clienteNome || 'Não informado', nota, data_hora]
  );

  console.log(`\nObrigado pelo feedback, ${clienteNome || 'Cliente'}! Você deu ${nota} estrela(s).`);
}


//Emissão de comprovante de compra
async function emitirComprovante(pedido: Pedido) {
  const clientes = await lerClientes();
  const cliente = pedido.clienteId
    ? clientes.find(c => c.id === pedido.clienteId)
    : undefined;

  let comprovante = '\n===== COMPROVANTE DE PEDIDO =====\n';
  comprovante += `ID do Pedido: ${pedido.id}\n`;
  comprovante += `Cliente: ${pedido.clienteNome ?? 'Cliente não identificado'}\n`;
  if ((pedido as any).enderecoEntrega) {
    comprovante += `Endereço entrega: ${(pedido as any).enderecoEntrega}\n`;
  } else if (cliente?.endereco) {
    comprovante += `Endereço: ${cliente.endereco}\n`;
  }
  comprovante += `Data: ${new Date(pedido.dataISO).toLocaleString()}\n\n`;
  comprovante += 'Itens:\n';

  // Mostra os itens do carrinho
  pedido.itens.forEach((item, index) => {
    const subtotal = item.precoUnit * item.quantidade;
    comprovante += `${index + 1}) ${item.nome} - x${item.quantidade} - R$ ${subtotal.toFixed(2)}${item.observacao ? ` (${item.observacao})` : ''}\n`;
  });

  comprovante += `\nTotal: R$ ${pedido.total.toFixed(2)}\n`;
  comprovante += `Forma de pagamento: ${pedido.formaPagamento}\n`;
  if (pedido.trocoPara !== undefined) {
    comprovante += `Troco para: R$ ${pedido.trocoPara.toFixed(2)}\n`;
  }
  
  comprovante += '\n================================\n';
  comprovante += 'Obrigado pela compra! \n';

  // Mostra no terminal
  console.log(comprovante);
  await fs.appendFile(ARQ.comprovante, comprovante, 'utf8');
  console.log('Comprovante emitido com sucesso!');
}

async function fluxoFinalizarPedido() {
  if (CARRINHO.length === 0) {
    console.log('Carrinho vazio. Adicione itens antes de finalizar.');
    return;
  }

  let clienteId: string | undefined;
  let enderecoEntrega: string | undefined;

  // pergunta se há cliente associado
  const temCliente = (await ask('Associar a um cliente cadastrado? (s/n): ')).trim().toLowerCase();
  if (temCliente === 's' || temCliente === 'sim') {
    const chave = await ask('Digite ID ou nome do cliente: ');
    const c = await consultarCliente(chave);
    if (c) {
      clienteId = c.id;
      console.log(`Pedido associado a ${c.nome}`);
      const usarOutroEndereco = (await ask('Deseja usar outro endereço para este pedido? (s/n): ')).trim().toLowerCase();
      if (usarOutroEndereco === 's') {
        enderecoEntrega = await ask('Informe o endereço de entrega: ');
      } else {
        enderecoEntrega = c.endereco;
      }
    } else {
      console.log('Cliente não encontrado, continue sem cliente ou cadastre antes.');
    } 
  } else {
    enderecoEntrega = await ask('Informe o endereço de entrega: ');
  }
    
  const pedidoParcial = await finalizarPedido(clienteId);
  if (!pedidoParcial) return;

  (pedidoParcial as any).enderecoEntrega = enderecoEntrega;

  // escolher forma pagamento
  console.log('Formas de pagamento: 1) Pix  2) Cartão  3) Dinheiro  4) Vale-alimentacao');
  const op = (await ask('Escolha: ')).trim();
  if (op === '1') pedidoParcial.formaPagamento = 'Pix';
  else if (op === '2') pedidoParcial.formaPagamento = 'Cartão';
  else if (op === '3') {
    pedidoParcial.formaPagamento = 'Dinheiro';
    const trocoStr = await ask('Valor entregue pelo cliente (para calcular troco) - deixe em branco se exato: ');
    if (trocoStr) {
      const trocoNum = parseFloat(trocoStr.replace(',', '.')) || 0;
      pedidoParcial.trocoPara = trocoNum;
    }
  } else if (op === '4') pedidoParcial.formaPagamento = 'Vale-alimentacao';
  else {
    console.log('Opção inválida. Usando Dinheiro por padrão.');
    pedidoParcial.formaPagamento = 'Dinheiro';
  }

  //Grava o pedido
  await gravarPedido(pedidoParcial);

  //Emite o comprovante
  await emitirComprovante(pedidoParcial);

  //Pede avaliação
  await avaliarExperiencia(pedidoParcial.clienteNome);

  }

  // ---------- Inicialização ----------
  (async function main() {
    try {
      await ensureFiles();
      await menuPrincipal();
    } catch (err) {
      console.error('Erro no sistema:', err);
      rl.close();
    }
  })();
