
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { DamageReport } from "@/types/damageReports";

interface DamageReportCardProps {
  report: DamageReport;
}

const DamageReportCard = ({ report }: DamageReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800 border-red-200';
      case 'assessed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFirstLine = (description: string) => {
    return description.split('\n')[0].substring(0, 100) + (description.length > 100 ? '...' : '');
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header with property name and status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <h3 className="font-semibold text-gray-900 truncate">
                {report.property_name || 'Unknown Property'}
              </h3>
            </div>
            <Badge className={getStatusColor(report.status)} variant="outline">
              {report.status}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {getFirstLine(report.description)}
          </p>

          {/* Footer with date and reporter */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(report.reported_at)}</span>
            </div>
            <span>by {report.reporter_name || 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DamageReportCard;
