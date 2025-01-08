import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InfluencersPage() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6 text-primary">Influencers List</h1> {/* Update: Changed title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Influencer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display detailed information about influencers and their claims.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

