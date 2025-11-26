"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var process_1 = require("process");
var readline = require("readline");
var DATA_DIR = '.'; // altere se quiser colocar em outra pasta
var ARQ = {
    clientes: path.join(DATA_DIR, 'clientes.csv'),
    produtos: path.join(DATA_DIR, 'produtos.csv'),
    pedidos: path.join(DATA_DIR, 'pedidos.csv'),
    resumo: path.join(DATA_DIR, 'resumo.txt'),
};
// util simples para criar ids
function nid(prefix) {
    if (prefix === void 0) { prefix = ''; }
    return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}
// ---------- I/O CSV helpers ----------
function ensureFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var files, _i, files_1, f, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    files = Object.values(ARQ);
                    _i = 0, files_1 = files;
                    _b.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                    f = files_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, fs_1.promises.access(f)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    _a = _b.sent();
                    // criar arquivo vazio
                    return [4 /*yield*/, fs_1.promises.writeFile(f, '', 'utf8')];
                case 5:
                    // criar arquivo vazio
                    _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function lerCSV(file, parser) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, linhas, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(file, 'utf8')];
                case 1:
                    raw = _b.sent();
                    linhas = raw.split(/\r?\n/).filter(Boolean);
                    return [2 /*return*/, linhas.map(function (l) { return parser(l.split(',')); })];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function appendCSV(file, line) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.appendFile(file, line + '\n', 'utf8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function writeCSV(file, lines) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.writeFile(file, lines.join('\n'), 'utf8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------- Clientes ----------
function cadastrarCliente(nome, telefone, email, endereco) {
    return __awaiter(this, void 0, void 0, function () {
        var cliente, line;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cliente = {
                        id: nid('C-'),
                        nome: nome.trim(),
                        telefone: telefone.trim(),
                        email: email === null || email === void 0 ? void 0 : email.trim(),
                        endereco: endereco === null || endereco === void 0 ? void 0 : endereco.trim(),
                    };
                    line = [cliente.id, cliente.nome, cliente.telefone, (_a = cliente.email) !== null && _a !== void 0 ? _a : '', (_b = cliente.endereco) !== null && _b !== void 0 ? _b : ''].map(function (s) { return s.replace(/,/g, ';'); }).join(',');
                    return [4 /*yield*/, appendCSV(ARQ.clientes, line)];
                case 1:
                    _c.sent();
                    console.log("Cliente cadastrado: ".concat(cliente.nome, " (ID: ").concat(cliente.id, ")"));
                    return [2 /*return*/, cliente];
            }
        });
    });
}
function lerClientes() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, lerCSV(ARQ.clientes, function (cols) {
                    var id = cols[0], nome = cols[1], telefone = cols[2], email = cols[3], endereco = cols[4];
                    return { id: id, nome: nome, telefone: telefone, email: email || undefined, endereco: endereco || undefined };
                })];
        });
    });
}
function consultarCliente(idOrNome) {
    return __awaiter(this, void 0, void 0, function () {
        var clientes, chave;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, lerClientes()];
                case 1:
                    clientes = _b.sent();
                    chave = idOrNome.trim().toLowerCase();
                    return [2 /*return*/, (_a = clientes.find(function (c) { return c.id.toLowerCase() === chave || c.nome.toLowerCase() === chave; })) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
function atualizarCliente(id, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var clientes, idx, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lerClientes()];
                case 1:
                    clientes = _a.sent();
                    idx = clientes.findIndex(function (c) { return c.id === id; });
                    if (idx === -1)
                        return [2 /*return*/, false];
                    clientes[idx] = __assign(__assign({}, clientes[idx]), updates);
                    lines = clientes.map(function (c) { var _a, _b; return [c.id, c.nome, c.telefone, (_a = c.email) !== null && _a !== void 0 ? _a : '', (_b = c.endereco) !== null && _b !== void 0 ? _b : ''].map(function (s) { return s.replace(/,/g, ';'); }).join(','); });
                    return [4 /*yield*/, writeCSV(ARQ.clientes, lines)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
function excluirCliente(id) {
    return __awaiter(this, void 0, void 0, function () {
        var clientes, novos, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lerClientes()];
                case 1:
                    clientes = _a.sent();
                    novos = clientes.filter(function (c) { return c.id !== id; });
                    if (novos.length === clientes.length)
                        return [2 /*return*/, false];
                    lines = novos.map(function (c) { var _a, _b; return [c.id, c.nome, c.telefone, (_a = c.email) !== null && _a !== void 0 ? _a : '', (_b = c.endereco) !== null && _b !== void 0 ? _b : ''].map(function (s) { return s.replace(/,/g, ';'); }).join(','); });
                    return [4 /*yield*/, writeCSV(ARQ.clientes, lines)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
// ---------- Produtos ----------
function cadastrarProduto(prod) {
    return __awaiter(this, void 0, void 0, function () {
        var line;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    prod.id = (_a = prod.id) !== null && _a !== void 0 ? _a : nid('P-');
                    line = [prod.id, prod.categoria, prod.nome, (_b = prod.descricao) !== null && _b !== void 0 ? _b : '', prod.preco.toFixed(2), (_c = prod.meta) !== null && _c !== void 0 ? _c : ''].map(function (s) { return s.toString().replace(/,/g, ';'); }).join(',');
                    return [4 /*yield*/, appendCSV(ARQ.produtos, line)];
                case 1:
                    _d.sent();
                    console.log("Produto cadastrado: ".concat(prod.nome, " (R$ ").concat(prod.preco.toFixed(2), ")"));
                    return [2 /*return*/, prod];
            }
        });
    });
}
function lerProdutos() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, lerCSV(ARQ.produtos, function (cols) {
                    var id = cols[0], categoria = cols[1], nome = cols[2], descricao = cols[3], preco = cols[4], meta = cols[5];
                    return { id: id, categoria: categoria, nome: nome, descricao: descricao || undefined, preco: parseFloat(preco || '0'), meta: meta || undefined };
                })];
        });
    });
}
function carregarProdutosIniciais() {
    return __awaiter(this, void 0, void 0, function () {
        var existentes, iniciais, _i, iniciais_1, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lerProdutos()];
                case 1:
                    existentes = _a.sent();
                    if (existentes.length > 0)
                        return [2 /*return*/];
                    iniciais = [
                        // Pizzas inteiras / 12 pedaços
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Frango com catupiry (Inteira)', descricao: 'Frango + Catupiry', preco: 45.00, meta: 'Inteira' },
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Calabresa (Inteira)', descricao: 'Calabresa tradicional', preco: 45.00, meta: 'Inteira' },
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Quatro queijos (Inteira)', descricao: 'Queijos variados', preco: 45.00, meta: 'Inteira' },
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Portuguesa (Inteira)', descricao: 'Presunto, ovo, cebola', preco: 45.00, meta: 'Inteira' },
                        // Meia a meia (dois sabores)
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Meia-Meia 12p (2 sabores)', descricao: 'Escolha 2 sabores', preco: 50.00, meta: 'Meia/Meia' },
                        // Pizzas por 8 pedaços (metade preço exemplo)
                        { id: nid('P-'), categoria: 'Pizza', nome: '8 pedaços (Meia)', descricao: 'Opção 8 pedaços', preco: 30.00, meta: '8p' },
                        // Doces
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Nutella com morango (Inteira)', descricao: 'Pizza doce', preco: 45.00, meta: 'Inteira' },
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Doce de Leite (Inteira)', descricao: 'Pizza doce', preco: 45.00, meta: 'Inteira' },
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Prestigio (Inteira)', descricao: 'Pizza doce', preco: 45.00, meta: 'Inteira' },
                        { id: nid('P-'), categoria: 'Pizza', nome: 'Romeu e Julieta (Inteira)', descricao: 'Pizza doce', preco: 45.00, meta: 'Inteira' },
                        // Bebidas
                        { id: nid('P-'), categoria: 'Bebida', nome: 'Coca-Cola Lata', descricao: '350ml', preco: 6.00, meta: 'Lata' },
                        { id: nid('P-'), categoria: 'Bebida', nome: 'Guaraná 2L', descricao: '2 litros', preco: 12.00, meta: '2L' },
                        { id: nid('P-'), categoria: 'Bebida', nome: 'Água sem gás 500ml', descricao: '500ml', preco: 4.00, meta: '500ml' },
                        { id: nid('P-'), categoria: 'Bebida', nome: 'Coca-Cola 2L', descricao: '2 litros', preco: 12.00, meta: '2L' },
                        { id: nid('P-'), categoria: 'Bebida', nome: 'Guarana Lata', descricao: '350ml', preco: 6.00, meta: 'Lata' },
                    ];
                    _i = 0, iniciais_1 = iniciais;
                    _a.label = 2;
                case 2:
                    if (!(_i < iniciais_1.length)) return [3 /*break*/, 5];
                    p = iniciais_1[_i];
                    return [4 /*yield*/, cadastrarProduto(p)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ---------- Pedidos / Carrinho ----------
var CARRINHO = [];
function verCarrinho() {
    if (CARRINHO.length === 0) {
        console.log('-- Carrinho vazio --');
        return;
    }
    console.log('--- Carrinho ---');
    var i = 1;
    for (var _i = 0, CARRINHO_1 = CARRINHO; _i < CARRINHO_1.length; _i++) {
        var it = CARRINHO_1[_i];
        console.log("".concat(i, ") ").concat(it.nome, " x").concat(it.quantidade, " - R$ ").concat((it.precoUnit * it.quantidade).toFixed(2), " ").concat(it.observacao ? "(".concat(it.observacao, ")") : ''));
        i++;
    }
    var total = CARRINHO.reduce(function (s, it) { return s + it.precoUnit * it.quantidade; }, 0);
    console.log("Total parcial: R$ ".concat(total.toFixed(2)));
}
function adicionarAoCarrinho(item) {
    // se já existe mesmo produto sem observação, soma quantidade
    var existente = CARRINHO.find(function (ci) { var _a, _b; return ci.produtoId === item.produtoId && ((_a = ci.observacao) !== null && _a !== void 0 ? _a : '') === ((_b = item.observacao) !== null && _b !== void 0 ? _b : ''); });
    if (existente) {
        existente.quantidade += item.quantidade;
    }
    else {
        CARRINHO.push(__assign({}, item));
    }
    console.log("Adicionado ao carrinho: ".concat(item.nome, " x").concat(item.quantidade));
}
function removerDoCarrinho(idx) {
    if (idx < 1 || idx > CARRINHO.length) {
        console.log('Índice inválido.');
        return false;
    }
    var it = CARRINHO.splice(idx - 1, 1)[0];
    console.log("Removido do carrinho: ".concat(it.nome));
    return true;
}
function finalizarPedido(clienteIdOpt) {
    return __awaiter(this, void 0, void 0, function () {
        var clientes, cliente, total, pedido;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (CARRINHO.length === 0) {
                        console.log('Carrinho vazio. Não é possível finalizar pedido.');
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, lerClientes()];
                case 1:
                    clientes = _a.sent();
                    cliente = clienteIdOpt ? clientes.find(function (c) { return c.id === clienteIdOpt; }) : undefined;
                    total = CARRINHO.reduce(function (s, it) { return s + it.precoUnit * it.quantidade; }, 0);
                    console.log("Total do pedido: R$ ".concat(total.toFixed(2)));
                    pedido = {
                        id: nid('O-'),
                        clienteId: cliente === null || cliente === void 0 ? void 0 : cliente.id,
                        clienteNome: cliente === null || cliente === void 0 ? void 0 : cliente.nome,
                        itens: JSON.parse(JSON.stringify(CARRINHO)),
                        total: total,
                        formaPagamento: 'Dinheiro',
                        dataISO: new Date().toISOString(),
                    };
                    return [2 /*return*/, pedido];
            }
        });
    });
}
function gravarPedido(pedido) {
    return __awaiter(this, void 0, void 0, function () {
        var itensResumo, line;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    itensResumo = pedido.itens.map(function (i) { return "".concat(i.nome, " x").concat(i.quantidade); }).join(';').replace(/,/g, ';');
                    line = [pedido.id, (_a = pedido.clienteId) !== null && _a !== void 0 ? _a : '', (_b = pedido.clienteNome) !== null && _b !== void 0 ? _b : '', pedido.total.toFixed(2), pedido.formaPagamento, ((_c = pedido.trocoPara) !== null && _c !== void 0 ? _c : '').toString(), pedido.dataISO, itensResumo].join(',');
                    return [4 /*yield*/, appendCSV(ARQ.pedidos, line)];
                case 1:
                    _d.sent();
                    // limpar carrinho
                    CARRINHO = [];
                    console.log("Pedido ".concat(pedido.id, " gravado. Total R$ ").concat(pedido.total.toFixed(2), ". Forma: ").concat(pedido.formaPagamento));
                    return [2 /*return*/];
            }
        });
    });
}
// ---------- Relatórios ----------
function gerarRelatorios() {
    return __awaiter(this, void 0, void 0, function () {
        var pedidos, totalVendas, vendasPorCliente, _i, pedidos_1, p, key, cur, contagemProdutos, _a, pedidos_2, p, _b, _c, it, cur, ordenado, _d, _e, _f, nome, q, linhasResumo;
        var _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, lerPedidos()];
                case 1:
                    pedidos = _k.sent();
                    if (pedidos.length === 0) {
                        console.log('Nenhum pedido registrado.');
                        return [2 /*return*/];
                    }
                    totalVendas = pedidos.reduce(function (s, p) { return s + p.total; }, 0);
                    console.log("Total vendas: R$ ".concat(totalVendas.toFixed(2), " (").concat(pedidos.length, " pedidos)"));
                    vendasPorCliente = new Map();
                    for (_i = 0, pedidos_1 = pedidos; _i < pedidos_1.length; _i++) {
                        p = pedidos_1[_i];
                        key = (_g = p.clienteNome) !== null && _g !== void 0 ? _g : 'Cliente não informado';
                        cur = (_h = vendasPorCliente.get(key)) !== null && _h !== void 0 ? _h : { total: 0, qty: 0 };
                        cur.total += p.total;
                        cur.qty += 1;
                        vendasPorCliente.set(key, cur);
                    }
                    console.log('\nVendas por cliente:');
                    vendasPorCliente.forEach(function (v, nome) {
                        console.log("Cliente: ".concat(nome, ", Quantidade: ").concat(v.qty, ", Total: R$ ").concat(v.total.toFixed(2)));
                    });
                    contagemProdutos = new Map();
                    for (_a = 0, pedidos_2 = pedidos; _a < pedidos_2.length; _a++) {
                        p = pedidos_2[_a];
                        for (_b = 0, _c = p.itens; _b < _c.length; _b++) {
                            it = _c[_b];
                            cur = (_j = contagemProdutos.get(it.nome)) !== null && _j !== void 0 ? _j : 0;
                            contagemProdutos.set(it.nome, cur + it.quantidade);
                        }
                    }
                    ordenado = Array.from(contagemProdutos.entries()).sort(function (a, b) { return b[1] - a[1]; });
                    console.log('\nProdutos mais vendidos (por unidades):');
                    for (_d = 0, _e = ordenado.slice(0, 10); _d < _e.length; _d++) {
                        _f = _e[_d], nome = _f[0], q = _f[1];
                        console.log("- ".concat(nome, ": ").concat(q));
                    }
                    linhasResumo = __spreadArray(__spreadArray(__spreadArray([
                        "Resumo de Vendas - ".concat(new Date().toLocaleString()),
                        "Total pedidos: ".concat(pedidos.length),
                        "Total vendas: R$ ".concat(totalVendas.toFixed(2)),
                        '',
                        'Top produtos:'
                    ], ordenado.slice(0, 10).map(function (_a) {
                        var n = _a[0], q = _a[1];
                        return "".concat(n, ": ").concat(q);
                    }), true), [
                        '',
                        'Vendas por cliente:'
                    ], false), Array.from(vendasPorCliente.entries()).map(function (_a) {
                        var n = _a[0], s = _a[1];
                        return "".concat(n, ": ").concat(s.qty, " pedidos - R$ ").concat(s.total.toFixed(2));
                    }), true);
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.resumo, linhasResumo.join('\n'), 'utf8')];
                case 2:
                    _k.sent();
                    console.log("\nResumo salvo em ".concat(ARQ.resumo));
                    return [2 /*return*/];
            }
        });
    });
}
function lerPedidos() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, lerCSV(ARQ.pedidos, function (cols) {
                    var _a;
                    // id,clienteId,clienteNome,total,formaPagamento,troco,dataISO,itensResumo
                    var id = cols[0], clienteId = cols[1], clienteNome = cols[2], total = cols[3], formaPagamento = cols[4], troco = cols[5], dataISO = cols[6], itensResumo = cols[7];
                    var itens = (itensResumo || '').split(';').filter(Boolean).map(function (tok) {
                        // form "Nome xQ" tentativa de parse simples
                        var m = tok.match(/^(.*)\sx(\d+)$/);
                        if (m) {
                            return { produtoId: '', nome: m[1].trim(), quantidade: parseInt(m[2], 10), precoUnit: 0 };
                        }
                        return { produtoId: '', nome: tok.trim(), quantidade: 1, precoUnit: 0 };
                    });
                    return { id: id, clienteId: clienteId || undefined, clienteNome: clienteNome || undefined, itens: itens, total: parseFloat(total || '0'), formaPagamento: (_a = formaPagamento) !== null && _a !== void 0 ? _a : 'Dinheiro', trocoPara: troco ? parseFloat(troco) : undefined, dataISO: dataISO || new Date().toISOString() };
                })];
        });
    });
}
// ---------- FILTRO DE PEDIDOS POR DATA ----------
function filtrarPedidosPorData() {
    return __awaiter(this, void 0, void 0, function () {
        var pedidos, dataIniStr, dataFimStr, _a, diaIni, mesIni, anoIni, _b, diaFim, mesFim, anoFim, dataIni, dataFim, filtrados, totalPeriodo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, lerPedidos()];
                case 1:
                    pedidos = _c.sent();
                    if (pedidos.length === 0) {
                        console.log('Nenhum pedido registrado.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ask('Data inicial (DD/MM/AAAA): ')];
                case 2:
                    dataIniStr = _c.sent();
                    return [4 /*yield*/, ask('Data final (DD/MM/AAAA): ')];
                case 3:
                    dataFimStr = _c.sent();
                    _a = dataIniStr.split('/').map(Number), diaIni = _a[0], mesIni = _a[1], anoIni = _a[2];
                    _b = dataFimStr.split('/').map(Number), diaFim = _b[0], mesFim = _b[1], anoFim = _b[2];
                    dataIni = new Date(anoIni, mesIni - 1, diaIni);
                    dataFim = new Date(anoFim, mesFim - 1, diaFim);
                    filtrados = pedidos.filter(function (p) {
                        var dt = new Date(p.dataISO);
                        return dt >= dataIni && dt <= dataFim;
                    });
                    if (filtrados.length === 0) {
                        console.log('Nenhum pedido encontrado nesse período.');
                        return [2 /*return*/];
                    }
                    console.log("\nPedidos de ".concat(dataIniStr, " at\u00E9 ").concat(dataFimStr, ":"));
                    filtrados.forEach(function (p) {
                        var _a;
                        var data = new Date(p.dataISO);
                        var dataFormatada = "".concat(String(data.getDate()).padStart(2, '0'), "/").concat(String(data.getMonth() + 1).padStart(2, '0'), "/").concat(data.getFullYear());
                        console.log("ID: ".concat(p.id, ", Cliente: ").concat((_a = p.clienteNome) !== null && _a !== void 0 ? _a : 'Não informado', ", Total: R$ ").concat(p.total.toFixed(2), ", Data: ").concat(dataFormatada));
                    });
                    totalPeriodo = filtrados.reduce(function (s, p) { return s + p.total; }, 0);
                    console.log("Total de pedidos no per\u00EDodo: ".concat(filtrados.length));
                    console.log("Total em vendas: R$ ".concat(totalPeriodo.toFixed(2)));
                    return [2 /*return*/];
            }
        });
    });
}
// ---------- Console interativo (menu) ----------
var rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
function ask(q) {
    return new Promise(function (resolve) { return rl.question(q, resolve); });
}
function menuPrincipal() {
    return __awaiter(this, void 0, void 0, function () {
        var loop, op, sub, subOp, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureFiles()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, carregarProdutosIniciais()];
                case 2:
                    _b.sent();
                    loop = true;
                    _b.label = 3;
                case 3:
                    if (!loop) return [3 /*break*/, 25];
                    console.log('\n===== PIZZARIA - MENU PRINCIPAL =====');
                    console.log('1) Clientes');
                    console.log('2) Produtos');
                    console.log('3) Carrinho');
                    console.log('4) Finalizar pedido');
                    console.log('5) Relatórios');
                    console.log('6) Sair');
                    return [4 /*yield*/, ask('Escolha: ')];
                case 4:
                    op = (_b.sent()).trim();
                    if (!(op === '1')) return [3 /*break*/, 6];
                    return [4 /*yield*/, menuClientes()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 6:
                    if (!(op === '2')) return [3 /*break*/, 8];
                    return [4 /*yield*/, menuProdutos()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 8:
                    if (!(op === '3')) return [3 /*break*/, 10];
                    return [4 /*yield*/, menuCarrinho()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 10:
                    if (!(op === '4')) return [3 /*break*/, 12];
                    return [4 /*yield*/, fluxoFinalizarPedido()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 12:
                    if (!(op === '5')) return [3 /*break*/, 23];
                    sub = true;
                    _b.label = 13;
                case 13:
                    if (!sub) return [3 /*break*/, 22];
                    console.log('\n--- RELATÓRIOS ---');
                    console.log('1) Relatório completo');
                    console.log('2) Filtrar por período/data');
                    console.log('3) Voltar');
                    return [4 /*yield*/, ask('Escolha: ')];
                case 14:
                    subOp = (_b.sent()).trim();
                    _a = subOp;
                    switch (_a) {
                        case '1': return [3 /*break*/, 15];
                        case '2': return [3 /*break*/, 17];
                        case '3': return [3 /*break*/, 19];
                    }
                    return [3 /*break*/, 20];
                case 15: return [4 /*yield*/, gerarRelatorios()];
                case 16:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 17: return [4 /*yield*/, filtrarPedidosPorData()];
                case 18:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 19:
                    sub = false;
                    return [3 /*break*/, 21];
                case 20:
                    console.log('Opção inválida.');
                    _b.label = 21;
                case 21:
                    if (sub)
                        console.log('');
                    return [3 /*break*/, 13];
                case 22: return [3 /*break*/, 24];
                case 23:
                    if (op === '6') {
                        loop = false;
                        console.log('Encerrando sistema.');
                    }
                    else {
                        console.log('Opção inválida.');
                    }
                    _b.label = 24;
                case 24: return [3 /*break*/, 3];
                case 25:
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
function menuClientes() {
    return __awaiter(this, void 0, void 0, function () {
        var sub, op, nome, tel, email, end, chave, c, id, nome, tel, email, end, updates, ok, id, ok, clientes;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sub = true;
                    _c.label = 1;
                case 1:
                    if (!sub) return [3 /*break*/, 25];
                    console.log('\n--- CLIENTES ---');
                    console.log('1) Cadastrar cliente');
                    console.log('2) Consultar cliente (por ID ou nome)');
                    console.log('3) Atualizar cliente');
                    console.log('4) Excluir cliente');
                    console.log('5) Listar todos');
                    console.log('6) Voltar');
                    return [4 /*yield*/, ask('Escolha: ')];
                case 2:
                    op = (_c.sent()).trim();
                    if (!(op === '1')) return [3 /*break*/, 8];
                    return [4 /*yield*/, ask('Nome: ')];
                case 3:
                    nome = _c.sent();
                    return [4 /*yield*/, ask('Telefone: ')];
                case 4:
                    tel = _c.sent();
                    return [4 /*yield*/, ask('Email (opcional): ')];
                case 5:
                    email = _c.sent();
                    return [4 /*yield*/, ask('Endereço: ')];
                case 6:
                    end = _c.sent();
                    return [4 /*yield*/, cadastrarCliente(nome, tel, email || undefined, end || undefined)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 24];
                case 8:
                    if (!(op === '2')) return [3 /*break*/, 11];
                    return [4 /*yield*/, ask('ID ou nome: ')];
                case 9:
                    chave = _c.sent();
                    return [4 /*yield*/, consultarCliente(chave)];
                case 10:
                    c = _c.sent();
                    if (c)
                        console.log("Encontrado: ID=".concat(c.id, " | ").concat(c.nome, " | ").concat(c.telefone, " | ").concat((_a = c.email) !== null && _a !== void 0 ? _a : '', " | ").concat((_b = c.endereco) !== null && _b !== void 0 ? _b : ''));
                    else
                        console.log('Cliente não encontrado.');
                    return [3 /*break*/, 24];
                case 11:
                    if (!(op === '3')) return [3 /*break*/, 18];
                    return [4 /*yield*/, ask('ID do cliente a atualizar: ')];
                case 12:
                    id = _c.sent();
                    return [4 /*yield*/, ask('Nome (enter p/ manter): ')];
                case 13:
                    nome = _c.sent();
                    return [4 /*yield*/, ask('Telefone (enter p/ manter): ')];
                case 14:
                    tel = _c.sent();
                    return [4 /*yield*/, ask('Email (enter p/ manter): ')];
                case 15:
                    email = _c.sent();
                    return [4 /*yield*/, ask('Endereço (enter p/ manter): ')];
                case 16:
                    end = _c.sent();
                    updates = {};
                    if (nome)
                        updates.nome = nome;
                    if (tel)
                        updates.telefone = tel;
                    if (email)
                        updates.email = email;
                    if (end)
                        updates.endereco = end;
                    return [4 /*yield*/, atualizarCliente(id, updates)];
                case 17:
                    ok = _c.sent();
                    console.log(ok ? 'Atualizado.' : 'Cliente não encontrado.');
                    return [3 /*break*/, 24];
                case 18:
                    if (!(op === '4')) return [3 /*break*/, 21];
                    return [4 /*yield*/, ask('ID do cliente a excluir: ')];
                case 19:
                    id = _c.sent();
                    return [4 /*yield*/, excluirCliente(id)];
                case 20:
                    ok = _c.sent();
                    console.log(ok ? 'Excluído.' : 'Cliente não encontrado.');
                    return [3 /*break*/, 24];
                case 21:
                    if (!(op === '5')) return [3 /*break*/, 23];
                    return [4 /*yield*/, lerClientes()];
                case 22:
                    clientes = _c.sent();
                    if (clientes.length === 0)
                        console.log('Nenhum cliente cadastrado.');
                    else
                        clientes.forEach(function (c) { var _a, _b; return console.log("".concat(c.id, " | ").concat(c.nome, " | ").concat(c.telefone, " | ").concat((_a = c.email) !== null && _a !== void 0 ? _a : '', " | ").concat((_b = c.endereco) !== null && _b !== void 0 ? _b : '')); });
                    return [3 /*break*/, 24];
                case 23:
                    if (op === '6') {
                        sub = false;
                    }
                    else {
                        console.log('Opção inválida.');
                    }
                    _c.label = 24;
                case 24: return [3 /*break*/, 1];
                case 25: return [2 /*return*/];
            }
        });
    });
}
function menuProdutos() {
    return __awaiter(this, void 0, void 0, function () {
        var sub, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sub = true;
                    _loop_1 = function () {
                        var op, cat, nome, desc, precoStr, meta, preco, produtos, chave_1, produtos;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log('\n--- PRODUTOS ---');
                                    console.log('1) Cadastrar produto');
                                    console.log('2) Listar produtos');
                                    console.log('3) Procurar por nome');
                                    console.log('4) Voltar');
                                    return [4 /*yield*/, ask('Escolha: ')];
                                case 1:
                                    op = (_b.sent()).trim();
                                    if (!(op === '1')) return [3 /*break*/, 8];
                                    return [4 /*yield*/, ask('Categoria (Pizza/Bebida/Outros): ')];
                                case 2:
                                    cat = (_b.sent()).trim();
                                    return [4 /*yield*/, ask('Nome do produto: ')];
                                case 3:
                                    nome = _b.sent();
                                    return [4 /*yield*/, ask('Descrição (opcional): ')];
                                case 4:
                                    desc = _b.sent();
                                    return [4 /*yield*/, ask('Preço (ex: 45.00): ')];
                                case 5:
                                    precoStr = _b.sent();
                                    return [4 /*yield*/, ask('Meta (ex: Inteira, 12p, Lata) (opcional): ')];
                                case 6:
                                    meta = _b.sent();
                                    preco = parseFloat(precoStr.replace(',', '.')) || 0;
                                    return [4 /*yield*/, cadastrarProduto({ id: nid('P-'), categoria: cat, nome: nome, descricao: desc || undefined, preco: preco, meta: meta || undefined })];
                                case 7:
                                    _b.sent();
                                    return [3 /*break*/, 14];
                                case 8:
                                    if (!(op === '2')) return [3 /*break*/, 10];
                                    return [4 /*yield*/, lerProdutos()];
                                case 9:
                                    produtos = _b.sent();
                                    if (produtos.length === 0)
                                        console.log('Nenhum produto cadastrado.');
                                    else
                                        produtos.forEach(function (p) { var _a; return console.log("".concat(p.id, " | ").concat(p.categoria, " | ").concat(p.nome, " | R$ ").concat(p.preco.toFixed(2), " | ").concat((_a = p.meta) !== null && _a !== void 0 ? _a : '')); });
                                    return [3 /*break*/, 14];
                                case 10:
                                    if (!(op === '3')) return [3 /*break*/, 13];
                                    return [4 /*yield*/, ask('Nome (ou parte): ')];
                                case 11:
                                    chave_1 = (_b.sent()).toLowerCase();
                                    return [4 /*yield*/, lerProdutos()];
                                case 12:
                                    produtos = (_b.sent()).filter(function (p) { return p.nome.toLowerCase().includes(chave_1); });
                                    if (produtos.length === 0)
                                        console.log('Nenhum produto encontrado.');
                                    else
                                        produtos.forEach(function (p) { var _a; return console.log("".concat(p.id, " | ").concat(p.categoria, " | ").concat(p.nome, " | R$ ").concat(p.preco.toFixed(2), " | ").concat((_a = p.meta) !== null && _a !== void 0 ? _a : '')); });
                                    return [3 /*break*/, 14];
                                case 13:
                                    if (op === '4') {
                                        sub = false;
                                    }
                                    else {
                                        console.log('Opção inválida.');
                                    }
                                    _b.label = 14;
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!sub) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function menuCarrinho() {
    return __awaiter(this, void 0, void 0, function () {
        var sub, op, produtos, sel, _a, p, qtd, _b, obs, idx, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sub = true;
                    _d.label = 1;
                case 1:
                    if (!sub) return [3 /*break*/, 13];
                    console.log('\n--- CARRINHO ---');
                    console.log('1) Adicionar produto ao carrinho');
                    console.log('2) Ver carrinho');
                    console.log('3) Remover item (por índice)');
                    console.log('4) Limpar carrinho');
                    console.log('5) Voltar');
                    return [4 /*yield*/, ask('Escolha: ')];
                case 2:
                    op = (_d.sent()).trim();
                    if (!(op === '1')) return [3 /*break*/, 8];
                    return [4 /*yield*/, lerProdutos()];
                case 3:
                    produtos = _d.sent();
                    produtos.forEach(function (p, i) { var _a; return console.log("".concat(i + 1, ") ").concat(p.nome, " - R$ ").concat(p.preco.toFixed(2), " (").concat((_a = p.meta) !== null && _a !== void 0 ? _a : p.categoria, ")")); });
                    _a = parseInt;
                    return [4 /*yield*/, ask('Escolha o número do produto: ')];
                case 4:
                    sel = _a.apply(void 0, [_d.sent(), 10]);
                    if (isNaN(sel) || sel < 1 || sel > produtos.length) {
                        console.log('Selecionado inválido.');
                        return [3 /*break*/, 1];
                    }
                    p = produtos[sel - 1];
                    _b = parseInt;
                    return [4 /*yield*/, ask('Quantidade: ')];
                case 5:
                    qtd = _b.apply(void 0, [_d.sent(), 10]) || 1;
                    obs = void 0;
                    if (!(p.categoria === 'Pizza')) return [3 /*break*/, 7];
                    return [4 /*yield*/, ask('Observação (ex: meia com outro sabor) (opcional): ')];
                case 6:
                    obs = _d.sent();
                    _d.label = 7;
                case 7:
                    adicionarAoCarrinho({ produtoId: p.id, nome: p.nome, quantidade: qtd, precoUnit: p.preco, observacao: obs || undefined });
                    return [3 /*break*/, 12];
                case 8:
                    if (!(op === '2')) return [3 /*break*/, 9];
                    verCarrinho();
                    return [3 /*break*/, 12];
                case 9:
                    if (!(op === '3')) return [3 /*break*/, 11];
                    verCarrinho();
                    _c = parseInt;
                    return [4 /*yield*/, ask('Índice do item a remover: ')];
                case 10:
                    idx = _c.apply(void 0, [_d.sent(), 10]);
                    removerDoCarrinho(idx);
                    return [3 /*break*/, 12];
                case 11:
                    if (op === '4') {
                        CARRINHO = [];
                        console.log('Carrinho limpo.');
                    }
                    else if (op === '5') {
                        sub = false;
                    }
                    else {
                        console.log('Opção inválida.');
                    }
                    _d.label = 12;
                case 12: return [3 /*break*/, 1];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Avaliação do sistema
function avaliarExperiencia(clienteNome) {
    return __awaiter(this, void 0, void 0, function () {
        var notaStr, nota, feedback, feedbackFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n===== AVALIAÇÃO =====');
                    console.log("Cliente: ".concat(clienteNome || 'Cliente não identificado'));
                    console.log('Nos avalie de 1 a 5 estrelas (1 = ruim, 5 = excelente)');
                    return [4 /*yield*/, ask('Sua nota: ')];
                case 1:
                    notaStr = _a.sent();
                    nota = parseInt(notaStr.trim(), 10);
                    if (isNaN(nota) || nota < 1 || nota > 5) {
                        console.log('Nota inválida. Avaliação ignorada.');
                        return [2 /*return*/];
                    }
                    feedback = "Cliente: ".concat(clienteNome || 'Não informado', " | Avalia\u00E7\u00E3o: ").concat('★'.repeat(nota)).concat('☆'.repeat(5 - nota), " (").concat(nota, "/5) | Data: ").concat(new Date().toLocaleString());
                    console.log('\n');
                    console.log("Obrigado pelo feedback, ".concat(clienteNome || 'Cliente', "! Voc\u00EA deu ").concat(nota, " estrela(s)."));
                    console.log('\n');
                    feedbackFile = path.join(DATA_DIR, 'avaliacoes.txt');
                    return [4 /*yield*/, appendCSV(feedbackFile, feedback)];
                case 2:
                    _a.sent();
                    console.log("Avalia\u00E7\u00E3o salva em ".concat(feedbackFile));
                    return [2 /*return*/];
            }
        });
    });
}
//Emissão de comprovante de compra
var fs_2 = require("fs");
function emitirComprovante(pedido) {
    return __awaiter(this, void 0, void 0, function () {
        var comprovante;
        var _a;
        return __generator(this, function (_b) {
            comprovante = '\n===== COMPROVANTE DE PEDIDO =====\n';
            comprovante += "ID do Pedido: ".concat(pedido.id, "\n");
            comprovante += "Cliente: ".concat((_a = pedido.clienteNome) !== null && _a !== void 0 ? _a : 'Cliente não identificado', "\n");
            comprovante += "Data: ".concat(new Date(pedido.dataISO).toLocaleString(), "\n\n");
            comprovante += 'Itens:\n';
            // Mostra os itens do carrinho
            pedido.itens.forEach(function (item, index) {
                var subtotal = item.precoUnit * item.quantidade;
                comprovante += "".concat(index + 1, ") ").concat(item.nome, " - x").concat(item.quantidade, " - R$ ").concat(subtotal.toFixed(2)).concat(item.observacao ? " (".concat(item.observacao, ")") : '', "\n");
            });
            comprovante += "\nTotal: R$ ".concat(pedido.total.toFixed(2), "\n");
            comprovante += "Forma de pagamento: ".concat(pedido.formaPagamento, "\n");
            // Se a forma de pagamento for dinheiro
            if (pedido.trocoPara !== undefined) {
                comprovante += "Troco para: R$ ".concat(pedido.trocoPara.toFixed(2), "\n");
            }
            comprovante += '\n================================\n';
            console.log('Comprovante emitido com sucesso!');
            comprovante += 'Obrigado pela compra! \n';
            // Mostra no terminal
            console.log(comprovante);
            // Salva em arquivo .txt
            (0, fs_2.writeFileSync)("comprovante.txt", comprovante, { encoding: "utf8" });
            console.log("Comprovante salvo em 'comprovante.txt'");
            return [2 /*return*/];
        });
    });
}
function fluxoFinalizarPedido() {
    return __awaiter(this, void 0, void 0, function () {
        var temCliente, clienteId, chave, c, pedidoParcial, op, trocoStr, trocoNum;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (CARRINHO.length === 0) {
                        console.log('Carrinho vazio. Adicione itens antes de finalizar.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ask('Associar a um cliente cadastrado? (s/n): ')];
                case 1:
                    temCliente = (_a.sent()).trim().toLowerCase();
                    if (!(temCliente === 's' || temCliente === 'sim')) return [3 /*break*/, 4];
                    return [4 /*yield*/, ask('Digite ID ou nome do cliente: ')];
                case 2:
                    chave = _a.sent();
                    return [4 /*yield*/, consultarCliente(chave)];
                case 3:
                    c = _a.sent();
                    if (!c) {
                        console.log('Cliente não encontrado, continue sem cliente ou cadastre antes.');
                    }
                    else {
                        clienteId = c.id;
                        console.log("Pedido associado a ".concat(c.nome));
                    }
                    _a.label = 4;
                case 4: return [4 /*yield*/, finalizarPedido(clienteId)];
                case 5:
                    pedidoParcial = _a.sent();
                    if (!pedidoParcial)
                        return [2 /*return*/];
                    // escolher forma pagamento
                    console.log('Formas de pagamento: 1) Pix  2) Cartão  3) Dinheiro  4) Vale-alimentacao');
                    return [4 /*yield*/, ask('Escolha: ')];
                case 6:
                    op = (_a.sent()).trim();
                    if (!(op === '1')) return [3 /*break*/, 7];
                    pedidoParcial.formaPagamento = 'Pix';
                    return [3 /*break*/, 11];
                case 7:
                    if (!(op === '2')) return [3 /*break*/, 8];
                    pedidoParcial.formaPagamento = 'Cartão';
                    return [3 /*break*/, 11];
                case 8:
                    if (!(op === '3')) return [3 /*break*/, 10];
                    pedidoParcial.formaPagamento = 'Dinheiro';
                    return [4 /*yield*/, ask('Valor entregue pelo cliente (para calcular troco) - deixe em branco se exato: ')];
                case 9:
                    trocoStr = _a.sent();
                    if (trocoStr) {
                        trocoNum = parseFloat(trocoStr.replace(',', '.')) || 0;
                        pedidoParcial.trocoPara = trocoNum;
                    }
                    return [3 /*break*/, 11];
                case 10:
                    if (op === '4')
                        pedidoParcial.formaPagamento = 'Vale-alimentacao';
                    else {
                        console.log('Opção inválida. Usando Dinheiro por padrão.');
                        pedidoParcial.formaPagamento = 'Dinheiro';
                    }
                    _a.label = 11;
                case 11: 
                //Grava o pedido
                return [4 /*yield*/, gravarPedido(pedidoParcial)];
                case 12:
                    //Grava o pedido
                    _a.sent();
                    //Emite o comprovante
                    return [4 /*yield*/, emitirComprovante(pedidoParcial)];
                case 13:
                    //Emite o comprovante
                    _a.sent();
                    //Pede avaliação
                    return [4 /*yield*/, avaliarExperiencia(pedidoParcial.clienteNome)];
                case 14:
                    //Pede avaliação
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------- Inicialização ----------
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, ensureFiles()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, carregarProdutosIniciais()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, menuPrincipal()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error('Erro no sistema:', err_1);
                    rl.close();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
})();
