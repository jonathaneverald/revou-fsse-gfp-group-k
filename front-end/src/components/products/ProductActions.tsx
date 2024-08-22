import { ListFilter, PlusCircle } from 'lucide-react'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import Link from 'next/link'

const ProductActions: React.FC = () => (
    <div className="mb-2 ml-auto mt-2 flex items-center justify-end gap-2 md:mt-0">
        <Link href={'products/add'}>
            <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                </span>
            </Button>
        </Link>
    </div>
)

export default ProductActions
