import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useUserProfile from '@/hooks/useAuthenticatedUser'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import EditProfile from '@/components/form/EditProfile'
import { useState } from 'react'
import useLogout from '@/hooks/useLogout'

const ProfileDropdown: React.FC = () => {
    const { user, error, isLoading } = useUserProfile()
    const [isOpen, setIsOpen] = useState(false)
    const {
        handleLogout,
        loading: isLoggingOut,
        error: logoutError,
    } = useLogout()

    if (isLoading) {
        return <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <EditProfile isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border">
                        <AvatarFallback>
                            {user?.email?.slice(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-6 w-56">
                    <DropdownMenuLabel>
                        {user?.email || 'My Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer"
                        >
                            Profile
                        </DropdownMenuItem>

                        <Link href={'/transaction'}>
                            <DropdownMenuItem className="cursor-pointer">
                                Transaction
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="cursor-pointer"
                    >
                        {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default ProfileDropdown
