import React, { useState } from 'react'
import { Card, CardFooter } from '../ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Loader, MoreHorizontal, Trash, Edit } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { useTransactionSeller } from '@/hooks/useTransactionSeller'
import { formatIntToIDR } from '@/utils/currency'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

const statusColorMap = new Map<string, string>([
    [
        'completed',
        'bg-green-300 text-green-800 hover:bg-green-400 hover:text-green-900',
    ],
    ['pending', 'bg-yellow-300 text-black hover:bg-yellow-400'],
    ['canceled', 'bg-red-300 text-red-800 hover:bg-red-400 hover:text-red-900'],
    [
        'processing',
        'bg-blue-300 text-blue-800 hover:bg-blue-400 hover:text-blue-900',
    ],
])

const statusTooltipMap = new Map<string, string>([
    ['completed', 'This transaction is successfully completed.'],
    ['pending', 'This transaction is still pending.'],
    ['canceled', 'This transaction was canceled.'],
    ['processing', 'This transaction is currently being processed.'],
])

const getStatusColor = (status: string): string => {
    return (
        statusColorMap.get(status.toLowerCase()) ||
        'bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900'
    )
}

const getStatusTooltipText = (status: string): string => {
    return (
        statusTooltipMap.get(status.toLowerCase()) ||
        'This transaction is currently being processed.'
    )
}

const TransactionSellerTable: React.FC = () => {
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [transactionToEdit, setTransactionToEdit] = useState<number | null>(
        null
    )
    const [newStatus, setNewStatus] = useState<string>('')

    const { transactions, message, isLoading, isError } = useTransactionSeller()

    const handleEdit = (transactionId: number, currentStatus: string) => {
        setTransactionToEdit(transactionId)
        setNewStatus(currentStatus)
        setOpenEditDialog(true)
    }

    const confirmEdit = () => {
        console.log(
            `Transaction ${transactionToEdit} status changed to ${newStatus}`
        )
        setOpenEditDialog(false)
    }

    if (isLoading)
        return (
            <Card className="flex items-center justify-center py-10">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </Card>
        )

    if (isError) return <div>Error loading transactions</div>

    if (transactions.length === 0)
        return (
            <Card className="flex items-center justify-center py-10">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m2 4h.01M9 16h.01M4 6h16M4 10h16m-7 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2z"
                        ></path>
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">
                        No transactions found.
                    </p>
                </div>
            </Card>
        )

    return (
        <Card className="mb-5 p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Customer</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                                {transaction.id}
                            </TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge
                                                onClick={() =>
                                                    handleEdit(
                                                        transaction.id,
                                                        transaction.status
                                                    )
                                                }
                                                className={`uppercase ${getStatusColor(
                                                    transaction.status
                                                )} transition duration-300 ease-in-out`}
                                            >
                                                {transaction.status}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>
                                                {getStatusTooltipText(
                                                    transaction.status
                                                )}{' '}
                                                Click To Edit
                                            </span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell>
                                {formatIntToIDR(transaction.total_price)}
                            </TableCell>
                            <TableCell>
                                <ul>
                                    {transaction.products.map(
                                        (product, index) => (
                                            <li key={index}>
                                                {product.product_name} -{' '}
                                                {product.quantity} pcs @{' '}
                                                {formatIntToIDR(product.price)}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </TableCell>
                            <TableCell>
                                <div>{transaction.user.user_name}</div>
                                <div>{transaction.user.address}</div>
                                <div>{transaction.user.phone_number}</div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{transactions.length}</strong> transactions.{' '}
                    {message}
                </div>
            </CardFooter>

            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Status</DialogTitle>
                        <DialogDescription>
                            Select a new status for transaction{' '}
                            <strong>{transactionToEdit}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="canceled">
                                    Canceled
                                </SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenEditDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default TransactionSellerTable
