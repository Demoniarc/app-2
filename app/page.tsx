import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const projects = [
  { id: "oceanprotocol", name: "Ocean Protocol", logo: "🌊" },
  { id: "dimitra", name: "Dimitra", logo: "🌿" },
  { id: "numerai", name: "Numerai", logo: "🧠" },
  { id: "anyone", name: "Anyone", logo: "👥" },
  { id: "genomes", name: "Genomes", logo: "🧬" },
]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Home() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
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
                  <dd>{getRandomInt(100, 1000)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Discord</dt>
                  <dd>{getRandomInt(50, 500)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Telegram</dt>
                  <dd>{getRandomInt(200, 2000)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

