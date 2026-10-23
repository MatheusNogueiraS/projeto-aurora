import { Toaster as Sonner, toast as sonnerToast, type ExternalToast, type ToasterProps } from "sonner"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { statusTones } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"

// Base: o Sonner do shadcn (toast(), toast.success/info/warning/error, ação, fechar, posição),
// com o visual todo do Aurora: o estilo próprio do Sonner fica desligado (unstyled) e cada tipo
// usa as cores de status do Alert. O tema vem dos tokens (.dark no <html>), sem o tema do Sonner.
// Toast é retorno de uma ação (feedback): carregando não é dele (use o Spinner ou o Skeleton).
// Botões: OU a ação OU o X de fechar; com ação, o X some (a ação já dispensa o aviso).
// Use o toast daqui (não o do "sonner"): só os tipos de feedback, e com ação o aviso fica mais tempo.

const typeStyles = {
  // neutro: fundo da página com borda
  default: cn("border-divider bg-background-6 text-text-1"),
  // status: descrição, ícone e botões seguem a cor do texto do tipo
  info: cn(statusTones.info, "**:data-description:text-current"),
  success: cn(statusTones.success, "**:data-description:text-current"),
  warning: cn(statusTones.warning, "**:data-description:text-current"),
  error: cn(statusTones.destructive, "**:data-description:text-current"),
}

const outlineButton = buttonVariants({ variant: "outline", size: "xs" })
const ghostButton = buttonVariants({ variant: "ghost" })

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      containerAriaLabel="Avisos"
      icons={{
        success: <CircleCheckIcon className="size-[16px]" />,
        info: <InfoIcon className="size-[16px]" />,
        warning: <TriangleAlertIcon className="size-[16px]" />,
        error: <CircleAlertIcon className="size-[16px]" />,
        close: <XIcon className="size-[16px]" />,
      }}
      toastOptions={{
        unstyled: true,
        closeButtonAriaLabel: "Fechar aviso",
        ...toastOptions,
        classNames: {
          toast: cn("group/toast flex w-full items-start gap-sm rounded-sm border-default p-lg shadow-m typo-body-md-regular"),
          ...typeStyles,
          icon: cn("flex size-[16px] shrink-0 translate-y-xxs items-center justify-center"),
          content: cn("flex min-w-[0px] flex-1 flex-col gap-xxs"),
          title: cn("typo-body-md-bold"),
          description: cn("typo-body-sm-regular text-text-3"),
          // ação: o Button pequeno na cor do texto do tipo (como o CTA do Alert)
          actionButton: cn(outlineButton, "shrink-0 border-current text-current hover:bg-transparent hover:opacity-lg"),
          // o X vem primeiro no HTML do Sonner; order-last o leva para o fim da linha
          closeButton: cn(ghostButton, "order-last size-[24px] shrink-0 p-none text-current group-has-data-button/toast:hidden hover:bg-transparent hover:opacity-lg"),
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

// Aviso com ação fica 10 s na tela (o padrão é 4 s), para dar tempo de apertar o botão
// (WCAG 2.2.1, tempo ajustável).
const ACTION_DURATION = 10_000

type ToastOptions = Omit<ExternalToast, "cancel">
type ToastMessage = Parameters<typeof sonnerToast>[0]

function withTime(options?: ToastOptions): ToastOptions | undefined {
  return options?.action && options.duration == null ? { ...options, duration: ACTION_DURATION } : options
}

const toast = Object.assign((message: ToastMessage, options?: ToastOptions) => sonnerToast(message, withTime(options)), {
  success: (message: ToastMessage, options?: ToastOptions) => sonnerToast.success(message, withTime(options)),
  info: (message: ToastMessage, options?: ToastOptions) => sonnerToast.info(message, withTime(options)),
  warning: (message: ToastMessage, options?: ToastOptions) => sonnerToast.warning(message, withTime(options)),
  error: (message: ToastMessage, options?: ToastOptions) => sonnerToast.error(message, withTime(options)),
  dismiss: sonnerToast.dismiss,
})

export { Toaster, toast }
