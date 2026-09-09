"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  Camera,
  ChevronDown,
  Coins,
  Info,
  Loader2,
  LogIn,
  MapPin,
  PackageCheck,
  PartyPopper,
  Sparkles,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ESTADOS } from "@/lib/estados";
import { useAuth } from "@/lib/auth-context";
import { criarAnuncio, type CriarAnuncioResultado } from "@/lib/api/anuncios";
import type { UF } from "@/types/usuario";

const MAX_FOTOS = 5;

const CATEGORIAS = [
  "Eletrônicos & Tecnologia",
  "Móveis & Decoração",
  "Roupas & Acessórios",
  "Ferramentas & Utilidades",
  "Bicicletas & Esportes",
  "Livros & Papelaria",
  "Casa & Cozinha",
  "Outros",
];

const CONDICOES = ["Novo (na caixa)", "Seminovo", "Usado — bom estado", "Usado — com marcas de uso"];

interface FotoSelecionada {
  id: string;
  url: string;
  arquivo: File;
}

/** Quantas fotos, no máximo, viram data URL e vão para o `localStorage` ao publicar — ver comentário em `handleSubmit`. */
const MAX_FOTOS_PERSISTIDAS = 3;

/**
 * Redimensiona a imagem para no máximo `maxLargura`px de largura e devolve
 * como data URL JPEG — usado só na publicação (não no preview, que continua
 * via `URL.createObjectURL`, mais leve). Existe porque as fotos, neste
 * protótipo, são persistidas em `localStorage` (ver
 * `src/lib/anuncios-usuario.ts`), que tem um limite de alguns MB por
 * origem — uma foto de câmera em resolução original estouraria essa cota em
 * poucas fotos. Num backend real isso vira um upload de verdade, sem essa
 * limitação.
 */
function redimensionarParaDataUrl(arquivo: File, maxLargura = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    const urlTemporaria = URL.createObjectURL(arquivo);
    imagem.onload = () => {
      const escala = Math.min(1, maxLargura / imagem.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(imagem.width * escala);
      canvas.height = Math.round(imagem.height * escala);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(urlTemporaria);
        reject(new Error("Canvas indisponível"));
        return;
      }
      ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(urlTemporaria);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    imagem.onerror = () => {
      URL.revokeObjectURL(urlTemporaria);
      reject(new Error("Não foi possível ler a imagem"));
    };
    imagem.src = urlTemporaria;
  });
}

/**
 * Anunciar (Etapa 4 — postagem de item para troca). Publica via
 * `criarAnuncio` (ver `src/lib/api/anuncios.ts`), que agora persiste de
 * verdade no `localStorage` do navegador (ver `src/lib/anuncios-usuario.ts`)
 * — o anúncio publicado aparece em "Meus Anúncios" (`/perfil`) e tem página
 * de detalhe navegável, mesmo sem backend ainda. A categoria escolhida aqui é
 * só um rótulo livre (`categoriaLabel`) — internamente mapeada para
 * `categoria: "variados"` no backend futuro, sem mexer no enum
 * `CategoriaAnuncio` por enquanto. Gate de sessão real via `useAuth()` —
 * exige login/cadastro para publicar. Sem o logo grande — o `AppHeader`
 * global já fica visível nesta rota (em telas >= md; no mobile ele está
 * oculto, ver `app-header.tsx`).
 */
export default function AnunciarPage() {
  const { usuario, carregando } = useAuth();
  const [fotos, setFotos] = useState<FotoSelecionada[]>([]);
  const [titulo, setTitulo] = useState("");
  const [categoriaLabel, setCategoriaLabel] = useState(CATEGORIAS[0]);
  const [condicao, setCondicao] = useState(CONDICOES[0]);
  const [descricao, setDescricao] = useState("");
  const [aceitaTroca, setAceitaTroca] = useState("");
  const [aceitaVoltaDinheiro, setAceitaVoltaDinheiro] = useState(false);
  const [valorVoltaSugerido, setValorVoltaSugerido] = useState("");
  const [estado, setEstado] = useState<UF>("SP");
  const [municipio, setMunicipio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CriarAnuncioResultado | null>(null);

  // Libera a memória dos previews (URL.createObjectURL) quando a tela é
  // desmontada — evita vazamento silencioso de blobs entre navegações.
  useEffect(() => {
    return () => {
      fotos.forEach((foto) => URL.revokeObjectURL(foto.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const podeEnviar =
    fotos.length > 0 &&
    titulo.trim().length > 2 &&
    descricao.trim().length > 9 &&
    aceitaTroca.trim().length > 2 &&
    municipio.trim().length > 1 &&
    !enviando;

  function adicionarFotos(event: ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (arquivos.length === 0) return;

    const espacoRestante = MAX_FOTOS - fotos.length;
    const novas: FotoSelecionada[] = arquivos.slice(0, espacoRestante).map((file) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      arquivo: file,
    }));
    setFotos((atual) => [...atual, ...novas]);
  }

  function removerFoto(id: string) {
    setFotos((atual) => {
      const alvo = atual.find((foto) => foto.id === id);
      if (alvo) URL.revokeObjectURL(alvo.url);
      return atual.filter((foto) => foto.id !== id);
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!podeEnviar || !usuario) {
      setErro("Confira os campos obrigatórios: fotos, título, descrição, o que você aceita em troca e o município.");
      return;
    }

    setEnviando(true);
    setErro(null);

    // Só as `MAX_FOTOS_PERSISTIDAS` primeiras viram data URL de verdade (ver
    // `redimensionarParaDataUrl`) — o resto do fluxo de seleção continua
    // aceitando até `MAX_FOTOS`, mas persistir todas estouraria a cota do
    // `localStorage` rapidamente.
    let imagens: string[];
    try {
      imagens = await Promise.all(
        fotos.slice(0, MAX_FOTOS_PERSISTIDAS).map((foto) => redimensionarParaDataUrl(foto.arquivo)),
      );
    } catch {
      imagens = [];
    }

    const resposta = await criarAnuncio({
      titulo,
      categoriaLabel,
      condicao,
      descricao,
      aceitaTroca,
      aceitaVoltaDinheiro,
      valorVoltaSugerido: aceitaVoltaDinheiro ? valorVoltaSugerido : undefined,
      estado,
      municipio,
      imagens,
      autor: usuario,
    });
    setEnviando(false);
    setResultado(resposta);
  }

  if (carregando) {
    return (
      <div className="page-container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground">
          <UserRound className="size-8" />
        </div>
        <h1 className="mb-2 font-display text-xl font-bold text-foreground">Faça login para anunciar</h1>
        <p className="mb-6 text-muted-foreground">
          Publicar um item para troca exige uma conta — assim quem se interessar consegue negociar direto com
          você.
        </p>
        <div className="flex w-full flex-col gap-2">
          <Button asChild size="lg" className="w-full">
            <Link href="/login?next=/anunciar">
              <LogIn className="size-5" />
              Entrar
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (resultado) {
    return <AnuncioPublicado titulo={titulo} />;
  }

  return (
    <div className="page-container max-w-xl py-4 pb-14">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Voltar para a tela anterior"
          className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-1.5 rounded-full bg-primary-container/25 px-3 py-1.5">
          <Sparkles className="size-4 text-primary" />
          <span className="font-display text-xs font-bold tracking-wide text-primary">Novo Anúncio</span>
        </div>
      </div>

      <header className="mb-6">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Anuncie seu desapego</h1>
        <p className="text-muted-foreground">
          Capriche nas fotos e na descrição — quanto mais detalhes, mais rápido você encontra uma boa troca.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="Fotos do item" htmlFor="fotos" obrigatorio>
          <div className="grid grid-cols-3 gap-2">
            {fotos.map((foto) => (
              <div key={foto.id} className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.url} alt="Foto do item" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removerFoto(foto.id)}
                  aria-label="Remover foto"
                  className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform active:scale-90"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}

            {fotos.length < MAX_FOTOS && (
              <label
                htmlFor="fotos"
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Camera className="size-6" />
                <span className="text-[11px] font-semibold">Adicionar</span>
                <input
                  id="fotos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={adicionarFotos}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <FieldHint>
            {fotos.length} de {MAX_FOTOS} fotos • a primeira foto é a capa do anúncio.
          </FieldHint>
        </FormField>

        <FormField label="Título do anúncio" htmlFor="titulo" obrigatorio>
          <div className="relative flex items-center">
            <Input
              id="titulo"
              name="titulo"
              placeholder="Ex: Cadeira Gamer Ergonômica, pouco uso"
              className="pr-12"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <Tag className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
          </div>
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoria" htmlFor="categoria">
            <SelectField
              id="categoria"
              value={categoriaLabel}
              onChange={(valor) => setCategoriaLabel(valor)}
              opcoes={CATEGORIAS}
            />
          </FormField>
          <FormField label="Condição" htmlFor="condicao">
            <SelectField id="condicao" value={condicao} onChange={(valor) => setCondicao(valor)} opcoes={CONDICOES} />
          </FormField>
        </div>

        <FormField label="Descrição do item" htmlFor="descricao" obrigatorio>
          <Textarea
            id="descricao"
            placeholder="Conte o estado de conservação, tempo de uso, se acompanha acessórios..."
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </FormField>

        <div className="flex flex-col gap-4 rounded-xl bg-secondary-container/20 p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-secondary-container-foreground shadow-sm">
              <ArrowLeftRight className="size-5" />
            </div>
            <div>
              <span className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
                Proposta de Escambo
              </span>
              <h2 className="font-display text-base font-bold leading-snug text-foreground">
                O que você aceita em troca?
              </h2>
            </div>
          </div>

          <Textarea
            id="aceita-troca"
            placeholder="Ex: Smartphone em bom estado, notebook, ou outros eletrônicos de valor equivalente"
            rows={3}
            value={aceitaTroca}
            onChange={(e) => setAceitaTroca(e.target.value)}
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-card p-3 shadow-card select-none">
            <Checkbox
              id="aceitaVoltaDinheiro"
              checked={aceitaVoltaDinheiro}
              onCheckedChange={(checked) => setAceitaVoltaDinheiro(checked === true)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <span className="flex items-center gap-1.5 font-display text-sm font-bold text-foreground">
                <Coins className="size-4 text-tertiary" />
                Aceito volta em dinheiro
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Se a troca não fechar o valor exato, você aceita complementar em espécie/PIX.
              </p>
            </div>
          </label>

          {aceitaVoltaDinheiro && (
            <FormField label="Valor sugerido de volta (opcional)" htmlFor="valorVolta">
              <Input
                id="valorVolta"
                inputMode="numeric"
                placeholder="Ex: R$ 150"
                value={valorVoltaSugerido}
                onChange={(e) => setValorVoltaSugerido(e.target.value)}
              />
            </FormField>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField label="Estado" htmlFor="estado">
            <div className="relative">
              <select
                id="estado"
                name="estado"
                className="h-14 w-full appearance-none rounded-xl border-[1.5px] border-input bg-card px-4 pr-10 text-foreground shadow-card outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/30"
                value={estado}
                onChange={(e) => setEstado(e.target.value as UF)}
              >
                {ESTADOS.map((uf) => (
                  <option key={uf.value} value={uf.value}>
                    {uf.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </FormField>

          <FormField label="Município" htmlFor="municipio" obrigatorio>
            <div className="relative flex items-center">
              <Input
                id="municipio"
                name="municipio"
                placeholder="Ex: São Paulo, Belo Horizonte, Salvador..."
                className="pr-12"
                required
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
              />
              <MapPin className="pointer-events-none absolute right-4 size-5 text-muted-foreground" />
            </div>
          </FormField>
        </div>

        {erro && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-container px-4 py-3 text-sm font-medium text-destructive-container-foreground"
          >
            {erro}
          </p>
        )}

        {!erro && !podeEnviar && (
          <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
            <Info className="size-5 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Adicione ao menos 1 foto e preencha título, descrição, o que aceita em troca e o município.
            </p>
          </div>
        )}

        <Button type="submit" size="lg" disabled={!podeEnviar} className="w-full">
          {enviando ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Publicando anúncio...
            </>
          ) : (
            <>
              <PackageCheck className="size-5" />
              Publicar Anúncio
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function AnuncioPublicado({ titulo }: { titulo: string }) {
  return (
    <div className="page-container flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary-container text-primary-container-foreground">
        <PartyPopper className="size-8" />
      </div>
      <h1 className="mb-2 font-display text-xl font-bold text-foreground">Anúncio publicado!</h1>
      <p className="mb-6 text-muted-foreground">
        &ldquo;{titulo}&rdquo; já está visível para toda a comunidade Escambo. Você será avisado assim que alguém
        propuser uma troca.
      </p>
      <div className="flex w-full flex-col gap-2">
        <Button asChild size="lg" className="w-full">
          <Link href="/perfil">Ver Meus Anúncios</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  );
}

function SelectField({
  id,
  value,
  onChange,
  opcoes,
}: {
  id: string;
  value: string;
  onChange: (valor: string) => void;
  opcoes: string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        className="h-14 w-full appearance-none rounded-xl border-[1.5px] border-input bg-card px-4 pr-10 text-foreground shadow-card outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  obrigatorio,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  obrigatorio?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="w-full justify-between font-normal">
        {label}
        {obrigatorio && <span className="text-xs font-bold text-secondary">Obrigatório</span>}
      </Label>
      {children}
    </div>
  );
}

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="px-1 text-xs text-muted-foreground">{children}</p>;
}
