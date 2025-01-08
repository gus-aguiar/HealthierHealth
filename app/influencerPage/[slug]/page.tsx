import { DashboardLayout } from "@/components/dashboard-layout";
import { InfluencerProfile } from "@/components/influencer-profile";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function InfluencerPage({ params }: PageProps) {
  return (
    <DashboardLayout>
      <InfluencerProfile slug={params.slug} />
    </DashboardLayout>
  );
}
