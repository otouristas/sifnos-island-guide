
import { Fragment, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Hotel, Building2, Map, Ship, PenSquare, Info, MessageCircle, Building, Home } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="bg-white shadow-sm z-10 relative">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Sifnos Hotels</span>
            <div className="flex items-center gap-2">
              <Hotel className="h-6 w-auto text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Sifnos Hotels</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">Sifnos Hotels</span>
                  <div className="flex items-center gap-2">
                    <Hotel className="h-6 w-auto text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">Sifnos Hotels</span>
                  </div>
                </Link>
              </div>
              <div className="flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <Link
                      to="/"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/hotels"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Hotels
                    </Link>
                    <Link
                      to="/locations"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Locations
                    </Link>
                    <Link
                      to="/ferry-tickets"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ferry Tickets
                    </Link>
                    <Link
                      to="/blog"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    <Link
                      to="/about"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                  <div className="py-6 space-y-2">
                    <Link
                      to="/pricing"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      List Your Hotel
                    </Link>
                    {!loading && (
                      user ? (
                        <Link
                          to="/dashboard"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Hotel Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard/auth"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Hotel Owner Login
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex lg:gap-x-6">
          <Link
            to="/"
            className={classNames(
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>

          <Link
            to="/hotels"
            className={classNames(
              location.pathname === '/hotels' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <Building2 className="h-4 w-4 mr-1" />
            Hotels
          </Link>

          <Link
            to="/locations"
            className={classNames(
              location.pathname === '/locations' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <Map className="h-4 w-4 mr-1" />
            Locations
          </Link>

          <Link
            to="/ferry-tickets"
            className={classNames(
              location.pathname === '/ferry-tickets' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <Ship className="h-4 w-4 mr-1" />
            Ferry Tickets
          </Link>

          <Link
            to="/blog"
            className={classNames(
              location.pathname === '/blog' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <PenSquare className="h-4 w-4 mr-1" />
            Blog
          </Link>
          
          <Link
            to="/about"
            className={classNames(
              location.pathname === '/about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <Info className="h-4 w-4 mr-1" />
            About
          </Link>
          
          <Link
            to="/contact"
            className={classNames(
              location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600',
              'flex items-center text-sm font-medium transition-colors'
            )}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Contact
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-2">
          <Link to="/pricing">
            <Button variant="outline" size="sm">
              List Your Hotel
            </Button>
          </Link>

          {!loading && (
            user ? (
              <Link to="/dashboard">
                <Button size="sm">
                  <Building className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard/auth">
                <Button size="sm">
                  Hotel Owner Login
                </Button>
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  )
}
