import { z } from "zod";

export const childEventSchema = z.object({
  name: z.string().trim().min(1, "Child event name is required."),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  maxSeats: z.coerce.number().int().min(1).max(50_000).optional(),
});

export const eventAddressSchema = z.object({
  street: z.string().trim().optional(),
  houseNumber: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().optional(),
  country: z.string().trim().min(1, "Country is required."),
  additionalInfo: z.string().trim().optional(),
});

export const createSettingsSchema = z.object({
  allowReEntry: z.boolean(),
  rotateSeconds: z.coerce.number().int().min(30).max(3600),
  maxSeats: z.coerce.number().int().min(1).max(50_000),
  allowPublicRsvp: z.boolean(),
  allowPublicPlusOne: z.boolean(),
  allowPublicRsvpWebsite: z.boolean(),
  invitedByOptions: z.array(z.string().trim().min(1)).default([]),
  publicRsvpWebsite: z
    .string()
    .trim()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  coverImageUrl: z.string().trim().url("Please enter a valid URL.").optional().or(z.literal("")),
  logoUrl: z.string().trim().url("Please enter a valid URL.").optional().or(z.literal("")),
  dressCode: z.string().trim().optional(),
  description: z.string().trim().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const createEventWizardSchema = z
  .object({
    parentId: z.string().trim().optional(),
    name: z.string().trim().min(1, "Event name is required."),
    address: eventAddressSchema.optional(),
    settings: createSettingsSchema,
    children: z.array(childEventSchema).default([]),
    addressSearch: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.settings.allowPublicRsvpWebsite &&
      (!value.settings.publicRsvpWebsite || value.settings.publicRsvpWebsite.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["settings", "publicRsvpWebsite"],
        message: "Public RSVP website is required when public RSVP website is enabled.",
      });
    }

    if (
      value.settings.startsAt &&
      value.settings.endsAt &&
      new Date(value.settings.startsAt).getTime() > new Date(value.settings.endsAt).getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["settings", "endsAt"],
        message: "End date must be after start date.",
      });
    }
  });

export type ChildEventFormValue = z.infer<typeof childEventSchema>;
export type EventAddressFormValue = z.infer<typeof eventAddressSchema>;
export type CreateSettingsFormValue = z.infer<typeof createSettingsSchema>;
export type CreateEventWizardFormValue = z.infer<typeof createEventWizardSchema>;
