export interface Voucher {
	type: "fixed" | "percentage";
	value: number;
	code: string;
}

export interface VoucherMap {
	[key: string]: Voucher;
}
