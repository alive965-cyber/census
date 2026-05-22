"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, MapPin, Users, FileText } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { HouseCensusForm } from "@/components/forms/house-census-form";
import { useHouses } from "@/hooks/use-houses";

export default function HouseholdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchHouse = async () => {
      setLoading(true);
      const { data } = await supabase.from("houses").select("*").eq("id", id).single();
      setHouse(data);
      setLoading(false);
    };
    fetchHouse();
  }, [id, supabase, isEditing]);

  if (loading) {
    return <div className="p-12 text-center animate-pulse text-slate-500">Loading details...</div>;
  }

  if (!house) {
    return <div className="p-12 text-center text-red-500">Household not found.</div>;
  }

  const statusLabel = house.survey_status === 'COMPLETED' ? 'Completed' : house.survey_status === 'IN_PROGRESS' ? 'In Progress' : 'Pending';

  if (isEditing) {
    // Convert snake_case DB row to camelCase Form Values
    const initialValues = {
      houseNumber: house.house_number,
      headOfFamily: house.head_of_family,
      mobile: house.contact_number,
      address: house.address,
      totalPopulation: house.total_population,
      male: house.male,
      female: house.female,
      children: house.children,
      seniorCitizens: house.senior_citizens,
      notes: house.notes,
      surveyStatus: house.survey_status,
      latitude: house.latitude || house.location?.lat,
      longitude: house.longitude || house.location?.lng,
    };

    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setIsEditing(false)} className="h-10 border border-slate-200 dark:border-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Details
          </Button>
          <h1 className="text-2xl font-bold">Edit Household {house.house_number}</h1>
        </div>
        <HouseCensusForm 
          initialValues={initialValues} 
          latitude={initialValues.latitude || 0}
          longitude={initialValues.longitude || 0}
          houseId={house.id}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

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
              Household {house.house_number}
            </h1>
            <Badge className={
              statusLabel === 'Completed' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 
              statusLabel === 'In Progress' ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }>
              {statusLabel}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Created on {new Date(house.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)} className="border-slate-200 dark:border-slate-800">
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
            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Head of Family</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{house.head_of_family}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Population</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{house.total_population} Persons</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Male</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{house.male}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Female</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{house.female}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Children</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{house.children}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Seniors</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{house.senior_citizens}</p>
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
                <p className="text-sm text-slate-900 dark:text-slate-100">{house.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Contact Number</p>
                <p className="text-sm text-slate-900 dark:text-slate-100">{house.contact_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">GPS Coordinates</p>
                <p className="text-sm text-slate-900 dark:text-slate-100 font-mono text-xs">
                  {house.latitude}, {house.longitude}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
