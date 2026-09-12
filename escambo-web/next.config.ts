import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove o ícone flutuante de dev tools do Next (pedido do usuário — não
  // combina com o visual de app do produto final).
  devIndicators: false,
  // `next/image` com `quality={100}` (logo em alta definição no cabeçalho,
  // na Home e no Cadastro) passou a exigir que cada valor de qualidade usado
  // esteja explicitamente listado aqui a partir desta versão do Next — sem
  // isso, o navegador acusa "quality is not configured in images.qualities"
  // no console (mesmo as imagens sendo `unoptimized`, o aviso ainda aparece).
  // 75 é o padrão do Next; 100 é o que usamos para a logo.
  images: {
    qualities: [75, 100],
  },
};

export default nextConfig;
