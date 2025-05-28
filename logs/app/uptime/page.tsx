"use client"

import { Suspense, useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ShieldIcon, LogOutIcon, LayoutGrid } from "lucide-react"
import { StatusUpdateForm } from "./status-update-form"
import AddUrlForm from "./add-url-form"
import UrlList from "./url-list"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Uptime Monitor</h1>
              <LayoutGrid className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Monitor your website's uptime and health status in real-time.</p>
          </div>
        </div>


        {/* Dashboard with draggable grid */}
        <Card>
          <CardHeader>
            <CardTitle>Health Status</CardTitle>
            <CardDescription>
              Monitor your website's uptime in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <UrlList  />
            </Suspense>
          </CardContent>
        </Card>

        {/* Only show management section if authenticated */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New URL</CardTitle>
                <CardDescription>Add a new URL to monitor its health status.</CardDescription>
              </CardHeader>
              <CardContent>
                <AddUrlForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Updates</CardTitle>
                <CardDescription>Add feature updates or downtime notifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusUpdateForm />
              </CardContent>
            </Card>
          </div>
      </div>
    </main>
  )
}
