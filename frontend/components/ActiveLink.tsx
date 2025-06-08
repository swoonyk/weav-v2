'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ActiveLinkProps {
  children: React.ReactNode
  href: string
  className?: string
  activeClassName?: string
  onClick?: () => void
}

const ActiveLink: React.FC<ActiveLinkProps> = ({
  children,
  href,
  className = '',
  activeClassName = '',
  onClick,
  ...props
}) => {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      {...props}
    >
      {children}
    </Link>
  )
}

export default ActiveLink

