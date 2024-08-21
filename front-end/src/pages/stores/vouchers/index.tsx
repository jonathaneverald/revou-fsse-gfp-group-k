import StoreLayout from '@/components/StoreLayout'
import VoucherTable from '@/components/voucher/VoucherTable'
import React from 'react'

const index = () => {
    return (
        <StoreLayout>
            <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                <div>
                    <VoucherTable />
                </div>
            </main>
        </StoreLayout>
    )
}

export default index
