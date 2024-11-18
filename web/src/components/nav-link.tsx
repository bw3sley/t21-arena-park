import { Link, LinkProps, useLocation } from 'react-router-dom'

type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps) {
    const { pathname } = useLocation()

    return (
        <Link
            data-current={pathname === props.to}
            className="flex items-center gap-1.5 data-[current='true']:text-lime-400 hover:text-lime-400"
            {...props}
        />
    )
}