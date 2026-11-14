import { formatearMiles } from '@/lib/formato'

type Props = {
  valor: number | null
  onCambiar: (valor: number | null) => void
  // Id único: el campo puede aparecer en la pestaña y en la lista a la vez.
  id?: string
}

// Campo para escribir el presupuesto. Solo acepta números y los muestra con puntos de miles.
export function CampoPresupuesto({ valor, onCambiar, id = 'presupuesto' }: Props) {
  function manejarCambio(texto: string) {
    const soloNumeros = texto.replace(/\D/g, '').slice(0, 10)
    onCambiar(soloNumeros ? Number(soloNumeros) : null)
  }

  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <label htmlFor={id} className="text-xl font-extrabold">
        Mi presupuesto
      </label>
      <div className="flex h-16 items-center gap-2 rounded-xl border-2 border-input bg-background px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
        <span className="text-2xl font-extrabold text-muted-foreground" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Ej: 150.000"
          value={valor ? formatearMiles(valor) : ''}
          onChange={(evento) => manejarCambio(evento.target.value)}
          className="w-full bg-transparent text-2xl font-extrabold outline-none placeholder:font-semibold placeholder:text-muted-foreground/60"
          aria-describedby={`ayuda-${id}`}
        />
        <span className="font-bold text-muted-foreground">COP</span>
      </div>
      <p id={`ayuda-${id}`} className="text-muted-foreground">
        ¿Cuánto tienes para el mercado?
      </p>
    </section>
  )
}
