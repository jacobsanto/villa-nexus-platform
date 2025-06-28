
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDamageReports } from "@/hooks/useDamageReports";
import DamageReportsList from "./DamageReportsList";
import CreateDamageReportModal from "./CreateDamageReportModal";

const DamageReportsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { reports, loading, createReport, updateReportStatus, deleteReport } = useDamageReports();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Damage Reports</h1>
          <p className="text-gray-600 mt-1">Track and manage property damage reports</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      <DamageReportsList
        reports={reports}
        loading={loading}
        onUpdateStatus={updateReportStatus}
        onDelete={deleteReport}
      />

      <CreateDamageReportModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createReport}
      />
    </div>
  );
};

export default DamageReportsPage;
