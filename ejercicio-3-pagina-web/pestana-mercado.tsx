import { BuscadorProductos } from './buscador-productos'
import { CampoPresupuesto } from './campo-presupuesto'
import { CategoriasProductos } from './categorias-productos'

type Props = {
  idsEnLista: Set<string>
  presupuesto: number | null
  onPresupuesto: (valor: number | null) => void
  onAgregar: (productoId: string) => void
}

// Pestaña 1: presupuesto, buscador y categorías. La lista vive en la columna derecha
// (computador) o en el panel del carrito (celular).
export function PestanaMercado({ idsEnLista, presupuesto, onPresupuesto, onAgregar }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* En computador el presupuesto ya está en la columna de la lista */}
      <div className="lg:hidden">
        <CampoPresupuesto valor={presupuesto} onCambiar={onPresupuesto} />
      </div>

      <section aria-labelledby="titulo-agregar" className="flex flex-col gap-2">
        <h2 id="titulo-agregar" className="text-xl font-extrabold">
          Agrega productos
        </h2>
        <BuscadorProductos idsEnLista={idsEnLista} onAgregar={onAgregar} />
      </section>

      <CategoriasProductos idsEnLista={idsEnLista} onAgregar={onAgregar} />
    </div>
  )
}
