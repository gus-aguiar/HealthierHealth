import { DashboardLayout } from "@/components/dashboard-layout";
import { Leaderboard } from "@/components/leaderboard";

export default function Home() {
  return (
    <DashboardLayout>
      <Leaderboard className="py-6" />
    </DashboardLayout>
  );
}
