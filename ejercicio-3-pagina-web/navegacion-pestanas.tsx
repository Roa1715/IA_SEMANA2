import { ChefHat, ShoppingCart, Trophy, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Pestana = 'mercado' | 'resultado' | 'recetas'

type Props = {
  pestanaActiva: Pestana
  onCambiar: (pestana: Pestana) => void
  cantidadProductos: number
  cantidadRecetas: number
}

// Navegación entre pestañas: abajo en celular, arriba en pantallas grandes.
export function NavegacionPestanas({ pestanaActiva, onCambiar, cantidadProductos, cantidadRecetas }: Props) {
  const pestanas: { id: Pestana; etiqueta: string; icono: LucideIcon; contador?: number }[] = [
    { id: 'mercado', etiqueta: 'Mi mercado', icono: ShoppingCart, contador: cantidadProductos },
    { id: 'resultado', etiqueta: 'Resultado', icono: Trophy },
    { id: 'recetas', etiqueta: 'Recetas', icono: ChefHat, contador: cantidadRecetas },
  ]

  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:sticky lg:top-0 lg:bottom-auto lg:border-b lg:border-t-0"
    >
      <ul className="mx-auto grid w-full max-w-2xl grid-cols-3 lg:max-w-6xl">
        {pestanas.map(({ id, etiqueta, icono: Icono, contador }) => {
          const activa = pestanaActiva === id
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onCambiar(id)}
                aria-current={activa ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-1 py-3 text-sm font-bold transition-colors md:flex-row md:justify-center md:gap-2 md:text-base',
                  activa ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'relative flex h-9 w-14 items-center justify-center rounded-full transition-colors md:h-auto md:w-auto',
                    activa && 'bg-secondary md:bg-transparent',
                  )}
                >
                  <Icono className="size-6" aria-hidden="true" />
                  {contador ? (
                    <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-extrabold text-primary-foreground md:static md:ml-1 md:hidden">
                      {contador}
                    </span>
                  ) : null}
                </span>
                {etiqueta}
                {contador ? (
                  <span className="hidden rounded-full bg-primary px-2 text-xs font-extrabold text-primary-foreground md:inline">
                    {contador}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
