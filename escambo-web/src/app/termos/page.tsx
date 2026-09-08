import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso",
};

/**
 * Conteúdo placeholder — o texto jurídico definitivo deve ser revisado por
 * um advogado antes de ir para produção. O objetivo aqui é só dar ao
 * usuário um link real para ler antes de aceitar no Cadastro (Etapa 2).
 */
export default function TermosPage() {
  return (
    <div className="page-container max-w-2xl py-6 pb-14">
      <Link
        href="/cadastro"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar ao cadastro
      </Link>

      <h1 className="mb-4 font-display text-2xl font-bold text-foreground">Termos de Uso do Escambo</h1>

      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          O Escambo é uma plataforma de anúncios para facilitar a troca direta (permuta física) de bens e produtos
          variados entre pessoas em todo o Brasil, incentivando a reutilização e o consumo consciente. Ao usar o
          Escambo, você concorda com os termos abaixo.
        </p>
        <p>
          <strong className="text-foreground">1. O que o Escambo é.</strong> Somos um espaço de anúncios e
          intermediação de contato entre pessoas interessadas em trocar mercadorias. O Escambo não é parte da troca,
          não garante a qualidade, origem ou legalidade dos itens anunciados, e não processa pagamentos.
        </p>
        <p>
          <strong className="text-foreground">2. Responsabilidade nas trocas.</strong> Cabe a cada usuário verificar
          o item antes de concluir a troca (no caso de animais, exigir a documentação de trânsito animal (GTA)
          aplicável) e realizar encontros em locais seguros e públicos.
        </p>
        <p>
          <strong className="text-foreground">3. Cadastro e veracidade dos dados.</strong> Você declara que as
          informações fornecidas no cadastro são verdadeiras e se compromete a mantê-las atualizadas.
        </p>
        <p>
          <strong className="text-foreground">4. Conduta na plataforma.</strong> Não são permitidos anúncios
          fraudulentos, itens de origem ilegal, ou uso da plataforma para fins diferentes da troca de bens e
          produtos entre usuários.
        </p>
        <p>
          <strong className="text-foreground">5. Alterações.</strong> Estes Termos podem ser atualizados; mudanças
          relevantes serão comunicadas aos usuários cadastrados.
        </p>
        <p className="text-xs text-muted-foreground/80">
          Última atualização: versão de desenvolvimento. Este texto ainda não passou por revisão jurídica.
        </p>
      </div>
    </div>
  );
}
