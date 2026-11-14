'use client'

import { useEffect, type ReactNode } from 'react'
import { ShoppingCart, X } from 'lucide-react'

type Props = {
  abierto: boolean
  onAbrir: () => void
  onCerrar: () => void
  cantidadProductos: number
  children: ReactNode
}

// Solo en celular: botón redondo con el carrito y panel que sube con la lista.
export function PanelCarrito({ abierto, onAbrir, onCerrar, cantidadProductos, children }: Props) {
  // Cierra con Escape y evita que la página de fondo se desplace.
  useEffect(() => {
    if (!abierto) return
    const cerrarConEscape = (evento: KeyboardEvent) => evento.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', cerrarConEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', cerrarConEscape)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={onAbrir}
        aria-label={`Ver mi lista (${cantidadProductos} productos)`}
        className="fixed bottom-24 right-4 z-30 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
      >
        <ShoppingCart className="size-7" aria-hidden="true" />
        {cantidadProductos > 0 && (
          <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-accent-foreground ring-2 ring-background">
            {cantidadProductos}
          </span>
        )}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="Cerrar lista"
            tabIndex={-1}
            onClick={onCerrar}
            className="absolute inset-0 bg-foreground/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mi lista"
            className="relative flex h-[92dvh] flex-col rounded-t-3xl bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-lg font-extrabold">Mi lista</p>
              <button
                type="button"
                onClick={onCerrar}
                autoFocus
                className="flex h-12 items-center gap-1 rounded-xl px-3 font-bold hover:bg-muted"
              >
                <X className="size-6" aria-hidden="true" />
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
