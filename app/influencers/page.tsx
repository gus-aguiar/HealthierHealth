import { DashboardLayout } from "@/components/dashboard-layout";
import { InfluencersList } from "@/components/influencers-list";

export default function InfluencersPage() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-6 text-primary">Influencers List</h1>
      <InfluencersList />
    </DashboardLayout>
  );
}
