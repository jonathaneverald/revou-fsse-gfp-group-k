import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    Loader,
    MoreHorizontal,
    Trash,
    SquarePen,
    PlusCircle,
} from 'lucide-react'
import { formatIntToIDR } from '@/utils/currency'
import { useFetchVouchers } from '@/hooks/useFetchVouchers'
import axios from 'axios'
import { getToken } from '@/utils/tokenUtils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Voucher } from '@/types/voucher'
import { VoucherFormSchema } from '@/schemas/VoucherForm'
import DeleteVoucher from '../dialog/DeleteVoucher'
import VoucherDialog from '../dialog/VoucherDialog'

const VoucherTable: React.FC = () => {
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [voucherToEdit, setVoucherToEdit] = useState<Voucher | null>(null)
    const [voucherToDelete, setVoucherToDelete] = useState<number | null>(null)
    const { vouchers, isError, isLoading, refetch } = useFetchVouchers()

    const authToken = getToken()

    const form = useForm({
        resolver: zodResolver(VoucherFormSchema),
        defaultValues: {
            name: '',
            discount: 0,
        },
    })

    const onSubmit = async (values: z.infer<typeof VoucherFormSchema>) => {
        try {
            if (voucherToEdit) {
                await axios.put(
                    `http://127.0.0.1:5000/voucher/${voucherToEdit.id}`,
                    {
                        name: values.name.toUpperCase(),
                        discount: values.discount,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                )
            } else {
                await axios.post(
                    `http://127.0.0.1:5000/voucher`,
                    {
                        name: values.name.toUpperCase(),
                        discount: values.discount,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                )
            }
            refetch()
            setOpenEditDialog(false)
        } catch (error) {
            console.error('Failed to submit voucher:', error)
        }
    }

    const handleDeleteVoucher = async () => {
        if (!voucherToDelete) return

        try {
            await axios.delete(
                `http://127.0.0.1:5000/voucher/${voucherToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            )
            refetch()
            setOpenDeleteDialog(false)
        } catch (error) {
            console.error('Failed to delete voucher:', error)
        }
    }

    const openEditDialogWithVoucher = (voucher: Voucher) => {
        setVoucherToEdit(voucher)
        form.setValue('name', voucher.name)
        form.setValue('discount', Math.floor(voucher.discount))
        setOpenEditDialog(true)
    }

    const openCreateDialog = () => {
        setVoucherToEdit(null)
        form.reset()
        setOpenEditDialog(true)
    }

    if (isLoading)
        return (
            <Card className="flex items-center justify-center py-10">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </Card>
        )

    if (isError) return <div>Error loading vouchers</div>

    if (vouchers && vouchers.length === 0)
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
                        No vouchers found.
                    </p>
                </div>
            </Card>
        )

    return (
        <>
            <div className="flex justify-end">
                <Button
                    size="sm"
                    className="mb-2 mt-2 h-9 gap-1 md:mt-0"
                    onClick={openCreateDialog}
                >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Voucher
                    </span>
                </Button>
            </div>

            <Card className="mb-5 p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {vouchers &&
                            vouchers.map((voucher) => (
                                <TableRow key={voucher.id}>
                                    <TableCell className="font-medium">
                                        {voucher.id}
                                    </TableCell>

                                    <TableCell>{voucher.name}</TableCell>
                                    <TableCell>
                                        {formatIntToIDR(voucher.discount)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        openEditDialogWithVoucher(
                                                            voucher
                                                        )
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Toggle menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="flex items-center justify-between"
                                                    onClick={() =>
                                                        openEditDialogWithVoucher(
                                                            voucher
                                                        )
                                                    }
                                                >
                                                    Edit
                                                    <SquarePen className="h-4 w-4" />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="flex items-center justify-between"
                                                    onClick={() => {
                                                        setVoucherToDelete(
                                                            voucher.id
                                                        )
                                                        setOpenDeleteDialog(
                                                            true
                                                        )
                                                    }}
                                                >
                                                    Delete
                                                    <Trash className="h-4 w-4" />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <VoucherDialog
                    form={form}
                    onSubmit={onSubmit}
                    openEditDialog={openEditDialog}
                    setOpenEditDialog={setOpenEditDialog}
                    voucherToEdit={voucherToEdit}
                />

                <DeleteVoucher
                    openDeleteDialog={openDeleteDialog}
                    setOpenDeleteDialog={setOpenDeleteDialog}
                    handleDeleteVoucher={handleDeleteVoucher}
                />
            </Card>
        </>
    )
}

export default VoucherTable
