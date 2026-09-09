import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove o ícone flutuante de dev tools do Next (pedido do usuário — não
  // combina com o visual de app do produto final).
  devIndicators: false,
};

export default nextConfig;
