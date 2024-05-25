'use client'
import React, {useState} from 'react'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from '@nextui-org/react'
import {AcmeLogo} from "../static/AcmeLogo";
import {User} from "../../types/prismaTypes";

interface HeaderProps {
    user?:  User | undefined
}

export default function Header({user}: HeaderProps) {
    const routePathName = usePathname()
    const isActive: (pathname: string) => boolean = (pathname) =>
        routePathName === pathname
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];
    const router = useRouter();

    function logout() {
        return async () => {
            await fetch('api/logout', {method: "Post"});
            router.refresh()
        };
    }

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"}/>
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <AcmeLogo/>
                    <p className="font-bold text-inherit">TIPPSPIEL_NEXT</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-3" justify="start">
                <NavbarBrand>
                    <Link href={"/"} style={{display: "flex", alignItems: "center"}}>
                    <AcmeLogo/>
                    <p className="font-bold text-inherit">TIPPSPIEL_NEXT</p>
                    </Link>
                </NavbarBrand>
                <NavbarItem>
                    <Link color="foreground" href="/community">
                        Communities
                    </Link>
                </NavbarItem>
                {user &&
                <NavbarItem>
                    <Link href="/bet" aria-current="page">
                        Bets
                    </Link>
                </NavbarItem>}
                <NavbarItem>
                    <Link color="foreground" href="/admin">
                        Admin
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                {user ? (
                        <NavbarItem>
                            <Button color="warning" onClick={logout()} variant="flat">
                                Sign Out
                            </Button>
                        </NavbarItem>)
                    :
                    (<NavbarItem className="lg:flex">
                        <Link href="/login">Login</Link>
                    </NavbarItem>)
                }
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            href="#"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}
