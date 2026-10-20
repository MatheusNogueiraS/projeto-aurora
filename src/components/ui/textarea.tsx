import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[64px] w-full rounded-sm border-default border-field bg-transparent px-md py-sm typo-body-lg-regular shadow-s transition-[color,box-shadow] outline-none placeholder:text-text-3 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring disabled:cursor-not-allowed disabled:opacity-disabled aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/invalid-ring md:typo-body-md-regular",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
