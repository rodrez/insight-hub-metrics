import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'submitted':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'pending-review':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'ready':
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
}