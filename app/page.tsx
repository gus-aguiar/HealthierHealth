import { DashboardLayout } from "@/components/dashboard-layout";
import { Leaderboard } from "@/components/leaderboard";
import { VerificationPanel } from "@/components/VerificationPanel";

export default function Home() {
  return (
    <DashboardLayout>
      <Leaderboard />
    </DashboardLayout>
  );
}
