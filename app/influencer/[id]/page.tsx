import { DashboardLayout } from "@/components/dashboard-layout";
import { InfluencerProfile } from "@/components/influencer-profile";
import { getInfluencer } from "@/lib/api";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function InfluencerPage({ params }: PageProps) {
  const influencer = await getInfluencer(params.id);

  if (!influencer) {
    return <div>Influencer not found</div>;
  }

  return (
    <DashboardLayout>
      <InfluencerProfile influencer={influencer} />
    </DashboardLayout>
  );
}
