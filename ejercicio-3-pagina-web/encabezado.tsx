import { Info, ShoppingBasket } from 'lucide-react'

// Encabezado con el nombre de la app y el aviso de precios de ejemplo.
export function Encabezado() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-2xl lg:max-w-6xl flex-col gap-3 px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground text-primary">
            <ShoppingBasket className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">Merca Fácil</h1>
            <p className="text-sm text-primary-foreground/85">Compara y ahorra en tu mercado</p>
          </div>
        </div>
        <p
          role="note"
          className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-bold text-accent-foreground"
        >
          <Info className="size-5 shrink-0" aria-hidden="true" />
          Precios de ejemplo, no son precios reales
        </p>
      </div>
    </header>
  )
}
