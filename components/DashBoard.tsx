import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Result {
  claim: string;
  status: "Verified" | "Questionable" | "Debunked";
  confidence: number;
  sources: string[];
}

interface DashboardProps {
  results: Result[];
}

export function Dashboard({ results }: DashboardProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Sources</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.claim}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    result.status === "Verified"
                      ? "success"
                      : result.status === "Questionable"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {result.status}
                </Badge>
              </TableCell>
              <TableCell>{result.confidence.toFixed(2)}%</TableCell>
              <TableCell>
                {result.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block"
                  >
                    Source {i + 1}
                  </a>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
