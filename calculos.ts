import { PRODUCTOS, PRODUCTOS_POR_ID, TIENDAS, type Producto, type Tienda } from '@/data/productos'
import { RECETAS_TEXTO } from '@/data/recetas'
import { normalizarTexto } from '@/lib/formato'

export type ItemLista = {
  productoId: string
  cantidad: number
}

export type TotalTienda = {
  tienda: Tienda
  total: number
  // Cuántos productos de la lista no vende esta tienda.
  faltantes: number
}

// ---------- Totales por tienda ----------

// Suma el mercado en cada tienda. Primero van las que tienen todo, de la más barata a la más cara.
export function calcularRanking(items: ItemLista[]): TotalTienda[] {
  return TIENDAS.map((tienda) => {
    let total = 0
    let faltantes = 0
    for (const item of items) {
      const precio = PRODUCTOS_POR_ID[item.productoId]?.precios[tienda.id]
      if (typeof precio === 'number') total += precio * item.cantidad
      else faltantes += 1
    }
    return { tienda, total, faltantes }
  }).sort((a, b) => a.faltantes - b.faltantes || a.total - b.total)
}

// Precio más bajo de un producto entre todas las tiendas.
export function precioMinimo(producto: Producto): number | null {
  const disponibles = Object.values(producto.precios).filter(
    (precio): precio is number => typeof precio === 'number',
  )
  return disponibles.length > 0 ? Math.min(...disponibles) : null
}

// ---------- Buscador ----------

export function buscarProductos(consulta: string): Producto[] {
  const texto = normalizarTexto(consulta)
  if (!texto) return []
  return PRODUCTOS.filter((producto) => normalizarTexto(producto.nombre).includes(texto))
}

// Productos que aún no están en la lista, primero los de canasta familiar.
export function sugerirProductos(idsEnLista: Set<string>, limite = 6): Producto[] {
  return PRODUCTOS.filter((producto) => !idsEnLista.has(producto.id))
    .sort((a, b) => Number(b.canastaFamiliar) - Number(a.canastaFamiliar))
    .slice(0, limite)
}

// ---------- Recetas ----------

export type Receta = {
  nombre: string
  ingredientes: Producto[]
}

// Lee el texto de data/recetas.ts: "Nombre: Ingrediente 1, Ingrediente 2".
function leerRecetas(texto: string): Receta[] {
  const porNombre = new Map(PRODUCTOS.map((p) => [normalizarTexto(p.nombre), p]))

  return texto
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea.includes(':'))
    .map((linea) => {
      const separador = linea.indexOf(':')
      const nombre = linea.slice(0, separador).trim()
      const ingredientes = linea
        .slice(separador + 1)
        .split(',')
        .map((nombreIngrediente) => porNombre.get(normalizarTexto(nombreIngrediente)))
        .filter((producto): producto is Producto => Boolean(producto))
      return { nombre, ingredientes }
    })
    .filter((receta) => receta.nombre && receta.ingredientes.length > 0)
}

export const RECETAS: Receta[] = leerRecetas(RECETAS_TEXTO)

export type RecetaSugerida = Receta & {
  tiene: Producto[]
  faltan: Producto[]
}

// Recetas con al menos el 75% de los ingredientes (redondeando hacia arriba).
// Primero las completas, luego las que tienen menos ingredientes faltantes.
export function sugerirRecetas(idsEnLista: Set<string>): RecetaSugerida[] {
  return RECETAS.map((receta) => ({
    ...receta,
    tiene: receta.ingredientes.filter((p) => idsEnLista.has(p.id)),
    faltan: receta.ingredientes.filter((p) => !idsEnLista.has(p.id)),
  }))
    .filter((receta) => receta.tiene.length >= Math.ceil(receta.ingredientes.length * 0.75))
    .sort((a, b) => a.faltan.length - b.faltan.length)
}
