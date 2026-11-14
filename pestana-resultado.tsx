import { PiggyBank, ShoppingCart, Trophy } from 'lucide-react'
import type { TotalTienda } from '@/lib/calculos'
import { formatearPesos } from '@/lib/formato'

type Props = {
  ranking: TotalTienda[]
  hayProductos: boolean
  cantidadProductos: number
  onIrAMercado: () => void
}

// Pestaña 2: la tienda más barata y el ranking de las demás.
export function PestanaResultado({ ranking, hayProductos, cantidadProductos, onIrAMercado }: Props) {
  if (!hayProductos) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-input bg-card p-8 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" aria-hidden="true" />
        <p className="text-xl font-extrabold text-balance">
          Agrega productos a tu mercado para ver dónde te sale más economico
        </p>
        <button
          type="button"
          onClick={onIrAMercado}
          className="h-14 rounded-2xl bg-primary px-6 text-lg font-extrabold text-primary-foreground hover:opacity-90"
        >
          Ir a Mi mercado
        </button>
      </div>
    )
  }

  const [ganadora, ...demas] = ranking
  // El ahorro solo se compara contra tiendas que tienen todo el mercado.
  const completas = ranking.filter((fila) => fila.faltantes === 0)
  const masCara = completas[completas.length - 1] ?? ganadora
  const ahorro = masCara.total - ganadora.total

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="titulo-ganadora"
        className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-md ring-2 ring-primary"
      >
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="size-6" aria-hidden="true" />
          <h2 id="titulo-ganadora" className="text-lg font-extrabold">
            Aquí te sale más barato
          </h2>
        </div>
        <div>
          <p className="text-3xl font-extrabold leading-tight">{ganadora.tienda.nombre}</p>
          <p className="text-muted-foreground">
            Total de tu mercado ({cantidadProductos} {cantidadProductos === 1 ? 'producto' : 'productos'})
          </p>
          <p className="mt-1 text-5xl font-extrabold tracking-tight text-primary">
            {formatearPesos(ganadora.total)}
          </p>
          {ganadora.faltantes > 0 && (
            <p className="mt-2 rounded-xl bg-destructive/10 p-3 font-bold text-destructive">
              Ninguna tienda tiene todo tu mercado. Aquí no encuentras {ganadora.faltantes}{' '}
              {ganadora.faltantes === 1 ? 'producto' : 'productos'}.
            </p>
          )}
        </div>
        <p className="flex items-center gap-3 rounded-2xl bg-secondary p-4 text-lg font-bold text-secondary-foreground">
          <PiggyBank className="size-8 shrink-0" aria-hidden="true" />
          {ahorro > 0 ? (
            <span>
              Ahorras {formatearPesos(ahorro)} frente a {masCara.tienda.nombre}
            </span>
          ) : completas.length === 0 ? (
            <span>Revisa tu lista: algunos productos no están en ninguna tienda completa</span>
          ) : completas.length === 1 ? (
            <span>Es la única tienda que tiene todo tu mercado</span>
          ) : (
            <span>Tu mercado cuesta lo mismo en todas las tiendas</span>
          )}
        </p>
      </section>

      <section aria-labelledby="titulo-ranking" className="flex flex-col gap-3">
        <h2 id="titulo-ranking" className="text-xl font-extrabold">
          Las demás tiendas
        </h2>
        <ol className="flex flex-col gap-3">
          {demas.map((fila, indice) => (
            <li
              key={fila.tienda.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-lg font-extrabold">
                  {indice + 2}
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-tight">{fila.tienda.nombre}</p>
                  <p className={fila.faltantes > 0 ? 'font-bold text-destructive' : 'text-muted-foreground'}>
                    {fila.faltantes > 0
                      ? `No tiene ${fila.faltantes} de tus productos`
                      : fila.total > ganadora.total
                        ? `${formatearPesos(fila.total - ganadora.total)} más`
                        : 'Mismo precio'}
                  </p>
                </div>
              </div>
              <p className="text-xl font-extrabold">
                {fila.faltantes > 0 && fila.total === 0 ? '—' : formatearPesos(fila.total)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
