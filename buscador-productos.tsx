'use client'

import { useId, useState } from 'react'
import { Check, Plus, Search, X } from 'lucide-react'
import type { Producto } from '@/data/productos'
import { buscarProductos, sugerirProductos } from '@/lib/calculos'
import { cn } from '@/lib/utils'
import { EtiquetaCanasta } from './etiqueta-canasta'

type Props = {
  idsEnLista: Set<string>
  onAgregar: (productoId: string) => void
}

// Buscador con autocompletado. Solo deja agregar productos que estén en el catálogo.
export function BuscadorProductos({ idsEnLista, onAgregar }: Props) {
  const [consulta, setConsulta] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const idLista = useId()

  const resultados = buscarProductos(consulta)
  const disponibles = resultados.filter((p) => !idsEnLista.has(p.id))
  const hayConsulta = consulta.trim().length > 0
  const noEncontrado = hayConsulta && resultados.length === 0

  function agregar(producto: Producto) {
    if (idsEnLista.has(producto.id)) return
    onAgregar(producto.id)
    setConsulta('')
    setResaltado(0)
  }

  function manejarTeclas(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key === 'ArrowDown') {
      evento.preventDefault()
      setResaltado((i) => Math.min(i + 1, Math.max(disponibles.length - 1, 0)))
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault()
      setResaltado((i) => Math.max(i - 1, 0))
    } else if (evento.key === 'Enter') {
      // No agregar mientras se escribe con teclados de composición (chino, japonés, coreano).
      if (evento.nativeEvent.isComposing || evento.keyCode === 229) return
      evento.preventDefault()
      const elegido = disponibles[resaltado]
      if (elegido) agregar(elegido)
    } else if (evento.key === 'Escape') {
      setConsulta('')
    }
  }

  const idResaltado = disponibles[resaltado] ? `${idLista}-${disponibles[resaltado].id}` : undefined

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-16 items-center gap-3 rounded-2xl border-2 border-input bg-card px-4 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
        <Search className="size-6 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="buscar-producto" className="sr-only">
          Buscar producto
        </label>
        <input
          id="buscar-producto"
          type="text"
          role="combobox"
          aria-expanded={hayConsulta && resultados.length > 0}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={idResaltado}
          autoComplete="off"
          placeholder="Busca: arroz, huevos, frijol..."
          value={consulta}
          onChange={(evento) => {
            setConsulta(evento.target.value)
            setResaltado(0)
          }}
          onKeyDown={manejarTeclas}
          className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground/70"
        />
        {hayConsulta && (
          <button
            type="button"
            onClick={() => setConsulta('')}
            aria-label="Borrar búsqueda"
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {hayConsulta && resultados.length > 0 && (
        <ul
          id={idLista}
          role="listbox"
          aria-label="Productos encontrados"
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md"
        >
          {resultados.map((producto) => {
            const yaEsta = idsEnLista.has(producto.id)
            const activo = disponibles[resaltado]?.id === producto.id
            return (
              <li
                key={producto.id}
                id={`${idLista}-${producto.id}`}
                role="option"
                aria-selected={activo}
                aria-disabled={yaEsta}
                onClick={() => agregar(producto)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0',
                  activo && 'bg-secondary',
                  yaEsta ? 'cursor-default opacity-60' : 'hover:bg-secondary',
                )}
              >
                <FilaProducto producto={producto} />
                {yaEsta ? (
                  <span className="flex shrink-0 items-center gap-1 font-bold text-muted-foreground">
                    <Check className="size-5" aria-hidden="true" />
                    En tu lista
                  </span>
                ) : (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Plus className="size-6" aria-hidden="true" />
                    <span className="sr-only">Agregar</span>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {noEncontrado && <ProductoNoEncontrado idsEnLista={idsEnLista} onAgregar={agregar} />}
    </div>
  )
}

function FilaProducto({ producto }: { producto: Producto }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-lg font-bold leading-tight">{producto.nombre}</span>
      <span className="flex flex-wrap items-center gap-2 text-muted-foreground">
        {producto.unidad}
        {producto.canastaFamiliar && <EtiquetaCanasta />}
      </span>
    </div>
  )
}

// Mensaje cuando el producto no existe, con sugerencias del catálogo.
function ProductoNoEncontrado({
  idsEnLista,
  onAgregar,
}: {
  idsEnLista: Set<string>
  onAgregar: (producto: Producto) => void
}) {
  const sugerencias = sugerirProductos(idsEnLista)

  return (
    <div role="status" className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-lg font-bold">No encontramos ese producto todavía, estamos agregando más</p>
      {sugerencias.length > 0 && (
        <>
          <p className="text-muted-foreground">Quizás te sirva alguno de estos:</p>
          <ul className="flex flex-col gap-2">
            {sugerencias.map((producto) => (
              <li key={producto.id}>
                <button
                  type="button"
                  onClick={() => onAgregar(producto)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-background px-3 py-2 text-left hover:bg-secondary"
                >
                  <FilaProducto producto={producto} />
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Plus className="size-6" aria-hidden="true" />
                    <span className="sr-only">Agregar {producto.nombre}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
