import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Trip } from "@shared/schema";
import {
  Calendar as CalendarIcon,
  Users,
  Phone,
  MessageSquare,
  MapPin,
  Mountain,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ trip, open, onOpenChange }: BookingModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const bookingFormSchema = z.object({
    bookingDate: z.date({
      required_error: t("booking.validation.dateRequired", "Please select a date for your trip"),
    }),
    groupSize: z.string().min(1, t("booking.validation.groupSizeRequired", "Please select group size")),
    participantNames: z.string().optional(),
    contactPhone: z.string().min(10, t("booking.validation.phoneInvalid", "Please enter a valid phone number")),
    specialRequests: z.string().optional(),
  });

  type BookingFormValues = z.infer<typeof bookingFormSchema>;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      groupSize: "1",
      participantNames: "",
      contactPhone: "",
      specialRequests: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      return apiRequest("POST", "/api/user/trips", {
        tripId: trip.id,
        bookingDate: data.bookingDate.toISOString(),
        groupSize: parseInt(data.groupSize),
        participantNames: data.participantNames,
        contactPhone: data.contactPhone,
        specialRequests: data.specialRequests,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/trips"] });
      toast({
        title: t("booking.toast.confirmedTitle", "Booking Confirmed!"),
        description: t("booking.toast.confirmedDescription", "Your trip to {{tripTitle}} has been booked successfully.", { tripTitle: trip.title }),
      });
      setStep(3);
    },
    onError: (error: Error) => {
      toast({
        title: t("booking.toast.failedTitle", "Booking Failed"),
        description: error.message || t("booking.toast.failedDescription", "Failed to book trip. Please try again."),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    bookingMutation.mutate(data);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    onOpenChange(false);
  };

  const maxGroupSize = trip.maxGroupSize || 10;
  const groupSizeOptions = Array.from({ length: maxGroupSize }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            {step === 3 ? t("booking.titleConfirmed", "Booking Confirmed!") : t("booking.titleBook", "Book Your Adventure")}
          </DialogTitle>
          <DialogDescription>
            {step === 3
              ? t("booking.descriptionConfirmed", "Your mountain adventure awaits!")
              : t("booking.descriptionBook", "Reserve your spot for {{tripTitle}}", { tripTitle: trip.title })}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{trip.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{t("booking.maxParticipants", "Max {{count}} participants", { count: maxGroupSize })}</span>
              </div>
              {trip.price && (
                <div className="text-lg font-semibold text-primary">
                  ${Number(trip.price).toFixed(0)} {t("booking.perPerson", "per person")}
                </div>
              )}
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full"
              data-testid="button-continue-booking"
            >
              {t("booking.continueToDetails", "Continue to Booking Details")}
            </Button>
          </div>
        )}

        {step === 2 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("booking.tripDate", "Trip Date")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-select-date"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("booking.selectDate", "Select a date")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.groupSize", "Group Size")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-group-size">
                          <SelectValue placeholder={t("booking.selectParticipants", "Select number of participants")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupSizeOptions.map((size) => (
                          <SelectItem
                            key={size}
                            value={size.toString()}
                            data-testid={`option-group-size-${size}`}
                          >
                            {size} {size === 1 ? t("booking.person", "person") : t("booking.people", "people")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("booking.maxPerBooking", "Maximum {{count}} participants per booking", { count: maxGroupSize })}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="participantNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.participantNames", "Participant Names (Optional)")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("booking.participantNamesPlaceholder", "Enter names of all participants, one per line")}
                        className="resize-none"
                        data-testid="input-participant-names"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.contactPhone", "Contact Phone")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="+994 XX XXX XX XX"
                          className="pl-10"
                          data-testid="input-contact-phone"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.specialRequests", "Special Requests (Optional)")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder={t("booking.specialRequestsPlaceholder", "Any dietary requirements, accessibility needs, or special requests...")}
                          className="pl-10 resize-none"
                          data-testid="input-special-requests"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {trip.price && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("booking.totalFor", "Total for {{count}} participant(s)", { count: parseInt(form.watch("groupSize") || "1") })}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      $
                      {(
                        Number(trip.price) *
                        parseInt(form.watch("groupSize") || "1")
                      ).toFixed(0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  {t("common.back", "Back")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={bookingMutation.isPending}
                  data-testid="button-confirm-booking"
                >
                  {bookingMutation.isPending ? t("booking.booking", "Booking...") : t("booking.confirmBooking", "Confirm Booking")}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {t("booking.adventureBooked", "Your adventure is booked!")}
              </h3>
              <p className="text-muted-foreground">
                {t("booking.confirmationSent", "We've sent a confirmation to your email with all the details.")}
              </p>
            </div>

            <div className="rounded-lg border p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mountain className="h-4 w-4 text-primary" />
                <span className="font-medium">{trip.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {form.getValues("bookingDate")
                    ? format(form.getValues("bookingDate"), "PPP")
                    : t("booking.dateSelected", "Date selected")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {form.getValues("groupSize")}{" "}
                  {parseInt(form.getValues("groupSize")) === 1
                    ? t("booking.participant", "participant")
                    : t("booking.participants", "participants")}
                </span>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full" data-testid="button-close-booking">
              {t("common.close", "Close")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
