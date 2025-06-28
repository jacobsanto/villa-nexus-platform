
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Camera } from "lucide-react";
import { DamageReport } from "@/types/damageReports";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import DamageReportPhotosModal from "./DamageReportPhotosModal";

interface DamageReportsListProps {
  reports: DamageReport[];
  loading: boolean;
  onUpdateStatus: (reportId: string, status: DamageReport['status']) => void;
  onDelete: (reportId: string) => void;
}

const DamageReportsList = ({ reports, loading, onUpdateStatus, onDelete }: DamageReportsListProps) => {
  const { profile } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const isAdmin = profile?.role === 'admin';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800';
      case 'assessed': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading damage reports...</div>;
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No damage reports found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.property_name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Reported by {report.reporter_name} on{' '}
                    {new Date(report.reported_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Photos
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(report.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{report.description}</p>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={report.status}
                    onValueChange={(value) => onUpdateStatus(report.id, value as DamageReport['status'])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="assessed">Assessed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <DamageReportPhotosModal
        reportId={selectedReportId}
        open={!!selectedReportId}
        onOpenChange={() => setSelectedReportId(null)}
      />
    </>
  );
};

export default DamageReportsList;
