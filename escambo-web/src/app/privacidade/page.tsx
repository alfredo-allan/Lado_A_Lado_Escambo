import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade",
};

/**
 * Conteúdo placeholder alinhado à LGPD (Lei 13.709/2018) — texto jurídico
 * definitivo deve ser revisado por um advogado antes de ir para produção.
 */
export default function PrivacidadePage() {
  return (
    <div className="page-container max-w-2xl py-6 pb-14">
      <Link href="/cadastro" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
        <ArrowLeft className="size-4" />
        Voltar ao cadastro
      </Link>

      <h1 className="mb-4 font-display text-2xl font-bold text-foreground">Política de Privacidade</h1>

      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Esta política explica como o Escambo trata os dados pessoais coletados no cadastro e no uso da plataforma,
          em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD).
        </p>
        <p>
          <strong className="text-foreground">1. Dados coletados.</strong> Nome completo, CPF, e-mail, telefone,
          estado e município. O CPF é usado exclusivamente para validação de identidade e combate a fraudes, e é
          armazenado de forma criptografada — nunca em texto puro.
        </p>
        <p>
          <strong className="text-foreground">2. Finalidade.</strong> Os dados são usados para viabilizar o
          cadastro, a comunicação entre usuários durante uma negociação de troca, e para prevenção de fraudes.
          Não usamos seus dados para envio de propaganda de terceiros.
        </p>
        <p>
          <strong className="text-foreground">3. Compartilhamento.</strong> Seus dados de contato só ficam visíveis
          para outro usuário depois que ambos aceitarem uma proposta de troca. Nunca vendemos ou compartilhamos seus
          dados com terceiros para fins comerciais.
        </p>
        <p>
          <strong className="text-foreground">4. Seus direitos.</strong> Você pode solicitar a qualquer momento,
          através do seu perfil, a correção, exportação ou exclusão dos seus dados pessoais, conforme os direitos
          garantidos pela LGPD.
        </p>
        <p>
          <strong className="text-foreground">5. Segurança.</strong> Usamos conexão criptografada (HTTPS) e
          controles de acesso para proteger os dados armazenados.
        </p>
        <p className="text-xs text-muted-foreground/80">
          Última atualização: versão de desenvolvimento. Este texto ainda não passou por revisão jurídica.
        </p>
      </div>
    </div>
  );
}
