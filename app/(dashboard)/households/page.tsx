import { ShieldCheck, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockHouseholds = [
  { id: "H-1001", head: "Ramesh Sharma", members: 4, status: "Completed", ward: "42", date: "2024-03-12" },
  { id: "H-1002", head: "Sunita Devi", members: 2, status: "Pending", ward: "42", date: "-" },
  { id: "H-1003", head: "Abdul Kalam", members: 5, status: "Completed", ward: "15", date: "2024-03-11" },
  { id: "H-1004", head: "Meera Reddy", members: 3, status: "In Progress", ward: "08", date: "2024-03-13" },
  { id: "H-1005", head: "Vikash Singh", members: 6, status: "Completed", ward: "19", date: "2024-03-10" },
];

export default function HouseholdsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Household Registry
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and view all surveyed households across assigned wards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-200 dark:border-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Add Household
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input 
              type="search" 
              placeholder="Search households or IDs..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-800">
            <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </Button>
        </div>
        
        <Table>
          <TableHeader className="bg-slate-100/50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead>Household ID</TableHead>
              <TableHead>Head of Family</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Survey Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHouseholds.map((house) => (
              <TableRow key={house.id} className="border-slate-200 dark:border-slate-800">
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">{house.id}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">{house.head}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">{house.ward}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">{house.members}</TableCell>
                <TableCell>
                  <Badge 
                    variant={house.status === 'Completed' ? 'default' : house.status === 'Pending' ? 'secondary' : 'outline'}
                    className={
                      house.status === 'Completed' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400' : 
                      house.status === 'In Progress' ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400' : ''
                    }
                  >
                    {house.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/households/${house.id}`}>
                    <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
