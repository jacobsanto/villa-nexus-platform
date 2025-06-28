
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, User, Home, DollarSign, Users } from "lucide-react";
import { Booking } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/contexts/TenantContext";

interface BookingDetailsPopoverProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated: () => void;
}

const BookingDetailsPopover = ({ booking, isOpen, onClose, onBookingUpdated }: BookingDetailsPopoverProps) => {
  const { toast } = useToast();
  const { tenant } = useTenant();

  if (!booking) return null;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
      
      onBookingUpdated();
      onClose();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Booking Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Guest Information */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">{booking.guest_name || 'Guest'}</p>
              <p className="text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {booking.number_of_guests} guest{booking.number_of_guests !== 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </div>

          {/* Property Information */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Home className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">{booking.property_name || 'Property'}</p>
              <p className="text-sm text-gray-600">Status: {booking.status}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-medium">{formatDate(booking.check_in_date)}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-medium">{formatDate(booking.check_out_date)}</p>
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Duration</p>
            <p className="font-semibold text-blue-800">{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</p>
          </div>

          {/* Revenue */}
          {booking.total_revenue && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Total Revenue</p>
                <p className="font-semibold text-green-800">${booking.total_revenue}</p>
              </div>
            </div>
          )}

          {/* Source */}
          <div className="text-center">
            <p className="text-xs text-gray-500">Source: {booking.source || 'Manual'}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement edit functionality
                  toast({
                    title: "Coming Soon",
                    description: "Edit functionality will be available soon",
                  });
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsPopover;
