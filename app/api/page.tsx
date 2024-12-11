"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/hooks/useWallet"
import { useApiContract } from "@/hooks/useApiContract"

export default function ApiPage() {
  const [months, setMonths] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { address, connectWallet } = useWallet()
  const { price, loading, error, payForAccess } = useApiContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address) {
      await connectWallet()
      return
    }

    setIsProcessing(true)
    try {
      const success = await payForAccess(Number(months))
      if (success) {
        setApiKey(`votre_cle_api_${Math.random().toString(36).substr(2, 9)}`)
      }
    } catch (err) {
      console.error("Erreur lors du paiement:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setMonths(value)
    }
  }

  const totalPrice = loading ? '...' : (Number(price) * Number(months || 0)).toFixed(2)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API CryptoSocialAnalyse</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentation de l'API</CardTitle>
          <CardDescription>Accédez à notre documentation complète pour intégrer l'API CryptoSocialAnalyse.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button as="a" href="/api-docs" target="_blank">Voir la Documentation</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement à l'API</CardTitle>
          <CardDescription>Choisissez la durée de votre abonnement et obtenez votre clé API.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="months">Nombre de mois d'abonnement</Label>
              <Input
                id="months"
                type="number"
                min="1"
                placeholder="Entrez le nombre de mois"
                value={months}
                onChange={handleMonthsChange}
                required
              />
              {months && !loading && (
                <p className="text-sm text-muted-foreground">
                  Prix total: {totalPrice} MATIC
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={!months || isProcessing || loading}
            >
              {!address 
                ? "Connecter le portefeuille" 
                : isProcessing 
                  ? "Transaction en cours..." 
                  : "Payer et obtenir la clé API"}
            </Button>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </form>
        </CardContent>
        {apiKey && (
          <CardFooter>
            <div className="w-full">
              <h3 className="font-semibold mb-2">Votre clé API :</h3>
              <code className="bg-secondary p-2 rounded block w-full break-all">{apiKey}</code>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}