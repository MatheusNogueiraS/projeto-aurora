import * as React from "react"
import { BoldIcon, InfoIcon, ItalicIcon, MailIcon, MoonIcon, SearchIcon, SunIcon, TriangleAlertIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster, toast } from "@/components/ui/sonner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const frutas = ["Banana", "Maçã", "Laranja", "Uva", "Manga"]

const hoje = new Date()
const intervalo = { from: hoje, to: new Date(hoje.getTime() + 5 * 864e5) }

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="outline"
      size="sm"
      className="shrink-0"
      iconLeading={isDark ? SunIcon : MoonIcon}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Claro" : "Escuro"}
    </Button>
  )
}

function Showcase({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-lg rounded-sm border-default border-divider bg-background-5 p-lg sm:p-xl">
      <h2 className="typo-heading-6 text-text-1">{title}</h2>
      <div className="grid gap-lg sm:grid-cols-2">{children}</div>
    </section>
  )
}

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-md">
      <span className="typo-overline-bold text-text-3">{label}</span>
      <div className="flex flex-wrap items-start gap-md">{children}</div>
    </div>
  )
}

export function App() {
  const [single, setSingle] = React.useState<Date | undefined>(new Date())
  const [progress, setProgress] = React.useState(35)

  return (
    <TooltipProvider>
      <div className="min-h-svh bg-background-4 text-text-1">
        <div className="mx-auto flex max-w-(--aurora-breakpoint-lg) flex-col gap-lg p-lg sm:gap-xl sm:p-xl">
          <header className="flex flex-col gap-xs">
            <div className="flex items-start justify-between gap-md">
              <h1 className="typo-heading-6 sm:typo-heading-5">Aurora · Vitrine de componentes</h1>
              <ThemeToggle />
            </div>
            <p className="typo-body-md-regular text-text-3">
              Todos os componentes com duas variantes, usando as cores do tema Bmg. Troque o tema
              pelo botão ou pela tecla{" "}
              <kbd className="rounded-xxs border-default border-field px-xs typo-body-sm-regular">d</kbd>.
            </p>
          </header>

          <Showcase title="Button">
            <Variant label="Default">
              <Button>Continuar</Button>
              <Button disabled>Desabilitado</Button>
            </Variant>
            <Variant label="Outline / Secondary / Ghost / Destructive / Link">
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Excluir</Button>
              <Button variant="link">Link</Button>
            </Variant>
          </Showcase>

          <Showcase title="Badge">
            <Variant label="Default / Secondary">
              <Badge variant="primary">Novo</Badge>
              <Badge variant="secondary">Em análise</Badge>
            </Variant>
            <Variant label="Destructive / Outline">
              <Badge variant="destructive">Recusado</Badge>
              <Badge variant="outline">Rascunho</Badge>
            </Variant>
          </Showcase>

          <Showcase title="Alert">
            <Variant label="Default">
              <Alert>
                <InfoIcon />
                <AlertTitle>Proposta enviada</AlertTitle>
                <AlertDescription>Você receberá a resposta em até 2 dias úteis.</AlertDescription>
              </Alert>
            </Variant>
            <Variant label="Destructive">
              <Alert variant="destructive">
                <TriangleAlertIcon />
                <AlertTitle>Não foi possível enviar</AlertTitle>
                <AlertDescription>Confira os dados e tente novamente.</AlertDescription>
              </Alert>
            </Variant>
          </Showcase>

          <Showcase title="Accordion">
            <Variant label="Fechado">
              <Accordion className="w-full">
                <AccordionItem value="a">
                  <AccordionTrigger>O que é o consignado?</AccordionTrigger>
                  <AccordionContent>Um empréstimo com parcelas descontadas na folha.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>Quais as taxas?</AccordionTrigger>
                  <AccordionContent>As taxas variam conforme o convênio.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Variant>
            <Variant label="Aberto">
              <Accordion defaultValue={["a"]} className="w-full">
                <AccordionItem value="a">
                  <AccordionTrigger>O que é o consignado?</AccordionTrigger>
                  <AccordionContent>Um empréstimo com parcelas descontadas na folha.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>Quais as taxas?</AccordionTrigger>
                  <AccordionContent>As taxas variam conforme o convênio.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Variant>
          </Showcase>

          <Showcase title="Breadcrumb">
            <Variant label="Simples">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Propostas</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Variant>
            <Variant label="Com reticências">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Início</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Detalhes</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Variant>
          </Showcase>

          <Showcase title="Input">
            <Variant label="Normal">
              <Input placeholder="Seu nome" />
            </Variant>
            <Variant label="Com erro / Desabilitado">
              <Input aria-invalid defaultValue="email-invalido" />
              <Input disabled placeholder="Desabilitado" />
            </Variant>
          </Showcase>

          <Showcase title="Input Group">
            <Variant label="Com ícone">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput placeholder="Buscar..." />
              </InputGroup>
            </Variant>
            <Variant label="Com texto e botão">
              <InputGroup>
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
                <InputGroupInput placeholder="email" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>@bmg.com.br</InputGroupText>
                  <InputGroupButton variant="secondary">Enviar</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Variant>
          </Showcase>

          <Showcase title="Textarea">
            <Variant label="Normal">
              <Textarea placeholder="Escreva uma observação" />
            </Variant>
            <Variant label="Com erro">
              <Textarea aria-invalid defaultValue="Texto inválido" />
            </Variant>
          </Showcase>

          <Showcase title="Select">
            <Variant label="Vazio">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Prazos</SelectLabel>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="48">48 meses</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Variant>
            <Variant label="Pequeno, com valor">
              <Select defaultValue="24">
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 meses</SelectItem>
                  <SelectItem value="24">24 meses</SelectItem>
                  <SelectItem value="48">48 meses</SelectItem>
                </SelectContent>
              </Select>
            </Variant>
          </Showcase>

          <Showcase title="Combobox">
            <Variant label="Com botão de abrir">
              <Combobox items={frutas}>
                <ComboboxInput placeholder="Escolha uma fruta" />
                <ComboboxContent>
                  <ComboboxEmpty>Nada encontrado.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Variant>
            <Variant label="Com botão de limpar">
              <Combobox items={frutas} defaultValue="Manga">
                <ComboboxInput placeholder="Escolha uma fruta" showClear />
                <ComboboxContent>
                  <ComboboxEmpty>Nada encontrado.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Variant>
          </Showcase>

          <Showcase title="Checkbox">
            <Variant label="Desmarcado">
              <Checkbox label="Aceito os termos" />
            </Variant>
            <Variant label="Marcado / Desabilitado">
              <Checkbox defaultChecked label="Receber novidades" />
              <Checkbox disabled label="Indisponível" />
            </Variant>
          </Showcase>

          <Showcase title="Radio Group">
            <Variant label="Vertical">
              <RadioGroup defaultValue="pix">
                <RadioGroupItem value="pix" label="Pix" />
                <RadioGroupItem value="ted" label="TED" />
              </RadioGroup>
            </Variant>
            <Variant label="Desabilitado">
              <RadioGroup defaultValue="pix" disabled>
                <RadioGroupItem value="pix" label="Pix" />
                <RadioGroupItem value="ted" label="TED" />
              </RadioGroup>
            </Variant>
          </Showcase>

          <Showcase title="Switch">
            <Variant label="Desligado">
              <Switch label="Notificações" />
            </Variant>
            <Variant label="Ligado / Pequeno">
              <Switch defaultChecked label="Modo avião" />
              <Switch size="sm" defaultChecked label="Pequeno" />
            </Variant>
          </Showcase>

          <Showcase title="Toggle">
            <Variant label="Default">
              <Toggle aria-label="Negrito">
                <BoldIcon />
              </Toggle>
              <Toggle aria-label="Itálico" defaultPressed>
                <ItalicIcon />
              </Toggle>
            </Variant>
            <Variant label="Outline">
              <Toggle variant="outline" aria-label="Negrito">
                <BoldIcon /> Negrito
              </Toggle>
              <Toggle variant="outline" aria-label="Itálico" defaultPressed>
                <ItalicIcon /> Itálico
              </Toggle>
            </Variant>
          </Showcase>

          <Showcase title="Progress">
            <Variant label="Em andamento">
              <Progress value={progress} className="w-full" />
              <Button size="sm" variant="outline" onClick={() => setProgress((p) => (p >= 100 ? 0 : p + 15))}>
                Avançar
              </Button>
            </Variant>
            <Variant label="Completo">
              <Progress value={100} className="w-full" />
            </Variant>
          </Showcase>

          <Showcase title="Separator">
            <Variant label="Horizontal">
              <div className="flex w-full flex-col gap-sm typo-body-md-regular">
                <span>Acima</span>
                <Separator />
                <span>Abaixo</span>
              </div>
            </Variant>
            <Variant label="Vertical">
              <div className="flex h-[20px] items-center gap-md typo-body-md-regular">
                <span>Perfil</span>
                <Separator orientation="vertical" />
                <span>Conta</span>
                <Separator orientation="vertical" />
                <span>Sair</span>
              </div>
            </Variant>
          </Showcase>

          <Showcase title="Skeleton">
            <Variant label="Linhas de texto">
              <div className="flex w-full flex-col gap-sm">
                <Skeleton shape="text" className="w-3/4" />
                <Skeleton shape="text" className="w-1/2" />
              </div>
            </Variant>
            <Variant label="Cartão com avatar">
              <div className="flex w-full items-center gap-md">
                <Skeleton shape="circle" className="w-[40px] shrink-0" />
                <div className="flex flex-1 flex-col gap-sm">
                  <Skeleton shape="text" className="w-2/3" />
                  <Skeleton shape="text" className="w-1/3" />
                </div>
              </div>
            </Variant>
          </Showcase>

          <Showcase title="Tooltip, Popover e Hover Card">
            <Variant label="Tooltip / Popover">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Passe o mouse</Button>
                </TooltipTrigger>
                <TooltipContent>Dica rápida</TooltipContent>
              </Tooltip>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary">Abrir popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>Detalhes da parcela</PopoverTitle>
                    <PopoverDescription>Vencimento todo dia 10.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            </Variant>
            <Variant label="Hover Card">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@aurora</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="typo-body-md-bold">Projeto Aurora</p>
                  <p className="typo-body-md-regular text-text-3">Design system do Bmg.</p>
                </HoverCardContent>
              </HoverCard>
            </Variant>
          </Showcase>

          <Showcase title="Sonner (toast)">
            <Variant label="Sucesso / Info">
              <Button variant="outline" onClick={() => toast.success("Proposta enviada!")}>
                Toast de sucesso
              </Button>
              <Button variant="outline" onClick={() => toast.info("Você tem uma nova mensagem")}>
                Toast de info
              </Button>
            </Variant>
            <Variant label="Aviso / Erro">
              <Button variant="outline" onClick={() => toast.warning("Seu limite está quase no fim")}>
                Toast de aviso
              </Button>
              <Button variant="outline" onClick={() => toast.error("Falha ao enviar")}>
                Toast de erro
              </Button>
            </Variant>
          </Showcase>

          <Showcase title="Table">
            <Variant label="Simples">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1/12</TableCell>
                    <TableCell>R$ 250,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2/12</TableCell>
                    <TableCell>R$ 250,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Variant>
            <Variant label="Com legenda e linha selecionada">
              <Table>
                <TableCaption>Histórico de pagamentos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow data-state="selected">
                    <TableCell>Setembro</TableCell>
                    <TableCell>
                      <Badge variant="primary">Pago</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Outubro</TableCell>
                    <TableCell>
                      <Badge variant="outline">Pendente</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Variant>
          </Showcase>

          <Showcase title="Calendar">
            <Variant label="Data única">
              <Calendar mode="single" selected={single} onSelect={setSingle} className="rounded-sm border-default border-divider" />
            </Variant>
            <Variant label="Intervalo">
              <Calendar
                mode="range"
                defaultMonth={hoje}
                selected={intervalo}
                className="rounded-sm border-default border-divider"
              />
            </Variant>
          </Showcase>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}

export default App
