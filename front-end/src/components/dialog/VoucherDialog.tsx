import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { VoucherFormSchema } from '@/schemas/VoucherForm'

interface VoucherDialogProps {
    openEditDialog: boolean
    setOpenEditDialog: (open: boolean) => void
    voucherToEdit?: { name: string; discount: number } | null
    form: any
    onSubmit: (data: z.infer<typeof VoucherFormSchema>) => void
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({
    openEditDialog,
    setOpenEditDialog,
    voucherToEdit,
    form,
    onSubmit,
}) => {
    return (
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {voucherToEdit ? 'Edit Voucher' : 'Create Voucher'}
                    </DialogTitle>
                    <DialogDescription>
                        {voucherToEdit
                            ? 'Update the name and discount for the voucher.'
                            : 'Create a new voucher.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Input voucher name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Input voucher discount"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                {voucherToEdit ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default VoucherDialog
