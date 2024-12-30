export interface FilterStock {
    name: string,
    category: string,
    belowQuantity: number | null,
    aboveQuantity: number | null
}