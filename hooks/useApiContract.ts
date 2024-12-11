import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { API_CONTRACT_ADDRESS, API_CONTRACT_ABI } from '@/lib/constants'

export function useApiContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [price, setPrice] = useState<string>('0')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const apiContract = new ethers.Contract(
            API_CONTRACT_ADDRESS,
            API_CONTRACT_ABI,
            signer
          )
          
          const priceWei = await apiContract.price()
          const priceEther = ethers.utils.formatEther(priceWei)
          
          setContract(apiContract)
          setPrice(priceEther)
          setLoading(false)
        }
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    initContract()
  }, [])

  const payForAccess = async (months: number) => {
    try {
      if (!contract) throw new Error('Contract not initialized, try refreshing the page')
      
      const priceWei = ethers.utils.parseEther(price)
      const totalPrice = priceWei.mul(months)
      
      const tx = await contract.payForAccess(months, {
        value: totalPrice
      })
      
      await tx.wait()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  return {
    contract,
    price,
    loading,
    error,
    payForAccess
  }
}