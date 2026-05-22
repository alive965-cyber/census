'use client';

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

const mockWorkers = [
  { id: "W001", name: "Rahul Sharma", ward: "Ward 42", status: "Active", progress: "85%" },
  { id: "W002", name: "Priya Patel", ward: "Ward 15", status: "Offline", progress: "62%" },
  { id: "W003", name: "Amit Kumar", ward: "Ward 08", status: "Active", progress: "91%" },
  { id: "W004", name: "Sneha Reddy", ward: "Ward 22", status: "Inactive", progress: "10%" },
  { id: "W005", name: "Vikram Singh", ward: "Ward 19", status: "Active", progress: "45%" },
];

export function WorkerTable() {
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
          {mockWorkers.map((worker) => (
            <TableRow key={worker.id} className="border-slate-200 dark:border-slate-800">
              <TableCell>
                <div className="font-medium text-slate-900 dark:text-slate-100">{worker.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{worker.id}</div>
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">{worker.ward}</TableCell>
              <TableCell>
                <Badge variant={worker.status === 'Active' ? 'default' : worker.status === 'Offline' ? 'secondary' : 'destructive'} 
                  className={worker.status === 'Active' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400' : ''}>
                  {worker.status}
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
