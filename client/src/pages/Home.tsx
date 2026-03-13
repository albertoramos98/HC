import { useState, useMemo } from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';

/**
 * HC - Desde 2020 | Catálogo Digital
 * Design: Cyberpunk Futurista Minimalista
 * Cores: Neon Verde (#39FF14) + Prata Cromada (#C0C0C0) + Preto Absoluto (#000000)
 * Tipografia: Orbitron (display) + Roboto Mono (body)
 */

// Dados do catálogo - JSON como fonte da verdade
const CATALOGO_DATA = {
  catalogo: [
    {
      marca: "IGNITE",
      modelos: [
        {
          id: "ig_v80",
          nome: "IGNITE 8.000",
          preco: 115.00,
          sabores: ["Limão com Manga", "Banana e Cereja", "Mirtilo com Limão", "Melancia Congelada", "Cactus"]
        },
        {
          id: "ig_v400_mix",
          nome: "IGNITE 40.000 MIX",
          preco: 165.00,
          sabores: ["Banana Ice / Morango Ice", "Maracujá com Kiwi Azedo / Abacaxi Ice"]
        }
      ]
    },
    {
      marca: "ELF BAR",
      modelos: [
        {
          id: "eb_23k",
          nome: "ELF BAR 23.000",
          preco: 135.00,
          sabores: ["Maça Verde", "Sakura Grape", "Kiwi com Fruta do Dragão"]
        }
      ]
    },
    {
      marca: "BLACK SHEEP",
      modelos: [
        {
          id: "bs_10k",
          nome: "BLACK SHEEP 10.000",
          preco: 125.00,
          sabores: ["Morango Selvagem", "Blueberry Mint", "Tropical Mix"]
        },
        {
          id: "bs_20k",
          nome: "BLACK SHEEP 20.000",
          preco: 155.00,
          sabores: ["Grape Ice", "Peach Mango", "Watermelon Freeze"]
        }
      ]
    },
    {
      marca: "SEX ADDICT",
      modelos: [
        {
          id: "sa_15k",
          nome: "SEX ADDICT 15.000",
          preco: 140.00,
          sabores: ["Strawberry Passion", "Mango Tango", "Cherry Bomb"]
        }
      ]
    },
    {
      marca: "WAKA",
      modelos: [
        {
          id: "wk_9k",
          nome: "WAKA 9.000",
          preco: 120.00,
          sabores: ["Lychee Ice", "Pineapple Coconut", "Mixed Berries"]
        },
        {
          id: "wk_18k",
          nome: "WAKA 18.000",
          preco: 150.00,
          sabores: ["Menta Gelada", "Frutas Vermelhas", "Citrus Explosion"]
        }
      ]
    }
  ]
};

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  sabor: string;
  quantidade: number;
}

export default function Home() {
  const [marcaSelecionada, setMarcaSelecionada] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [saborSelecionado, setSaborSelecionado] = useState<Record<string, string>>({});

  // Filtrar produtos por marca
  const produtosFiltrados = useMemo(() => {
    if (!marcaSelecionada) {
      return CATALOGO_DATA.catalogo.flatMap(marca => 
        marca.modelos.map(modelo => ({ ...modelo, marca: marca.marca }))
      );
    }
    const marca = CATALOGO_DATA.catalogo.find(m => m.marca === marcaSelecionada);
    return marca ? marca.modelos.map(modelo => ({ ...modelo, marca: marcaSelecionada })) : [];
  }, [marcaSelecionada]);

  // Calcular total do carrinho
  const total = useMemo(() => {
    return carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  }, [carrinho]);

  // Adicionar ao carrinho
  const adicionarAoCarrinho = (produto: any) => {
    const sabor = saborSelecionado[produto.id];
    if (!sabor) {
      alert('Por favor, selecione um sabor!');
      return;
    }

    const itemExistente = carrinho.find(
      item => item.id === produto.id && item.sabor === sabor
    );

    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.id === produto.id && item.sabor === sabor
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        sabor,
        quantidade: 1
      }]);
    }

    setSaborSelecionado({ ...saborSelecionado, [produto.id]: '' });
  };

  // Remover do carrinho
  const removerDoCarrinho = (id: string, sabor: string) => {
    setCarrinho(carrinho.filter(item => !(item.id === id && item.sabor === sabor)));
  };

  // Alterar quantidade
  const alterarQuantidade = (id: string, sabor: string, delta: number) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id && item.sabor === sabor) {
        const novaQtd = item.quantidade + delta;
        return novaQtd > 0 ? { ...item, quantidade: novaQtd } : item;
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  // Gerar link WhatsApp
  const gerarLinkWhatsApp = () => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    let mensagem = '🚀 Pedido HC\n\n';
    carrinho.forEach(item => {
      mensagem += `${item.nome} x${item.quantidade} - ${item.sabor}\n`;
    });
    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

    const numeroWhatsApp = '558197390944'; // +55 81 9739-0944
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <div className="min-h-screen bg-black asphalt-texture">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#39FF14]/30">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39FF14] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold font-['Orbitron'] text-lg">HC</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold neon-glow">HC VAPE</h1>
              <p className="text-xs text-[#C0C0C0]">Desde 2020</p>
            </div>
          </div>

          {/* Carrinho Button */}
          <button
            onClick={() => setCarrinhoAberto(!carrinhoAberto)}
            className="relative p-3 rounded-lg border border-[#39FF14]/50 hover:border-[#39FF14] transition-all duration-300 group"
          >
            <ShoppingCart className="w-6 h-6 text-[#39FF14]" />
            {carrinho.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#39FF14] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {carrinho.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-xl overflow-hidden h-64 md:h-96 mb-8 neon-border">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663031280581/YWVtuQ8XYvWAC8qzKsm9J4/hc-hero-vape-hbeqLd68hjYagq8tDr8jQW.webp"
              alt="HC Vape Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
              <div className="pl-8">
                <h2 className="text-4xl md:text-5xl font-bold neon-glow mb-2">CATÁLOGO</h2>
                <p className="text-[#C0C0C0] text-lg">Explore nossos produtos premium</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros por Marca */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4 text-[#E0E0E0]">Filtrar por Marca</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setMarcaSelecionada(null)}
              className={`px-4 py-2 rounded-lg font-['Orbitron'] font-bold transition-all duration-300 ${
                marcaSelecionada === null
                  ? 'bg-[#39FF14] text-black neon-border'
                  : 'bg-[#1a1a1a] text-[#E0E0E0] border border-[#39FF14]/30 hover:border-[#39FF14]'
              }`}
            >
              Todas
            </button>
            {CATALOGO_DATA.catalogo.map(marca => (
              <button
                key={marca.marca}
                onClick={() => setMarcaSelecionada(marca.marca)}
                className={`px-4 py-2 rounded-lg font-['Orbitron'] font-bold transition-all duration-300 ${
                  marcaSelecionada === marca.marca
                    ? 'bg-[#39FF14] text-black neon-border'
                    : 'bg-[#1a1a1a] text-[#E0E0E0] border border-[#39FF14]/30 hover:border-[#39FF14]'
                }`}
              >
                {marca.marca}
              </button>
            ))}
          </div>
        </section>

        {/* Grid de Produtos */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map(produto => (
              <div
                key={produto.id}
                className="group glass-morphism p-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
              >
                {/* Badge de Marca */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#39FF14]/20 border border-[#39FF14] text-[#39FF14] text-xs font-bold rounded-full font-['Orbitron']">
                    {produto.marca}
                  </span>
                </div>

                {/* Nome do Produto */}
                <h4 className="text-xl font-bold text-[#E0E0E0] mb-2 font-['Orbitron']">
                  {produto.nome}
                </h4>

                {/* Preço */}
                <div className="mb-4">
                  <p className="text-3xl font-bold neon-glow font-['Roboto_Mono']">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </div>

                {/* Seletor de Sabor */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#C0C0C0] mb-2 font-['Orbitron']">
                    Sabor
                  </label>
                  <select
                    value={saborSelecionado[produto.id] || ''}
                    onChange={(e) => setSaborSelecionado({
                      ...saborSelecionado,
                      [produto.id]: e.target.value
                    })}
                    className="w-full bg-black/60 border border-[#39FF14]/50 text-[#E0E0E0] px-3 py-2 rounded-lg focus:border-[#39FF14] focus:outline-none transition-all duration-300 font-['Roboto_Mono']"
                  >
                    <option value="">Selecione um sabor</option>
                    {produto.sabores.map(sabor => (
                      <option key={sabor} value={sabor}>
                        {sabor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botão Adicionar */}
                <button
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="cyber-button w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Carrinho Flutuante */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCarrinhoAberto(false)}
          />

          {/* Painel do Carrinho */}
          <div className="relative w-full md:w-96 h-screen md:h-auto md:max-h-[90vh] bg-black border-l md:border border-[#39FF14]/50 flex flex-col overflow-hidden rounded-t-2xl md:rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#39FF14]/30">
              <h3 className="text-2xl font-bold neon-glow font-['Orbitron']">CARRINHO</h3>
              <button
                onClick={() => setCarrinhoAberto(false)}
                className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6 text-[#39FF14]" />
              </button>
            </div>

            {/* Itens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {carrinho.length === 0 ? (
                <p className="text-center text-[#808080] py-8">Carrinho vazio</p>
              ) : (
                carrinho.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.sabor}-${idx}`}
                    className="bg-[#0a0a0a] border border-[#39FF14]/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-[#E0E0E0] font-['Orbitron']">{item.nome}</p>
                        <p className="text-sm text-[#C0C0C0]">{item.sabor}</p>
                      </div>
                      <button
                        onClick={() => removerDoCarrinho(item.id, item.sabor)}
                        className="p-1 hover:bg-red-500/20 rounded transition-all duration-300"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alterarQuantidade(item.id, item.sabor, -1)}
                          className="p-1 bg-[#1a1a1a] border border-[#39FF14]/30 rounded hover:border-[#39FF14] transition-all duration-300"
                        >
                          <Minus className="w-4 h-4 text-[#39FF14]" />
                        </button>
                        <span className="w-8 text-center font-bold text-[#E0E0E0]">{item.quantidade}</span>
                        <button
                          onClick={() => alterarQuantidade(item.id, item.sabor, 1)}
                          className="p-1 bg-[#1a1a1a] border border-[#39FF14]/30 rounded hover:border-[#39FF14] transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 text-[#39FF14]" />
                        </button>
                      </div>
                      <p className="font-bold text-[#39FF14] font-['Roboto_Mono']">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {carrinho.length > 0 && (
              <div className="border-t border-[#39FF14]/30 p-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-[#E0E0E0]">Total:</span>
                  <span className="neon-glow font-['Roboto_Mono']">R$ {total.toFixed(2)}</span>
                </div>
                <button
                  onClick={gerarLinkWhatsApp}
                  className="cyber-button w-full"
                >
                  Finalizar no WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
