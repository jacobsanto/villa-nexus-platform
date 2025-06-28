
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, List, Clock } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddBookingModal from "./AddBookingModal";
import BookingDetailsPopover from "./BookingDetailsPopover";

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'listWeek';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<CalendarView>('dayGridMonth');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsPopover, setShowDetailsPopover] = useState(false);
  const { tenant } = useTenant();
  const { toast } = useToast();

  const fetchBookings = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(name)
        `)
        .eq('tenant_id', tenant.id);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [tenant?.id]);

  const calendarEvents = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.guest_name || 'Guest'} - ${booking.property_name || 'Property'}`,
    start: booking.check_in_date,
    end: booking.check_out_date,
    backgroundColor: tenant?.primary_color || '#0ea5e9',
    borderColor: tenant?.primary_color || '#0ea5e9',
    extendedProps: {
      booking
    }
  }));

  const handleDateClick = (dateInfo: any) => {
    setSelectedDate(dateInfo.dateStr);
    setShowAddModal(true);
  };

  const handleEventClick = (eventInfo: any) => {
    setSelectedBooking(eventInfo.event.extendedProps.booking);
    setShowDetailsPopover(true);
  };

  const handleBookingSuccess = () => {
    fetchBookings();
    setShowAddModal(false);
    setSelectedDate(null);
  };

  const viewButtons = [
    { id: 'dayGridMonth', label: 'Month', icon: Calendar },
    { id: 'timeGridWeek', label: 'Week', icon: Clock },
    { id: 'listWeek', label: 'List', icon: List },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Calendar</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* View Controls */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {viewButtons.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as CalendarView)}
                className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentView === id
                    ? 'text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={currentView === id ? { backgroundColor: tenant?.primary_color || '#0ea5e9' } : {}}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          
          {/* Add Booking Button */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
            style={{ backgroundColor: tenant?.primary_color || '#0ea5e9' }}
          >
            <Plus className="w-4 h-4" />
            Add Booking
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventDisplay="block"
          displayEventTime={false}
          aspectRatio={1.8}
          responsive={true}
          eventMouseEnter={(info) => {
            info.el.style.cursor = 'pointer';
          }}
        />
      </div>

      {/* Add Booking Modal */}
      <AddBookingModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedDate(null);
        }}
        onSuccess={handleBookingSuccess}
        initialDate={selectedDate}
      />

      {/* Booking Details Popover */}
      <BookingDetailsPopover
        booking={selectedBooking}
        isOpen={showDetailsPopover}
        onClose={() => {
          setShowDetailsPopover(false);
          setSelectedBooking(null);
        }}
        onBookingUpdated={fetchBookings}
      />
    </div>
  );
};

export default BookingsPage;
