const formatoMiles = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })

// Muestra un valor en pesos colombianos con puntos de miles: 12800 -> "$12.800".
export function formatearPesos(valor: number) {
  return `$${formatoMiles.format(Math.round(valor))}`
}

// Solo los números con puntos de miles, sin el signo: 12800 -> "12.800".
export function formatearMiles(valor: number) {
  return formatoMiles.format(Math.round(valor))
}

// Quita tildes y mayúsculas para comparar textos: "Fríjol" -> "frijol".
export function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
