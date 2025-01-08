import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResearchConfigPage() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6 text-primary">Research Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Research Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will allow configuration of research parameters.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

