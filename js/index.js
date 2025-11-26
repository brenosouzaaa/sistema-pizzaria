"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
// ================== GERENCIADORES ==================
class GerenciadorClientes {
    constructor() {
        this.clientes = [];
        this.nextId = 1;
    }
    cadastrar(nome, telefone, endereco, email) {
        const novo = { id: this.nextId.toString(), nome, telefone, endereco, email };
        this.clientes.push(novo);
        this.nextId++;
        return novo;
    }
    listar() {
        return this.clientes;
    }
    atualizar(id, nome) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente)
            cliente.nome = nome;
    }
    excluir(id) {
        this.clientes = this.clientes.filter(c => c.id !== id);
    }
}
class GerenciadorProdutos {
    constructor() {
        this.produtos = [];
        this.nextId = 1;
    }
    adicionar(nome, preco, categoria) {
        const novo = { id: this.nextId.toString(), nome, preco, categoria };
        this.produtos.push(novo);
        this.nextId++;
        return novo;
    }
    listar() {
        return this.produtos;
    }
}
class GerenciadorPedidos {
    constructor() {
        this.pedidos = [];
        this.nextId = 1;
    }
    criar(cliente, itens, formaPagamento) {
        const total = itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
        const novo = { id: this.nextId.toString(), cliente, itens, total, formaPagamento };
        this.pedidos.push(novo);
        this.nextId++;
        return novo;
    }
    listar() {
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
    const opcao = readline_sync_1.default.question("Escolha uma opção: ");
    // ===== CADASTRO DE CLIENTE =====
    if (opcao === "1") {
        console.log("\n--- Cadastro de Cliente ---");
        console.log("1 - Criar cliente");
        console.log("2 - Consultar clientes");
        console.log("3 - Atualizar cliente");
        console.log("4 - Excluir cliente");
        const sub = readline_sync_1.default.question("Escolha: ");
        if (sub === "1") {
            const nome = readline_sync_1.default.question("Nome: ");
            const telefone = readline_sync_1.default.question("Telefone: ");
            const endereco = readline_sync_1.default.question("Endereco: ");
            const email = readline_sync_1.default.question("Email (opcional): ");
            console.log("✅ Cliente criado:", clientes.cadastrar(nome, telefone, endereco, email || undefined));
        }
        else if (sub === "2") {
            console.log("📋 Clientes cadastrados:", clientes.listar());
        }
        else if (sub === "3") {
            const id = readline_sync_1.default.question("ID do cliente: ");
            const nome = readline_sync_1.default.question("Novo nome: ");
            clientes.atualizar(id, nome);
            console.log("✅ Cliente atualizado.");
        }
        else if (sub === "4") {
            const id = readline_sync_1.default.question("ID do cliente: ");
            clientes.excluir(id);
            console.log("✅ Cliente excluído.");
        }
        // ===== CADASTRO DE PRODUTO =====
    }
    else if (opcao === "2") {
        console.log("\n--- Cadastro de Produto ---");
        const nome = readline_sync_1.default.question("Nome: ");
        const preco = parseFloat(readline_sync_1.default.question("Preco: "));
        const categoria = readline_sync_1.default.question("Categoria (pizza/bebida): ");
        console.log("✅ Produto cadastrado:", produtos.adicionar(nome, preco, categoria));
        // ===== CRIAR PEDIDO =====
    }
    else if (opcao === "3") {
        console.log("\n--- Criar Pedido ---");
        console.log("Clientes:");
        clientes.listar().forEach(c => console.log(`${c.id} - ${c.nome}`));
        const clienteId = readline_sync_1.default.question("ID do cliente: ");
        const cliente = clientes.listar().find(c => c.id === clienteId);
        if (!cliente) {
            console.log("❌ Cliente não encontrado!");
            continue;
        }
        const itens = [];
        while (true) {
            console.log("Produtos:");
            produtos.listar().forEach(p => console.log(`${p.id} - ${p.nome} (R$${p.preco})`));
            const prodId = readline_sync_1.default.question("ID do produto (ou ENTER para finalizar): ");
            if (!prodId)
                break;
            const produto = produtos.listar().find(p => p.id === prodId);
            if (!produto) {
                console.log("❌ Produto não encontrado!");
                continue;
            }
            const qtd = parseInt(readline_sync_1.default.question("Quantidade: "));
            itens.push({ produto, quantidade: qtd });
        }
        const forma = readline_sync_1.default.question("Forma de pagamento (credito/debito/dinheiro/pix): ");
        const pedido = pedidos.criar(cliente, itens, forma);
        console.log("✅ Pedido criado:", pedido);
        // ===== RELATÓRIOS =====
    }
    else if (opcao === "4") {
        console.log("\n--- Relatórios ---");
        pedidos.listar().forEach(p => {
            console.log(`Pedido #${p.id} | Cliente: ${p.cliente.nome} | Total: R$${p.total}`);
        });
        // ===== SAIR =====
    }
    else if (opcao === "0") {
        console.log("✅ Sistema encerrado.");
        break;
    }
    else {
        console.log("❌ Opção inválida!");
    }
}
