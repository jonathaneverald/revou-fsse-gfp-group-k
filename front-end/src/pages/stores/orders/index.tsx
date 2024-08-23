import StoreLayout from '@/components/StoreLayout'
import TransactionSellerTable from '@/components/transaction/TransactionSellerTable'
import { useTransactionSeller } from '@/hooks/useTransactionSeller'
import React from 'react'

const index = () => {
    const { transactions } = useTransactionSeller()

    return (
        <StoreLayout>
            <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                <div>
                    <TransactionSellerTable />
                </div>
            </main>
        </StoreLayout>
    )
}

export default index
