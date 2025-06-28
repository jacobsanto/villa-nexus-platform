import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

interface Booking {
  id: string;
  property_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { tenant } = useTenant();

  const primaryColor = tenant?.brand_color_primary || '#4f46e5';
  const secondaryColor = tenant?.brand_color_secondary || '#7c3aed';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('tenant_id', tenant?.id);

      if (error) {
        throw error;
      }

      // Map database field names to interface field names
      const mappedBookings: Booking[] = data.map(booking => ({
        id: booking.id,
        property_id: booking.property_id,
        guest_name: booking.guest_name || '',
        check_in: booking.check_in_date,
        check_out: booking.check_out_date,
        number_of_guests: booking.number_of_guests || 1,
        status: booking.status as 'confirmed' | 'pending' | 'cancelled'
      }));

      setBookings(mappedBookings);
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

  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.guest_name} - ${booking.number_of_guests} guests`,
    start: booking.check_in,
    end: booking.check_out,
    allDay: false,
    extendedProps: booking,
  }));

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setOpen(true);
  };

  const upcomingBookings = bookings
    .filter((booking) => new Date(booking.check_in) >= new Date())
    .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Here's a list of your upcoming bookings.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Booking</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input id="username" value="@peduarte" className="col-span-3" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            height="auto"
            eventClick={handleEventClick}
            eventColor={primaryColor}
            eventBackgroundColor={primaryColor}
            eventBorderColor={primaryColor}
            eventTextColor="white"
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Click on a booking to view more details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1">
                <Label htmlFor="search">Guest Name</Label>
                <Input id="search" placeholder="Search guest..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Status</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="admin">Confirmed</SelectItem>
                    <SelectItem value="editor">Pending</SelectItem>
                    <SelectItem value="user">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Upcoming Bookings</h3>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {booking.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(booking.check_in), 'MMM d')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">{booking.guest_name}</h4>
                  <p className="text-gray-600 text-xs">
                    {format(parseISO(booking.check_in), 'MMM d, yyyy')} - {format(parseISO(booking.check_out), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Information about the selected booking.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="guestName" className="text-right">
                  Guest Name
                </Label>
                <Input id="guestName" value={selectedEvent.guest_name} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkIn" className="text-right">
                  Check-in Date
                </Label>
                <Input id="checkIn" value={format(parseISO(selectedEvent.check_in), 'MMM d, yyyy')} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOut" className="text-right">
                  Check-out Date
                </Label>
                <Input id="checkOut" value={format(parseISO(selectedEvent.check_out), 'MMM d, yyyy')} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numGuests" className="text-right">
                  Number of Guests
                </Label>
                <Input id="numGuests" value={selectedEvent.number_of_guests} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Input id="status" value={selectedEvent.status} className="col-span-3" readOnly />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsPage;
