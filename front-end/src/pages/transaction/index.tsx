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

interface Product {
    price: number
    product_name: string
    quantity: number
}

interface User {
    user_name: string
    address: string
    phone_number: string
}

interface Transaction {
    id: number
    discount: number
    products: Product[]
    status: string
    total_price: number
    voucher_applied: string | null
    user: User
}

interface TransactionsResponse {
    data: Transaction[]
    message: string
}

interface Props {
    transactions: Transaction[]
    error?: string
}

const TransactionsPage: React.FC<Props> = ({ transactions, error }) => {
    const handleMarkAsComplete = (transactionId: number) => {
        // Implement the logic to mark the transaction as complete
        console.log(`Mark transaction ${transactionId} as complete`)
    }

    if (error) {
        return <div>Error: {error}</div>
    }
    console.log(transactions)

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
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    ID
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total Price
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Discount
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Voucher Applied
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Products
                                </TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 bg-white">
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {transaction.id}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {transaction.status}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {formatIntToIDR(
                                            transaction.total_price
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {formatIntToIDR(transaction.discount)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {transaction.voucher_applied ?? 'None'}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        <ul>
                                            {transaction.products.map(
                                                (product, index) => (
                                                    <li key={index}>
                                                        {product.product_name} -{' '}
                                                        {product.quantity} @{' '}
                                                        {formatIntToIDR(
                                                            product.price
                                                        )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {transaction.status === 'complete' ? (
                                            <Button
                                                variant={'outline'}
                                                size={'sm'}
                                                disabled
                                            >
                                                Completed
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

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    try {
        const authToken = context.req.cookies.jwtToken

        const res = await fetch('http://127.0.0.1:5000/transaction', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })

        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        const data: TransactionsResponse = await res.json()

        return {
            props: {
                transactions: data.data,
            },
        }
    } catch (error) {
        return {
            props: {
                transactions: [],
                error: (error as Error).message,
            },
        }
    }
}

export default TransactionsPage
