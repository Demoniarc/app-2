"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, MenuIcon } from 'lucide-react'
import { useTheme } from "next-themes"
import { SearchBar } from "@/components/search-bar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()

  const connectWallet = async () => {
    // Simuler la connexion du portefeuille
    setIsWalletConnected(true)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold md:text-2xl">
              CryptoSocialAnalyse
            </Link>
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/api" className="text-sm font-medium">
                API
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Changer de thème</span>
              </Button>
              <Button onClick={connectWallet}>
                {isWalletConnected ? "Connecté" : "Connecter Portefeuille"}
              </Button>
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <SearchBar />
                  <Link href="/api" className="text-sm font-medium">
                    API
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setIsMenuOpen(false)
                    }}
                  >
                    {theme === "dark" ? (
                      <SunIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <MoonIcon className="h-5 w-5 mr-2" />
                    )}
                    Changer de thème
                  </Button>
                  <Button onClick={() => {
                    connectWallet()
                    setIsMenuOpen(false)
                  }}>
                    {isWalletConnected ? "Connecté" : "Connecter Portefeuille"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

