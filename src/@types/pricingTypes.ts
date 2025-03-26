export interface Plan {
  id: string
  entity: string
  interval: number
  period: string
  item: {
    id: string
    active: boolean
    name: string
    description: string | null
    amount: number
    unit_amount: number
    currency: string
    type: string
    unit: string | null
    tax_inclusive: boolean
    hsn_code: string | null
    sac_code: string | null
    tax_rate: string | null
    tax_id: string | null
    tax_group_id: string | null
    created_at: number
    updated_at: number
  }
  notes: any[] // Use a more specific type if notes structure is known.
  created_at: number
}
