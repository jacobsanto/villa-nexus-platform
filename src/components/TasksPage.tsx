
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";

const TasksPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Team's Tasks</h1>
          <p className="text-gray-600 mt-2">
            Track maintenance requests, cleaning schedules, and team assignments.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Repair air conditioning - Ocean View Villa
                </CardTitle>
                <CardDescription>High priority maintenance request</CardDescription>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Assigned to: John Smith</p>
            <p className="text-sm text-gray-500">Due: Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                  Deep cleaning - Mountain Cabin
                </CardTitle>
                <CardDescription>Scheduled cleaning between guests</CardDescription>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Assigned to: Cleaning Team A</p>
            <p className="text-sm text-gray-500">Due: Tomorrow</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Property inspection - City Apartment
                </CardTitle>
                <CardDescription>Monthly safety inspection completed</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Completed by: Sarah Johnson</p>
            <p className="text-sm text-gray-500">Completed: Yesterday</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksPage;
