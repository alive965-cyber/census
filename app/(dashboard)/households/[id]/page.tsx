import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, MapPin, Users, Calendar, Home, FileText } from "lucide-react";
import Link from "next/link";

export default async function HouseholdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Mock Data
  const household = {
    id: id,
    head: "Ramesh Sharma",
    members: 4,
    status: "Completed",
    ward: "42",
    address: "123, Block C, Saket",
    surveyDate: "2024-03-12",
    enumerator: "Rahul Sharma (W001)",
    coordinates: "28.6139° N, 77.2090° E"
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/households">
          <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 dark:border-slate-800">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Household {household.id}
            </h1>
            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400">
              {household.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Surveyed on {household.surveyDate} by {household.enumerator}
          </p>
        </div>
        <Button variant="outline" className="border-slate-200 dark:border-slate-800">
          <Edit className="w-4 h-4 mr-2" />
          Edit Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Users className="w-5 h-5 text-orange-500" />
              Family Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Head of Family</p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{household.head}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Members</p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{household.members} Persons</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Family Members Roster</h4>
              <div className="space-y-3">
                {[
                  { name: "Ramesh Sharma", age: 45, rel: "Head", gender: "Male" },
                  { name: "Anita Sharma", age: 42, rel: "Wife", gender: "Female" },
                  { name: "Karan Sharma", age: 18, rel: "Son", gender: "Male" },
                  { name: "Priya Sharma", age: 15, rel: "Daughter", gender: "Female" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.rel} • {member.gender}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{member.age} yrs</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <MapPin className="w-5 h-5 text-orange-500" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Address</p>
                <p className="text-sm text-slate-900 dark:text-slate-100">{household.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ward</p>
                <p className="text-sm text-slate-900 dark:text-slate-100">Ward {household.ward}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">GPS Coordinates</p>
                <p className="text-sm text-slate-900 dark:text-slate-100 font-mono">{household.coordinates}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <FileText className="w-5 h-5 text-orange-500" />
                Survey Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900">
                View Full Survey Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
