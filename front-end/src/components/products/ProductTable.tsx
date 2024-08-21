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
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { formatIntToIDR } from '@/utils/currency'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal, SquarePen, Trash } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import ImageUploadDialog from '../form/ImageUploadDialog'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getToken } from '@/utils/tokenUtils'

interface Product {
    id: number
    images: string[] | null
    name: string
    price: number
    quantity: number
    slug: string
    type: string
}

interface ProductTableProps {
    products: Product[]
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
    const router = useRouter()
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogImage, setOpenDialogImage] = useState(false)
    const [images, setImages] = useState<string[] | null>([])
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

    const handleDelete = (productId: number | null) => {
        setSelectedProduct(productId)
        setOpenDialog(true)
    }

    const confirmDelete = async () => {
        if (selectedProduct !== null) {
            try {
                const token = getToken()
                await axios.delete(
                    `http://127.0.0.1:5000/product/${selectedProduct}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            } catch (error) {
                console.error('Failed to delete product:', error)
            } finally {
                setOpenDialog(false)
                setSelectedProduct(null)
            }
        }
    }

    const showImage = (
        imagesParams: string[] | null,
        productId: number | null
    ) => {
        setImages(imagesParams)
        setOpenDialogImage(true)
        setSelectedProduct(productId)
    }

    return (
        <Card className="mb-5 p-0">
            <ImageUploadDialog
                openDialogImage={openDialogImage}
                setOpenDialogImage={setOpenDialogImage}
                productId={selectedProduct}
                images={images}
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:block">Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="hidden lg:table-cell">
                            Quantity
                        </TableHead>

                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    onClick={() =>
                                        showImage(product.images, product.id)
                                    }
                                    alt="Product image"
                                    className="aspect-square cursor-pointer rounded-md object-cover hover:opacity-80"
                                    height="64"
                                    src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
                                    width="64"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.name}
                            </TableCell>
                            <TableCell className="hidden md:block">
                                <Badge variant="outline">{product.type}</Badge>
                            </TableCell>
                            <TableCell>
                                {formatIntToIDR(product.price)}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {product.quantity}
                            </TableCell>

                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
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
                                            onClick={() =>
                                                router.push(
                                                    `/stores/products/edit/${product.slug}`
                                                )
                                            }
                                            className="flex items-center justify-between"
                                        >
                                            Edit
                                            <SquarePen className="size-4" />
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem
                                            className="flex items-center justify-between"
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                        >
                                            Delete
                                            <Trash className="size-4" />
                                        </DropdownMenuItem> */}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{' '}
                    products
                </div>
            </CardFooter>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the product ? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default ProductTable
