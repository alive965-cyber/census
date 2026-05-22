"use client"

import { useEffect, useState } from "react";
import { Search, Filter, Download } from "lucide-react";
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
import { useHouses } from "@/hooks/use-houses";
import { HouseCensusFormValues } from "@/utils/validators";

type HouseRow = HouseCensusFormValues & { id: string; created_at: string };

export default function HouseholdsPage() {
  const { fetchHouses, loading, error } = useHouses();
  const [houses, setHouses] = useState<HouseRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchHouses();
      if (data) setHouses(data as HouseRow[]);
    };
    load();
  }, [fetchHouses]);

  const filtered = houses.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.houseNumber.toLowerCase().includes(q) ||
      h.headOfFamily.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  });

  const statusLabel = (s: string) => {
    switch (s) {
      case "COMPLETED": return "Completed";
      case "IN_PROGRESS": return "In Progress";
      default: return "Pending";
    }
  };

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
          <a href="/api/export/excel" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-slate-200 dark:border-slate-800">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </a>
          <Link href="/map">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Add Household
            </Button>
          </Link>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-800">
            <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </Button>
        </div>
        
        {loading ? (
          <div className="p-12 text-center animate-pulse text-slate-500">Loading households...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? "No matching households found." : "No households yet. Click 'Add Household' to create one."}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-100/50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead>House #</TableHead>
                <TableHead>Head of Family</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Members (M/F)</TableHead>
                <TableHead>Survey Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((house) => {
                const status = statusLabel(house.surveyStatus);
                return (
                  <TableRow key={house.id} className="border-slate-200 dark:border-slate-800">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{house.houseNumber}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{house.headOfFamily}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{house.totalPopulation}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{house.male}M / {house.female}F</TableCell>
                    <TableCell>
                      <Badge 
                        variant={status === 'Completed' ? 'default' : status === 'Pending' ? 'secondary' : 'outline'}
                        className={
                          status === 'Completed' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400' : 
                          status === 'In Progress' ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400' : ''
                        }
                      >
                        {status}
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
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
