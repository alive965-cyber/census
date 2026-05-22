'use client';

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function WorkerTable() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('users')
        .select('*, wards(name)');
      if (data) setWorkers(data);
      setLoading(false);
    };
    fetchWorkers();
  }, [supabase]);

  if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Loading workers...</div>;

  if (workers.length === 0) return <div className="p-8 text-center text-slate-500">No enumerators registered yet.</div>;

  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-100/50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead>Worker</TableHead>
            <TableHead>Assigned Ward</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.id} className="border-slate-200 dark:border-slate-800">
              <TableCell>
                <div className="font-medium text-slate-900 dark:text-slate-100">{worker.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{worker.email}</div>
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">{worker.wards?.name || 'Unassigned'}</TableCell>
              <TableCell>
                <Badge variant={worker.role === 'enumerator' ? 'default' : 'secondary'} 
                  className={worker.role === 'enumerator' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400' : ''}>
                  {worker.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
