import { ArrowRight, ShoppingBasket, Star } from 'lucide-react'
import type { ItemLista, TotalTienda } from '@/lib/calculos'
import { TIENDAS } from '@/data/productos'
import { formatearPesos } from '@/lib/formato'
import { cn } from '@/lib/utils'
import { ItemMercado } from './item-mercado'
import { CampoPresupuesto } from './campo-presupuesto'
import { EstadoPresupuesto } from './estado-presupuesto'

type Props = {
  idCampo: string
  items: ItemLista[]
  ranking: TotalTienda[]
  presupuesto: number | null
  onPresupuesto: (valor: number | null) => void
  onCambiarCantidad: (productoId: string, cambio: number) => void
  onQuitar: (productoId: string) => void
  onVerResultado: () => void
}

// La lista del mercado: productos con precio por tienda, fila Total y presupuesto.
// Se usa en la columna derecha (computador) y en el panel del carrito (celular).
export function ListaMercado({
  idCampo,
  items,
  ranking,
  presupuesto,
  onPresupuesto,
  onCambiarCantidad,
  onQuitar,
  onVerResultado,
}: Props) {
  const hayProductos = items.length > 0
  const recomendada = ranking[0]

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-extrabold">
        Mi lista {hayProductos && <span className="text-muted-foreground">({items.length})</span>}
      </h2>

      {!hayProductos ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-input bg-background p-6 text-center">
          <ShoppingBasket className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-lg font-bold">Tu lista está vacía</p>
          <p className="text-muted-foreground">Busca un producto o elige una categoría para empezar.</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <ItemMercado
                key={item.productoId}
                item={item}
                onCambiarCantidad={onCambiarCantidad}
                onQuitar={onQuitar}
              />
            ))}
          </ul>

          {/* Fila Total: total de cada tienda, con la recomendada resaltada */}
          <section aria-label="Total por tienda" className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <h3 className="mb-2 text-lg font-extrabold">Total</h3>
            <ul className="grid grid-cols-3 gap-2">
              {TIENDAS.map((tienda) => {
                const fila = ranking.find((r) => r.tienda.id === tienda.id)
                if (!fila) return null
                const esRecomendada = fila.tienda.id === recomendada.tienda.id
                return (
                  <li
                    key={tienda.id}
                    className={cn(
                      'flex flex-col items-center rounded-xl border px-2 py-2 text-center',
                      esRecomendada
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background',
                    )}
                  >
                    <span className="text-sm font-bold">{tienda.nombre}</span>
                    {fila.faltantes === items.length ? (
                      <span className="text-sm font-semibold text-muted-foreground">No disponible</span>
                    ) : (
                      <span className="text-base font-extrabold">{formatearPesos(fila.total)}</span>
                    )}
                    {fila.faltantes > 0 && (
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          esRecomendada ? 'text-primary-foreground/90' : 'text-destructive',
                        )}
                      >
                        Le faltan {fila.faltantes}
                      </span>
                    )}
                    {esRecomendada && (
                      <span className="mt-1 flex items-center gap-1 text-xs font-extrabold">
                        <Star className="size-3 fill-current" aria-hidden="true" />
                        Recomendada
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}

      <CampoPresupuesto id={idCampo} valor={presupuesto} onCambiar={onPresupuesto} />
      <EstadoPresupuesto
        hayProductos={hayProductos}
        presupuesto={presupuesto}
        totalMasBarato={recomendada.total}
        nombreTienda={recomendada.tienda.nombre}
      />

      {hayProductos && (
        <button
          type="button"
          onClick={onVerResultado}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver dónde me sale más barato
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
