import { Star } from 'lucide-react'

// Etiqueta para los productos de primera necesidad.
export function EtiquetaCanasta() {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-sm font-bold text-accent-foreground">
      <Star className="size-3.5 fill-current" aria-hidden="true" />
      Canasta familiar
    </span>
  )
}
