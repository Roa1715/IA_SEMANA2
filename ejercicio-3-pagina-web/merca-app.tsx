'use client'

import { useCallback, useMemo, useState } from 'react'
import { calcularRanking, sugerirRecetas, type ItemLista } from '@/lib/calculos'
import { Encabezado } from './encabezado'
import { NavegacionPestanas, type Pestana } from './navegacion-pestanas'
import { EstadoPresupuesto } from './estado-presupuesto'
import { PestanaMercado } from './pestana-mercado'
import { PestanaResultado } from './pestana-resultado'
import { PestanaRecetas } from './pestana-recetas'
import { ListaMercado } from './lista-mercado'
import { PanelCarrito } from './panel-carrito'

// Componente principal: guarda la lista y el presupuesto, y recalcula todo al instante.
export function MercaApp() {
  const [pestana, setPestana] = useState<Pestana>('mercado')
  const [items, setItems] = useState<ItemLista[]>([])
  const [presupuesto, setPresupuesto] = useState<number | null>(null)
  const [panelAbierto, setPanelAbierto] = useState(false)
  // Ingredientes que el usuario agregó desde una receta (para mostrar el botón "−").
  const [agregadosDesdeReceta, setAgregadosDesdeReceta] = useState<Set<string>>(new Set())

  const idsEnLista = useMemo(() => new Set(items.map((item) => item.productoId)), [items])
  const ranking = useMemo(() => calcularRanking(items), [items])
  const recetas = useMemo(() => sugerirRecetas(idsEnLista), [idsEnLista])
  const tiendaMasBarata = ranking[0]

  function agregarProducto(productoId: string) {
    setItems((actuales) =>
      actuales.some((item) => item.productoId === productoId)
        ? actuales
        : [...actuales, { productoId, cantidad: 1 }],
    )
  }

  function cambiarCantidad(productoId: string, cambio: number) {
    setItems((actuales) =>
      actuales.map((item) =>
        item.productoId === productoId
          ? { ...item, cantidad: Math.max(1, item.cantidad + cambio) }
          : item,
      ),
    )
  }

  function quitarProducto(productoId: string) {
    setItems((actuales) => actuales.filter((item) => item.productoId !== productoId))
    setAgregadosDesdeReceta((actuales) => {
      const nuevos = new Set(actuales)
      nuevos.delete(productoId)
      return nuevos
    })
  }

  function agregarDesdeReceta(productoId: string) {
    agregarProducto(productoId)
    setAgregadosDesdeReceta((actuales) => new Set(actuales).add(productoId))
  }

  const hayProductos = items.length > 0

  const cerrarPanel = useCallback(() => setPanelAbierto(false), [])

  // La misma lista se muestra en la columna derecha y en el panel del carrito.
  function renderLista(idCampo: string) {
    return (
      <ListaMercado
        idCampo={idCampo}
        items={items}
        ranking={ranking}
        presupuesto={presupuesto}
        onPresupuesto={setPresupuesto}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={quitarProducto}
        onVerResultado={() => {
          setPestana('resultado')
          setPanelAbierto(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-dvh pb-44 lg:pb-10">
      <Encabezado />
      <NavegacionPestanas
        pestanaActiva={pestana}
        onCambiar={setPestana}
        cantidadProductos={items.length}
        cantidadRecetas={recetas.length}
      />

      <div className="mx-auto w-full max-w-2xl px-4 pt-5 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-8">
      <main className="min-w-0">
        {pestana !== 'recetas' && (
          <EstadoPresupuesto
            hayProductos={hayProductos}
            presupuesto={presupuesto}
            totalMasBarato={tiendaMasBarata.total}
            nombreTienda={tiendaMasBarata.tienda.nombre}
          />
        )}

        {pestana === 'mercado' && (
          <PestanaMercado
            idsEnLista={idsEnLista}
            presupuesto={presupuesto}
            onPresupuesto={setPresupuesto}
            onAgregar={agregarProducto}
          />
        )}

        {pestana === 'resultado' && (
          <PestanaResultado
            ranking={ranking}
            hayProductos={hayProductos}
            cantidadProductos={items.reduce((suma, item) => suma + item.cantidad, 0)}
            onIrAMercado={() => setPestana('mercado')}
          />
        )}

        {pestana === 'recetas' && (
          <PestanaRecetas
            recetas={recetas}
            hayProductos={hayProductos}
            tiendaMasBarata={tiendaMasBarata.tienda}
            agregadosDesdeReceta={agregadosDesdeReceta}
            onAgregar={agregarDesdeReceta}
            onQuitar={quitarProducto}
            onIrAMercado={() => setPestana('mercado')}
          />
        )}
      </main>

        {/* Computador: la lista siempre visible a la derecha */}
        <aside aria-label="Mi lista" className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:rounded-3xl lg:bg-muted lg:p-4">
          {renderLista('presupuesto-lateral')}
        </aside>
      </div>

      {/* Celular: botón del carrito y panel con la lista */}
      <PanelCarrito
        abierto={panelAbierto}
        onAbrir={() => setPanelAbierto(true)}
        onCerrar={cerrarPanel}
        cantidadProductos={items.length}
      >
        {renderLista('presupuesto-panel')}
      </PanelCarrito>
    </div>
  )
}
