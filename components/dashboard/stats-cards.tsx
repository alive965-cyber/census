import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Home, Users, User, UserPlus, Baby, CheckCircle2 } from "lucide-react"

interface StatsCardsProps {
  totalHouses: number
  totalPopulation: number
  male: number
  female: number
  children: number
  seniors: number
  completionRate: number
}

export function StatsCards({
  totalHouses,
  totalPopulation,
  male,
  female,
  children,
  seniors,
  completionRate,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">Total Houses</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalHouses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Surveyed properties</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">Population</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalPopulation.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total recorded</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">Male / Female</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {male.toLocaleString()} / {female.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Gender distribution</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">Children</CardTitle>
          <Baby className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{children.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Under 18 years</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">Senior Citizens</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{seniors.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">60+ years</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">Completion</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">Overall progress</p>
        </CardContent>
      </Card>
    </div>
  )
}
