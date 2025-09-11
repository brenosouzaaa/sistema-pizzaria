import readlineSync from "readline-sync";

// ================== MODELOS ==================
interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  email?: string;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: "pizza" | "bebida";
}

interface Pedido {
  id: string;
  cliente: Cliente;
  itens: { produto: Produto; quantidade: number }[];
  total: number;
  formaPagamento: "credito" | "debito" | "dinheiro" | "pix";
}

// ================== GERENCIADORES ==================
class GerenciadorClientes {
  private clientes: Cliente[] = [];
  private nextId = 1;

  cadastrar(nome: string, telefone: string, endereco: string, email?: string): Cliente {
    const novo: Cliente = { id: this.nextId.toString(), nome, telefone, endereco, email };
    this.clientes.push(novo);
    this.nextId++;
    return novo;
  }

  listar(): Cliente[] {
    return this.clientes;
  }

  atualizar(id: string, nome: string) {
    const cliente = this.clientes.find(c => c.id === id);
    if (cliente) cliente.nome = nome;
  }

  excluir(id: string) {
    this.clientes = this.clientes.filter(c => c.id !== id);
  }
}

class GerenciadorProdutos {
  private produtos: Produto[] = [];
  private nextId = 1;

  adicionar(nome: string, preco: number, categoria: "pizza" | "bebida"): Produto {
    const novo: Produto = { id: this.nextId.toString(), nome, preco, categoria };
    this.produtos.push(novo);
    this.nextId++;
    return novo;
  }

  listar(): Produto[] {
    return this.produtos;
  }
}

class GerenciadorPedidos {
  private pedidos: Pedido[] = [];
  private nextId = 1;

  criar(cliente: Cliente, itens: { produto: Produto; quantidade: number }[], formaPagamento: Pedido["formaPagamento"]): Pedido {
    const total = itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
    const novo: Pedido = { id: this.nextId.toString(), cliente, itens, total, formaPagamento };
    this.pedidos.push(novo);
    this.nextId++;
    return novo;
  }

  listar(): Pedido[] {
    return this.pedidos;
  }
}

// ================== EXECUÇÃO ==================
console.log("🍕 Bem-vindo ao Sistema de Pizzaria!");

const clientes = new GerenciadorClientes();
const produtos = new GerenciadorProdutos();
const pedidos = new GerenciadorPedidos();

// Produtos iniciais (exemplo do fluxograma)
produtos.adicionar("Pizza Calabresa", 45, "pizza");
produtos.adicionar("Pizza Quatro Queijos", 45, "pizza");
produtos.adicionar("Guaraná 2L", 10, "bebida");
produtos.adicionar("Cerveja", 8, "bebida");

// ========== MENU PRINCIPAL ==========
while (true) {
  console.log("\n===== MENU PRINCIPAL =====");
  console.log("1 - Cadastro de Cliente");
  console.log("2 - Cadastro de Produto");
  console.log("3 - Criar Pedido");
  console.log("4 - Relatórios de Vendas");
  console.log("0 - Encerrar");
  const opcao = readlineSync.question("Escolha uma opção: ");

  // ===== CADASTRO DE CLIENTE =====
  if (opcao === "1") {
    console.log("\n--- Cadastro de Cliente ---");
    console.log("1 - Criar cliente");
    console.log("2 - Consultar clientes");
    console.log("3 - Atualizar cliente");
    console.log("4 - Excluir cliente");
    const sub = readlineSync.question("Escolha: ");

    if (sub === "1") {
      const nome = readlineSync.question("Nome: ");
      const telefone = readlineSync.question("Telefone: ");
      const endereco = readlineSync.question("Endereco: ");
      const email = readlineSync.question("Email (opcional): ");
      console.log("✅ Cliente criado:", clientes.cadastrar(nome, telefone, endereco, email || undefined));
    } else if (sub === "2") {
      console.log("📋 Clientes cadastrados:", clientes.listar());
    } else if (sub === "3") {
      const id = readlineSync.question("ID do cliente: ");
      const nome = readlineSync.question("Novo nome: ");
      clientes.atualizar(id, nome);
      console.log("✅ Cliente atualizado.");
    } else if (sub === "4") {
      const id = readlineSync.question("ID do cliente: ");
      clientes.excluir(id);
      console.log("✅ Cliente excluído.");
    }

  // ===== CADASTRO DE PRODUTO =====
  } else if (opcao === "2") {
    console.log("\n--- Cadastro de Produto ---");
    const nome = readlineSync.question("Nome: ");
    const preco = parseFloat(readlineSync.question("Preco: "));
    const categoria = readlineSync.question("Categoria (pizza/bebida): ") as "pizza" | "bebida";
    console.log("✅ Produto cadastrado:", produtos.adicionar(nome, preco, categoria));

  // ===== CRIAR PEDIDO =====
  } else if (opcao === "3") {
    console.log("\n--- Criar Pedido ---");
    console.log("Clientes:");
    clientes.listar().forEach(c => console.log(`${c.id} - ${c.nome}`));
    const clienteId = readlineSync.question("ID do cliente: ");
    const cliente = clientes.listar().find(c => c.id === clienteId);
    if (!cliente) { console.log("❌ Cliente não encontrado!"); continue; }

    const itens: { produto: Produto; quantidade: number }[] = [];
    while (true) {
      console.log("Produtos:");
      produtos.listar().forEach(p => console.log(`${p.id} - ${p.nome} (R$${p.preco})`));
      const prodId = readlineSync.question("ID do produto (ou ENTER para finalizar): ");
      if (!prodId) break;
      const produto = produtos.listar().find(p => p.id === prodId);
      if (!produto) { console.log("❌ Produto não encontrado!"); continue; }
      const qtd = parseInt(readlineSync.question("Quantidade: "));
      itens.push({ produto, quantidade: qtd });
    }

    const forma = readlineSync.question("Forma de pagamento (credito/debito/dinheiro/pix): ") as Pedido["formaPagamento"];
    const pedido = pedidos.criar(cliente, itens, forma);

    // Trecho novo de código (Emite o comprovante de compra)
        
        // ========== EMISSÃO DE COMPROVANTE ==========
        console.log("\n========== EMISSÃO DE COMPROVANTE DE COMPRA ==========\n");

        const agora = new Date();
        const dataPedido = agora.toLocaleDateString("pt-BR");
        const horaPedido = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        console.log("Dados do Pedido");
        console.log(`Pedido Nº: ${pedido.id.padStart(5, "0")}`);
        console.log(`Data: ${dataPedido} - Hora: ${horaPedido}`);
        console.log(`Cliente: ${pedido.cliente.nome}`);
        console.log(`Telefone: ${pedido.cliente.telefone}`);
        console.log(`Endereço: ${pedido.cliente.endereco}`);
        console.log("_________________________________\n");

        console.log("Itens Comprados:");
        let subtotal = 0;
        pedido.itens.forEach(i => {
            const totalItem = i.produto.preco * i.quantidade;
            subtotal += totalItem;
            console.log(`${i.quantidade}x ${i.produto.nome} ............... R$ ${totalItem.toFixed(2)} (R$ ${i.produto.preco.toFixed(2)} cada)`);
        });
        console.log("_________________________________\n");

        const taxaEntrega = 5.00;
        const desconto = 0.00;
        const totalFinal = subtotal + taxaEntrega - desconto;

        console.log("Totais:");
        console.log(`Subtotal: ..................... R$ ${subtotal.toFixed(2)}`);
        console.log(`Taxa de Entrega: .............. R$ ${taxaEntrega.toFixed(2)}`);
        console.log(`Desconto: ..................... R$ ${desconto.toFixed(2)}`);
        console.log(`TOTAL A PAGAR: ................ R$ ${totalFinal.toFixed(2)}`);
        console.log("_________________________________\n");

        if (forma.toLowerCase() === "dinheiro") {
            const valorPago = parseFloat(readlineSync.question("Valor pago em dinheiro: R$ "));
            const troco = valorPago - totalFinal;
            console.log(`Forma de Pagamento: Dinheiro`);
            console.log(`Valor Pago: R$ ${valorPago.toFixed(2)}`);
            console.log(`Troco: R$ ${troco.toFixed(2)}`);
        } else {
            console.log(`Forma de Pagamento: ${forma}`);
        }
        console.log("_________________________________\n");

        console.log("✅ Pedido confirmado e registrado!");

  // ===== RELATÓRIOS =====
  } else if (opcao === "4") {
    console.log("\n--- Relatórios ---");
    pedidos.listar().forEach(p => {
      console.log(`Pedido #${p.id} | Cliente: ${p.cliente.nome} | Total: R$${p.total}`);
    });

  // ===== SAIR =====
  } else if (opcao === "0") {
    console.log("✅ Sistema encerrado.");
    break;
  } else {
    console.log("❌ Opção inválida!");
  }
}
