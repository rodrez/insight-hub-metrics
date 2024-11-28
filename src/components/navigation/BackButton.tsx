import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
      className="absolute top-16 left-4"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}