import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-[0px] rounded-sm border-default border-field bg-transparent px-md py-sm typo-body-lg-regular shadow-s transition-[color,box-shadow] outline-none file:inline-flex file:border-(length:--aurora-stroke-none) file:bg-transparent file:typo-body-md-regular file:text-text-1 placeholder:text-text-3 focus-visible:border-focus focus-visible:ring-(length:--aurora-stroke-focus) focus-visible:ring-focus/focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-disabled aria-invalid:border-invalid aria-invalid:ring-(length:--aurora-stroke-focus) aria-invalid:ring-invalid/invalid-ring md:typo-body-md-regular",
        className
      )}
      {...props}
    />
  )
}

export { Input }
