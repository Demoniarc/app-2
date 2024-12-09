"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ApiPage() {
  const [months, setMonths] = useState("")
  const [apiKey, setApiKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler un processus de paiement
    setTimeout(() => {
      setApiKey(`votre_cle_api_${Math.random().toString(36).substr(2, 9)}`)
    }, 1000)
  }

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
                placeholder="Entrez le nombre de mois"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Payer et obtenir la clé API</Button>
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

