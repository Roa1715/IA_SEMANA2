'use client'

import { useState } from 'react'
import {
  Apple,
  Bath,
  Carrot,
  Check,
  Croissant,
  CupSoda,
  Drumstick,
  Milk,
  Package,
  Plus,
  ShoppingBasket,
  SprayCan,
  Wheat,
  type LucideIcon,
} from 'lucide-react'
import { CATEGORIAS, PRODUCTOS } from '@/data/productos'
import { precioMinimo } from '@/lib/calculos'
import { formatearPesos } from '@/lib/formato'
import { cn } from '@/lib/utils'

// Ícono de cada categoría.
const ICONOS: Record<string, LucideIcon> = {
  'Granos y cereales': Wheat,
  'Lácteos y derivados': Milk,
  'Carnes, pollo y pescados': Drumstick,
  Frutas: Apple,
  'Verduras y hortalizas': Carrot,
  'Despensa y productos básicos': Package,
  'Panadería y repostería': Croissant,
  'Aseo del hogar': SprayCan,
  'Aseo personal': Bath,
  Bebidas: CupSoda,
}

type Props = {
  idsEnLista: Set<string>
  onAgregar: (productoId: string) => void
}

// Cuadritos de categorías. Al tocar una se muestran sus productos; tocarla otra vez quita el filtro.
export function CategoriasProductos({ idsEnLista, onAgregar }: Props) {
  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const productos = seleccionada ? PRODUCTOS.filter((p) => p.categoria === seleccionada) : []

  return (
    <section aria-labelledby="titulo-categorias" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="titulo-categorias" className="text-xl font-extrabold">
          Categorías
        </h2>
        {seleccionada && (
          <button
            type="button"
            onClick={() => setSeleccionada(null)}
            className="rounded-xl px-3 py-2 font-bold text-primary hover:bg-secondary"
          >
            Todas
          </button>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {CATEGORIAS.map((categoria) => {
          const activa = seleccionada === categoria.nombre
          const Icono = ICONOS[categoria.nombre] ?? ShoppingBasket
          return (
            <li key={categoria.nombre}>
              <button
                type="button"
                onClick={() => setSeleccionada(activa ? null : categoria.nombre)}
                aria-pressed={activa}
                className={cn(
                  'flex h-full min-h-24 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center text-sm font-bold leading-tight transition-colors',
                  activa
                    ? 'border-primary bg-secondary text-secondary-foreground'
                    : 'border-border bg-card hover:border-primary/50',
                )}
              >
                <Icono className="size-8 text-primary" aria-hidden="true" />
                {categoria.nombre}
              </button>
            </li>
          )
        })}
      </ul>

      {seleccionada && (
        <ul className="flex flex-col gap-2" aria-label={`Productos de ${seleccionada}`}>
          {productos.map((producto) => {
            const enLista = idsEnLista.has(producto.id)
            const precio = precioMinimo(producto)
            return (
              <li
                key={producto.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="font-extrabold leading-tight">{producto.nombre}</span>
                  <span className="text-sm text-muted-foreground">{producto.unidad}</span>
                  {precio !== null && (
                    <span className="text-sm font-bold text-primary">Desde {formatearPesos(precio)}</span>
                  )}
                </div>
                {enLista ? (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <Check className="size-6" aria-hidden="true" />
                    <span className="sr-only">{producto.nombre} ya está en tu lista</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAgregar(producto.id)}
                    aria-label={`Agregar ${producto.nombre}`}
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Plus className="size-6" aria-hidden="true" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
