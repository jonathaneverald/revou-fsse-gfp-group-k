import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'

interface DeleteVoucherProps {
    openDeleteDialog: boolean
    setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>
    handleDeleteVoucher: () => void
}

const DeleteVoucher: React.FC<DeleteVoucherProps> = ({
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDeleteVoucher,
}) => {
    return (
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Voucher</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this voucher? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleDeleteVoucher}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteVoucher
