import { DashboardLayout } from "@/components/dashboard-layout";
import { ResearchConfig } from "@/components/research-config";
import { ClaimVerifier } from "@/components/claim-verifier";

export default function ResearchPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-primary hover:text-primary/90 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Dashboard
          </a>
        </div>
        <h1 className="text-4xl font-bold">Research Tasks</h1>
        <ResearchConfig />
      </div>
    </DashboardLayout>
  );
}
