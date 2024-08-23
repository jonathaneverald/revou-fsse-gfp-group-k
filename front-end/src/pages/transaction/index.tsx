import React from 'react'
import { GetServerSideProps } from 'next'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { formatIntToIDR } from '@/utils/currency'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useUpdateTransactionStatus from '@/hooks/useUpdateTransactionStatus'
import { useTransactionCustomer } from '@/hooks/useTransactionCustomer'
import { mutate } from 'swr'

const statusColorMap = new Map<string, string>([
    [
        'payment success',
        'bg-blue-300 text-blue-800 hover:bg-blue-400 hover:text-blue-900',
    ],
    [
        'transaction success',
        'bg-green-300 text-green-800 hover:bg-green-400 hover:text-green-900',
    ],
    ['pending', 'bg-yellow-300 text-black hover:bg-yellow-400'],
    ['cancel', 'bg-red-300 text-red-800 hover:bg-red-400 hover:text-red-900'],
])

const getStatusColor = (status: string): string => {
    return (
        statusColorMap.get(status.toLowerCase()) ||
        'bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900'
    )
}

const TransactionsPage: React.FC = () => {
    const { transactions, message, isLoading, isError } =
        useTransactionCustomer() // Use the new hook
    const {
        updateTransactionStatus,
        isUpdating,
        error: updateError,
    } = useUpdateTransactionStatus()

    const handleMarkAsComplete = async (transactionId: number) => {
        const newStatus = 'Transaction Success'
        const result = await updateTransactionStatus(transactionId, newStatus)

        if (result) {
            setTimeout(() => {
                // Re-fetch the data for user transactions to update the UI
                mutate('http://127.0.0.1:5000/transaction') // Trigger re-fetch
            }, 2000)
        } else {
            console.error(
                'Failed to mark transaction as complete:',
                updateError
            )
        }
    }

    if (isLoading || isUpdating) return <div>Loading...</div>
    if (isError) return <div>Error: {isError.message}</div>

    return (
        <div className="p-4 md:px-6">
            <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Voucher Applied</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 bg-white">
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        <Badge
                                            className={`uppercase ${getStatusColor(transaction.status)}`}
                                        >
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatIntToIDR(
                                            Number(transaction.total_price)
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatIntToIDR(
                                            Number(transaction.discount)
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.voucher_applied ?? 'None'}
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            {transaction.products.map(
                                                (product, index) => (
                                                    <li key={index}>
                                                        {product.product_name} -{' '}
                                                        {product.quantity} @{' '}
                                                        {formatIntToIDR(
                                                            Number(
                                                                product.price
                                                            )
                                                        )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            <li>{transaction.seller.store}</li>
                                            <li>
                                                {
                                                    transaction.seller.profile
                                                        .name
                                                }
                                            </li>
                                            <li>
                                                {
                                                    transaction.seller.profile
                                                        .phone_number
                                                }
                                            </li>
                                        </ul>
                                    </TableCell>
                                    <TableCell>
                                        {transaction.status !==
                                        'Payment Success' ? (
                                            <Button
                                                variant={'outline'}
                                                size={'sm'}
                                                disabled
                                            >
                                                {transaction.status ===
                                                'Transaction Success'
                                                    ? 'Completed'
                                                    : 'Mark as Complete'}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={'outline'}
                                                size={'sm'}
                                                onClick={() =>
                                                    handleMarkAsComplete(
                                                        transaction.id
                                                    )
                                                }
                                            >
                                                Mark as Complete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default TransactionsPage
