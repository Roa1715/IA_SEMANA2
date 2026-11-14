import { AlertTriangle, CheckCircle2, Wallet } from 'lucide-react'
import { formatearPesos } from '@/lib/formato'
import { cn } from '@/lib/utils'

type Props = {
  hayProductos: boolean
  presupuesto: number | null
  totalMasBarato: number
  nombreTienda: string
}

// Mensaje superior: dice si el presupuesto alcanza o cuánto falta.
export function EstadoPresupuesto({ hayProductos, presupuesto, totalMasBarato, nombreTienda }: Props) {
  // Sin productos todavía no hay nada que comparar.
  if (!hayProductos) return null

  if (!presupuesto) {
    return (
      <Aviso tono="neutro" icono={<Wallet className="size-7 shrink-0" aria-hidden="true" />}>
        Ingresa tu presupuesto para saber si te alcanza
      </Aviso>
    )
  }

  const diferencia = presupuesto - totalMasBarato

  if (diferencia >= 0) {
    return (
      <Aviso tono="positivo" icono={<CheckCircle2 className="size-7 shrink-0" aria-hidden="true" />}>
        <span className="block">¡Te alcanza! Te sobran {formatearPesos(diferencia)}</span>
        <span className="block text-base font-semibold opacity-90">
          Comprando en {nombreTienda} por {formatearPesos(totalMasBarato)}
        </span>
      </Aviso>
    )
  }

  return (
    <Aviso tono="negativo" icono={<AlertTriangle className="size-7 shrink-0" aria-hidden="true" />}>
      <span className="block">No te alcanza. Te faltan {formatearPesos(-diferencia)}</span>
      <span className="block text-base font-semibold opacity-90">
        Aun en {nombreTienda}, tu mercado cuesta {formatearPesos(totalMasBarato)}
      </span>
    </Aviso>
  )
}

function Aviso({
  tono,
  icono,
  children,
}: {
  tono: 'neutro' | 'positivo' | 'negativo'
  icono: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'mb-5 flex items-start gap-3 rounded-2xl p-4 text-lg font-extrabold leading-snug',
        tono === 'neutro' && 'border-2 border-dashed border-input bg-card text-foreground',
        tono === 'positivo' && 'bg-primary text-primary-foreground',
        tono === 'negativo' && 'bg-destructive text-white',
      )}
    >
      {icono}
      <p>{children}</p>
    </div>
  )
}
