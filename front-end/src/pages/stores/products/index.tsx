import React from 'react'
import ProductTable from '@/components/products/ProductTable'
import { useSellerProducts } from '@/hooks/useSellerProducts'
import ProductActions from '@/components/products/ProductActions'
import StoreLayout from '@/components/StoreLayout'

const StoreProducts: React.FC = () => {
    const { products } = useSellerProducts()

    return (
        <StoreLayout>
            <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                <div>
                    <ProductActions />
                    <ProductTable products={products} />
                </div>
            </main>
        </StoreLayout>
    )
}

export default StoreProducts
