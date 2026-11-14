import { Check, ChefHat, Minus, Plus } from 'lucide-react'
import type { Tienda } from '@/data/productos'
import { RECETAS, type RecetaSugerida } from '@/lib/calculos'
import { formatearPesos } from '@/lib/formato'
import { cn } from '@/lib/utils'

type Props = {
  recetas: RecetaSugerida[]
  hayProductos: boolean
  tiendaMasBarata: Tienda
  agregadosDesdeReceta: Set<string>
  onAgregar: (productoId: string) => void
  onQuitar: (productoId: string) => void
  onIrAMercado: () => void
}

// Pestaña 3: recetas que se pueden cocinar con lo que hay en la lista.
export function PestanaRecetas({
  recetas,
  hayProductos,
  tiendaMasBarata,
  agregadosDesdeReceta,
  onAgregar,
  onQuitar,
  onIrAMercado,
}: Props) {
  if (RECETAS.length === 0) {
    return <MensajeVacio titulo="Todavía no hay recetas cargadas" texto="Pronto verás aquí ideas para cocinar con tu mercado." />
  }

  if (recetas.length === 0) {
    return (
      <MensajeVacio
        titulo={hayProductos ? 'Aún no hay recetas para tu lista' : 'Tu lista está vacía'}
        texto="Te mostramos las recetas de las que ya tienes al menos el 75% de los ingredientes. Agrega más productos a tu mercado."
        onIrAMercado={onIrAMercado}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-extrabold">Puedes cocinar</h2>
      <ul className="flex flex-col gap-4">
        {recetas.map((receta) => (
          <li key={receta.nombre} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-extrabold leading-tight">{receta.nombre}</h3>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-sm font-extrabold',
                  receta.faltan.length === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                )}
              >
                {receta.faltan.length === 0
                  ? '¡Lo tienes todo!'
                  : `${receta.tiene.length} de ${receta.ingredientes.length}`}
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {receta.ingredientes.map((ingrediente) => {
                const falta = receta.faltan.some((p) => p.id === ingrediente.id)
                const agregadoAqui = agregadosDesdeReceta.has(ingrediente.id)
                return (
                  <li
                    key={ingrediente.id}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl px-3 py-2',
                      falta ? 'bg-destructive/10' : 'bg-secondary',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {falta ? (
                        <span className="shrink-0 rounded-md bg-destructive px-2 py-0.5 text-sm font-extrabold text-white">
                          Te falta
                        </span>
                      ) : (
                        <Check className="size-6 shrink-0 text-primary" strokeWidth={3} aria-label="Ya lo tienes" />
                      )}
                      <div>
                        <p className="text-lg font-bold leading-tight">{ingrediente.nombre}</p>
                        {falta && (
                          <p className="text-muted-foreground">
                            {ingrediente.precios[tiendaMasBarata.id] != null
                              ? `${formatearPesos(ingrediente.precios[tiendaMasBarata.id] as number)} en ${tiendaMasBarata.nombre}`
                              : `No disponible en ${tiendaMasBarata.nombre}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {falta && (
                      <button
                        type="button"
                        onClick={() => onAgregar(ingrediente.id)}
                        aria-label={`Agregar ${ingrediente.nombre} a Mi mercado`}
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                      >
                        <Plus className="size-6" aria-hidden="true" />
                      </button>
                    )}
                    {!falta && agregadoAqui && (
                      <button
                        type="button"
                        onClick={() => onQuitar(ingrediente.id)}
                        aria-label={`Quitar ${ingrediente.nombre} de Mi mercado`}
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-destructive bg-card text-destructive hover:bg-destructive/10"
                      >
                        <Minus className="size-6" aria-hidden="true" />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MensajeVacio({ titulo, texto, onIrAMercado }: { titulo: string; texto: string; onIrAMercado?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-input bg-card p-8 text-center">
      <ChefHat className="size-12 text-muted-foreground" aria-hidden="true" />
      <p className="text-xl font-extrabold">{titulo}</p>
      <p className="text-muted-foreground text-pretty">{texto}</p>
      {onIrAMercado && (
        <button
          type="button"
          onClick={onIrAMercado}
          className="h-14 rounded-2xl bg-primary px-6 text-lg font-extrabold text-primary-foreground hover:opacity-90"
        >
          Ir a Mi mercado
        </button>
      )}
    </div>
  )
}
