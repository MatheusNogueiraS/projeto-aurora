import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-icon-md" />
        ),
        info: (
          <InfoIcon className="size-icon-md" />
        ),
        warning: (
          <TriangleAlertIcon className="size-icon-md" />
        ),
        error: (
          <OctagonXIcon className="size-icon-md" />
        ),
        loading: (
          <Loader2Icon className="size-icon-md animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--aurora-color-background-6)",
          "--normal-text": "var(--aurora-color-text-1)",
          "--normal-border": "var(--aurora-color-divider)",
          "--border-radius": "var(--aurora-radius-card)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
