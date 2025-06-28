
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDamageReports } from "@/hooks/useDamageReports";
import DamageReportCard from "./DamageReportCard";
import AddDamageReportModal from "./AddDamageReportModal";

const DamageReportsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { reports, loading, createReport } = useDamageReports();

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading damage reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Damage Reports</h1>
          <p className="text-gray-600 mt-1">Track and manage property damage reports</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Report New Damage
        </Button>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No damage reports found</div>
          <Button onClick={() => setShowAddModal(true)} variant="outline">
            Create your first report
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <DamageReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {/* Add Report Modal */}
      <AddDamageReportModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={createReport}
      />
    </div>
  );
};

export default DamageReportsPage;
