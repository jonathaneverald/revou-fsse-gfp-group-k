import React, { useState } from 'react'
import { useRouter } from 'next/router'
import useCreateProduct from '@/hooks/useCreateProduct'
import ProductForm from '@/components/form/ProductForm'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const AddProduct: React.FC = () => {
    const router = useRouter()
    const { createProduct, success } = useCreateProduct()
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)

    const handleAddProduct = async (data: any) => {
        await createProduct(data)
        setShowSuccessAlert(true)
    }

    return (
        <div>
            <ProductForm onSubmit={handleAddProduct} />
            <AlertDialog
                open={showSuccessAlert}
                onOpenChange={setShowSuccessAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Product Added Successfully
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Your product has been added successfully.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                setShowSuccessAlert(false)
                                router.push('/stores/products')
                            }}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AddProduct
