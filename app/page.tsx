"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const projects = [
  { id: "oceanprotocol", name: "Ocean Protocol", logo: "🌊" },
  { id: "dimitra", name: "Dimitra", logo: "🌿" },
  { id: "numerai", name: "Numerai", logo: "🧠" },
  { id: "anyone", name: "Anyone", logo: "👥" },
  { id: "genomes", name: "Genomes", logo: "🧬" },
]

interface ProjectData {
  project_id: string
  twitter_user: number
  discord_user: number
  telegram_user: number
}

export default function Home() {
  const [projectsData, setProjectsData] = useState<ProjectData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-display.onrender.com/preview', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-key': 'b668705246684ade9d57f17d4f805f6be7c9ad931fd1636273404b593a93a8be'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await response.json()
        setProjectsData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const getProjectData = (projectId: string) => {
    return projectsData.find(data => data.project_id === projectId)
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const data = getProjectData(project.id)
        
        return (
          <Link key={project.id} href={`/dashboard/${project.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl">
                  {project.logo}
                </div>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <dt className="font-medium">Twitter</dt>
                    <dd>{data?.twitter_user}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Discord</dt>
                    <dd>{data?.discord_user}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Telegram</dt>
                    <dd>{data?.telegram_user}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}