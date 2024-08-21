export interface Voucher {
    discount: number
    id: number
    name: string
    seller_id: number
    seller_name: string
    user_id: number
}

export interface VoucherMap {
    [key: string]: Voucher
}
