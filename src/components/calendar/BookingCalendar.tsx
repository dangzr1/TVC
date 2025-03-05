import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: "wedding" | "engagement" | "portrait" | "event" | "meeting";
  clientName: string;
  notes?: string;
}

const BookingCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(() => {
    // Try to load events from localStorage
    const storedEvents = localStorage.getItem("calendarEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      // Convert string dates back to Date objects
      return parsedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }));
    }

    // Default events
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    const defaultEvents = [
      {
        id: "event1",
        title: "Thompson-Garcia Wedding",
        date: nextWeek,
        startTime: "14:00",
        endTime: "20:00",
        location: "Sunset Gardens, Miami",
        type: "wedding" as const,
        clientName: "Emma Thompson & Carlos Garcia",
        notes:
          "Full day coverage with second shooter. Bring extra lighting equipment.",
      },
      {
        id: "event2",
        title: "Wilson Family Portraits",
        date: tomorrow,
        startTime: "10:00",
        endTime: "12:00",
        location: "Riverside Park",
        type: "portrait" as const,
        clientName: "Wilson Family",
        notes: "Family of 5, including 3 children under 10. Outdoor session.",
      },
      {
        id: "event3",
        title: "Chen-Williams Engagement",
        date: twoWeeksLater,
        startTime: "17:30",
        endTime: "19:30",
        location: "Downtown Arts District",
        type: "engagement" as const,
        clientName: "Lily Chen & James Williams",
        notes: "Sunset shoot. Couple wants urban backdrop.",
      },
      {
        id: "event4",
        title: "Client Consultation",
        date: today,
        startTime: "13:00",
        endTime: "14:00",
        location: "Virtual (Zoom)",
        type: "meeting" as const,
        clientName: "New Potential Client",
        notes: "Initial consultation for wedding in December.",
      },
    ];

    // Save to localStorage
    localStorage.setItem("calendarEvents", JSON.stringify(defaultEvents));
    return defaultEvents;
  });

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    date: new Date(),
    type: "wedding",
  });
  const [activeView, setActiveView] = useState<"month" | "week" | "day">(
    "month",
  );

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  // Get events for selected week
  const getEventsForWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "wedding":
        return "bg-purple/10 text-purple border-purple/20";
      case "engagement":
        return "bg-pink/10 text-pink border-pink/20";
      case "portrait":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "event":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "meeting":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (
      !newEvent.title ||
      !newEvent.date ||
      !newEvent.startTime ||
      !newEvent.endTime ||
      !newEvent.clientName
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const event: Event = {
      id: `event-${Date.now()}`,
      title: newEvent.title!,
      date: newEvent.date!,
      startTime: newEvent.startTime!,
      endTime: newEvent.endTime!,
      location: newEvent.location || "TBD",
      type: (newEvent.type as any) || "event",
      clientName: newEvent.clientName!,
      notes: newEvent.notes,
    };

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));

    // Reset form and close dialog
    setNewEvent({
      date: new Date(),
      type: "wedding",
    });
    setIsAddEventOpen(false);

    // Create notification
    const newNotification = {
      id: `notif-${Date.now()}`,
      type: "system",
      title: "New Event Added",
      description: `${event.title} has been added to your calendar for ${formatDate(event.date)}`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: "/calendar",
    };

    window.dispatchEvent(
      new CustomEvent("new-notification", {
        detail: newNotification,
      }),
    );
  };

  // Generate week days for week view
  const generateWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Get week range string
  const getWeekRangeString = (date: Date) => {
    const days = generateWeekDays(date);
    const startDay = days[0];
    const endDay = days[6];

    const startMonth = startDay.toLocaleDateString("en-US", { month: "short" });
    const endMonth = endDay.toLocaleDateString("en-US", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay.getDate()} - ${endDay.getDate()}, ${endDay.getFullYear()}`;
    } else {
      return `${startMonth} ${startDay.getDate()} - ${endMonth} ${endDay.getDate()}, ${endDay.getFullYear()}`;
    }
  };

  // Handle date navigation
  const navigateDate = (direction: "prev" | "next") => {
    if (!date) return;

    const newDate = new Date(date);

    if (activeView === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (activeView === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }

    setDate(newDate);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Booking Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="h-6 border-l mx-2"></div>
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as any)}
          >
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="h-6 border-l mx-2"></div>
          <Button onClick={() => setIsAddEventOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView} className="w-full">
          <TabsContent value="month" className="mt-0">
            <div className="mb-4 text-xl font-medium">
              {date?.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
                modifiers={{
                  event: (day) => {
                    return events.some(
                      (event) =>
                        event.date.getDate() === day.getDate() &&
                        event.date.getMonth() === day.getMonth() &&
                        event.date.getFullYear() === day.getFullYear(),
                    );
                  },
                }}
                modifiersClassNames={{
                  event: "bg-purple/10 font-bold text-purple",
                }}
              />

              {date && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Events for {formatDate(date)}
                  </h3>
                  <div className="space-y-3">
                    {getEventsForDate(date).length === 0 ? (
                      <p className="text-gray-500">
                        No events scheduled for this day.
                      </p>
                    ) : (
                      getEventsForDate(date).map((event) => (
                        <div
                          key={event.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsViewEventOpen(true);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge
                              variant="outline"
                              className={getEventColor(event.type)}
                            >
                              {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {event.clientName}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="week" className="mt-0">
            <div className="mb-4 text-xl font-medium">
              {date && getWeekRangeString(date)}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {date &&
                generateWeekDays(date).map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div
                      className={`text-lg rounded-full w-8 h-8 mx-auto flex items-center justify-center ${day.toDateString() === new Date().toDateString() ? "bg-purple text-white" : ""}`}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-2">
              {date &&
                generateWeekDays(date).map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  return (
                    <div
                      key={index}
                      className="min-h-[150px] border rounded-lg p-2 overflow-y-auto"
                    >
                      {dayEvents.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400">
                          No events
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`p-2 rounded-md text-xs cursor-pointer ${getEventColor(event.type)}`}
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsViewEventOpen(true);
                              }}
                            >
                              <div className="font-medium truncate">
                                {event.title}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {event.startTime}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="day" className="mt-0">
            <div className="mb-4 text-xl font-medium">
              {date?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {date &&
                [
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                ].map((hour, index) => {
                  const hourEvents = getEventsForDate(date).filter((event) => {
                    const eventStartHour = event.startTime.split(":")[0];
                    return eventStartHour === hour.split(":")[0];
                  });

                  return (
                    <div key={index} className="flex border-t py-2">
                      <div className="w-20 text-right pr-4 text-gray-500">
                        {hour}
                      </div>
                      <div className="flex-1">
                        {hourEvents.length === 0 ? (
                          <div className="h-12 border border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm">
                            Available
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {hourEvents.map((event) => (
                              <div
                                key={event.id}
                                className={`p-3 rounded-md cursor-pointer ${getEventColor(event.type)}`}
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setIsViewEventOpen(true);
                                }}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="flex items-center justify-between mt-1 text-sm">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {event.startTime} - {event.endTime}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {event.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center mt-1 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => setNewEvent({ ...newEvent, date })}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                  className="flex-1"
                />
                <span className="flex items-center">to</span>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Event Type
              </Label>
              <Select
                value={newEvent.type}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, type: value as any })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Input
                id="client"
                value={newEvent.clientName || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, clientName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={newEvent.location || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newEvent.notes || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, notes: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      {selectedEvent && (
        <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={getEventColor(selectedEvent.type)}
                >
                  {selectedEvent.type.charAt(0).toUpperCase() +
                    selectedEvent.type.slice(1)}
                </Badge>
                <div className="text-sm text-gray-500">
                  {formatDate(selectedEvent.date)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedEvent.clientName}</span>
                </div>
              </div>

              {selectedEvent.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-gray-700">{selectedEvent.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewEventOpen(false)}
              >
                Close
              </Button>
              <Button variant="destructive">Delete Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default BookingCalendar;
