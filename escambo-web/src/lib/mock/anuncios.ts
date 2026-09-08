import type { Anuncio } from "@/types/anuncio";

/**
 * Dados mockados da Vitrine de Trocas. Servem só para desenvolvimento das
 * telas antes do backend existir — ver `src/lib/api/anuncios.ts` para o
 * ponto de troca. As fotos usam um serviço de placeholder (picsum.photos);
 * no produto real elas vêm do upload do próprio anunciante.
 *
 * Itens focados em produtos variados (não agropecuários/animais) por pedido
 * explícito do usuário — a categoria `Anuncio["categoria"]` continua
 * genérica no tipo, aberta a qualquer segmento futuro. Localidades dos
 * anúncios espalhadas por diferentes regiões do país (Sudeste, Sul,
 * Nordeste) para deixar claro que o Escambo é uma rede nacional, não
 * restrita a uma única região.
 */
export const MOCK_ANUNCIOS: Anuncio[] = [
  {
    id: "bicicleta-aro29-sao-paulo",
    titulo: "Bicicleta Aro 29 Seminova, Pouco Uso",
    categoria: "variados",
    categoriaLabel: "Bicicletas & Esportes",
    status: "disponivel",
    imagens: [
      "https://picsum.photos/seed/escambo-bike-1/1200/900",
      "https://picsum.photos/seed/escambo-bike-2/1200/900",
      "https://picsum.photos/seed/escambo-bike-3/1200/900",
    ],
    localidade: "São Paulo, SP • Zona Leste",
    distanciaKm: 6,
    publicadoHa: "2 horas",
    descricaoCurta: "Smartphone em bom estado ou ferramentas elétricas",
    descricaoLonga:
      "Bicicleta aro 29, quadro em alumínio, 21 marchas, freio a disco. Usada por cerca de 6 meses, sempre guardada em local coberto. Pneus e câmaras trocados recentemente, sem folgas ou ruídos.",
    motivoTroca: "Preciso de um celular melhor para trabalho, ou de ferramentas para uma reforma em casa.",
    opcoesTroca: [
      {
        titulo: "Opção 1: Smartphone em bom estado",
        descricao: "Tela sem trincos, bateria boa, com carregador. Sujeito a avaliação.",
      },
      {
        titulo: "Opção 2: Kit de ferramentas elétricas",
        descricao: "Furadeira/parafusadeira, serra circular ou similar, funcionando.",
      },
    ],
    balanca: "equivalente",
    atributos: ["Pouco uso", "Freio a disco", "Aceita contraproposta"],
    vendedor: {
      id: "usr_marcia-sp",
      nome: "Márcia Oliveira",
      iniciais: "M",
      fotoUrl: "https://i.pravatar.cc/150?u=marcia-sp",
      verificado: true,
      nota: 4.9,
      trocasConcluidas: 17,
      naComunidadeDesde: "Há 2 anos",
      percentualEntregas: 100,
    },
  },
  {
    id: "furadeira-profissional-porto-alegre",
    titulo: "Furadeira/Parafusadeira Profissional + Kit de Brocas",
    categoria: "maquinas_motores",
    categoriaLabel: "Ferramentas & Utilidades",
    status: "disponivel",
    imagens: ["https://picsum.photos/seed/escambo-furadeira-1/1200/900"],
    localidade: "Porto Alegre, RS",
    distanciaKm: 12,
    publicadoHa: "5 horas",
    descricaoCurta: "TV de 32'' ou caixa de som amplificada",
    descricaoLonga:
      "Furadeira/parafusadeira profissional com bateria e carregador, acompanha maleta e kit completo de brocas e pontas. Pouco uso, testada e funcionando perfeitamente.",
    opcoesTroca: [
      { titulo: "TV de 32'' (LED/Smart)", descricao: "Funcionando, sem trincos na tela." },
      { titulo: "Caixa de som amplificada", descricao: "Com bluetooth, boa potência." },
    ],
    balanca: "flexivel",
    atributos: ["Com maleta", "Kit de brocas incluso", "Testada"],
    vendedor: {
      id: "usr_joao-poa",
      nome: "João Pedro Alves",
      iniciais: "J",
      verificado: true,
      nota: 5.0,
      trocasConcluidas: 9,
      naComunidadeDesde: "Há 8 meses",
      percentualEntregas: 100,
    },
  },
  {
    id: "sofa-rack-feira-de-santana",
    titulo: "Sofá 3 Lugares + Rack de TV",
    categoria: "variados",
    categoriaLabel: "Casa & Decoração",
    status: "em_negociacao",
    imagens: ["https://picsum.photos/seed/escambo-sofa-1/1200/900"],
    localidade: "Feira de Santana, Bahia",
    publicadoHa: "1 dia",
    descricaoCurta: "Guarda-roupa 6 portas ou fogão 5 bocas",
    descricaoLonga:
      "Sofá retrátil e reclinável 3 lugares em tecido suede, cor cinza, sem manchas ou rasgos. Rack de TV em MDF, com nichos, cor branca. Ambos em ótimo estado de conservação.",
    opcoesTroca: [
      { titulo: "Guarda-roupa 6 portas", descricao: "Em bom estado, com espelho de preferência." },
      { titulo: "Fogão 5 bocas", descricao: "Funcionando, com forno operando normalmente." },
    ],
    balanca: "equivalente",
    atributos: ["Sem manchas", "Retrátil e reclinável", "Conjunto completo"],
    vendedor: {
      id: "usr_ana-feira-santana",
      nome: "Ana Beatriz Souza",
      iniciais: "A",
      verificado: false,
      nota: 4.7,
      trocasConcluidas: 5,
      naComunidadeDesde: "Há 4 meses",
      percentualEntregas: 90,
    },
  },
];
