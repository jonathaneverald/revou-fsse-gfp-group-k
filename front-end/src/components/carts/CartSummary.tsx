import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { formatIntToIDR } from '@/utils/currency'
import { Button } from '../ui/button'
import { CartSummaryProps } from '@/types/cart'
import { useTransactionPost } from '@/hooks/useCreateTransaction'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/router'

const CartSummary: React.FC<CartSummaryProps> = ({
    calculateStoreSubtotals,
    calculateTotal,
    voucher,
}) => {
    const { postTransaction } = useTransactionPost()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const vc = voucher ? voucher.voucher_id : null

            const newTransaction = await postTransaction(vc)
            if (newTransaction.message == 'Success') {
                router.push('/transaction')
            }
        } catch (error) {
            console.error('Error posting transaction:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="mb-4">
            <CardHeader className="p-4">
                <CardTitle>Shopping summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {calculateStoreSubtotals.map((storeSubtotal) => (
                        <div key={storeSubtotal.store} className="space-y-1">
                            <div className="font-semibold">
                                {storeSubtotal.store}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>
                                    {formatIntToIDR(storeSubtotal.subtotal)}
                                </span>
                            </div>
                            {storeSubtotal.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>
                                        -
                                        {formatIntToIDR(storeSubtotal.discount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm font-semibold">
                                <span>Store Total:</span>
                                <span>
                                    {formatIntToIDR(
                                        storeSubtotal.subtotal -
                                            storeSubtotal.discount
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{formatIntToIDR(calculateTotal)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="px-4">
                <Button className="w-full" onClick={handleSubmit}>
                    {!loading ? (
                        'Proceed to Checkout'
                    ) : (
                        <>
                            <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CartSummary
