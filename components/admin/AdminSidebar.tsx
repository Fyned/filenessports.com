'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  FileText,
  Package,
  FolderTree,
  Image as ImageIcon,
  ShoppingCart,
  Users,
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Sayfalar', href: '/admin/pages', icon: FileText },
  { label: 'Ürünler', href: '/admin/products', icon: Package },
  { label: 'Kategoriler', href: '/admin/categories', icon: FolderTree },
  { label: 'Bannerlar', href: '/admin/banners', icon: ImageIcon },
  { label: 'Siparişler', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Müşteriler', href: '/admin/customers', icon: Users },
  { label: 'Blog', href: '/admin/blog', icon: Newspaper },
  { label: 'Ayarlar', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-[#1C2840] text-white flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="Filenes Sports"
              width={120}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                    isActive
                      ? 'bg-[#BB1624] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <ExternalLink className="w-4 h-4" />
          {!collapsed && <span>Siteyi Görüntüle</span>}
        </Link>
      </div>
    </aside>
  )
}
