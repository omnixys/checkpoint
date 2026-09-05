export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** JSON custom scalar type */
  JSON: { input: unknown; output: unknown; }
};

/** Optional contact information submitted when a guest RSVPs YES. This data is stored in the invitation or forwarded to the ephemeral contact store. */
export type AcceptRsvpInput = {
  /** Email address of the guest. Optional. */
  email: InputMaybe<Scalars['String']['input']>;
  /** First name of the guest submitting the RSVP. */
  firstName: Scalars['String']['input'];
  /** Optional note from guest. */
  guestNote: InputMaybe<Scalars['String']['input']>;
  /** Last name of the guest submitting the RSVP. */
  lastName: Scalars['String']['input'];
  /** Required list of phone numbers for contact. */
  phoneNumbers: Array<PhoneNumberInput>;
  /** Optional list of additional guests (plus-ones) */
  plusOnes: InputMaybe<Array<PublicPlusOneInput>>;
  /** Configured inviter/source options selected by the guest */
  selectedInvitedBy: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ActivateDeviceInput = {
  deviceId: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  ticketId: Scalars['String']['input'];
};

export type AddContactInput = {
  Contact: ContactInput;
  userId: Scalars['ID']['input'];
};

export type AddSecurityQuestionInput = {
  answer: Scalars['String']['input'];
  questionId: Scalars['ID']['input'];
};

export type AddressAutocompletePayload = {
  __typename: 'AddressAutocompletePayload';
  city: Maybe<Scalars['String']['output']>;
  confidence: Maybe<Scalars['Float']['output']>;
  country: Maybe<Scalars['String']['output']>;
  formatted: Maybe<Scalars['String']['output']>;
  houseNumber: Maybe<Scalars['String']['output']>;
  lat: Maybe<Scalars['Float']['output']>;
  lon: Maybe<Scalars['Float']['output']>;
  postalCode: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  street: Maybe<Scalars['String']['output']>;
};

export enum AddressType {
  BILLING = 'BILLING',
  HOME = 'HOME',
  SHIPPING = 'SHIPPING',
  WORK = 'WORK'
}

export type AddressValidationInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  houseNumber: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type AddressValidationPayload = {
  __typename: 'AddressValidationPayload';
  confidence: Maybe<Scalars['Float']['output']>;
  formatted: Maybe<Scalars['String']['output']>;
  lat: Maybe<Scalars['Float']['output']>;
  lon: Maybe<Scalars['Float']['output']>;
  reason: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
};

export type AdminSignUpInput = {
  email: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: InputMaybe<Scalars['String']['input']>;
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  username: InputMaybe<Scalars['String']['input']>;
};

export type AnalyticsChartPointPayload = {
  __typename: 'AnalyticsChartPointPayload';
  time: Scalars['DateTime']['output'];
  value: Scalars['Float']['output'];
};

export type AnalyticsPlatformInfo = {
  __typename: 'AnalyticsPlatformInfo';
  apiVersion: Scalars['String']['output'];
  name: Scalars['String']['output'];
  processingVersion: Scalars['String']['output'];
};

export type AnalyticsRulePayload = {
  __typename: 'AnalyticsRulePayload';
  activeVersion: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lifecycle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  versions: Array<Scalars['Int']['output']>;
};

export type AnalyticsSchedulePayload = {
  __typename: 'AnalyticsSchedulePayload';
  active: Scalars['Boolean']['output'];
  concurrencyPolicy: Scalars['String']['output'];
  cron: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastRunAt: Maybe<Scalars['DateTime']['output']>;
  misfirePolicy: Scalars['String']['output'];
  nextRunAt: Scalars['DateTime']['output'];
  targetId: Scalars['ID']['output'];
  targetType: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
};

export type AnalyticsSecurityChartsPayload = {
  __typename: 'AnalyticsSecurityChartsPayload';
  scans: Array<AnalyticsChartPointPayload>;
  warnings: Array<AnalyticsChartPointPayload>;
};

export type ApproveInvitationDataInput = {
  /** ID of the invitation to approve/unapprove (cuid). */
  invitationId: Scalars['ID']['input'];
  /** ID of the seat to assign when approving the invitation. */
  seatId: InputMaybe<Scalars['ID']['input']>;
};

/** Input used by admins to approve or unapprove an invitation. All other fields are system-managed. */
export type ApproveInvitationInput = {
  /** Admin approval flag (true = approved, false = unapproved). Requires admin permissions. */
  approved: Scalars['Boolean']['input'];
  eventId: InputMaybe<Scalars['ID']['input']>;
  /** ID of the invitation to approve/unapprove (cuid). */
  invitationId: Scalars['ID']['input'];
  /** ID of the seat to assign when approving the invitation. */
  seatId: InputMaybe<Scalars['ID']['input']>;
};

export type ArchiveEventRoleInput = {
  eventId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
};

export type AssignEventRoleInput = {
  eventId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type AssignSeatInput = {
  guestId: InputMaybe<Scalars['ID']['input']>;
  invitationId: InputMaybe<Scalars['String']['input']>;
  note: InputMaybe<Scalars['String']['input']>;
  seatId: Scalars['ID']['input'];
};

export type AssignUserRoleInput = {
  eventId: Scalars['String']['input'];
  eventRole: UserRoleType;
  userId: Scalars['String']['input'];
};

export type AutoGenerateLayoutInput = {
  adaptiveRadius: Scalars['Boolean']['input'];
  eventId: Scalars['ID']['input'];
  sections: Array<SectionInput>;
};

export type AutoGenerateSeatMapInput = {
  eventId: Scalars['ID']['input'];
  seatCount: Scalars['Int']['input'];
  sectionLayout: SectionShape;
  sectionName: Scalars['String']['input'];
  spacing: InputMaybe<Scalars['Float']['input']>;
  tableCount: Scalars['Int']['input'];
  tableShape: TableShape;
};

export type BulkApproveInvitationInput = {
  /** Approval flag applied to all invitations. */
  approved: Scalars['Boolean']['input'];
  /** List of invitation IDs to approve/unapprove. */
  invitationIds: Array<ApproveInvitationDataInput>;
};

export type BulkRenamePayload = {
  __typename: 'BulkRenamePayload';
  affectedSeats: Scalars['Float']['output'];
  affectedSections: Maybe<Scalars['Float']['output']>;
  affectedTables: Maybe<Scalars['Float']['output']>;
  conflicts: Array<RenameConflict>;
  success: Scalars['Boolean']['output'];
};

export type BulkStageInvitationInput = {
  /** Invitations to stage or return to their RSVP-derived status. */
  invitationIds: Array<StageInvitationDataInput>;
  /** True stages approval without creating a guest or ticket. */
  staged: Scalars['Boolean']['input'];
};

export type CallingCode = {
  __typename: 'CallingCode';
  code: Scalars['String']['output'];
  countries: Array<Country>;
  id: Scalars['ID']['output'];
};

export type CatalogSearchItemPayload = {
  __typename: 'CatalogSearchItemPayload';
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lifecycle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
};

export type ChangeMyPasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export enum Channel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  WHATSAPP = 'WHATSAPP'
}

export enum ChannelType {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP'
}

/**
 * =====================================================
 * CITY
 * =====================================================
 */
export type City = {
  __typename: 'City';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  level: Maybe<Scalars['Int']['output']>;
  location: Maybe<GeoPoint>;
  name: Scalars['String']['output'];
  parent: Maybe<City>;
  population: Maybe<Scalars['Int']['output']>;
  postalCodes: Maybe<Array<PostalCode>>;
  state: State;
  timezone: Maybe<Timezone>;
  type: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type CityFilterInput = {
  maxPopulation: InputMaybe<Scalars['Int']['input']>;
  minPopulation: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  stateId: InputMaybe<Scalars['ID']['input']>;
  type: InputMaybe<Scalars['String']['input']>;
};

export type CloneSectionInput = {
  offsetX: Scalars['Int']['input'];
  offsetY: Scalars['Int']['input'];
  sectionId: Scalars['String']['input'];
};

export type CompleteResetInputGql = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type ContactInput = {
  contactId: Scalars['String']['input'];
  emergency: InputMaybe<Scalars['Boolean']['input']>;
  endDate: InputMaybe<Scalars['DateTime']['input']>;
  relationship: RelationshipType;
  startDate: InputMaybe<Scalars['DateTime']['input']>;
  withdrawalLimit: InputMaybe<Scalars['Int']['input']>;
};

export enum ContactOptionsType {
  EMAIL = 'EMAIL',
  LETTER = 'LETTER',
  PHONE = 'PHONE',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP'
}

export type ContactPayload = {
  __typename: 'ContactPayload';
  contactId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  emergency: Scalars['Boolean']['output'];
  endDate: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  relationship: RelationshipType;
  startDate: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
  withdrawalLimit: Scalars['Float']['output'];
};

export enum ContentFormat {
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN',
  TEXT = 'TEXT'
}

export type Continent = {
  __typename: 'Continent';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subregion: Array<Subregion>;
};

export type Conversation = {
  __typename: 'Conversation';
  channel: ChannelType;
  externalAddress: Maybe<Scalars['String']['output']>;
  externalDisplayName: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastMessage: Maybe<Scalars['String']['output']>;
  lastMessageAt: Maybe<Scalars['DateTime']['output']>;
  participants: Array<Participant>;
  type: ConversationType;
  unreadCount: Scalars['Int']['output'];
};

export enum ConversationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WEBCHAT = 'WEBCHAT',
  WHATSAPP = 'WHATSAPP'
}

export enum ConversationPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  URGENT = 'URGENT'
}

export enum ConversationStatus {
  ASSIGNED = 'ASSIGNED',
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

export enum ConversationType {
  CHANNEL = 'CHANNEL',
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  SUPPORT = 'SUPPORT'
}

/**
 * =====================================================
 * COUNTRY
 * =====================================================
 */
export type Country = {
  __typename: 'Country';
  areaSqKm: Maybe<Scalars['Float']['output']>;
  callingCode: Maybe<CallingCode>;
  continent: Continent;
  currency: Maybe<Currency>;
  flagPng: Maybe<Scalars['String']['output']>;
  flagSvg: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  iso3: Scalars['String']['output'];
  languages: Array<Language>;
  latitude: Maybe<Scalars['Float']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  nationality: Maybe<Scalars['String']['output']>;
  numericCode: Maybe<Scalars['String']['output']>;
  population: Maybe<Scalars['Int']['output']>;
  subregion: Subregion;
  timezones: Array<Timezone>;
  tld: Maybe<Scalars['String']['output']>;
};

/**
 * =====================================================
 * FILTER INPUT
 * =====================================================
 */
export type CountryFilterInput = {
  callingCode: InputMaybe<Scalars['String']['input']>;
  continent: InputMaybe<Scalars['String']['input']>;
  currencyCode: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  subregion: InputMaybe<Scalars['String']['input']>;
};

export type CreateAnalyticsScheduleInput = {
  concurrencyPolicy: InputMaybe<Scalars['String']['input']>;
  cron: Scalars['String']['input'];
  endAt: InputMaybe<Scalars['DateTime']['input']>;
  maxRetries: InputMaybe<Scalars['Int']['input']>;
  misfirePolicy: InputMaybe<Scalars['String']['input']>;
  retryBaseSeconds: InputMaybe<Scalars['Int']['input']>;
  startAt: InputMaybe<Scalars['DateTime']['input']>;
  targetId: Scalars['ID']['input'];
  targetType: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type CreateEventAddressInput = {
  additionalInfo: InputMaybe<Scalars['String']['input']>;
  cityId: InputMaybe<Scalars['ID']['input']>;
  countryId: InputMaybe<Scalars['ID']['input']>;
  eventId: Scalars['ID']['input'];
  houseNumberId: Scalars['ID']['input'];
  postalCodeId: InputMaybe<Scalars['ID']['input']>;
  stateId: InputMaybe<Scalars['ID']['input']>;
  streetId: Scalars['ID']['input'];
};

export type CreateEventInput = {
  address: InputMaybe<EventAddressInput>;
  children: InputMaybe<Array<CreateEventInput>>;
  name: Scalars['String']['input'];
  parentId: InputMaybe<Scalars['ID']['input']>;
  settings: CreateSettingsInput;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateEventRoleInput = {
  color: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  icon: InputMaybe<Scalars['String']['input']>;
  key: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateMediaDto = {
  eventId: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  key: Scalars['String']['input'];
  mimetype: Scalars['String']['input'];
  size: Scalars['Float']['input'];
  type: MediaType;
  url: Scalars['String']['input'];
};

export type CreateNotificationInput = {
  channel: Channel;
  dedupeKey: InputMaybe<Scalars['String']['input']>;
  expiresAt: InputMaybe<Scalars['DateTime']['input']>;
  locale: InputMaybe<Scalars['String']['input']>;
  metadata: InputMaybe<Scalars['JSON']['input']>;
  priority: InputMaybe<Priority>;
  recipientAddress: InputMaybe<Scalars['String']['input']>;
  recipientId: InputMaybe<Scalars['String']['input']>;
  recipientUsername: Scalars['String']['input'];
  sensitive: InputMaybe<Scalars['Boolean']['input']>;
  templateId: InputMaybe<Scalars['String']['input']>;
  tenantId: InputMaybe<Scalars['String']['input']>;
  variables: InputMaybe<Scalars['JSON']['input']>;
};

export type CreatePlusOneInput = {
  email: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  invitedByInvitationId: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  plusOneAgeCategory: PlusOneAgeCategory;
};

export type CreateSeatInput = {
  eventId: Scalars['ID']['input'];
  label: InputMaybe<Scalars['String']['input']>;
  meta: InputMaybe<Scalars['JSON']['input']>;
  note: InputMaybe<Scalars['String']['input']>;
  number: InputMaybe<Scalars['Int']['input']>;
  rotation: InputMaybe<Scalars['Float']['input']>;
  seatType: InputMaybe<SeatType>;
  sectionId: Scalars['ID']['input'];
  tableId: InputMaybe<Scalars['ID']['input']>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type CreateSectionInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  eventId: Scalars['ID']['input'];
  height: InputMaybe<Scalars['Float']['input']>;
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  order: InputMaybe<Scalars['Int']['input']>;
  width: InputMaybe<Scalars['Float']['input']>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type CreateSettingsInput = {
  allowGuestSeatSelection: Scalars['Boolean']['input'];
  allowPlusOneUpdate: Scalars['Boolean']['input'];
  allowPublicPlusOne: Scalars['Boolean']['input'];
  allowPublicRsvp: Scalars['Boolean']['input'];
  allowPublicRsvpWebsite: Scalars['Boolean']['input'];
  allowReEntry: Scalars['Boolean']['input'];
  allowSeatOverbooking: Scalars['Boolean']['input'];
  approvalMode: InvitationApprovalMode;
  category: EventCategory;
  description: InputMaybe<Scalars['String']['input']>;
  dressCode: InputMaybe<Scalars['String']['input']>;
  endsAt: InputMaybe<Scalars['DateTime']['input']>;
  guestConfirmationMaxResends: InputMaybe<Scalars['Int']['input']>;
  guestConfirmationReminderEnabled: InputMaybe<Scalars['Boolean']['input']>;
  guestConfirmationReminderPresets: InputMaybe<Array<GuestReminderPreset>>;
  invitedByOptions: Array<Scalars['String']['input']>;
  isActive: Scalars['Boolean']['input'];
  isPublic: Scalars['Boolean']['input'];
  maxPlusOnes: Scalars['Int']['input'];
  maxSeats: Scalars['Int']['input'];
  publicRsvpWebsite: InputMaybe<Scalars['String']['input']>;
  requireApprovalForPlusOnes: Scalars['Boolean']['input'];
  rotateSeconds: Scalars['Int']['input'];
  rsvpDeadline: InputMaybe<Scalars['DateTime']['input']>;
  scheduleTicketRelease: Scalars['Boolean']['input'];
  seatColorGroups: InputMaybe<Array<SeatColorGroupInput>>;
  startsAt: InputMaybe<Scalars['DateTime']['input']>;
  ticketReleaseAt: InputMaybe<Scalars['DateTime']['input']>;
  visibleTabs: Array<EventVisibleTab>;
};

export type CreateTableInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  eventId: Scalars['ID']['input'];
  height: InputMaybe<Scalars['Float']['input']>;
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  order: InputMaybe<Scalars['Int']['input']>;
  rotation: InputMaybe<Scalars['Float']['input']>;
  sectionId: Scalars['String']['input'];
  shape: InputMaybe<TableShape>;
  width: InputMaybe<Scalars['Float']['input']>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type CreateTemplateInput = {
  body: Scalars['String']['input'];
  channel: Channel;
  format: ContentFormat;
  key: Scalars['String']['input'];
  locale: Scalars['String']['input'];
  subject: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
  tenantId: InputMaybe<Scalars['String']['input']>;
  variables: Array<Scalars['String']['input']>;
};

export type CreateTenantInput = {
  createdBy: Scalars['String']['input'];
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};

export type CreateTimelineInput = {
  label: Scalars['String']['input'];
  timestamp: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateUserAddressInput = {
  additionalInfo: InputMaybe<Scalars['String']['input']>;
  addressType: AddressType;
  cityId: InputMaybe<Scalars['ID']['input']>;
  countryId: InputMaybe<Scalars['ID']['input']>;
  houseNumberId: InputMaybe<Scalars['ID']['input']>;
  postalCodeId: InputMaybe<Scalars['ID']['input']>;
  stateId: InputMaybe<Scalars['ID']['input']>;
  streetId: InputMaybe<Scalars['ID']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  acceptedTerms: Scalars['Boolean']['input'];
  acceptedTermsAt: Scalars['DateTime']['input'];
  addresses: InputMaybe<Array<UserAddressInput>>;
  contacts: InputMaybe<Array<ContactInput>>;
  customer: InputMaybe<CustomerInput>;
  employee: InputMaybe<EmployeeInput>;
  password: Scalars['String']['input'];
  personalInfo: PersonalInfoInput;
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  securityQuestions: InputMaybe<Array<AddSecurityQuestionInput>>;
  userType: UserType;
  username: Scalars['String']['input'];
};

export type Currency = {
  __typename: 'Currency';
  code: Scalars['String']['output'];
  countries: Array<Country>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type CustomerInput = {
  contactOptions: Array<ContactOptionsType>;
  interestIds: InputMaybe<Array<Scalars['ID']['input']>>;
  state: InputMaybe<StatusType>;
  subscribed: Scalars['Boolean']['input'];
};

export type CustomerInterestPayload = {
  __typename: 'CustomerInterestPayload';
  createdAt: Scalars['DateTime']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  interest: Maybe<InterestPayload>;
  interestId: Scalars['ID']['output'];
  isPrimary: Maybe<Scalars['Boolean']['output']>;
  level: Maybe<Scalars['Int']['output']>;
};

export type CustomerPayload = {
  __typename: 'CustomerPayload';
  contactOptions: Array<ContactOptionsType>;
  createdAt: Scalars['DateTime']['output'];
  customerInterest: Maybe<Array<CustomerInterestPayload>>;
  id: Scalars['ID']['output'];
  state: StatusType;
  subscribed: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DeleteEventRoleInput = {
  eventId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
};

export type DeleteTenantInput = {
  id: Scalars['String']['input'];
  updatedBy: Scalars['String']['input'];
};

export enum DeliveryStatus {
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  READ = 'READ',
  SENT = 'SENT',
  UNKNOWN = 'UNKNOWN'
}

export type DuplicateTableInput = {
  offsetX: Scalars['Float']['input'];
  offsetY: Scalars['Float']['input'];
  tableId: Scalars['ID']['input'];
};

export type EmployeeInput = {
  department: InputMaybe<Scalars['String']['input']>;
  hireDate: InputMaybe<Scalars['DateTime']['input']>;
  isExternal: Scalars['Boolean']['input'];
  position: InputMaybe<Scalars['String']['input']>;
  role: InputMaybe<Scalars['String']['input']>;
  salary: InputMaybe<Scalars['Float']['input']>;
};

export type EmployeePayload = {
  __typename: 'EmployeePayload';
  createdAt: Scalars['DateTime']['output'];
  department: Maybe<Scalars['String']['output']>;
  hireDate: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isExternal: Scalars['Boolean']['output'];
  position: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['String']['output']>;
  salary: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type EventAccessPayload = {
  __typename: 'EventAccessPayload';
  eventId: Scalars['ID']['output'];
  permissions: Array<Scalars['String']['output']>;
  roles: Array<EventRoleDefinitionPayload>;
  userId: Scalars['ID']['output'];
};

export type EventAddress = {
  __typename: 'EventAddress';
  additionalInfo: Maybe<Scalars['String']['output']>;
  cityId: Scalars['ID']['output'];
  countryId: Scalars['ID']['output'];
  eventId: Scalars['ID']['output'];
  houseNumberId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  postalCodeId: Scalars['ID']['output'];
  stateId: Scalars['ID']['output'];
  streetId: Scalars['ID']['output'];
};

export type EventAddressInput = {
  additionalInfo: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  houseNumber: InputMaybe<Scalars['String']['input']>;
  postalCode: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  street: InputMaybe<Scalars['String']['input']>;
};

export type EventAddressPayload = {
  __typename: 'EventAddressPayload';
  additionalInfo: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  eventId: Scalars['ID']['output'];
  houseNumber: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lat: Maybe<Scalars['Float']['output']>;
  lon: Maybe<Scalars['Float']['output']>;
  postalCode: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  street: Maybe<Scalars['String']['output']>;
};

export type EventCatalogEntry = {
  __typename: 'EventCatalogEntry';
  id: Scalars['ID']['output'];
  lifecycle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
};

export enum EventCategory {
  GENERAL = 'GENERAL',
  KONFERENZ = 'KONFERENZ',
  MUSIK = 'MUSIK',
  SOCIAL = 'SOCIAL',
  SPORTS = 'SPORTS',
  WORKSHOP = 'WORKSHOP'
}

export type EventConversationsUpdate = {
  __typename: 'EventConversationsUpdate';
  assignedTo: Maybe<Scalars['String']['output']>;
  channel: Maybe<Scalars['String']['output']>;
  conversationId: Scalars['ID']['output'];
  eventId: Scalars['ID']['output'];
  guestName: Maybe<Scalars['String']['output']>;
  guestUnreadCount: Maybe<Scalars['Float']['output']>;
  kind: Scalars['String']['output'];
  status: Maybe<Scalars['String']['output']>;
  unreadCount: Maybe<Scalars['Float']['output']>;
};

export type EventPayload = {
  __typename: 'EventPayload';
  coverMedia: Maybe<MediaPayload>;
  coverMediaId: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  logoMedia: Maybe<MediaPayload>;
  logoMediaId: Maybe<Scalars['ID']['output']>;
  media: Array<MediaPayload>;
  myAccess: Maybe<EventAccessPayload>;
  myRole: Maybe<UserRoleType>;
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  parentId: Maybe<Scalars['String']['output']>;
  path: Maybe<Scalars['String']['output']>;
  roleDefinitions: Array<EventRoleDefinitionPayload>;
  settings: Maybe<SettingsPayload>;
  tags: Array<Scalars['String']['output']>;
  timeline: Array<EventTimelinePayload>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  userRoles: Array<UserRolePayload>;
};

export type EventPermissionPayload = {
  __typename: 'EventPermissionPayload';
  category: Scalars['String']['output'];
  description: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  premiumFeatureKey: Maybe<Scalars['String']['output']>;
};

export type EventRoleDefinitionPayload = {
  __typename: 'EventRoleDefinitionPayload';
  archivedAt: Maybe<Scalars['DateTime']['output']>;
  assignedUserCount: Scalars['Int']['output'];
  color: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  eventId: Scalars['ID']['output'];
  icon: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  system: Scalars['Boolean']['output'];
  systemKey: Maybe<Scalars['String']['output']>;
};

export type EventSearchConnectionPayload = {
  __typename: 'EventSearchConnectionPayload';
  nodes: Array<EventSearchItemPayload>;
  pageInfo: SearchPageInfoPayload;
};

export type EventSearchInput = {
  cursor: InputMaybe<Scalars['String']['input']>;
  environment: InputMaybe<Scalars['String']['input']>;
  from: InputMaybe<Scalars['DateTime']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  sessionId: InputMaybe<Scalars['String']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  text: InputMaybe<Scalars['String']['input']>;
  to: InputMaybe<Scalars['DateTime']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
};

export type EventSearchItemPayload = {
  __typename: 'EventSearchItemPayload';
  anonymousId: Maybe<Scalars['String']['output']>;
  environment: Scalars['String']['output'];
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  occurredAt: Scalars['DateTime']['output'];
  propertiesJson: Scalars['String']['output'];
  receivedAt: Scalars['DateTime']['output'];
  sdkName: Scalars['String']['output'];
  sdkVersion: Scalars['String']['output'];
  sessionId: Maybe<Scalars['String']['output']>;
  sourceId: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  userId: Maybe<Scalars['String']['output']>;
};

export type EventStaffPayload = {
  __typename: 'EventStaffPayload';
  email: Maybe<Scalars['String']['output']>;
  permissions: Array<Scalars['String']['output']>;
  personalInfo: Maybe<EventStaffPersonalInfo>;
  phoneNumbers: Maybe<Array<EventStaffPhoneNumber>>;
  roles: Array<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  username: Maybe<Scalars['String']['output']>;
};

export type EventStaffPersonalInfo = {
  __typename: 'EventStaffPersonalInfo';
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
};

export type EventStaffPhoneNumber = {
  __typename: 'EventStaffPhoneNumber';
  isPrimary: Maybe<Scalars['Boolean']['output']>;
  label: Maybe<Scalars['String']['output']>;
  number: Scalars['String']['output'];
  type: Maybe<Scalars['String']['output']>;
};

export type EventTimelinePayload = {
  __typename: 'EventTimelinePayload';
  eventId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  referenceId: Maybe<Scalars['String']['output']>;
  sourceId: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
};

export type EventTreePayload = {
  __typename: 'EventTreePayload';
  rootEvent: EventPayload;
  subEvents: Maybe<Array<EventPayload>>;
};

export enum EventVisibleTab {
  DETAILS = 'DETAILS',
  MAP = 'MAP',
  TIMELINE = 'TIMELINE'
}

export type FeatureFlagPayload = {
  __typename: 'FeatureFlagPayload';
  activeVersion: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  lifecycle: Scalars['String']['output'];
  versions: Array<Scalars['Int']['output']>;
};

export enum GenderType {
  DIVERSE = 'DIVERSE',
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  UNKNOWN = 'UNKNOWN'
}

export type GeoLocationInfo = {
  __typename: 'GeoLocationInfo';
  city: Maybe<Scalars['String']['output']>;
  cityId: Scalars['ID']['output'];
  country: Maybe<Scalars['String']['output']>;
  countryId: Scalars['ID']['output'];
  houseNumber: Maybe<Scalars['String']['output']>;
  houseNumberId: Scalars['ID']['output'];
  lat: Maybe<Scalars['Float']['output']>;
  lon: Maybe<Scalars['Float']['output']>;
  postalCode: Maybe<Scalars['String']['output']>;
  postalCodeId: Scalars['ID']['output'];
  state: Maybe<Scalars['String']['output']>;
  stateId: Scalars['ID']['output'];
  street: Maybe<Scalars['String']['output']>;
  streetId: Scalars['ID']['output'];
};

/**
 * -----------------------------------
 * Supporting Types
 * -----------------------------------
 */
export type GeoPoint = {
  __typename: 'GeoPoint';
  latitude: Maybe<Scalars['Float']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
};

export type GeocodeAddressInput = {
  address: Scalars['String']['input'];
};

export type GeocodeResultPayload = {
  __typename: 'GeocodeResultPayload';
  displayName: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type GuestEventSeatInput = {
  eventId: Scalars['ID']['input'];
  guestId: Scalars['ID']['input'];
};

export enum GuestReminderPreset {
  HOURS_24_BEFORE = 'HOURS_24_BEFORE',
  THREE_DAYS_BEFORE = 'THREE_DAYS_BEFORE',
  WEEK_BEFORE = 'WEEK_BEFORE'
}

export type GuestSignUpPayload = {
  __typename: 'GuestSignUpPayload';
  message: Maybe<Scalars['String']['output']>;
  results: Maybe<Array<SignUpResultsPayload>>;
};

export type HouseNumber = {
  __typename: 'HouseNumber';
  id: Scalars['ID']['output'];
  number: Scalars['String']['output'];
};

export type ImportInvitationsInput = {
  eventId: Scalars['ID']['input'];
  key: Scalars['String']['input'];
  uploadType: Scalars['String']['input'];
};

export type ImportInvitationsResult = {
  __typename: 'ImportInvitationsResult';
  duplicates: Array<Scalars['String']['output']>;
  errors: Array<Scalars['String']['output']>;
  imported: Scalars['Int']['output'];
  skipped: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type InterestCategoryPayload = {
  __typename: 'InterestCategoryPayload';
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  icon: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interests: Maybe<Array<InterestPayload>>;
  key: InterestCategoryType;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum InterestCategoryType {
  FINANCE = 'FINANCE',
  LIFESTYLE = 'LIFESTYLE',
  MUSIC = 'MUSIC',
  REAL_ASSETS = 'REAL_ASSETS',
  SPORTS = 'SPORTS',
  TECHNOLOGY = 'TECHNOLOGY'
}

export type InterestPayload = {
  __typename: 'InterestPayload';
  categoryId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  icon: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: InterestType;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum InterestType {
  BANK_PRODUCTS_AND_SERVICES = 'BANK_PRODUCTS_AND_SERVICES',
  BASKETBALL = 'BASKETBALL',
  CLASSIC = 'CLASSIC',
  CREDIT_AND_DEBT = 'CREDIT_AND_DEBT',
  FINANCIAL_EDUCATION_AND_COUNSELING = 'FINANCIAL_EDUCATION_AND_COUNSELING',
  FOOTBALL = 'FOOTBALL',
  HIPHOP = 'HIPHOP',
  INSURANCE = 'INSURANCE',
  INVESTMENTS = 'INVESTMENTS',
  RAP = 'RAP',
  REAL_ESTATE = 'REAL_ESTATE',
  ROCK = 'ROCK',
  RUGBY = 'RUGBY',
  SAVING_AND_FINANCE = 'SAVING_AND_FINANCE',
  SOCCER = 'SOCCER',
  SUSTAINABLE_FINANCE = 'SUSTAINABLE_FINANCE',
  TECHNOLOGY_AND_INNOVATION = 'TECHNOLOGY_AND_INNOVATION',
  TRAVEL = 'TRAVEL'
}

export enum InvitationApprovalMode {
  AUTO = 'AUTO',
  AUTO_INVITE_ONLY = 'AUTO_INVITE_ONLY',
  AUTO_PUBLIC_ONLY = 'AUTO_PUBLIC_ONLY',
  MANUAL = 'MANUAL'
}

/** Input type for creating an invitation. A guest profile is not created here; only basic invite metadata is stored. */
export type InvitationCreateInput = {
  email: InputMaybe<Scalars['String']['input']>;
  /** ID of the event this invitation belongs to. */
  eventId: Scalars['ID']['input'];
  /** Optional: first name of the invited guest. */
  firstName: Scalars['String']['input'];
  /** Optional: ID of the parent invitation (for invite chains). */
  invitedByInvitationId: InputMaybe<Scalars['ID']['input']>;
  /** Optional: last name of the invited guest. */
  lastName: Scalars['String']['input'];
  /** Maximum number of plus-one invitations (must be >= 0). */
  maxInvitees: Scalars['Int']['input'];
  phoneNumber: InputMaybe<Scalars['String']['input']>;
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
};

export type InvitationGuestInput = {
  email: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  eventName: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  locale: InputMaybe<Scalars['String']['input']>;
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  plusOnes: InputMaybe<Scalars['Float']['input']>;
  rootInvitee: InputMaybe<Scalars['String']['input']>;
  rsvpUrl: Scalars['String']['input'];
};

/** GraphQL Invitation entity matching the Prisma model exactly. */
export type InvitationPayload = {
  __typename: 'InvitationPayload';
  approvedAt: Maybe<Scalars['DateTime']['output']>;
  approvedByUserId: Maybe<Scalars['ID']['output']>;
  autoApproveOnAccept: Scalars['Boolean']['output'];
  confirmationResendCount: Scalars['Int']['output'];
  confirmationSentAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  eventEndsAt: Maybe<Scalars['DateTime']['output']>;
  eventId: Scalars['ID']['output'];
  eventName: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  guestNote: Maybe<Scalars['String']['output']>;
  guestProfileId: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  invitedByInvitationId: Maybe<Scalars['ID']['output']>;
  invitedByUserId: Maybe<Scalars['ID']['output']>;
  lastName: Scalars['String']['output'];
  maxInvitees: Scalars['Int']['output'];
  /** Pointer to PII record inside Ephemeral Redis Store. */
  pendingContactId: Maybe<Scalars['String']['output']>;
  phoneNumber: Maybe<Scalars['String']['output']>;
  phoneNumbers: Array<PhoneNumberPayload>;
  plusOneAgeCategory: Maybe<PlusOneAgeCategory>;
  plusOnes: Array<InvitationPayload>;
  rsvpAt: Maybe<Scalars['DateTime']['output']>;
  rsvpChoice: Maybe<RsvpChoice>;
  selectedInvitedBy: Array<Scalars['String']['output']>;
  status: InvitationStatus;
  type: InvitationType;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
};

export enum InvitationStatus {
  ACCEPTED = 'ACCEPTED',
  APPROVAL_STAGED = 'APPROVAL_STAGED',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum InvitationType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}

export type KcUser = {
  __typename: 'KcUser';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  role: Maybe<RealmRoleType>;
  username: Scalars['String']['output'];
};

export type KpiValuePayload = {
  __typename: 'KpiValuePayload';
  format: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  unit: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type Language = {
  __typename: 'Language';
  countries: Array<Country>;
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  iso3: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type LayoutChangeLogPayload = {
  __typename: 'LayoutChangeLogPayload';
  actorId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  payload: Scalars['JSON']['output'];
  type: LayoutChangeType;
};

export enum LayoutChangeType {
  AUTO_GENERATE_GEOMETRY_V4 = 'AUTO_GENERATE_GEOMETRY_V4',
  LAYOUT_VERSION_SAVED = 'LAYOUT_VERSION_SAVED',
  SEAT_ASSIGN = 'SEAT_ASSIGN',
  SEAT_ASSIGNED = 'SEAT_ASSIGNED',
  SEAT_CREATE = 'SEAT_CREATE',
  SEAT_DELETE = 'SEAT_DELETE',
  SEAT_MOVED = 'SEAT_MOVED',
  SEAT_UNASSIGNED = 'SEAT_UNASSIGNED',
  SEAT_UPDATE = 'SEAT_UPDATE',
  SECTION_CLONED = 'SECTION_CLONED',
  SECTION_CREATE = 'SECTION_CREATE',
  SECTION_DELETE = 'SECTION_DELETE',
  SECTION_MOVED = 'SECTION_MOVED',
  SECTION_RENAME = 'SECTION_RENAME',
  SECTION_UPDATE = 'SECTION_UPDATE',
  TABLE_CREATE = 'TABLE_CREATE',
  TABLE_DELETE = 'TABLE_DELETE',
  TABLE_DUPLICATED = 'TABLE_DUPLICATED',
  TABLE_MOVED = 'TABLE_MOVED',
  TABLE_RENAME = 'TABLE_RENAME',
  TABLE_UPDATE = 'TABLE_UPDATE'
}

export type LayoutVersionPayload = {
  __typename: 'LayoutVersionPayload';
  createdAt: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  inversePatch: Maybe<Scalars['JSON']['output']>;
  label: Maybe<Scalars['String']['output']>;
  patch: Maybe<Scalars['JSON']['output']>;
  version: Scalars['Float']['output'];
};

export type LineageEdgePayload = {
  __typename: 'LineageEdgePayload';
  id: Scalars['ID']['output'];
  inputVersionId: Scalars['ID']['output'];
  outputVersionId: Scalars['ID']['output'];
  transformationVersionId: Maybe<Scalars['ID']['output']>;
};

export type LineageGraphPayload = {
  __typename: 'LineageGraphPayload';
  edges: Array<LineageEdgePayload>;
  metricId: Scalars['ID']['output'];
  nodes: Array<LineageNodePayload>;
  runs: Array<LineageRunPayload>;
  version: Scalars['Int']['output'];
};

export type LineageNodePayload = {
  __typename: 'LineageNodePayload';
  assetId: Scalars['ID']['output'];
  definitionJson: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  type: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type LineageRunPayload = {
  __typename: 'LineageRunPayload';
  definitionVersion: Maybe<Scalars['String']['output']>;
  discardedCount: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inputCount: Scalars['String']['output'];
  inputVersionIds: Array<Scalars['ID']['output']>;
  outputCount: Scalars['String']['output'];
  outputVersionIds: Array<Scalars['ID']['output']>;
  processingVersion: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
  watermark: Maybe<Scalars['DateTime']['output']>;
};

export type LogInInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginTotpInput = {
  code: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export enum MaritalStatusType {
  DIVORCED = 'DIVORCED',
  MARRIED = 'MARRIED',
  SINGLE = 'SINGLE',
  WIDOWED = 'WIDOWED'
}

export type MediaPayload = {
  __typename: 'MediaPayload';
  filename: Scalars['String']['output'];
  id: Scalars['String']['output'];
  key: Scalars['String']['output'];
  mimetype: Scalars['String']['output'];
  size: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
  variants: Array<MediaVariantPayload>;
};

export enum MediaType {
  COVER = 'COVER',
  GALLERY = 'GALLERY',
  LOGO = 'LOGO'
}

export type MediaVariantPayload = {
  __typename: 'MediaVariantPayload';
  format: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type Message = {
  __typename: 'Message';
  body: Scalars['String']['output'];
  channel: ChannelType;
  contentType: MessageContentType;
  conversationId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  deliveryStatus: DeliveryStatus;
  editedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  senderId: Scalars['String']['output'];
};

export enum MessageContentType {
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM',
  TEXT = 'TEXT'
}

export type MetricDefinitionPayload = {
  __typename: 'MetricDefinitionPayload';
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  lifecycle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type MetricPointPayload = {
  __typename: 'MetricPointPayload';
  bucketSize: Scalars['String']['output'];
  bucketStart: Scalars['DateTime']['output'];
  inputCount: Scalars['String']['output'];
  value: Scalars['Float']['output'];
  watermark: Scalars['DateTime']['output'];
};

export enum MfaPreference {
  BACKUP_CODES = 'BACKUP_CODES',
  NONE = 'NONE',
  SECURITY_QUESTIONS = 'SECURITY_QUESTIONS',
  TOTP = 'TOTP',
  WEBAUTHN = 'WEBAUTHN'
}

export type MoveSeatInput = {
  id: Scalars['ID']['input'];
  rotation: InputMaybe<Scalars['Float']['input']>;
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type MoveSectionInput = {
  id: Scalars['ID']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type MoveTableInput = {
  id: Scalars['ID']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  DEBUG_createSignupVerification: Scalars['String']['output'];
  activateAnalyticsFeatureFlag: FeatureFlagPayload;
  activateAnalyticsMetric: MetricDefinitionPayload;
  activateAnalyticsRule: AnalyticsRulePayload;
  /** Bind a device to a ticket (first activation) */
  activateDevice: TicketPayload;
  activateEvent: Scalars['Boolean']['output'];
  addAnalyticsFeatureFlagVersion: FeatureFlagPayload;
  addAnalyticsRuleVersion: AnalyticsRulePayload;
  addContact: Scalars['Boolean']['output'];
  addPhoneNumbers: Scalars['Boolean']['output'];
  addTimeLines: EventPayload;
  adminChangePassword: Scalars['Boolean']['output'];
  adminSignUp: TokenPayload;
  adminUpdateUser: Scalars['Boolean']['output'];
  approveInvitation: InvitationPayload;
  archiveAnalyticsSavedSearch: SavedSearchPayload;
  archiveEventRole: EventRoleDefinitionPayload;
  archiveMyNotification: NotificationPayload;
  archiveNotification: NotificationPayload;
  assignEventRole: EventAccessPayload;
  assignRealmRole: Scalars['Boolean']['output'];
  assignSeat: SeatPayload;
  assignSupportConversation: SupportConversation;
  assignUserToEvent: EventPayload;
  autoGenerateLayout: Scalars['Boolean']['output'];
  autoGenerateSeatMap: Scalars['Boolean']['output'];
  bulkApproveInvitations: Array<InvitationPayload>;
  bulkRenameSections: BulkRenamePayload;
  bulkRenameTables: BulkRenamePayload;
  /** Stages invitations without creating guests, tickets, or notifications. */
  bulkStageInvitations: Array<InvitationPayload>;
  cancelNotification: NotificationPayload;
  changeMyPassword: SuccessPayload;
  cloneSection: SectionPayload;
  closeSupportConversation: SupportConversation;
  completePasswordReset: Scalars['Boolean']['output'];
  confirmTotp: Scalars['Boolean']['output'];
  createAnalyticsFeatureFlag: FeatureFlagPayload;
  createAnalyticsKpi: KpiValuePayload;
  createAnalyticsMetric: MetricDefinitionPayload;
  createAnalyticsRule: AnalyticsRulePayload;
  createAnalyticsSchedule: AnalyticsSchedulePayload;
  createEvent: EventPayload;
  createEventAddress: EventAddressPayload;
  createEventRole: EventRoleDefinitionPayload;
  createInAppConversation: Conversation;
  createInvitation: InvitationPayload;
  createInvitationFromRsvp: InvitationPayload;
  createMedia: Scalars['String']['output'];
  createNotification: NotificationPayload;
  createPlusOnesInvitation: InvitationPayload;
  createQuickReply: QuickReply;
  createSeat: SeatPayload;
  createSection: SectionPayload;
  createSignupVerification: Scalars['Boolean']['output'];
  createSupportConversation: SupportConversation;
  createTable: TablePayload;
  createTemplate: TemplatePayload;
  createTenant: TenantType;
  createUserAddress: UserAddress;
  createWhatsappConversation: Conversation;
  credentialsLogin: TokenPayload;
  deactivateEvent: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteEventAddressByEventId: Scalars['Boolean']['output'];
  deleteEventRole: Scalars['Boolean']['output'];
  deleteKcUser: Scalars['Boolean']['output'];
  deleteNotification: Scalars['Boolean']['output'];
  deleteQuickReply: Scalars['Boolean']['output'];
  deleteSeat: Scalars['Boolean']['output'];
  deleteSection: Scalars['Boolean']['output'];
  deleteTable: Scalars['Boolean']['output'];
  deleteTenant: Scalars['Boolean']['output'];
  /** Delete ticket and all its logs (admin only) */
  deleteTicket: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  deleteUserAddressByUserId: Scalars['Boolean']['output'];
  duplicateTable: TablePayload;
  enableTotp: TotpSetupPayload;
  generatePasswordlessOptions: Scalars['JSON']['output'];
  /** Rotate nonce for a ticket’s QR token */
  generateToken: Scalars['String']['output'];
  generateWebAuthnAuthOptions: Scalars['JSON']['output'];
  generateWebAuthnAuthOptions2: Scalars['JSON']['output'];
  generateWebAuthnRegistrationOptions: Scalars['JSON']['output'];
  /** Imports invitations from CSV/XLSX stored in object storage */
  importInvitations: ImportInvitationsResult;
  loginTotp: TokenPayload;
  logout: SuccessPayload;
  markConversationAsRead: SupportConversation;
  markMyNotificationAsRead: NotificationPayload;
  markNotificationAsRead: NotificationPayload;
  markNotificationAsUnread: NotificationPayload;
  markRead: Scalars['Boolean']['output'];
  moveSeat: SeatPayload;
  moveSection: SeatPayload;
  moveTable: SeatPayload;
  redoLayout: Scalars['Boolean']['output'];
  refresh: TokenPayload;
  regenerateBackupCodes: Array<Scalars['String']['output']>;
  removeAllPlusOnesByInvitationId: Array<InvitationPayload>;
  removeContact: Scalars['Boolean']['output'];
  removeEventRole: EventAccessPayload;
  removeInvitation: SuccessPayload;
  removePhoneNumbers: Scalars['Boolean']['output'];
  removePlusOneInvitation: InvitationPayload;
  removeRealmRole: Scalars['Boolean']['output'];
  removeTimeLines: EventPayload;
  removeUserFromEvent: EventPayload;
  renameSection: RenamePayload;
  renameTable: RenamePayload;
  renameWebAuthnCredential: Scalars['Boolean']['output'];
  reopenSupportConversation: SupportConversation;
  replyInvitation: InvitationPayload;
  requestAnalyticsReplay: ReplayJobPayload;
  requestPasswordReset: Scalars['Boolean']['output'];
  resendGuestConfirmations: ResendGuestConfirmationsPayload;
  /** Revoke a ticket (security or admin) */
  revokeTicket: TicketPayload;
  revokeWebAuthnCredential: Scalars['Boolean']['output'];
  rsvpMarkConversationAsRead: SupportConversation;
  rsvpSendSupportMessage: SupportMessage;
  saveAnalyticsSearch: SavedSearchPayload;
  saveLayoutVersion: LayoutVersionPayload;
  scanToken: ScanPayload;
  seedAll: SeedPayload;
  seedCountries: SeedPayload;
  seedPostalCodes: SeedPayload;
  seedStates: SeedPayload;
  sendInvitations: Scalars['Boolean']['output'];
  sendMagicLink: Scalars['Boolean']['output'];
  sendMessage: Message;
  sendSupportMessage: SupportMessage;
  setAnalyticsScheduleActive: AnalyticsSchedulePayload;
  setEventRolePermissions: EventRoleDefinitionPayload;
  setMfaPreference: Scalars['Boolean']['output'];
  setTimelines: EventPayload;
  transferEventOwnership: Scalars['Boolean']['output'];
  unarchiveNotification: NotificationPayload;
  unassignSeat: SeatPayload;
  undoLayout: Scalars['Boolean']['output'];
  updateEvent: EventPayload;
  updateEventAddress: EventAddressPayload;
  updateEventRole: EventRoleDefinitionPayload;
  updateMe: UserPayload;
  updateMyProfile: SuccessPayload;
  updatePlusOnesInvitation: InvitationPayload;
  updateQuickReply: QuickReply;
  updateSeat: SeatPayload;
  updateSection: SectionPayload;
  updateSupportConversation: SupportConversation;
  updateTable: TablePayload;
  updateTemplate: TemplatePayload;
  updateTenant: TenantType;
  updateTimeLines: EventPayload;
  updateUser: UserPayload;
  updateUserAddress: UserAddress;
  verifyGuestSignUp: GuestSignUpPayload;
  verifyMagicLink: TokenPayload;
  verifyPasswordResetStepUp: Scalars['Boolean']['output'];
  verifyPasswordResetToken: ResetVerificationPayload;
  verifyPasswordlessAuthentication: TokenPayload;
  verifySignUp: SignUpPayload;
  verifyWebAuthnAuthentication: TokenPayload;
  verifyWebAuthnAuthentication2: Scalars['Boolean']['output'];
  verifyWebAuthnRegistration: Scalars['Boolean']['output'];
};


export type MutationDebug_CreateSignupVerificationArgs = {
  createUserInput: CreateUserInput;
};


export type MutationActivateAnalyticsFeatureFlagArgs = {
  flagId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationActivateAnalyticsMetricArgs = {
  metricId: Scalars['ID']['input'];
};


export type MutationActivateAnalyticsRuleArgs = {
  ruleId: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationActivateDeviceArgs = {
  input: ActivateDeviceInput;
};


export type MutationActivateEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationAddAnalyticsFeatureFlagVersionArgs = {
  definitionJson: Scalars['String']['input'];
  flagId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationAddAnalyticsRuleVersionArgs = {
  definitionJson: Scalars['String']['input'];
  ruleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationAddContactArgs = {
  contact: AddContactInput;
};


export type MutationAddPhoneNumbersArgs = {
  phoneNumbers: Array<PhoneNumberInput>;
};


export type MutationAddTimeLinesArgs = {
  eventId: Scalars['ID']['input'];
  input: Array<CreateTimelineInput>;
};


export type MutationAdminChangePasswordArgs = {
  input: UpdateUserPasswordInput;
};


export type MutationAdminSignUpArgs = {
  input: AdminSignUpInput;
};


export type MutationAdminUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateKcUserInput;
};


export type MutationApproveInvitationArgs = {
  input: ApproveInvitationInput;
};


export type MutationArchiveAnalyticsSavedSearchArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveEventRoleArgs = {
  input: ArchiveEventRoleInput;
};


export type MutationArchiveMyNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationArchiveNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationAssignEventRoleArgs = {
  input: AssignEventRoleInput;
};


export type MutationAssignRealmRoleArgs = {
  id: Scalars['ID']['input'];
  roleName: RealmRoleType;
};


export type MutationAssignSeatArgs = {
  input: AssignSeatInput;
};


export type MutationAssignSupportConversationArgs = {
  conversationId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAssignUserToEventArgs = {
  input: AssignUserRoleInput;
};


export type MutationAutoGenerateLayoutArgs = {
  input: AutoGenerateLayoutInput;
};


export type MutationAutoGenerateSeatMapArgs = {
  input: AutoGenerateSeatMapInput;
};


export type MutationBulkApproveInvitationsArgs = {
  input: BulkApproveInvitationInput;
};


export type MutationBulkRenameSectionsArgs = {
  inputs: Array<RenameSectionInput>;
};


export type MutationBulkRenameTablesArgs = {
  inputs: Array<RenameTableInput>;
};


export type MutationBulkStageInvitationsArgs = {
  input: BulkStageInvitationInput;
};


export type MutationCancelNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeMyPasswordArgs = {
  input: ChangeMyPasswordInput;
};


export type MutationCloneSectionArgs = {
  input: CloneSectionInput;
};


export type MutationCloseSupportConversationArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationCompletePasswordResetArgs = {
  input: CompleteResetInputGql;
};


export type MutationConfirmTotpArgs = {
  code: Scalars['String']['input'];
};


export type MutationCreateAnalyticsFeatureFlagArgs = {
  definitionJson: Scalars['String']['input'];
  key: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateAnalyticsKpiArgs = {
  definitionJson: Scalars['String']['input'];
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateAnalyticsMetricArgs = {
  definitionJson: Scalars['String']['input'];
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateAnalyticsRuleArgs = {
  definitionJson: Scalars['String']['input'];
  name: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateAnalyticsScheduleArgs = {
  input: CreateAnalyticsScheduleInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateEventAddressArgs = {
  input: CreateEventAddressInput;
};


export type MutationCreateEventRoleArgs = {
  input: CreateEventRoleInput;
};


export type MutationCreateInAppConversationArgs = {
  conversationType?: ConversationType;
  participantUserId: Scalars['String']['input'];
};


export type MutationCreateInvitationArgs = {
  input: InvitationCreateInput;
};


export type MutationCreateInvitationFromRsvpArgs = {
  input: PublicRsvpInput;
};


export type MutationCreateMediaArgs = {
  input: CreateMediaDto;
};


export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


export type MutationCreatePlusOnesInvitationArgs = {
  input: CreatePlusOneInput;
};


export type MutationCreateQuickReplyArgs = {
  body: Scalars['String']['input'];
  channel: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationCreateSeatArgs = {
  input: CreateSeatInput;
};


export type MutationCreateSectionArgs = {
  input: CreateSectionInput;
};


export type MutationCreateSignupVerificationArgs = {
  createUserInput: CreateUserInput;
};


export type MutationCreateSupportConversationArgs = {
  channel: ConversationChannel;
  eventId: Scalars['String']['input'];
  firstMessage: Scalars['String']['input'];
  guestContact: InputMaybe<Scalars['String']['input']>;
  guestName: Scalars['String']['input'];
  invitationId: InputMaybe<Scalars['String']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateTableArgs = {
  input: CreateTableInput;
};


export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


export type MutationCreateTenantArgs = {
  input: CreateTenantInput;
};


export type MutationCreateUserAddressArgs = {
  input: CreateUserAddressInput;
};


export type MutationCreateWhatsappConversationArgs = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};


export type MutationCredentialsLoginArgs = {
  input: LogInInput;
};


export type MutationDeactivateEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEventAddressByEventIdArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDeleteEventRoleArgs = {
  input: DeleteEventRoleInput;
};


export type MutationDeleteKcUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteQuickReplyArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSeatArgs = {
  seatId: Scalars['String']['input'];
};


export type MutationDeleteSectionArgs = {
  sectionId: Scalars['String']['input'];
};


export type MutationDeleteTableArgs = {
  tableId: Scalars['String']['input'];
};


export type MutationDeleteTenantArgs = {
  input: DeleteTenantInput;
};


export type MutationDeleteTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserAddressByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationDuplicateTableArgs = {
  input: DuplicateTableInput;
};


export type MutationGeneratePasswordlessOptionsArgs = {
  email: Scalars['String']['input'];
};


export type MutationGenerateTokenArgs = {
  ticketId: Scalars['ID']['input'];
};


export type MutationImportInvitationsArgs = {
  input: ImportInvitationsInput;
};


export type MutationLoginTotpArgs = {
  input: LoginTotpInput;
};


export type MutationMarkConversationAsReadArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationMarkMyNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkNotificationAsUnreadArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationMoveSeatArgs = {
  input: MoveSeatInput;
};


export type MutationMoveSectionArgs = {
  input: MoveSectionInput;
};


export type MutationMoveTableArgs = {
  input: MoveTableInput;
};


export type MutationRedoLayoutArgs = {
  eventId: Scalars['String']['input'];
};


export type MutationRemoveAllPlusOnesByInvitationIdArgs = {
  invitedByInvitationId: Scalars['ID']['input'];
};


export type MutationRemoveContactArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationRemoveEventRoleArgs = {
  input: RemoveEventRoleInput;
};


export type MutationRemoveInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemovePhoneNumbersArgs = {
  phoneNumberIds: Array<Scalars['ID']['input']>;
};


export type MutationRemovePlusOneInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveRealmRoleArgs = {
  id: Scalars['ID']['input'];
  roleName: RealmRoleType;
};


export type MutationRemoveTimeLinesArgs = {
  eventId: Scalars['ID']['input'];
  input: Array<RemoveTimelineInput>;
};


export type MutationRemoveUserFromEventArgs = {
  input: RemoveUserFromEventInput;
};


export type MutationRenameSectionArgs = {
  input: RenameSectionInput;
};


export type MutationRenameTableArgs = {
  input: RenameTableInput;
};


export type MutationRenameWebAuthnCredentialArgs = {
  credentialId: Scalars['String']['input'];
  nickname: Scalars['String']['input'];
};


export type MutationReopenSupportConversationArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationReplyInvitationArgs = {
  input: RsvpInput;
};


export type MutationRequestAnalyticsReplayArgs = {
  dryRun?: Scalars['Boolean']['input'];
  filter: ReplayFilterInput;
  workspaceId: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResendGuestConfirmationsArgs = {
  invitationIds: Array<Scalars['ID']['input']>;
};


export type MutationRevokeTicketArgs = {
  input: RevokeTicketInput;
};


export type MutationRevokeWebAuthnCredentialArgs = {
  credentialId: Scalars['String']['input'];
};


export type MutationRsvpMarkConversationAsReadArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationRsvpSendSupportMessageArgs = {
  body: InputMaybe<Scalars['String']['input']>;
  invitationId: Scalars['String']['input'];
  mediaUrl: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveAnalyticsSearchArgs = {
  definitionJson: Scalars['String']['input'];
  name: Scalars['String']['input'];
  resourceType: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationSaveLayoutVersionArgs = {
  input: SaveLayoutVersionInput;
};


export type MutationScanTokenArgs = {
  input: ScanInput;
};


export type MutationSendInvitationsArgs = {
  input: SendInvitationsInput;
};


export type MutationSendMagicLinkArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  body: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
};


export type MutationSendSupportMessageArgs = {
  body: InputMaybe<Scalars['String']['input']>;
  conversationId: Scalars['String']['input'];
  mediaUrl: InputMaybe<Scalars['String']['input']>;
};


export type MutationSetAnalyticsScheduleActiveArgs = {
  active: Scalars['Boolean']['input'];
  scheduleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationSetEventRolePermissionsArgs = {
  input: SetEventRolePermissionsInput;
};


export type MutationSetMfaPreferenceArgs = {
  method: MfaPreference;
};


export type MutationSetTimelinesArgs = {
  input: SetTimelineInput;
};


export type MutationTransferEventOwnershipArgs = {
  input: TransferInput;
};


export type MutationUnarchiveNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationUnassignSeatArgs = {
  seatId: Scalars['String']['input'];
};


export type MutationUndoLayoutArgs = {
  eventId: Scalars['String']['input'];
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateEventAddressArgs = {
  input: UpdateEventAddressInput;
};


export type MutationUpdateEventRoleArgs = {
  input: UpdateEventRoleInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput;
};


export type MutationUpdatePlusOnesInvitationArgs = {
  input: UpdatePlusOneInput;
};


export type MutationUpdateQuickReplyArgs = {
  body: InputMaybe<Scalars['String']['input']>;
  channel: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  key: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationUpdateSeatArgs = {
  input: UpdateSeatInput;
};


export type MutationUpdateSectionArgs = {
  input: UpdateSectionInput;
};


export type MutationUpdateSupportConversationArgs = {
  id: Scalars['String']['input'];
  priority: InputMaybe<ConversationPriority>;
  subject: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateTableArgs = {
  input: UpdateTableInput;
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


export type MutationUpdateTenantArgs = {
  input: UpdateTenantInput;
};


export type MutationUpdateTimeLinesArgs = {
  eventId: Scalars['ID']['input'];
  input: Array<UpdateTimelineInput>;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserAddressArgs = {
  input: UpdateUserAddressInput;
};


export type MutationVerifyGuestSignUpArgs = {
  token: Scalars['String']['input'];
};


export type MutationVerifyMagicLinkArgs = {
  token: Scalars['String']['input'];
};


export type MutationVerifyPasswordResetStepUpArgs = {
  input: StepUpVerificationInputGql;
};


export type MutationVerifyPasswordResetTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationVerifyPasswordlessAuthenticationArgs = {
  response: Scalars['JSON']['input'];
};


export type MutationVerifySignUpArgs = {
  token: Scalars['String']['input'];
};


export type MutationVerifyWebAuthnAuthenticationArgs = {
  response: Scalars['JSON']['input'];
};


export type MutationVerifyWebAuthnAuthentication2Args = {
  response: Scalars['JSON']['input'];
};


export type MutationVerifyWebAuthnRegistrationArgs = {
  response: Scalars['JSON']['input'];
};

export type NotificationFilterInput = {
  channel: InputMaybe<Channel>;
  recipientId: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<NotificationStatus>;
  unreadOnly: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationPayload = {
  __typename: 'NotificationPayload';
  archivedAt: Maybe<Scalars['DateTime']['output']>;
  body: Maybe<Scalars['String']['output']>;
  channel: Channel;
  contentFormat: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Maybe<Scalars['String']['output']>;
  deliveredAt: Maybe<Scalars['DateTime']['output']>;
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  failureReason: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata: Scalars['JSON']['output'];
  priority: Priority;
  provider: Maybe<Scalars['String']['output']>;
  providerRef: Maybe<Scalars['String']['output']>;
  purgedAt: Maybe<Scalars['DateTime']['output']>;
  readAt: Maybe<Scalars['DateTime']['output']>;
  recipientAddress: Maybe<Scalars['String']['output']>;
  recipientId: Maybe<Scalars['String']['output']>;
  recipientUsername: Scalars['String']['output'];
  sensitive: Scalars['Boolean']['output'];
  status: NotificationStatus;
  tenantId: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  variables: Scalars['JSON']['output'];
};

export enum NotificationStatus {
  ARCHIVED = 'ARCHIVED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  READ = 'READ',
  SENT = 'SENT'
}

export type Participant = {
  __typename: 'Participant';
  userId: Scalars['ID']['output'];
};

export enum PersonStatusType {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
  DELETED = 'DELETED',
  DISABLED = 'DISABLED',
  INACTIVE = 'INACTIVE'
}

export type PersonalInfoInput = {
  birthDate: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  gender: InputMaybe<GenderType>;
  lastName: Scalars['String']['input'];
  maritalStatus: InputMaybe<MaritalStatusType>;
};

export type PersonalInfoPayload = {
  __typename: 'PersonalInfoPayload';
  birthDate: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: Maybe<GenderType>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  maritalStatus: Maybe<MaritalStatusType>;
  phoneNumbers: Maybe<Array<PhoneNumberPayload>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PhoneNumberInput = {
  countryCode: Scalars['String']['input'];
  /** Marks this number as primary for the associated profile. */
  isPrimary: InputMaybe<Scalars['Boolean']['input']>;
  /** Optional user-defined label (e.g., “Office Line”, “Private”). */
  label: InputMaybe<Scalars['String']['input']>;
  /** Phone number value in international format. Regex validated. */
  number: Scalars['String']['input'];
  /** The category/type of the phone number (e.g., MOBILE, HOME, WORK). */
  type: PhoneNumberType;
};

export type PhoneNumberPayload = {
  __typename: 'PhoneNumberPayload';
  countryCode: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  infoId: Scalars['String']['output'];
  isPrimary: Maybe<Scalars['Boolean']['output']>;
  label: Maybe<Scalars['String']['output']>;
  number: Scalars['String']['output'];
  type: PhoneNumberType;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
};

export enum PhoneNumberType {
  HOME = 'HOME',
  MOBILE = 'MOBILE',
  OTHER = 'OTHER',
  PRIVATE = 'PRIVATE',
  WHATSAPP = 'WHATSAPP',
  WORK = 'WORK'
}

export enum PlusOneAgeCategory {
  OVER_SIX = 'OVER_SIX',
  UNDER_SIX = 'UNDER_SIX'
}

export type PostalCode = {
  __typename: 'PostalCode';
  accuracy: Maybe<Scalars['Int']['output']>;
  city: City;
  code: Scalars['String']['output'];
  country: Country;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Maybe<GeoPoint>;
  updatedAt: Scalars['String']['output'];
};

export type PostalCodeFilterInput = {
  cityId: InputMaybe<Scalars['ID']['input']>;
  code: InputMaybe<Scalars['String']['input']>;
  countryId: InputMaybe<Scalars['ID']['input']>;
};

/** Whether the ticket holder is currently INSIDE or OUTSIDE the venue. */
export enum PresenceState {
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE'
}

export enum Priority {
  HIGH = 'HIGH',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  URGENT = 'URGENT'
}

export type ProcessingMetricsPayload = {
  __typename: 'ProcessingMetricsPayload';
  averageDurationMs: Scalars['Float']['output'];
  duplicate: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
  quarantined: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PublicPlusOneInput = {
  email: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  plusOneAgeCategory: PlusOneAgeCategory;
};

export type PublicRsvpInput = {
  email: InputMaybe<Scalars['String']['input']>;
  /** Public event identifier (eventId or slug) */
  eventId: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  /** Optional note from guest */
  guestNote: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  /** Optional RSVP message from guest */
  message: InputMaybe<Scalars['String']['input']>;
  phoneNumbers: Array<PhoneNumberInput>;
  /** Optional list of additional guests (plus-ones) */
  plusOnes: InputMaybe<Array<PublicPlusOneInput>>;
  /** Configured inviter/source options selected by the guest */
  selectedInvitedBy: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Query = {
  __typename: 'Query';
  activeTemplate: TemplatePayload;
  addressAutocomplete: Array<AddressAutocompletePayload>;
  adminEvents: Array<EventPayload>;
  adminGetEvent: Maybe<EventPayload>;
  analyticsCatalogSearch: Array<CatalogSearchItemPayload>;
  analyticsEventCatalog: Array<EventCatalogEntry>;
  analyticsEventSearch: EventSearchConnectionPayload;
  analyticsFeatureFlags: Array<FeatureFlagPayload>;
  analyticsKpiValue: KpiValuePayload;
  analyticsMetricSeries: Array<MetricPointPayload>;
  analyticsPlatformInfo: AnalyticsPlatformInfo;
  analyticsProcessingMetrics: ProcessingMetricsPayload;
  analyticsRealtimeMetric: Maybe<Scalars['Float']['output']>;
  analyticsReplayJobs: Array<ReplayJobPayload>;
  analyticsRules: Array<AnalyticsRulePayload>;
  analyticsSavedSearches: Array<SavedSearchPayload>;
  analyticsSchedules: Array<AnalyticsSchedulePayload>;
  analyticsSecurityCharts: AnalyticsSecurityChartsPayload;
  analyticsSessionSearch: SessionSearchConnectionPayload;
  analyticsTrackingPlanSearch: Array<TrackingPlanSearchItemPayload>;
  checkEmail: Scalars['Boolean']['output'];
  checkUsername: Scalars['Boolean']['output'];
  conversation: Maybe<Conversation>;
  conversations: Array<Conversation>;
  event: Maybe<EventPayload>;
  eventAccess: EventAccessPayload;
  eventAddressById: Maybe<EventAddress>;
  eventChildren: Array<EventPayload>;
  eventGuests: Array<Scalars['String']['output']>;
  eventInvitation: Array<InvitationPayload>;
  eventPermissions: Array<EventPermissionPayload>;
  eventRoles: Array<EventRoleDefinitionPayload>;
  eventRsvp: Maybe<EventPayload>;
  eventStaff: Array<EventStaffPayload>;
  eventTables: Array<TablePayload>;
  eventTree: EventTreePayload;
  explainMetric: LineageGraphPayload;
  geocodeAddress: Maybe<GeocodeResultPayload>;
  getAllCountries: Array<Country>;
  getAllInterestCategories: Array<InterestCategoryPayload>;
  getAllInterests: Array<InterestPayload>;
  /** Fetch all tickets */
  getAllTickets: Array<TicketPayload>;
  getById: KcUser;
  getByUsername: KcUser;
  getCitiesByPostalCode: City;
  getCitiesByState: Maybe<Array<City>>;
  getCityByNameAndState: Maybe<City>;
  getCountryByName: Maybe<Country>;
  getEventAddressByEventId: Maybe<EventAddressPayload>;
  getFullByEventIds: Array<InvitationPayload>;
  getGeoLocationInfo: Maybe<GeoLocationInfo>;
  getHouseNumberByName: Maybe<HouseNumber>;
  /** Find tickets linked to a authenticated user */
  getMyTickets: Array<TicketPayload>;
  getPlusOnesByInvitation: Array<InvitationPayload>;
  getPostalCodeByNameAndCity: Maybe<PostalCode>;
  getPostalCodesByCity: Maybe<Array<PostalCode>>;
  getPostalCodesByState: Maybe<Array<PostalCode>>;
  getSeatByGuestAndEvent: SeatPayload;
  getSeatList: Array<SeatPayload>;
  getSecurityQuestions: Array<SecurityQuestionPayload>;
  getStateByName: Maybe<State>;
  getStatesByCountry: Array<State>;
  getStreetByName: Maybe<Street>;
  getTenant: TenantType;
  getUserAddressesByUserId: Array<UserAddressPayload>;
  getUserList: Array<UserPayload>;
  invitation: InvitationPayload;
  invitations: Array<InvitationPayload>;
  kc_users: Array<KcUser>;
  latestLayoutVersion: Maybe<LayoutVersionPayload>;
  layoutChangeLog: Array<LayoutChangeLogPayload>;
  layoutVersions: Array<LayoutVersionPayload>;
  listTenants: Array<TenantType>;
  listWebAuthnDevices: Array<WebAuthnDevicePayload>;
  me: UserPayload;
  meAuth: KcUser;
  meByToken: KcUser;
  mediaUrl: Scalars['String']['output'];
  mediaVariantUrl: Scalars['String']['output'];
  messages: Array<Message>;
  myEventAccess: EventAccessPayload;
  myEvents: Array<EventPayload>;
  myInvitations: Array<InvitationPayload>;
  myNotifications: Array<NotificationPayload>;
  mySupportConversations: Array<SupportConversation>;
  notification: NotificationPayload;
  notifications: Array<NotificationPayload>;
  pnpm: UserPayload;
  publicEventTree: EventTreePayload;
  quickReplies: Array<QuickReply>;
  quickReply: QuickReply;
  rsvpSupportConversation: RsvpSupportConversationResult;
  rsvpSupportMessages: Array<SupportMessage>;
  /** Load all security scan logs of a ticket */
  scanLogsByTicket: Array<ScanLogPayload>;
  seat: Maybe<SeatPayload>;
  seatAssignmentLogs: Array<SeatAssignmentLogPayload>;
  seatLayout: Array<SectionPayload>;
  seatPresencesByEvent: Array<SeatPresencePayload>;
  seats: Array<SeatPayload>;
  seatsBySection: Array<SeatPayload>;
  seatsByTable: Array<SeatPayload>;
  section: Maybe<SectionPayload>;
  sections: Array<SectionPayload>;
  supportAssignedToMe: Array<SupportConversation>;
  supportConversation: SupportConversation;
  supportConversationCount: Scalars['Float']['output'];
  supportConversationsByEvent: Array<SupportConversation>;
  supportMessages: Array<SupportMessage>;
  supportQueue: Array<SupportConversation>;
  supportUnassigned: Array<SupportConversation>;
  table: Array<TablePayload>;
  tablesBySection: Array<TablePayload>;
  templates: Array<TemplatePayload>;
  /** Fetch a single ticket by its cuid */
  ticketById: TicketPayload;
  /** Find the ticket created for a specific invitationId */
  ticketByInvitation: TicketPayload;
  /** Fetch all tickets belonging to a specific event */
  ticketsByEvent: Array<TicketPayload>;
  /** Find tickets linked to a specific guestProfileId */
  ticketsByGuest: Array<TicketPayload>;
  unreadCountsByEvent: Array<SupportConversation>;
  userAddressById: Maybe<UserAddress>;
  userAddresses: Array<UserAddress>;
  userById: UserPayload;
  users: Array<UserPayload>;
  validateAddress: AddressValidationPayload;
};


export type QueryActiveTemplateArgs = {
  channel: Channel;
  key: Scalars['String']['input'];
  locale: InputMaybe<Scalars['String']['input']>;
};


export type QueryAddressAutocompleteArgs = {
  countryCode: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};


export type QueryAdminGetEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAnalyticsCatalogSearchArgs = {
  lifecycle: InputMaybe<Scalars['String']['input']>;
  text: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsEventCatalogArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsEventSearchArgs = {
  filter: EventSearchInput;
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsFeatureFlagsArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsKpiValueArgs = {
  from: Scalars['DateTime']['input'];
  kpiId: Scalars['ID']['input'];
  to: Scalars['DateTime']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsMetricSeriesArgs = {
  from: Scalars['DateTime']['input'];
  metricId: Scalars['ID']['input'];
  to: Scalars['DateTime']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsRealtimeMetricArgs = {
  metricVersionId: Scalars['ID']['input'];
  windowMinutes: Scalars['Int']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsReplayJobsArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsRulesArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsSavedSearchesArgs = {
  resourceType: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsSchedulesArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsSecurityChartsArgs = {
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
  workspaceSlug: Scalars['String']['input'];
};


export type QueryAnalyticsSessionSearchArgs = {
  filter: SessionSearchInput;
  workspaceId: Scalars['ID']['input'];
};


export type QueryAnalyticsTrackingPlanSearchArgs = {
  lifecycle: InputMaybe<Scalars['String']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryCheckEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryCheckUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryConversationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventAccessArgs = {
  eventId: Scalars['ID']['input'];
  userId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryEventAddressByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventChildrenArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryEventGuestsArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryEventInvitationArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryEventRolesArgs = {
  eventId: Scalars['ID']['input'];
  includeArchived: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryEventRsvpArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventStaffArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryEventTablesArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QueryEventTreeArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryExplainMetricArgs = {
  from: InputMaybe<Scalars['DateTime']['input']>;
  metricId: Scalars['ID']['input'];
  to: InputMaybe<Scalars['DateTime']['input']>;
  version: InputMaybe<Scalars['Int']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryGeocodeAddressArgs = {
  input: GeocodeAddressInput;
};


export type QueryGetByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryGetCitiesByPostalCodeArgs = {
  postalCodeId: Scalars['ID']['input'];
};


export type QueryGetCitiesByStateArgs = {
  stateId: Scalars['ID']['input'];
};


export type QueryGetCityByNameAndStateArgs = {
  name: Scalars['String']['input'];
  stateId: Scalars['ID']['input'];
};


export type QueryGetCountryByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetEventAddressByEventIdArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryGetFullByEventIdsArgs = {
  eventIds: Array<Scalars['ID']['input']>;
};


export type QueryGetGeoLocationInfoArgs = {
  countryCode: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};


export type QueryGetHouseNumberByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetPlusOnesByInvitationArgs = {
  invitationId: Scalars['ID']['input'];
};


export type QueryGetPostalCodeByNameAndCityArgs = {
  cityId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
};


export type QueryGetPostalCodesByCityArgs = {
  cityId: Scalars['ID']['input'];
};


export type QueryGetPostalCodesByStateArgs = {
  stateId: Scalars['ID']['input'];
};


export type QueryGetSeatByGuestAndEventArgs = {
  input: GuestEventSeatInput;
};


export type QueryGetSeatListArgs = {
  seatIds: Array<Scalars['ID']['input']>;
};


export type QueryGetStateByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetStatesByCountryArgs = {
  countryId: Scalars['ID']['input'];
};


export type QueryGetStreetByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetTenantArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserAddressesByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserListArgs = {
  userIds: Array<Scalars['ID']['input']>;
};


export type QueryInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLatestLayoutVersionArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryLayoutChangeLogArgs = {
  eventId: Scalars['ID']['input'];
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLayoutVersionsArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryListTenantsArgs = {
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryMediaUrlArgs = {
  mediaId: Scalars['String']['input'];
};


export type QueryMediaVariantUrlArgs = {
  format: Scalars['String']['input'];
  mediaId: Scalars['String']['input'];
  width: Scalars['Float']['input'];
};


export type QueryMessagesArgs = {
  before?: InputMaybe<Scalars['DateTime']['input']>;
  conversationId: Scalars['ID']['input'];
  limit?: Scalars['Int']['input'];
};


export type QueryMyEventAccessArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryMyNotificationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationArgs = {
  id: Scalars['String']['input'];
};


export type QueryNotificationsArgs = {
  filter: InputMaybe<NotificationFilterInput>;
  limit: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPnpmArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPublicEventTreeArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryQuickReplyArgs = {
  id: Scalars['String']['input'];
};


export type QueryRsvpSupportConversationArgs = {
  invitationId: Scalars['String']['input'];
};


export type QueryRsvpSupportMessagesArgs = {
  invitationId: Scalars['String']['input'];
  limit: InputMaybe<Scalars['Float']['input']>;
};


export type QueryScanLogsByTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type QuerySeatArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySeatAssignmentLogsArgs = {
  eventId: Scalars['String']['input'];
};


export type QuerySeatLayoutArgs = {
  eventId: Scalars['ID']['input'];
};


export type QuerySeatPresencesByEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type QuerySeatsArgs = {
  eventId: Scalars['ID']['input'];
};


export type QuerySeatsBySectionArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QuerySeatsByTableArgs = {
  tableId: Scalars['ID']['input'];
};


export type QuerySectionArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySectionsArgs = {
  eventId: Scalars['String']['input'];
};


export type QuerySupportAssignedToMeArgs = {
  eventId: Scalars['String']['input'];
};


export type QuerySupportConversationArgs = {
  id: Scalars['String']['input'];
};


export type QuerySupportConversationCountArgs = {
  eventId: Scalars['String']['input'];
  status: InputMaybe<ConversationStatus>;
};


export type QuerySupportConversationsByEventArgs = {
  eventId: Scalars['String']['input'];
};


export type QuerySupportMessagesArgs = {
  conversationId: Scalars['String']['input'];
  limit: InputMaybe<Scalars['Float']['input']>;
};


export type QuerySupportQueueArgs = {
  eventId: Scalars['String']['input'];
};


export type QuerySupportUnassignedArgs = {
  eventId: Scalars['String']['input'];
};


export type QueryTableArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QueryTablesBySectionArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QueryTemplatesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryTicketByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTicketByInvitationArgs = {
  invitationId: Scalars['ID']['input'];
};


export type QueryTicketsByEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryTicketsByGuestArgs = {
  guestProfileId: Scalars['ID']['input'];
};


export type QueryUnreadCountsByEventArgs = {
  eventId: Scalars['String']['input'];
};


export type QueryUserAddressByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAddressesArgs = {
  filter: InputMaybe<UserAddressFilter>;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryValidateAddressArgs = {
  input: AddressValidationInput;
};

export type QuickReply = {
  __typename: 'QuickReply';
  body: Scalars['String']['output'];
  channel: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** RSVP input for an invitation. A YES response may include optional contact information. */
export type RsvpInput = {
  /** The RSVP response: YES, NO, or MAYBE. */
  choice: RsvpChoice;
  /** ID of the invitation for which the guest is submitting an RSVP. */
  invitationId: Scalars['ID']['input'];
  /** Additional contact info provided when the guest RSVPs YES. Ignored when choice !== YES. */
  replyInput: InputMaybe<AcceptRsvpInput>;
};

export enum RealmRoleType {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC',
  ELITE = 'ELITE',
  GUEST = 'GUEST',
  SUPREME = 'SUPREME',
  USER = 'USER'
}

export enum RelationshipType {
  BUSINESS_PARTNER = 'BUSINESS_PARTNER',
  CHILD = 'CHILD',
  COLLEAGUE = 'COLLEAGUE',
  COUSIN = 'COUSIN',
  FAMILY = 'FAMILY',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER',
  PARENT = 'PARENT',
  PARTNER = 'PARTNER',
  RELATIVE = 'RELATIVE',
  SIBLING = 'SIBLING'
}

export type RemoveEventRoleInput = {
  eventId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type RemoveTimelineInput = {
  id: Scalars['ID']['input'];
};

export type RemoveUserFromEventInput = {
  eventId: Scalars['String']['input'];
  eventRole: UserRoleType;
  userId: Scalars['String']['input'];
};

export type RenameConflict = {
  __typename: 'RenameConflict';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type RenamePayload = {
  __typename: 'RenamePayload';
  affectedSeats: Scalars['Float']['output'];
  success: Scalars['Boolean']['output'];
};

export type RenameSectionInput = {
  newName: Scalars['String']['input'];
  sectionId: Scalars['ID']['input'];
};

export type RenameTableInput = {
  newName: Scalars['String']['input'];
  tableId: Scalars['ID']['input'];
};

export type ReplayFilterInput = {
  eventName: InputMaybe<Scalars['String']['input']>;
  from: InputMaybe<Scalars['String']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  to: InputMaybe<Scalars['String']['input']>;
};

export type ReplayJobPayload = {
  __typename: 'ReplayJobPayload';
  dryRun: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  inputCount: Scalars['String']['output'];
  replayedCount: Scalars['String']['output'];
  skippedCount: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ResendGuestConfirmationItem = {
  __typename: 'ResendGuestConfirmationItem';
  invitationId: Scalars['ID']['output'];
  reason: Maybe<Scalars['String']['output']>;
  resent: Scalars['Boolean']['output'];
};

export type ResendGuestConfirmationsPayload = {
  __typename: 'ResendGuestConfirmationsPayload';
  resent: Scalars['Int']['output'];
  results: Array<ResendGuestConfirmationItem>;
  skipped: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ResetVerificationPayload = {
  __typename: 'ResetVerificationPayload';
  mfaMethod: MfaPreference;
  mfaRequired: Scalars['Boolean']['output'];
};

export type RevokeTicketInput = {
  reason: InputMaybe<Scalars['String']['input']>;
  ticketId: Scalars['ID']['input'];
};

export enum RsvpChoice {
  MAYBE = 'MAYBE',
  NO = 'NO',
  YES = 'YES'
}

export type RsvpSupportConversationResult = {
  __typename: 'RsvpSupportConversationResult';
  conversation: Maybe<SupportConversation>;
  messages: Array<SupportMessage>;
};

export type SaveLayoutVersionInput = {
  data: Scalars['JSON']['input'];
  eventId: Scalars['ID']['input'];
  label: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
};

export type SavedSearchPayload = {
  __typename: 'SavedSearchPayload';
  definitionJson: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lifecycle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  resourceType: Scalars['String']['output'];
};

export type ScanInput = {
  deviceId: Scalars['String']['input'];
  gate: InputMaybe<Scalars['String']['input']>;
  signature: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type ScanLogPayload = {
  __typename: 'ScanLogPayload';
  actorId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deviceId: Maybe<Scalars['String']['output']>;
  direction: PresenceState;
  eventId: Scalars['String']['output'];
  gate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  nonce: Maybe<Scalars['Int']['output']>;
  ticketId: Scalars['ID']['output'];
  verdict: ScanVerdict;
};

export type ScanPayload = {
  __typename: 'ScanPayload';
  log: ScanLogPayload;
  message: Scalars['String']['output'];
  ticket: TicketPayload;
  verdict: ScanVerdict;
};

/** The result of a ticket scan, including anti-sharing cases. */
export enum ScanVerdict {
  BLOCKED = 'BLOCKED',
  DEVICE_MISMATCH = 'DEVICE_MISMATCH',
  EXPIRED_EVENT = 'EXPIRED_EVENT',
  INVALID_NONCE = 'INVALID_NONCE',
  OK = 'OK',
  REPLAY = 'REPLAY',
  REVOKED = 'REVOKED',
  UNKNOWN = 'UNKNOWN'
}

export type SearchPageInfoPayload = {
  __typename: 'SearchPageInfoPayload';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export enum SeatAssignmentAction {
  ASSIGNED = 'ASSIGNED',
  MOVED = 'MOVED',
  UNASSIGNED = 'UNASSIGNED'
}

export type SeatAssignmentLogPayload = {
  __typename: 'SeatAssignmentLogPayload';
  action: SeatAssignmentAction;
  createdAt: Scalars['DateTime']['output'];
  data: Maybe<Scalars['JSON']['output']>;
  eventId: Scalars['ID']['output'];
  guestId: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  invitationId: Maybe<Scalars['ID']['output']>;
  seatId: Scalars['ID']['output'];
};

export type SeatColorGroupInput = {
  id: InputMaybe<Scalars['String']['input']>;
  invitedByValues: Array<Scalars['String']['input']>;
  matchType: SeatColorGroupMatchType;
  name: Scalars['String']['input'];
  order: Scalars['Int']['input'];
  priority: Scalars['Int']['input'];
  style: SeatColorGroupStyleInput;
};

export enum SeatColorGroupMatchType {
  ALL = 'ALL',
  CUSTOM = 'CUSTOM',
  NONE = 'NONE',
  SINGLE = 'SINGLE'
}

export type SeatColorGroupPayload = {
  __typename: 'SeatColorGroupPayload';
  id: Scalars['String']['output'];
  invitedByValues: Array<Scalars['String']['output']>;
  isOrphaned: Scalars['Boolean']['output'];
  matchType: SeatColorGroupMatchType;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  priority: Scalars['Int']['output'];
  style: SeatColorGroupStyle;
};

export type SeatColorGroupStyle = {
  __typename: 'SeatColorGroupStyle';
  background: Scalars['String']['output'];
  border: Scalars['String']['output'];
  foreground: Scalars['String']['output'];
  legendIcon: Scalars['String']['output'];
};

export type SeatColorGroupStyleInput = {
  background: Scalars['String']['input'];
  border: Scalars['String']['input'];
  foreground: Scalars['String']['input'];
  legendIcon: Scalars['String']['input'];
};

export type SeatConfigInput = {
  count: Scalars['Int']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  shape: Scalars['String']['input'];
};

export type SeatPayload = {
  __typename: 'SeatPayload';
  colorGroup: Maybe<SeatColorGroupPayload>;
  createdAt: Scalars['DateTime']['output'];
  eventId: Scalars['String']['output'];
  guestId: Maybe<Scalars['ID']['output']>;
  height: Maybe<Scalars['Float']['output']>;
  hidden: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  invitationId: Maybe<Scalars['ID']['output']>;
  label: Maybe<Scalars['String']['output']>;
  locked: Scalars['Boolean']['output'];
  meta: Maybe<Scalars['JSON']['output']>;
  note: Maybe<Scalars['String']['output']>;
  number: Maybe<Scalars['Float']['output']>;
  radius: Maybe<Scalars['Float']['output']>;
  rotation: Maybe<Scalars['Float']['output']>;
  seatType: Maybe<SeatType>;
  section: SectionPayload;
  sectionId: Scalars['String']['output'];
  shape: SeatShape;
  status: Scalars['String']['output'];
  table: Maybe<TablePayload>;
  tableId: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  width: Maybe<Scalars['Float']['output']>;
  x: Maybe<Scalars['Float']['output']>;
  y: Maybe<Scalars['Float']['output']>;
  zIndex: Maybe<Scalars['Int']['output']>;
};

export type SeatPresencePayload = {
  __typename: 'SeatPresencePayload';
  checkedInAt: Maybe<Scalars['DateTime']['output']>;
  presenceState: PresenceState;
  revoked: Scalars['Boolean']['output'];
  revokedAt: Maybe<Scalars['DateTime']['output']>;
  seatId: Scalars['ID']['output'];
};

export enum SeatShape {
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE',
  SQUARE = 'SQUARE'
}

export enum SeatType {
  CHILD = 'CHILD',
  RESERVED = 'RESERVED',
  STAFF = 'STAFF',
  STANDARD = 'STANDARD',
  STANDING = 'STANDING',
  VIP = 'VIP'
}

export type SectionInput = {
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  order: InputMaybe<Scalars['Int']['input']>;
  shape: Scalars['String']['input'];
  tables: Array<TableConfigInput>;
};

export type SectionPayload = {
  __typename: 'SectionPayload';
  capacity: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  eventId: Scalars['String']['output'];
  height: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  meta: Scalars['JSON']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Float']['output'];
  rotation: Maybe<Scalars['Float']['output']>;
  seats: Array<SeatPayload>;
  shape: SectionShape;
  tables: Array<TablePayload>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  width: Maybe<Scalars['Float']['output']>;
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export enum SectionShape {
  CIRCLE = 'CIRCLE',
  POLYGON = 'POLYGON',
  RECTANGLE = 'RECTANGLE'
}

export type SecurityQuestionAnswerInput = {
  answer: Scalars['String']['input'];
  questionId: Scalars['String']['input'];
};

/** Specifies the type/category of a phone number. */
export enum SecurityQuestionEnum {
  BIRTH_CITY = 'BIRTH_CITY',
  BIRTH_DATE = 'BIRTH_DATE',
  CHILDHOOD_BEST_FRIEND = 'CHILDHOOD_BEST_FRIEND',
  FAVORITE_SCHOOL_SUBJECT = 'FAVORITE_SCHOOL_SUBJECT',
  FAVOURITE_COMPANY = 'FAVOURITE_COMPANY',
  FIRST_PET = 'FIRST_PET',
  MOTHER_MAIDEN_NAME = 'MOTHER_MAIDEN_NAME'
}

export type SecurityQuestionPayload = {
  __typename: 'SecurityQuestionPayload';
  id: Scalars['ID']['output'];
  key: SecurityQuestionEnum;
  question: Scalars['String']['output'];
};

/**
 * =====================================================
 * SEED PAYLOAD
 * =====================================================
 */
export type SeedPayload = {
  __typename: 'SeedPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SendInvitationsInput = {
  guests: Array<InvitationGuestInput>;
  hostName: InputMaybe<Scalars['String']['input']>;
};

export type SessionSearchConnectionPayload = {
  __typename: 'SessionSearchConnectionPayload';
  nodes: Array<SessionSearchItemPayload>;
  pageInfo: SearchPageInfoPayload;
};

export type SessionSearchInput = {
  anonymousId: InputMaybe<Scalars['String']['input']>;
  cursor: InputMaybe<Scalars['String']['input']>;
  environment: InputMaybe<Scalars['String']['input']>;
  from: InputMaybe<Scalars['DateTime']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  to: InputMaybe<Scalars['DateTime']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
};

export type SessionSearchItemPayload = {
  __typename: 'SessionSearchItemPayload';
  anonymousId: Maybe<Scalars['String']['output']>;
  durationMs: Scalars['String']['output'];
  environment: Scalars['String']['output'];
  eventCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lastSeenAt: Scalars['DateTime']['output'];
  sourceId: Scalars['ID']['output'];
  startedAt: Scalars['DateTime']['output'];
  userId: Maybe<Scalars['String']['output']>;
};

export type SetEventRolePermissionsInput = {
  eventId: Scalars['ID']['input'];
  permissionKeys: Array<Scalars['String']['input']>;
  roleId: Scalars['ID']['input'];
};

export type SetTimelineInput = {
  eventId: Scalars['ID']['input'];
  timelines: Array<TimelineUpsertInput>;
};

export type SettingsPayload = {
  __typename: 'SettingsPayload';
  allowGuestSeatSelection: Scalars['Boolean']['output'];
  allowPlusOneUpdate: Scalars['Boolean']['output'];
  allowPublicPlusOne: Scalars['Boolean']['output'];
  allowPublicRsvp: Scalars['Boolean']['output'];
  allowPublicRsvpWebsite: Scalars['Boolean']['output'];
  allowReEntry: Scalars['Boolean']['output'];
  allowSeatOverbooking: Scalars['Boolean']['output'];
  approvalMode: InvitationApprovalMode;
  category: EventCategory;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  dressCode: Maybe<Scalars['String']['output']>;
  endsAt: Scalars['DateTime']['output'];
  guestConfirmationMaxResends: Maybe<Scalars['Int']['output']>;
  guestConfirmationReminderEnabled: Scalars['Boolean']['output'];
  guestConfirmationReminderPresets: Array<GuestReminderPreset>;
  id: Scalars['ID']['output'];
  invitedByOptions: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isPublic: Scalars['Boolean']['output'];
  maxPlusOnes: Scalars['Float']['output'];
  maxSeats: Scalars['Float']['output'];
  publicRsvpWebsite: Maybe<Scalars['String']['output']>;
  requireApprovalForPlusOnes: Scalars['Boolean']['output'];
  rotateSeconds: Scalars['Float']['output'];
  rsvpDeadline: Maybe<Scalars['DateTime']['output']>;
  scheduleTicketRelease: Scalars['Boolean']['output'];
  seatColorGroups: Array<SeatColorGroupPayload>;
  startsAt: Scalars['DateTime']['output'];
  ticketReleaseAt: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  visibleTabs: Array<EventVisibleTab>;
};

export type SignUpPayload = {
  __typename: 'SignUpPayload';
  message: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  token: Maybe<TokenPayload>;
  user: Maybe<KcUser>;
  userId: Maybe<Scalars['ID']['output']>;
  username: Maybe<Scalars['String']['output']>;
};

export type SignUpResultsPayload = {
  __typename: 'SignUpResultsPayload';
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type StageInvitationDataInput = {
  invitationId: Scalars['ID']['input'];
};

/**
 * =====================================================
 * STATE TYPE
 * =====================================================
 */
export type State = {
  __typename: 'State';
  code: Scalars['String']['output'];
  country: Country;
  id: Scalars['ID']['output'];
  iso3166Code: Maybe<Scalars['String']['output']>;
  latitude: Maybe<Scalars['Float']['output']>;
  level: Maybe<Scalars['Int']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  parent: Maybe<State>;
  population: Maybe<Scalars['Int']['output']>;
  timezones: Array<Timezone>;
  type: Maybe<Scalars['String']['output']>;
};

/**
 * =====================================================
 * FILTER INPUT
 * =====================================================
 */
export type StateFilterInput = {
  code: InputMaybe<Scalars['String']['input']>;
  countryId: InputMaybe<Scalars['ID']['input']>;
  countryIso2: InputMaybe<Scalars['String']['input']>;
  countryIso3: InputMaybe<Scalars['String']['input']>;
  iso3166_2: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  type: InputMaybe<Scalars['String']['input']>;
};

/**
 * =====================================================
 * PAGINATION WRAPPER
 * =====================================================
 */
export type StatePage = {
  __typename: 'StatePage';
  content: Array<State>;
  number: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  totalElements: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export enum StatusType {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export type StepUpVerificationInputGql = {
  answers: InputMaybe<Array<SecurityQuestionAnswerInput>>;
  code: InputMaybe<Scalars['String']['input']>;
  credentialResponse: InputMaybe<Scalars['JSON']['input']>;
  token: Scalars['String']['input'];
};

export type Street = {
  __typename: 'Street';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Subregion = {
  __typename: 'Subregion';
  continent: Continent;
  countries: Array<Country>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Subscription = {
  __typename: 'Subscription';
  conversationUpdated: Conversation;
  eventConversationsChanged: EventConversationsUpdate;
  messageReceived: Message;
  rsvpSupportMessageReceived: SupportMessage;
  supportMessageReceived: SupportMessage;
};


export type SubscriptionEventConversationsChangedArgs = {
  eventId: Scalars['String']['input'];
};


export type SubscriptionMessageReceivedArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionRsvpSupportMessageReceivedArgs = {
  invitationId: Scalars['String']['input'];
};


export type SubscriptionSupportMessageReceivedArgs = {
  conversationId: Scalars['String']['input'];
};

/** Generic success response payload used across mutations. Includes a boolean status flag and an optional human-readable message. */
export type SuccessPayload = {
  __typename: 'SuccessPayload';
  /** Optional human-readable message providing additional context about the operation result. */
  message: Maybe<Scalars['String']['output']>;
  /** Indicates whether the operation was successful. */
  ok: Scalars['Boolean']['output'];
};

export type SupportConversation = {
  __typename: 'SupportConversation';
  assignedTo: Maybe<Scalars['String']['output']>;
  channel: ConversationChannel;
  closedAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  eventId: Scalars['String']['output'];
  guestContact: Maybe<Scalars['String']['output']>;
  guestName: Scalars['String']['output'];
  guestUnreadCount: Maybe<Scalars['Int']['output']>;
  guestUserId: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invitationId: Maybe<Scalars['String']['output']>;
  lastMessageAt: Maybe<Scalars['DateTime']['output']>;
  lastMessagePreview: Maybe<Scalars['String']['output']>;
  priority: ConversationPriority;
  status: ConversationStatus;
  subject: Maybe<Scalars['String']['output']>;
  unreadCount: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type SupportMessage = {
  __typename: 'SupportMessage';
  body: Maybe<Scalars['String']['output']>;
  channel: ConversationChannel;
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deliveredAt: Maybe<Scalars['DateTime']['output']>;
  direction: SupportMessageDirection;
  externalId: Maybe<Scalars['String']['output']>;
  fromGuest: Scalars['Boolean']['output'];
  fromUserId: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mediaUrl: Maybe<Scalars['String']['output']>;
  mimeType: Maybe<Scalars['String']['output']>;
  readAt: Maybe<Scalars['DateTime']['output']>;
  status: SupportMessageStatus;
};

export enum SupportMessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export enum SupportMessageStatus {
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  READ = 'READ',
  SENT = 'SENT'
}

export type TableConfigInput = {
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<Scalars['Int']['input']>;
  seats: SeatConfigInput;
  shape: Scalars['String']['input'];
};

export type TablePayload = {
  __typename: 'TablePayload';
  capacity: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  eventId: Scalars['String']['output'];
  height: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  meta: Scalars['JSON']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Float']['output'];
  rotation: Maybe<Scalars['Float']['output']>;
  seats: Array<SeatPayload>;
  section: SectionPayload;
  sectionId: Scalars['String']['output'];
  shape: TableShape;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  width: Maybe<Scalars['Float']['output']>;
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export enum TableShape {
  OVAL = 'OVAL',
  RECTANGLE = 'RECTANGLE',
  ROUND = 'ROUND',
  ROW = 'ROW'
}

export type TemplatePayload = {
  __typename: 'TemplatePayload';
  body: Scalars['String']['output'];
  channel: Channel;
  createdAt: Scalars['DateTime']['output'];
  format: ContentFormat;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  locale: Scalars['String']['output'];
  subject: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  variables: Scalars['JSON']['output'];
  version: Scalars['Float']['output'];
};

export type TenantType = {
  __typename: 'TenantType';
  createdAt: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
};

export type TicketPayload = {
  __typename: 'TicketPayload';
  checkedInAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentState: PresenceState;
  deviceActivationAt: Maybe<Scalars['DateTime']['output']>;
  deviceActivationIP: Maybe<Scalars['String']['output']>;
  deviceId: Maybe<Scalars['String']['output']>;
  devicePublicKey: Maybe<Scalars['String']['output']>;
  eventId: Scalars['ID']['output'];
  guestProfileId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  invitationId: Scalars['ID']['output'];
  lastNonce: Maybe<Scalars['Int']['output']>;
  nextNonce: Maybe<Scalars['Int']['output']>;
  revoked: Scalars['Boolean']['output'];
  revokedAt: Maybe<Scalars['DateTime']['output']>;
  revokedBy: Maybe<Scalars['String']['output']>;
  revokedReason: Maybe<Scalars['String']['output']>;
  seatId: Scalars['ID']['output'];
  updatedAt: Maybe<Scalars['DateTime']['output']>;
};

export type TimelineUpsertInput = {
  id: InputMaybe<Scalars['ID']['input']>;
  label: Scalars['String']['input'];
  timestamp: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type Timezone = {
  __typename: 'Timezone';
  abbreviation: Scalars['String']['output'];
  countries: Array<Country>;
  gmtOffset: Scalars['String']['output'];
  gmtOffsetName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  tzName: Scalars['String']['output'];
  zoneName: Scalars['String']['output'];
};

export type TokenPayload = {
  __typename: 'TokenPayload';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['String']['output'];
  idToken: Scalars['String']['output'];
  refreshExpiresIn: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  scope: Scalars['String']['output'];
};

export type TotpSetupPayload = {
  __typename: 'TotpSetupPayload';
  otpauth: Maybe<Scalars['String']['output']>;
  secret: Maybe<Scalars['String']['output']>;
  uri: Maybe<Scalars['String']['output']>;
};

export type TrackingPlanSearchItemPayload = {
  __typename: 'TrackingPlanSearchItemPayload';
  activeVersion: Maybe<Scalars['Int']['output']>;
  environment: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lifecycle: Scalars['String']['output'];
  sourceId: Scalars['ID']['output'];
};

export type TransferInput = {
  eventId: Scalars['ID']['input'];
  newOwnerId: Scalars['ID']['input'];
};

export type UpdateEventAddressInput = {
  additionalInfo: InputMaybe<Scalars['String']['input']>;
  cityId: InputMaybe<Scalars['ID']['input']>;
  countryId: InputMaybe<Scalars['ID']['input']>;
  eventId: Scalars['ID']['input'];
  houseNumber: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  postalCodeId: InputMaybe<Scalars['ID']['input']>;
  stateId: InputMaybe<Scalars['ID']['input']>;
  street: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventInput = {
  eventId: Scalars['String']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  parentId: InputMaybe<Scalars['String']['input']>;
  settings: InputMaybe<UpdateSettingsInput>;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateEventRoleInput = {
  color: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  icon: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['ID']['input'];
};

export type UpdateKcUserInput = {
  email: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeInput = {
  personalInfo: InputMaybe<PersonalInfoInput>;
};

export type UpdateMyProfileInput = {
  email: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  username: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlusOneInput = {
  email: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  plusOneAgeCategory: PlusOneAgeCategory;
};

export type UpdateSeatInput = {
  id: Scalars['ID']['input'];
  label: InputMaybe<Scalars['String']['input']>;
  meta: InputMaybe<Scalars['JSON']['input']>;
  note: InputMaybe<Scalars['String']['input']>;
  number: InputMaybe<Scalars['Int']['input']>;
  rotation: InputMaybe<Scalars['Float']['input']>;
  seatType: InputMaybe<SeatType>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateSectionInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  height: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<Scalars['Int']['input']>;
  shape: InputMaybe<SectionShape>;
  width: InputMaybe<Scalars['Float']['input']>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateSettingsInput = {
  allowGuestSeatSelection: InputMaybe<Scalars['Boolean']['input']>;
  allowPlusOneUpdate: InputMaybe<Scalars['Boolean']['input']>;
  allowPublicPlusOne: InputMaybe<Scalars['Boolean']['input']>;
  allowPublicRsvp: InputMaybe<Scalars['Boolean']['input']>;
  allowPublicRsvpWebsite: InputMaybe<Scalars['Boolean']['input']>;
  allowReEntry: InputMaybe<Scalars['Boolean']['input']>;
  allowSeatOverbooking: InputMaybe<Scalars['Boolean']['input']>;
  approvalMode: InputMaybe<InvitationApprovalMode>;
  category: InputMaybe<EventCategory>;
  description: InputMaybe<Scalars['String']['input']>;
  dressCode: InputMaybe<Scalars['String']['input']>;
  endsAt: InputMaybe<Scalars['DateTime']['input']>;
  guestConfirmationMaxResends: InputMaybe<Scalars['Int']['input']>;
  guestConfirmationReminderEnabled: InputMaybe<Scalars['Boolean']['input']>;
  guestConfirmationReminderPresets: InputMaybe<Array<GuestReminderPreset>>;
  invitedByOptions: InputMaybe<Array<Scalars['String']['input']>>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  isPublic: InputMaybe<Scalars['Boolean']['input']>;
  maxPlusOnes: InputMaybe<Scalars['Int']['input']>;
  maxSeats: InputMaybe<Scalars['Int']['input']>;
  publicRsvpWebsite: InputMaybe<Scalars['String']['input']>;
  requireApprovalForPlusOnes: InputMaybe<Scalars['Boolean']['input']>;
  rotateSeconds: InputMaybe<Scalars['Int']['input']>;
  rsvpDeadline: InputMaybe<Scalars['DateTime']['input']>;
  scheduleTicketRelease: InputMaybe<Scalars['Boolean']['input']>;
  seatColorGroups: InputMaybe<Array<SeatColorGroupInput>>;
  startsAt: InputMaybe<Scalars['DateTime']['input']>;
  ticketReleaseAt: InputMaybe<Scalars['DateTime']['input']>;
  visibleTabs: InputMaybe<Array<EventVisibleTab>>;
};

export type UpdateTableInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  height: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<Scalars['Int']['input']>;
  rotation: InputMaybe<Scalars['Float']['input']>;
  shape: InputMaybe<TableShape>;
  width: InputMaybe<Scalars['Float']['input']>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateTemplateInput = {
  body: InputMaybe<Scalars['String']['input']>;
  bumpVersion: Scalars['Boolean']['input'];
  format: InputMaybe<ContentFormat>;
  id: Scalars['ID']['input'];
  locale: InputMaybe<Scalars['String']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
  variables: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateTenantInput = {
  id: Scalars['String']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  updatedBy: Scalars['String']['input'];
};

export type UpdateTimelineInput = {
  id: Scalars['ID']['input'];
  label: Scalars['String']['input'];
  timestamp: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type UpdateUserAddressInput = {
  additionalInfo: InputMaybe<Scalars['String']['input']>;
  addressType: InputMaybe<AddressType>;
  id: Scalars['ID']['input'];
};

export type UpdateUserInput = {
  id: Scalars['ID']['input'];
  status: InputMaybe<PersonStatusType>;
  userType: InputMaybe<UserType>;
};

export type UpdateUserPasswordInput = {
  id: InputMaybe<Scalars['ID']['input']>;
  newPassword: InputMaybe<Scalars['String']['input']>;
};

export type UserAddress = {
  __typename: 'UserAddress';
  additionalInfo: Maybe<Scalars['String']['output']>;
  addressType: AddressType;
  cityId: Maybe<Scalars['String']['output']>;
  countryId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  houseNumberId: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  postalCodeId: Maybe<Scalars['String']['output']>;
  stateId: Maybe<Scalars['String']['output']>;
  streetId: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type UserAddressFilter = {
  addressType: InputMaybe<AddressType>;
  cityId: InputMaybe<Scalars['ID']['input']>;
  countryId: InputMaybe<Scalars['ID']['input']>;
  postalCodeId: InputMaybe<Scalars['ID']['input']>;
  userId: InputMaybe<Scalars['ID']['input']>;
};

export type UserAddressInput = {
  additionalInfo: InputMaybe<Scalars['String']['input']>;
  addressType: Scalars['String']['input'];
  cityId: Scalars['ID']['input'];
  countryId: Scalars['ID']['input'];
  houseNumber: InputMaybe<Scalars['String']['input']>;
  postalCodeId: InputMaybe<Scalars['ID']['input']>;
  stateId: InputMaybe<Scalars['ID']['input']>;
  street: InputMaybe<Scalars['String']['input']>;
};

export type UserAddressPayload = {
  __typename: 'UserAddressPayload';
  additionalInfo: Maybe<Scalars['String']['output']>;
  addressType: AddressType;
  city: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  houseNumber: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  postalCode: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  street: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

export type UserPayload = {
  __typename: 'UserPayload';
  contacts: Maybe<Array<ContactPayload>>;
  createdAt: Scalars['DateTime']['output'];
  customer: Maybe<CustomerPayload>;
  employee: Maybe<EmployeePayload>;
  id: Scalars['ID']['output'];
  personalInfo: Maybe<PersonalInfoPayload>;
  role: Maybe<RealmRoleType>;
  status: PersonStatusType;
  updatedAt: Scalars['DateTime']['output'];
  userType: UserType;
  username: Scalars['String']['output'];
};

export type UserRolePayload = {
  __typename: 'UserRolePayload';
  eventId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: UserRoleType;
  userId: Scalars['String']['output'];
};

/** Role of a user inside an event */
export enum UserRoleType {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  GUEST = 'GUEST',
  SECURITY = 'SECURITY',
  SUPPORT = 'SUPPORT',
  USHER = 'USHER'
}

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST'
}

export type WebAuthnDevicePayload = {
  __typename: 'WebAuthnDevicePayload';
  backedUp: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  credentialId: Scalars['String']['output'];
  deviceType: Scalars['String']['output'];
  lastUsedAt: Maybe<Scalars['DateTime']['output']>;
  nickname: Maybe<Scalars['String']['output']>;
  revokedAt: Maybe<Scalars['DateTime']['output']>;
};
