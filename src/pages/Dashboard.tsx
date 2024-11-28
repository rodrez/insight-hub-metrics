import { useState } from "react";
import DataManagement from "@/components/data/DataManagement";
import { TechDomainSettings } from "@/components/settings/TechDomainSettings";
import { DepartmentSettings } from "@/components/settings/DepartmentSettings";
import { AgreementWarningSettings } from "@/components/settings/AgreementWarningSettings";
import { StatusColorSettings } from "@/components/settings/StatusColorSettings";
import { SampleDataSettings } from "@/components/settings/SampleDataSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db"; // Make sure to import db

export default function Settings() {
  const handlePopulateSampleData = async () => {
    await db.populateSampleData({
      projects: 10,
      spis: 10,
      objectives: 5,
      sitreps: 10,
      fortune30: 30,
      internalPartners: 20,
      smePartners: 10
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <Tabs defaultValue="colors">
          <TabsList>
            <TabsTrigger value="colors">Status Colors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="tech-domains">Tech Domains</TabsTrigger>
            <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Colors & Warnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <StatusColorSettings />
                <AgreementWarningSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <DepartmentSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech-domains">
            <Card>
              <CardHeader>
                <CardTitle>Tech Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <TechDomainSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sample-data">
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SampleDataSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent>
                <DataManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
