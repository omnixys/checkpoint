export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string };
  /** JSON custom scalar type */
  JSON: { input: unknown; output: unknown };
}

/** Optional contact information submitted when a guest RSVPs YES. This data is stored in the invitation or forwarded to the ephemeral contact store. */
export interface AcceptRsvpInput {
  /** Email address of the guest. Optional. */
  email: InputMaybe<Scalars["String"]["input"]>;
  /** First name of the guest submitting the RSVP. */
  firstName: Scalars["String"]["input"];
  /** Optional note from guest. */
  guestNote: InputMaybe<Scalars["String"]["input"]>;
  /** Last name of the guest submitting the RSVP. */
  lastName: Scalars["String"]["input"];
  /** Required list of phone numbers for contact. */
  phoneNumbers: PhoneNumberInput[];
  /** Optional list of additional guests (plus-ones) */
  plusOnes: InputMaybe<PublicPlusOneInput[]>;
}

export interface ActivateDeviceInput {
  deviceId: Scalars["String"]["input"];
  publicKey: Scalars["String"]["input"];
  ticketId: Scalars["String"]["input"];
}

export interface AddContactInput {
  Contact: ContactInput;
  userId: Scalars["ID"]["input"];
}

export interface AddSecurityQuestionInput {
  answer: Scalars["String"]["input"];
  questionId: Scalars["ID"]["input"];
}

export interface AddressAutocompletePayload {
  __typename: "AddressAutocompletePayload";
  city: Maybe<Scalars["String"]["output"]>;
  confidence: Maybe<Scalars["Float"]["output"]>;
  country: Maybe<Scalars["String"]["output"]>;
  formatted: Maybe<Scalars["String"]["output"]>;
  houseNumber: Maybe<Scalars["String"]["output"]>;
  lat: Maybe<Scalars["Float"]["output"]>;
  lon: Maybe<Scalars["Float"]["output"]>;
  postalCode: Maybe<Scalars["String"]["output"]>;
  state: Maybe<Scalars["String"]["output"]>;
  street: Maybe<Scalars["String"]["output"]>;
}

export type AddressType = "BILLING" | "HOME" | "SHIPPING" | "WORK";

export interface AddressValidationInput {
  city: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  houseNumber: Scalars["String"]["input"];
  postalCode: Scalars["String"]["input"];
  state: Scalars["String"]["input"];
  street: Scalars["String"]["input"];
}

export interface AddressValidationPayload {
  __typename: "AddressValidationPayload";
  confidence: Maybe<Scalars["Float"]["output"]>;
  formatted: Maybe<Scalars["String"]["output"]>;
  lat: Maybe<Scalars["Float"]["output"]>;
  lon: Maybe<Scalars["Float"]["output"]>;
  reason: Scalars["String"]["output"];
  valid: Scalars["Boolean"]["output"];
}

export interface AdminSignUpInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: InputMaybe<Scalars["String"]["input"]>;
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
  username: InputMaybe<Scalars["String"]["input"]>;
}

export interface ApproveInvitationDataInput {
  /** ID of the invitation to approve/unapprove (cuid). */
  invitationId: Scalars["ID"]["input"];
  /** ID of the seat to assign when approving the invitation. */
  seatId: InputMaybe<Scalars["ID"]["input"]>;
}

/** Input used by admins to approve or unapprove an invitation. All other fields are system-managed. */
export interface ApproveInvitationInput {
  /** Admin approval flag (true = approved, false = unapproved). Requires admin permissions. */
  approved: Scalars["Boolean"]["input"];
  eventId: InputMaybe<Scalars["ID"]["input"]>;
  /** ID of the invitation to approve/unapprove (cuid). */
  invitationId: Scalars["ID"]["input"];
  /** ID of the seat to assign when approving the invitation. */
  seatId: InputMaybe<Scalars["ID"]["input"]>;
}

export interface AssignSeatInput {
  guestId: InputMaybe<Scalars["ID"]["input"]>;
  invitationId: InputMaybe<Scalars["String"]["input"]>;
  note: InputMaybe<Scalars["String"]["input"]>;
  seatId: Scalars["ID"]["input"];
}

export interface AssignUserRoleInput {
  eventId: Scalars["String"]["input"];
  eventRole: UserRoleType;
  userId: Scalars["String"]["input"];
}

export interface AutoGenerateLayoutInput {
  adaptiveRadius: Scalars["Boolean"]["input"];
  eventId: Scalars["ID"]["input"];
  sections: SectionInput[];
}

export interface AutoGenerateSeatMapInput {
  eventId: Scalars["ID"]["input"];
  seatCount: Scalars["Int"]["input"];
  sectionLayout: SectionShape;
  sectionName: Scalars["String"]["input"];
  spacing: InputMaybe<Scalars["Float"]["input"]>;
  tableCount: Scalars["Int"]["input"];
  tableShape: TableShape;
}

export interface BulkApproveInvitationInput {
  /** Approval flag applied to all invitations. */
  approved: Scalars["Boolean"]["input"];
  /** List of invitation IDs to approve/unapprove. */
  invitationIds: ApproveInvitationDataInput[];
}

export interface BulkRenamePayload {
  __typename: "BulkRenamePayload";
  affectedSeats: Scalars["Float"]["output"];
  affectedSections: Maybe<Scalars["Float"]["output"]>;
  affectedTables: Maybe<Scalars["Float"]["output"]>;
  conflicts: RenameConflict[];
  success: Scalars["Boolean"]["output"];
}

export interface CallingCode {
  __typename: "CallingCode";
  code: Scalars["String"]["output"];
  countries: Country[];
  id: Scalars["ID"]["output"];
}

export interface ChangeMyPasswordInput {
  newPassword: Scalars["String"]["input"];
  oldPassword: Scalars["String"]["input"];
}

export type Channel = "EMAIL" | "IN_APP" | "PUSH" | "SMS" | "WHATSAPP";

export interface Chat {
  __typename: "Chat";
  chatId: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  isGroup: Scalars["Boolean"]["output"];
  name: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
}

/**
 * =====================================================
 * CITY
 * =====================================================
 */
export interface City {
  __typename: "City";
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  level: Maybe<Scalars["Int"]["output"]>;
  location: Maybe<GeoPoint>;
  name: Scalars["String"]["output"];
  parent: Maybe<City>;
  population: Maybe<Scalars["Int"]["output"]>;
  postalCodes: Maybe<PostalCode[]>;
  state: State;
  timezone: Maybe<Timezone>;
  type: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["String"]["output"];
}

export interface CityFilterInput {
  maxPopulation: InputMaybe<Scalars["Int"]["input"]>;
  minPopulation: InputMaybe<Scalars["Int"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  stateId: InputMaybe<Scalars["ID"]["input"]>;
  type: InputMaybe<Scalars["String"]["input"]>;
}

export interface CloneSectionInput {
  offsetX: Scalars["Int"]["input"];
  offsetY: Scalars["Int"]["input"];
  sectionId: Scalars["String"]["input"];
}

export interface CompleteResetInputGql {
  newPassword: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
}

export interface ContactInput {
  contactId: Scalars["String"]["input"];
  emergency: InputMaybe<Scalars["Boolean"]["input"]>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  relationship: RelationshipType;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  withdrawalLimit: InputMaybe<Scalars["Int"]["input"]>;
}

export type ContactOptionsType = "EMAIL" | "LETTER" | "PHONE" | "SMS" | "WHATSAPP";

export interface ContactPayload {
  __typename: "ContactPayload";
  contactId: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  emergency: Scalars["Boolean"]["output"];
  endDate: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  relationship: RelationshipType;
  startDate: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
  userId: Scalars["String"]["output"];
  withdrawalLimit: Scalars["Float"]["output"];
}

export type ContentFormat = "HTML" | "MARKDOWN" | "TEXT";

export interface Continent {
  __typename: "Continent";
  code: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  subregion: Subregion[];
}

/**
 * =====================================================
 * COUNTRY
 * =====================================================
 */
export interface Country {
  __typename: "Country";
  areaSqKm: Maybe<Scalars["Float"]["output"]>;
  callingCode: Maybe<CallingCode>;
  continent: Continent;
  currency: Maybe<Currency>;
  flagPng: Maybe<Scalars["String"]["output"]>;
  flagSvg: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  iso2: Scalars["String"]["output"];
  iso3: Scalars["String"]["output"];
  languages: Language[];
  latitude: Maybe<Scalars["Float"]["output"]>;
  longitude: Maybe<Scalars["Float"]["output"]>;
  name: Scalars["String"]["output"];
  nationality: Maybe<Scalars["String"]["output"]>;
  numericCode: Maybe<Scalars["String"]["output"]>;
  population: Maybe<Scalars["Int"]["output"]>;
  subregion: Subregion;
  timezones: Timezone[];
  tld: Maybe<Scalars["String"]["output"]>;
}

/**
 * =====================================================
 * FILTER INPUT
 * =====================================================
 */
export interface CountryFilterInput {
  callingCode: InputMaybe<Scalars["String"]["input"]>;
  continent: InputMaybe<Scalars["String"]["input"]>;
  currencyCode: InputMaybe<Scalars["String"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  subregion: InputMaybe<Scalars["String"]["input"]>;
}

export interface CreateEventAddressInput {
  additionalInfo: InputMaybe<Scalars["String"]["input"]>;
  cityId: InputMaybe<Scalars["ID"]["input"]>;
  countryId: InputMaybe<Scalars["ID"]["input"]>;
  eventId: Scalars["ID"]["input"];
  houseNumberId: Scalars["ID"]["input"];
  postalCodeId: InputMaybe<Scalars["ID"]["input"]>;
  stateId: InputMaybe<Scalars["ID"]["input"]>;
  streetId: Scalars["ID"]["input"];
}

export interface CreateEventInput {
  address: InputMaybe<EventAddressInput>;
  children: InputMaybe<CreateEventInput[]>;
  name: Scalars["String"]["input"];
  parentId: InputMaybe<Scalars["ID"]["input"]>;
  settings: CreateSettingsInput;
  tags: InputMaybe<Scalars["String"]["input"][]>;
}

export interface CreateMediaDto {
  eventId: Scalars["String"]["input"];
  filename: Scalars["String"]["input"];
  key: Scalars["String"]["input"];
  mimetype: Scalars["String"]["input"];
  size: Scalars["Float"]["input"];
  type: MediaType;
  url: Scalars["String"]["input"];
}

export interface CreateNotificationInput {
  channel: Channel;
  dedupeKey: InputMaybe<Scalars["String"]["input"]>;
  expiresAt: InputMaybe<Scalars["DateTime"]["input"]>;
  metadata: InputMaybe<Scalars["JSON"]["input"]>;
  priority: InputMaybe<Priority>;
  recipientAddress: InputMaybe<Scalars["String"]["input"]>;
  recipientId: InputMaybe<Scalars["String"]["input"]>;
  recipientUsername: Scalars["String"]["input"];
  sensitive: InputMaybe<Scalars["Boolean"]["input"]>;
  templateId: InputMaybe<Scalars["String"]["input"]>;
  tenantId: InputMaybe<Scalars["String"]["input"]>;
  variables: InputMaybe<Scalars["JSON"]["input"]>;
}

export interface CreatePlusOneInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  eventId: Scalars["ID"]["input"];
  firstName: Scalars["String"]["input"];
  invitedByInvitationId: Scalars["ID"]["input"];
  lastName: Scalars["String"]["input"];
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
  plusOneAgeCategory: PlusOneAgeCategory;
}

export interface CreateSeatInput {
  eventId: Scalars["ID"]["input"];
  label: InputMaybe<Scalars["String"]["input"]>;
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  note: InputMaybe<Scalars["String"]["input"]>;
  number: InputMaybe<Scalars["Int"]["input"]>;
  rotation: InputMaybe<Scalars["Float"]["input"]>;
  seatType: InputMaybe<SeatType>;
  sectionId: Scalars["ID"]["input"];
  tableId: InputMaybe<Scalars["ID"]["input"]>;
  x: InputMaybe<Scalars["Float"]["input"]>;
  y: InputMaybe<Scalars["Float"]["input"]>;
}

export interface CreateSectionInput {
  capacity: InputMaybe<Scalars["Int"]["input"]>;
  eventId: Scalars["ID"]["input"];
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
  order: InputMaybe<Scalars["Int"]["input"]>;
  x: InputMaybe<Scalars["Float"]["input"]>;
  y: InputMaybe<Scalars["Float"]["input"]>;
}

export interface CreateSettingsInput {
  allowGuestSeatSelection: Scalars["Boolean"]["input"];
  allowPlusOneUpdate: Scalars["Boolean"]["input"];
  allowPublicPlusOne: Scalars["Boolean"]["input"];
  allowPublicRsvp: Scalars["Boolean"]["input"];
  allowPublicRsvpWebsite: Scalars["Boolean"]["input"];
  allowReEntry: Scalars["Boolean"]["input"];
  allowSeatOverbooking: Scalars["Boolean"]["input"];
  approvalMode: InvitationApprovalMode;
  category: EventCategory;
  description: InputMaybe<Scalars["String"]["input"]>;
  dressCode: InputMaybe<Scalars["String"]["input"]>;
  endsAt: InputMaybe<Scalars["DateTime"]["input"]>;
  invitedByOptions: Scalars["String"]["input"][];
  isActive: Scalars["Boolean"]["input"];
  isPublic: Scalars["Boolean"]["input"];
  maxPlusOnes: Scalars["Int"]["input"];
  maxSeats: Scalars["Int"]["input"];
  publicRsvpWebsite: InputMaybe<Scalars["String"]["input"]>;
  requireApprovalForPlusOnes: Scalars["Boolean"]["input"];
  rotateSeconds: Scalars["Int"]["input"];
  rsvpDeadline: InputMaybe<Scalars["DateTime"]["input"]>;
  startsAt: InputMaybe<Scalars["DateTime"]["input"]>;
  ticketReleaseAt: InputMaybe<Scalars["DateTime"]["input"]>;
}

export interface CreateTableInput {
  capacity: InputMaybe<Scalars["Int"]["input"]>;
  eventId: Scalars["ID"]["input"];
  height: InputMaybe<Scalars["Float"]["input"]>;
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
  order: InputMaybe<Scalars["Int"]["input"]>;
  rotation: InputMaybe<Scalars["Float"]["input"]>;
  sectionId: Scalars["String"]["input"];
  shape: InputMaybe<TableShape>;
  width: InputMaybe<Scalars["Float"]["input"]>;
  x: InputMaybe<Scalars["Float"]["input"]>;
  y: InputMaybe<Scalars["Float"]["input"]>;
}

export interface CreateTemplateInput {
  body: Scalars["String"]["input"];
  channel: Channel;
  format: ContentFormat;
  key: Scalars["String"]["input"];
  locale: Scalars["String"]["input"];
  subject: InputMaybe<Scalars["String"]["input"]>;
  tags: InputMaybe<Scalars["String"]["input"][]>;
  tenantId: InputMaybe<Scalars["String"]["input"]>;
  variables: Scalars["String"]["input"][];
}

export interface CreateTimelineInput {
  label: Scalars["String"]["input"];
  timestamp: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
}

export interface CreateUserAddressInput {
  additionalInfo: InputMaybe<Scalars["String"]["input"]>;
  addressType: AddressType;
  cityId: InputMaybe<Scalars["ID"]["input"]>;
  countryId: InputMaybe<Scalars["ID"]["input"]>;
  houseNumberId: InputMaybe<Scalars["ID"]["input"]>;
  postalCodeId: InputMaybe<Scalars["ID"]["input"]>;
  stateId: InputMaybe<Scalars["ID"]["input"]>;
  streetId: InputMaybe<Scalars["ID"]["input"]>;
  userId: Scalars["ID"]["input"];
}

export interface CreateUserInput {
  acceptedTerms: Scalars["Boolean"]["input"];
  acceptedTermsAt: Scalars["DateTime"]["input"];
  addresses: InputMaybe<UserAddressInput[]>;
  contacts: InputMaybe<ContactInput[]>;
  customer: InputMaybe<CustomerInput>;
  employee: InputMaybe<EmployeeInput>;
  password: Scalars["String"]["input"];
  personalInfo: PersonalInfoInput;
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
  securityQuestions: InputMaybe<AddSecurityQuestionInput[]>;
  userType: UserType;
  username: Scalars["String"]["input"];
}

export interface Currency {
  __typename: "Currency";
  code: Scalars["String"]["output"];
  countries: Country[];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  symbol: Scalars["String"]["output"];
}

export interface CustomerInput {
  contactOptions: ContactOptionsType[];
  interestIds: InputMaybe<Scalars["ID"]["input"][]>;
  state: InputMaybe<StatusType>;
  subscribed: Scalars["Boolean"]["input"];
}

export interface CustomerInterestPayload {
  __typename: "CustomerInterestPayload";
  createdAt: Scalars["DateTime"]["output"];
  customerId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  interest: Maybe<InterestPayload>;
  interestId: Scalars["ID"]["output"];
  isPrimary: Maybe<Scalars["Boolean"]["output"]>;
  level: Maybe<Scalars["Int"]["output"]>;
}

export interface CustomerPayload {
  __typename: "CustomerPayload";
  contactOptions: ContactOptionsType[];
  createdAt: Scalars["DateTime"]["output"];
  customerInterest: Maybe<CustomerInterestPayload[]>;
  id: Scalars["ID"]["output"];
  state: StatusType;
  subscribed: Scalars["Boolean"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
}

export interface DuplicateTableInput {
  offsetX: Scalars["Float"]["input"];
  offsetY: Scalars["Float"]["input"];
  tableId: Scalars["ID"]["input"];
}

export interface EmployeeInput {
  department: InputMaybe<Scalars["String"]["input"]>;
  hireDate: InputMaybe<Scalars["DateTime"]["input"]>;
  isExternal: Scalars["Boolean"]["input"];
  position: InputMaybe<Scalars["String"]["input"]>;
  role: InputMaybe<Scalars["String"]["input"]>;
  salary: InputMaybe<Scalars["Float"]["input"]>;
}

export interface EmployeePayload {
  __typename: "EmployeePayload";
  createdAt: Scalars["DateTime"]["output"];
  department: Maybe<Scalars["String"]["output"]>;
  hireDate: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  isExternal: Scalars["Boolean"]["output"];
  position: Maybe<Scalars["String"]["output"]>;
  role: Maybe<Scalars["String"]["output"]>;
  salary: Maybe<Scalars["Float"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
}

export interface EventAddress {
  __typename: "EventAddress";
  additionalInfo: Maybe<Scalars["String"]["output"]>;
  cityId: Scalars["ID"]["output"];
  countryId: Scalars["ID"]["output"];
  eventId: Scalars["ID"]["output"];
  houseNumberId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  postalCodeId: Scalars["ID"]["output"];
  stateId: Scalars["ID"]["output"];
  streetId: Scalars["ID"]["output"];
}

export interface EventAddressInput {
  additionalInfo: InputMaybe<Scalars["String"]["input"]>;
  city: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  houseNumber: InputMaybe<Scalars["String"]["input"]>;
  postalCode: InputMaybe<Scalars["String"]["input"]>;
  state: InputMaybe<Scalars["String"]["input"]>;
  street: InputMaybe<Scalars["String"]["input"]>;
}

export interface EventAddressPayload {
  __typename: "EventAddressPayload";
  additionalInfo: Maybe<Scalars["String"]["output"]>;
  city: Maybe<Scalars["String"]["output"]>;
  country: Maybe<Scalars["String"]["output"]>;
  eventId: Scalars["ID"]["output"];
  houseNumber: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lat: Maybe<Scalars["Float"]["output"]>;
  lon: Maybe<Scalars["Float"]["output"]>;
  postalCode: Maybe<Scalars["String"]["output"]>;
  state: Maybe<Scalars["String"]["output"]>;
  street: Maybe<Scalars["String"]["output"]>;
}

export type EventCategory = "GENERAL" | "KONFERENZ" | "MUSIK" | "SOCIAL" | "SPORTS" | "WORKSHOP";

export interface EventPayload {
  __typename: "EventPayload";
  coverMedia: Maybe<MediaPayload>;
  coverMediaId: Maybe<Scalars["ID"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  depth: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  logoMedia: Maybe<MediaPayload>;
  logoMediaId: Maybe<Scalars["ID"]["output"]>;
  media: MediaPayload[];
  myRole: Maybe<UserRoleType>;
  name: Scalars["String"]["output"];
  owner: Scalars["String"]["output"];
  parentId: Maybe<Scalars["String"]["output"]>;
  path: Maybe<Scalars["String"]["output"]>;
  settings: Maybe<SettingsPayload>;
  tags: Scalars["String"]["output"][];
  timeline: EventTimelinePayload[];
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
  userRoles: UserRolePayload[];
}

export interface EventTimelinePayload {
  __typename: "EventTimelinePayload";
  eventId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  label: Scalars["String"]["output"];
  referenceId: Maybe<Scalars["String"]["output"]>;
  sourceId: Maybe<Scalars["String"]["output"]>;
  timestamp: Scalars["DateTime"]["output"];
  type: Scalars["String"]["output"];
}

export interface EventTreePayload {
  __typename: "EventTreePayload";
  rootEvent: EventPayload;
  subEvents: Maybe<EventPayload[]>;
}

export type GenderType = "DIVERSE" | "FEMALE" | "MALE" | "UNKNOWN";

export interface GeoLocationInfo {
  __typename: "GeoLocationInfo";
  city: Maybe<Scalars["String"]["output"]>;
  cityId: Scalars["ID"]["output"];
  country: Maybe<Scalars["String"]["output"]>;
  countryId: Scalars["ID"]["output"];
  houseNumber: Maybe<Scalars["String"]["output"]>;
  houseNumberId: Scalars["ID"]["output"];
  lat: Maybe<Scalars["Float"]["output"]>;
  lon: Maybe<Scalars["Float"]["output"]>;
  postalCode: Maybe<Scalars["String"]["output"]>;
  postalCodeId: Scalars["ID"]["output"];
  state: Maybe<Scalars["String"]["output"]>;
  stateId: Scalars["ID"]["output"];
  street: Maybe<Scalars["String"]["output"]>;
  streetId: Scalars["ID"]["output"];
}

/**
 * -----------------------------------
 * Supporting Types
 * -----------------------------------
 */
export interface GeoPoint {
  __typename: "GeoPoint";
  latitude: Maybe<Scalars["Float"]["output"]>;
  longitude: Maybe<Scalars["Float"]["output"]>;
}

export interface GeocodeAddressInput {
  address: Scalars["String"]["input"];
}

export interface GeocodeResultPayload {
  __typename: "GeocodeResultPayload";
  displayName: Maybe<Scalars["String"]["output"]>;
  latitude: Scalars["Float"]["output"];
  longitude: Scalars["Float"]["output"];
}

export interface GuestEventSeatInput {
  eventId: Scalars["ID"]["input"];
  guestId: Scalars["ID"]["input"];
}

export interface GuestSignUpPayload {
  __typename: "GuestSignUpPayload";
  message: Maybe<Scalars["String"]["output"]>;
  results: Maybe<SignUpResultsPayload[]>;
}

export interface HouseNumber {
  __typename: "HouseNumber";
  id: Scalars["ID"]["output"];
  number: Scalars["String"]["output"];
}

export interface ImportInvitationsInput {
  eventId: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
  uploadType: Scalars["String"]["input"];
}

export interface ImportInvitationsResult {
  __typename: "ImportInvitationsResult";
  duplicates: Scalars["String"]["output"][];
  errors: Scalars["String"]["output"][];
  imported: Scalars["Int"]["output"];
  skipped: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
}

export interface InterestCategoryPayload {
  __typename: "InterestCategoryPayload";
  createdAt: Scalars["DateTime"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  icon: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  interests: Maybe<InterestPayload[]>;
  key: InterestCategoryType;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
}

export type InterestCategoryType =
  | "FINANCE"
  | "LIFESTYLE"
  | "MUSIC"
  | "REAL_ASSETS"
  | "SPORTS"
  | "TECHNOLOGY";

export interface InterestPayload {
  __typename: "InterestPayload";
  categoryId: Scalars["ID"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  icon: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  key: InterestType;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
}

export type InterestType =
  | "BANK_PRODUCTS_AND_SERVICES"
  | "BASKETBALL"
  | "CLASSIC"
  | "CREDIT_AND_DEBT"
  | "FINANCIAL_EDUCATION_AND_COUNSELING"
  | "FOOTBALL"
  | "HIPHOP"
  | "INSURANCE"
  | "INVESTMENTS"
  | "RAP"
  | "REAL_ESTATE"
  | "ROCK"
  | "RUGBY"
  | "SAVING_AND_FINANCE"
  | "SOCCER"
  | "SUSTAINABLE_FINANCE"
  | "TECHNOLOGY_AND_INNOVATION"
  | "TRAVEL";

export type InvitationApprovalMode = "AUTO" | "AUTO_INVITE_ONLY" | "AUTO_PUBLIC_ONLY" | "MANUAL";

/** Input type for creating an invitation. A guest profile is not created here; only basic invite metadata is stored. */
export interface InvitationCreateInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  /** ID of the event this invitation belongs to. */
  eventId: Scalars["ID"]["input"];
  /** Optional: first name of the invited guest. */
  firstName: Scalars["String"]["input"];
  /** Optional: ID of the parent invitation (for invite chains). */
  invitedByInvitationId: InputMaybe<Scalars["ID"]["input"]>;
  /** Optional: last name of the invited guest. */
  lastName: Scalars["String"]["input"];
  /** Maximum number of plus-one invitations (must be >= 0). */
  maxInvitees: Scalars["Int"]["input"];
  phoneNumber: InputMaybe<Scalars["String"]["input"]>;
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
}

export interface InvitationGuestInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  eventId: Scalars["ID"]["input"];
  eventName: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  locale: InputMaybe<Scalars["String"]["input"]>;
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
  plusOnes: InputMaybe<Scalars["Float"]["input"]>;
  rootInvitee: InputMaybe<Scalars["String"]["input"]>;
  rsvpUrl: Scalars["String"]["input"];
}

/** GraphQL Invitation entity matching the Prisma model exactly. */
export interface InvitationPayload {
  __typename: "InvitationPayload";
  approvedAt: Maybe<Scalars["DateTime"]["output"]>;
  approvedByUserId: Maybe<Scalars["ID"]["output"]>;
  autoApproveOnAccept: Scalars["Boolean"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  email: Maybe<Scalars["String"]["output"]>;
  eventEndsAt: Maybe<Scalars["DateTime"]["output"]>;
  eventId: Scalars["ID"]["output"];
  eventName: Maybe<Scalars["String"]["output"]>;
  firstName: Scalars["String"]["output"];
  guestNote: Maybe<Scalars["String"]["output"]>;
  guestProfileId: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  invitedByInvitationId: Maybe<Scalars["ID"]["output"]>;
  invitedByUserId: Maybe<Scalars["ID"]["output"]>;
  lastName: Scalars["String"]["output"];
  maxInvitees: Scalars["Int"]["output"];
  /** Pointer to PII record inside Ephemeral Redis Store. */
  pendingContactId: Maybe<Scalars["String"]["output"]>;
  phoneNumber: Maybe<Scalars["String"]["output"]>;
  phoneNumbers: PhoneNumberPayload[];
  plusOneAgeCategory: Maybe<PlusOneAgeCategory>;
  plusOnes: InvitationPayload[];
  rsvpAt: Maybe<Scalars["DateTime"]["output"]>;
  rsvpChoice: Maybe<RsvpChoice>;
  selectedInvitedBy: Scalars["String"]["output"][];
  status: InvitationStatus;
  type: InvitationType;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
}

export type InvitationStatus =
  | "ACCEPTED"
  | "APPROVED"
  | "CANCELED"
  | "DECLINED"
  | "PENDING"
  | "REJECTED";

export type InvitationType = "PRIVATE" | "PUBLIC";

export interface KcUser {
  __typename: "KcUser";
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastName: Scalars["String"]["output"];
  role: Maybe<RealmRoleType>;
  username: Scalars["String"]["output"];
}

export interface Language {
  __typename: "Language";
  countries: Country[];
  id: Scalars["ID"]["output"];
  iso2: Scalars["String"]["output"];
  iso3: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
}

export interface LayoutChangeLogPayload {
  __typename: "LayoutChangeLogPayload";
  actorId: Scalars["ID"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  eventId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  payload: Scalars["JSON"]["output"];
  type: LayoutChangeType;
}

export type LayoutChangeType =
  | "AUTO_GENERATE_GEOMETRY_V4"
  | "LAYOUT_VERSION_SAVED"
  | "SEAT_ASSIGN"
  | "SEAT_ASSIGNED"
  | "SEAT_CREATE"
  | "SEAT_DELETE"
  | "SEAT_MOVED"
  | "SEAT_UNASSIGNED"
  | "SEAT_UPDATE"
  | "SECTION_CLONED"
  | "SECTION_CREATE"
  | "SECTION_DELETE"
  | "SECTION_MOVED"
  | "SECTION_RENAME"
  | "SECTION_UPDATE"
  | "TABLE_CREATE"
  | "TABLE_DELETE"
  | "TABLE_DUPLICATED"
  | "TABLE_MOVED"
  | "TABLE_RENAME"
  | "TABLE_UPDATE";

export interface LayoutVersionPayload {
  __typename: "LayoutVersionPayload";
  createdAt: Scalars["DateTime"]["output"];
  data: Scalars["JSON"]["output"];
  eventId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  inversePatch: Maybe<Scalars["JSON"]["output"]>;
  label: Maybe<Scalars["String"]["output"]>;
  patch: Maybe<Scalars["JSON"]["output"]>;
  version: Scalars["Float"]["output"];
}

export interface LogInInput {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
}

export interface LoginTotpInput {
  code: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
}

export type MaritalStatusType = "DIVORCED" | "MARRIED" | "SINGLE" | "WIDOWED";

export interface MediaPayload {
  __typename: "MediaPayload";
  filename: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  key: Scalars["String"]["output"];
  mimetype: Scalars["String"]["output"];
  size: Maybe<Scalars["Int"]["output"]>;
  type: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
  variants: MediaVariantPayload[];
}

export type MediaType = "COVER" | "GALLERY" | "LOGO";

export interface MediaVariantPayload {
  __typename: "MediaVariantPayload";
  format: Scalars["String"]["output"];
  height: Scalars["Int"]["output"];
  key: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
  width: Scalars["Int"]["output"];
}

export interface Message {
  __typename: "Message";
  body: Maybe<Scalars["String"]["output"]>;
  chatId: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  direction: MessageDirection;
  from: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  mediaUrl: Maybe<Scalars["String"]["output"]>;
  messageId: Maybe<Scalars["String"]["output"]>;
  to: Scalars["String"]["output"];
}

export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MfaPreference = "BACKUP_CODES" | "NONE" | "SECURITY_QUESTIONS" | "TOTP" | "WEBAUTHN";

export interface MoveSeatInput {
  id: Scalars["ID"]["input"];
  rotation: InputMaybe<Scalars["Float"]["input"]>;
  x: Scalars["Float"]["input"];
  y: Scalars["Float"]["input"];
}

export interface MoveSectionInput {
  id: Scalars["ID"]["input"];
  x: Scalars["Float"]["input"];
  y: Scalars["Float"]["input"];
}

export interface MoveTableInput {
  id: Scalars["ID"]["input"];
  x: Scalars["Float"]["input"];
  y: Scalars["Float"]["input"];
}

export interface Mutation {
  __typename: "Mutation";
  DEBUG_createSignupVerification: Scalars["String"]["output"];
  /** Bind a device to a ticket (first activation) */
  activateDevice: TicketPayload;
  activateEvent: Scalars["Boolean"]["output"];
  addContact: Scalars["Boolean"]["output"];
  addPhoneNumbers: Scalars["Boolean"]["output"];
  addTimeLines: EventPayload;
  adminChangePassword: Scalars["Boolean"]["output"];
  adminSignUp: TokenPayload;
  adminUpdateUser: Scalars["Boolean"]["output"];
  approveInvitation: InvitationPayload;
  archiveNotification: NotificationPayload;
  assignChat: Chat;
  assignRealmRole: Scalars["Boolean"]["output"];
  assignSeat: SeatPayload;
  assignUserToEvent: Scalars["Boolean"]["output"];
  autoGenerateLayout: Scalars["Boolean"]["output"];
  autoGenerateSeatMap: Scalars["Boolean"]["output"];
  bulkApproveInvitations: InvitationPayload[];
  bulkRenameSections: BulkRenamePayload;
  bulkRenameTables: BulkRenamePayload;
  cancelNotification: NotificationPayload;
  changeMyPassword: SuccessPayload;
  claimChat: Chat;
  claimWhatsappChat: Chat;
  cloneSection: SectionPayload;
  completePasswordReset: Scalars["Boolean"]["output"];
  confirmTotp: Scalars["Boolean"]["output"];
  createEvent: EventPayload;
  createEventAddress: EventAddressPayload;
  createInvitation: InvitationPayload;
  createInvitationFromRsvp: InvitationPayload;
  createMedia: Scalars["String"]["output"];
  createNotification: NotificationPayload;
  createPlusOnesInvitation: InvitationPayload;
  createSeat: SeatPayload;
  createSection: SectionPayload;
  createSignupVerification: Scalars["Boolean"]["output"];
  createTable: TablePayload;
  createTemplate: TemplatePayload;
  createUserAddress: UserAddress;
  credentialsLogin: TokenPayload;
  deactivateEvent: Scalars["Boolean"]["output"];
  deleteEvent: Scalars["Boolean"]["output"];
  deleteEventAddressByEventId: Scalars["Boolean"]["output"];
  deleteKcUser: Scalars["Boolean"]["output"];
  deleteNotification: Scalars["Boolean"]["output"];
  deleteSeat: Scalars["Boolean"]["output"];
  deleteSection: Scalars["Boolean"]["output"];
  deleteTable: Scalars["Boolean"]["output"];
  /** Delete ticket and all its logs (admin only) */
  deleteTicket: Scalars["Boolean"]["output"];
  deleteUser: Scalars["Boolean"]["output"];
  deleteUserAddressByUserId: Scalars["Boolean"]["output"];
  duplicateTable: TablePayload;
  enableTotp: TotpSetupPayload;
  generatePasswordlessOptions: Scalars["JSON"]["output"];
  /** Rotate nonce for a ticket’s QR token */
  generateToken: Scalars["String"]["output"];
  generateWebAuthnAuthOptions: Scalars["JSON"]["output"];
  generateWebAuthnAuthOptions2: Scalars["JSON"]["output"];
  generateWebAuthnRegistrationOptions: Scalars["JSON"]["output"];
  /** Imports invitations from CSV/XLSX stored in object storage */
  importInvitations: ImportInvitationsResult;
  loginTotp: TokenPayload;
  logout: SuccessPayload;
  markNotificationAsRead: NotificationPayload;
  markNotificationAsUnread: NotificationPayload;
  moveSeat: SeatPayload;
  moveSection: SeatPayload;
  moveTable: SeatPayload;
  redoLayout: Scalars["Boolean"]["output"];
  refresh: TokenPayload;
  regenerateBackupCodes: Scalars["String"]["output"][];
  removeAllPlusOnesByInvitationId: InvitationPayload[];
  removeContact: Scalars["Boolean"]["output"];
  removeInvitation: SuccessPayload;
  removePhoneNumbers: Scalars["Boolean"]["output"];
  removePlusOneInvitation: InvitationPayload;
  removeRealmRole: Scalars["Boolean"]["output"];
  removeTimeLines: EventPayload;
  removeUserFromEvent: Scalars["Boolean"]["output"];
  renameSection: RenamePayload;
  renameTable: RenamePayload;
  renameWebAuthnCredential: Scalars["Boolean"]["output"];
  replyInvitation: InvitationPayload;
  requestPasswordReset: Scalars["Boolean"]["output"];
  /** Revoke a ticket (security or admin) */
  revokeTicket: TicketPayload;
  revokeWebAuthnCredential: Scalars["Boolean"]["output"];
  saveLayoutVersion: LayoutVersionPayload;
  scanToken: ScanPayload;
  sendEmail: Scalars["Boolean"]["output"];
  sendInAppMessage: Scalars["Boolean"]["output"];
  sendInvitations: Scalars["Boolean"]["output"];
  sendMagicLink: Scalars["Boolean"]["output"];
  sendWhatsappMessage: Message;
  sendWhatsappMessage2: Message;
  setMfaPreference: Scalars["Boolean"]["output"];
  setTimelines: EventPayload;
  transferEventOwnership: Scalars["Boolean"]["output"];
  unarchiveNotification: NotificationPayload;
  unassignSeat: SeatPayload;
  undoLayout: Scalars["Boolean"]["output"];
  updateEvent: EventPayload;
  updateEventAddress: EventAddressPayload;
  updateMe: UserPayload;
  updateMyProfile: SuccessPayload;
  updatePlusOnesInvitation: InvitationPayload;
  updateSeat: SeatPayload;
  updateSection: SectionPayload;
  updateTable: TablePayload;
  updateTemplate: TemplatePayload;
  updateTimeLines: EventPayload;
  updateUser: UserPayload;
  updateUserAddress: UserAddress;
  verifyGuestSignUp: GuestSignUpPayload;
  verifyMagicLink: TokenPayload;
  verifyPasswordResetStepUp: Scalars["Boolean"]["output"];
  verifyPasswordResetToken: ResetVerificationPayload;
  verifyPasswordlessAuthentication: TokenPayload;
  verifySignUp: SignUpPayload;
  verifyWebAuthnAuthentication: TokenPayload;
  verifyWebAuthnAuthentication2: Scalars["Boolean"]["output"];
  verifyWebAuthnRegistration: Scalars["Boolean"]["output"];
}

export interface MutationDebug_CreateSignupVerificationArgs {
  createUserInput: CreateUserInput;
}

export interface MutationActivateDeviceArgs {
  input: ActivateDeviceInput;
}

export interface MutationActivateEventArgs {
  eventId: Scalars["ID"]["input"];
}

export interface MutationAddContactArgs {
  contact: AddContactInput;
}

export interface MutationAddPhoneNumbersArgs {
  phoneNumbers: PhoneNumberInput[];
}

export interface MutationAddTimeLinesArgs {
  eventId: Scalars["ID"]["input"];
  input: CreateTimelineInput[];
}

export interface MutationAdminChangePasswordArgs {
  input: UpdateUserPasswordInput;
}

export interface MutationAdminSignUpArgs {
  input: AdminSignUpInput;
}

export interface MutationAdminUpdateUserArgs {
  id: Scalars["ID"]["input"];
  input: UpdateKcUserInput;
}

export interface MutationApproveInvitationArgs {
  input: ApproveInvitationInput;
}

export interface MutationArchiveNotificationArgs {
  id: Scalars["String"]["input"];
}

export interface MutationAssignChatArgs {
  chatId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
}

export interface MutationAssignRealmRoleArgs {
  id: Scalars["ID"]["input"];
  roleName: RealmRoleType;
}

export interface MutationAssignSeatArgs {
  input: AssignSeatInput;
}

export interface MutationAssignUserToEventArgs {
  input: AssignUserRoleInput;
}

export interface MutationAutoGenerateLayoutArgs {
  input: AutoGenerateLayoutInput;
}

export interface MutationAutoGenerateSeatMapArgs {
  input: AutoGenerateSeatMapInput;
}

export interface MutationBulkApproveInvitationsArgs {
  input: BulkApproveInvitationInput;
}

export interface MutationBulkRenameSectionsArgs {
  inputs: RenameSectionInput[];
}

export interface MutationBulkRenameTablesArgs {
  inputs: RenameTableInput[];
}

export interface MutationCancelNotificationArgs {
  id: Scalars["String"]["input"];
}

export interface MutationChangeMyPasswordArgs {
  input: ChangeMyPasswordInput;
}

export interface MutationClaimChatArgs {
  chatId: Scalars["String"]["input"];
}

export interface MutationClaimWhatsappChatArgs {
  chatId: Scalars["String"]["input"];
}

export interface MutationCloneSectionArgs {
  input: CloneSectionInput;
}

export interface MutationCompletePasswordResetArgs {
  input: CompleteResetInputGql;
}

export interface MutationConfirmTotpArgs {
  code: Scalars["String"]["input"];
}

export interface MutationCreateEventArgs {
  input: CreateEventInput;
}

export interface MutationCreateEventAddressArgs {
  input: CreateEventAddressInput;
}

export interface MutationCreateInvitationArgs {
  input: InvitationCreateInput;
}

export interface MutationCreateInvitationFromRsvpArgs {
  input: PublicRsvpInput;
}

export interface MutationCreateMediaArgs {
  input: CreateMediaDto;
}

export interface MutationCreateNotificationArgs {
  input: CreateNotificationInput;
}

export interface MutationCreatePlusOnesInvitationArgs {
  input: CreatePlusOneInput;
}

export interface MutationCreateSeatArgs {
  input: CreateSeatInput;
}

export interface MutationCreateSectionArgs {
  input: CreateSectionInput;
}

export interface MutationCreateSignupVerificationArgs {
  createUserInput: CreateUserInput;
}

export interface MutationCreateTableArgs {
  input: CreateTableInput;
}

export interface MutationCreateTemplateArgs {
  input: CreateTemplateInput;
}

export interface MutationCreateUserAddressArgs {
  input: CreateUserAddressInput;
}

export interface MutationCredentialsLoginArgs {
  input: LogInInput;
}

export interface MutationDeactivateEventArgs {
  eventId: Scalars["ID"]["input"];
}

export interface MutationDeleteEventArgs {
  id: Scalars["ID"]["input"];
}

export interface MutationDeleteEventAddressByEventIdArgs {
  eventId: Scalars["ID"]["input"];
}

export interface MutationDeleteKcUserArgs {
  id: Scalars["ID"]["input"];
}

export interface MutationDeleteNotificationArgs {
  id: Scalars["String"]["input"];
}

export interface MutationDeleteSeatArgs {
  seatId: Scalars["String"]["input"];
}

export interface MutationDeleteSectionArgs {
  sectionId: Scalars["String"]["input"];
}

export interface MutationDeleteTableArgs {
  tableId: Scalars["String"]["input"];
}

export interface MutationDeleteTicketArgs {
  ticketId: Scalars["ID"]["input"];
}

export interface MutationDeleteUserArgs {
  id: Scalars["ID"]["input"];
}

export interface MutationDeleteUserAddressByUserIdArgs {
  userId: Scalars["ID"]["input"];
}

export interface MutationDuplicateTableArgs {
  input: DuplicateTableInput;
}

export interface MutationGeneratePasswordlessOptionsArgs {
  email: Scalars["String"]["input"];
}

export interface MutationGenerateTokenArgs {
  ticketId: Scalars["ID"]["input"];
}

export interface MutationImportInvitationsArgs {
  input: ImportInvitationsInput;
}

export interface MutationLoginTotpArgs {
  input: LoginTotpInput;
}

export interface MutationMarkNotificationAsReadArgs {
  id: Scalars["String"]["input"];
}

export interface MutationMarkNotificationAsUnreadArgs {
  id: Scalars["String"]["input"];
}

export interface MutationMoveSeatArgs {
  input: MoveSeatInput;
}

export interface MutationMoveSectionArgs {
  input: MoveSectionInput;
}

export interface MutationMoveTableArgs {
  input: MoveTableInput;
}

export interface MutationRedoLayoutArgs {
  eventId: Scalars["String"]["input"];
}

export interface MutationRemoveAllPlusOnesByInvitationIdArgs {
  invitedByInvitationId: Scalars["ID"]["input"];
}

export interface MutationRemoveContactArgs {
  contactId: Scalars["ID"]["input"];
}

export interface MutationRemoveInvitationArgs {
  id: Scalars["ID"]["input"];
}

export interface MutationRemovePhoneNumbersArgs {
  phoneNumberIds: Scalars["ID"]["input"][];
}

export interface MutationRemovePlusOneInvitationArgs {
  id: Scalars["ID"]["input"];
}

export interface MutationRemoveRealmRoleArgs {
  id: Scalars["ID"]["input"];
  roleName: RealmRoleType;
}

export interface MutationRemoveTimeLinesArgs {
  eventId: Scalars["ID"]["input"];
  input: RemoveTimelineInput[];
}

export interface MutationRemoveUserFromEventArgs {
  input: RemoveUserFromEventInput;
}

export interface MutationRenameSectionArgs {
  input: RenameSectionInput;
}

export interface MutationRenameTableArgs {
  input: RenameTableInput;
}

export interface MutationRenameWebAuthnCredentialArgs {
  credentialId: Scalars["String"]["input"];
  nickname: Scalars["String"]["input"];
}

export interface MutationReplyInvitationArgs {
  input: RsvpInput;
}

export interface MutationRequestPasswordResetArgs {
  email: Scalars["String"]["input"];
}

export interface MutationRevokeTicketArgs {
  input: RevokeTicketInput;
}

export interface MutationRevokeWebAuthnCredentialArgs {
  credentialId: Scalars["String"]["input"];
}

export interface MutationSaveLayoutVersionArgs {
  input: SaveLayoutVersionInput;
}

export interface MutationScanTokenArgs {
  input: ScanInput;
}

export interface MutationSendEmailArgs {
  input: SendEmail;
}

export interface MutationSendInAppMessageArgs {
  input: SendInAppMessageInput;
}

export interface MutationSendInvitationsArgs {
  input: SendInvitationsInput;
}

export interface MutationSendMagicLinkArgs {
  email: Scalars["String"]["input"];
}

export interface MutationSendWhatsappMessageArgs {
  input: SendWhatsappMessageInput;
}

export interface MutationSendWhatsappMessage2Args {
  input: SendWhatsappMessageInput2;
}

export interface MutationSetMfaPreferenceArgs {
  method: MfaPreference;
}

export interface MutationSetTimelinesArgs {
  input: SetTimelineInput;
}

export interface MutationTransferEventOwnershipArgs {
  input: TransferInput;
}

export interface MutationUnarchiveNotificationArgs {
  id: Scalars["String"]["input"];
}

export interface MutationUnassignSeatArgs {
  seatId: Scalars["String"]["input"];
}

export interface MutationUndoLayoutArgs {
  eventId: Scalars["String"]["input"];
}

export interface MutationUpdateEventArgs {
  input: UpdateEventInput;
}

export interface MutationUpdateEventAddressArgs {
  input: UpdateEventAddressInput;
}

export interface MutationUpdateMeArgs {
  input: UpdateMeInput;
}

export interface MutationUpdateMyProfileArgs {
  input: UpdateMyProfileInput;
}

export interface MutationUpdatePlusOnesInvitationArgs {
  input: UpdatePlusOneInput;
}

export interface MutationUpdateSeatArgs {
  input: UpdateSeatInput;
}

export interface MutationUpdateSectionArgs {
  input: UpdateSectionInput;
}

export interface MutationUpdateTableArgs {
  input: UpdateTableInput;
}

export interface MutationUpdateTemplateArgs {
  input: UpdateTemplateInput;
}

export interface MutationUpdateTimeLinesArgs {
  eventId: Scalars["ID"]["input"];
  input: UpdateTimelineInput[];
}

export interface MutationUpdateUserArgs {
  input: UpdateUserInput;
}

export interface MutationUpdateUserAddressArgs {
  input: UpdateUserAddressInput;
}

export interface MutationVerifyGuestSignUpArgs {
  token: Scalars["String"]["input"];
}

export interface MutationVerifyMagicLinkArgs {
  token: Scalars["String"]["input"];
}

export interface MutationVerifyPasswordResetStepUpArgs {
  input: StepUpVerificationInputGql;
}

export interface MutationVerifyPasswordResetTokenArgs {
  token: Scalars["String"]["input"];
}

export interface MutationVerifyPasswordlessAuthenticationArgs {
  response: Scalars["JSON"]["input"];
}

export interface MutationVerifySignUpArgs {
  token: Scalars["String"]["input"];
}

export interface MutationVerifyWebAuthnAuthenticationArgs {
  response: Scalars["JSON"]["input"];
}

export interface MutationVerifyWebAuthnAuthentication2Args {
  response: Scalars["JSON"]["input"];
}

export interface MutationVerifyWebAuthnRegistrationArgs {
  response: Scalars["JSON"]["input"];
}

export interface NotificationFilterInput {
  channel: InputMaybe<Channel>;
  recipientId: InputMaybe<Scalars["String"]["input"]>;
  status: InputMaybe<NotificationStatus>;
  unreadOnly: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface NotificationPayload {
  __typename: "NotificationPayload";
  archivedAt: Maybe<Scalars["DateTime"]["output"]>;
  channel: Channel;
  createdAt: Scalars["DateTime"]["output"];
  createdBy: Maybe<Scalars["String"]["output"]>;
  deliveredAt: Maybe<Scalars["DateTime"]["output"]>;
  expiresAt: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  metadata: Scalars["JSON"]["output"];
  priority: Priority;
  provider: Maybe<Scalars["String"]["output"]>;
  providerRef: Maybe<Scalars["String"]["output"]>;
  purgedAt: Maybe<Scalars["DateTime"]["output"]>;
  readAt: Maybe<Scalars["DateTime"]["output"]>;
  recipientAddress: Maybe<Scalars["String"]["output"]>;
  recipientId: Maybe<Scalars["String"]["output"]>;
  recipientUsername: Scalars["String"]["output"];
  sensitive: Scalars["Boolean"]["output"];
  status: NotificationStatus;
  tenantId: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
  variables: Scalars["JSON"]["output"];
}

export type NotificationStatus =
  | "ARCHIVED"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED"
  | "PENDING"
  | "PROCESSING"
  | "READ"
  | "SENT";

export type PersonStatusType =
  | "ACTIVE"
  | "BLOCKED"
  | "CLOSED"
  | "DELETED"
  | "DISABLED"
  | "INACTIVE";

export interface PersonalInfoInput {
  birthDate: InputMaybe<Scalars["DateTime"]["input"]>;
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  gender: InputMaybe<GenderType>;
  lastName: Scalars["String"]["input"];
  maritalStatus: InputMaybe<MaritalStatusType>;
}

export interface PersonalInfoPayload {
  __typename: "PersonalInfoPayload";
  birthDate: Maybe<Scalars["DateTime"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  gender: Maybe<GenderType>;
  id: Scalars["ID"]["output"];
  lastName: Scalars["String"]["output"];
  maritalStatus: Maybe<MaritalStatusType>;
  phoneNumbers: Maybe<PhoneNumberPayload[]>;
  updatedAt: Scalars["DateTime"]["output"];
}

export interface PhoneNumberInput {
  countryCode: Scalars["String"]["input"];
  /** Marks this number as primary for the associated profile. */
  isPrimary: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Optional user-defined label (e.g., “Office Line”, “Private”). */
  label: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number value in international format. Regex validated. */
  number: Scalars["String"]["input"];
  /** The category/type of the phone number (e.g., MOBILE, HOME, WORK). */
  type: PhoneNumberType;
}

export interface PhoneNumberPayload {
  __typename: "PhoneNumberPayload";
  countryCode: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  infoId: Scalars["String"]["output"];
  isPrimary: Maybe<Scalars["Boolean"]["output"]>;
  label: Maybe<Scalars["String"]["output"]>;
  number: Scalars["String"]["output"];
  type: PhoneNumberType;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
}

export type PhoneNumberType = "HOME" | "MOBILE" | "OTHER" | "PRIVATE" | "WHATSAPP" | "WORK";

export type PlusOneAgeCategory = "OVER_SIX" | "UNDER_SIX";

export interface PostalCode {
  __typename: "PostalCode";
  accuracy: Maybe<Scalars["Int"]["output"]>;
  city: City;
  code: Scalars["String"]["output"];
  country: Country;
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  location: Maybe<GeoPoint>;
  updatedAt: Scalars["String"]["output"];
}

export interface PostalCodeFilterInput {
  cityId: InputMaybe<Scalars["ID"]["input"]>;
  code: InputMaybe<Scalars["String"]["input"]>;
  countryId: InputMaybe<Scalars["ID"]["input"]>;
}

/** Whether the ticket holder is currently INSIDE or OUTSIDE the venue. */
export type PresenceState = "INSIDE" | "OUTSIDE";

export type Priority = "HIGH" | "LOW" | "NORMAL" | "URGENT";

export interface PublicPlusOneInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
  plusOneAgeCategory: PlusOneAgeCategory;
}

export interface PublicRsvpInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  /** Public event identifier (eventId or slug) */
  eventId: Scalars["ID"]["input"];
  firstName: Scalars["String"]["input"];
  /** Optional note from guest */
  guestNote: InputMaybe<Scalars["String"]["input"]>;
  lastName: Scalars["String"]["input"];
  /** Optional RSVP message from guest */
  message: InputMaybe<Scalars["String"]["input"]>;
  phoneNumbers: PhoneNumberInput[];
  /** Optional list of additional guests (plus-ones) */
  plusOnes: InputMaybe<PublicPlusOneInput[]>;
  /** Configured inviter/source options selected by the guest */
  selectedInvitedBy: InputMaybe<Scalars["String"]["input"][]>;
}

export interface Query {
  __typename: "Query";
  activeTemplate: TemplatePayload;
  addressAutocomplete: AddressAutocompletePayload[];
  adminEvents: EventPayload[];
  adminGetEvent: Maybe<EventPayload>;
  checkEmail: Scalars["Boolean"]["output"];
  checkUsername: Scalars["Boolean"]["output"];
  event: Maybe<EventPayload>;
  eventAddressById: Maybe<EventAddress>;
  eventChildren: EventPayload[];
  eventGuests: Scalars["String"]["output"][];
  eventInvitation: InvitationPayload[];
  eventRsvp: Maybe<EventPayload>;
  eventTables: TablePayload[];
  eventTree: EventTreePayload;
  geocodeAddress: Maybe<GeocodeResultPayload>;
  getAllCountries: Country[];
  getAllInterestCategories: InterestCategoryPayload[];
  getAllInterests: InterestPayload[];
  /** Fetch all tickets */
  getAllTickets: TicketPayload[];
  getById: KcUser;
  getByUsername: KcUser;
  getChats: Chat[];
  getCitiesByPostalCode: City;
  getCitiesByState: Maybe<City[]>;
  getCityByNameAndState: Maybe<City>;
  getCountryByName: Maybe<Country>;
  getEventAddressByEventId: Maybe<EventAddressPayload>;
  getFullByEventIds: InvitationPayload[];
  getGeoLocationInfo: Maybe<GeoLocationInfo>;
  getHouseNumberByName: Maybe<HouseNumber>;
  /** Find tickets linked to a authenticated user */
  getMyTickets: TicketPayload[];
  getPlusOnesByInvitation: InvitationPayload[];
  getPostalCodeByNameAndCity: Maybe<PostalCode>;
  getPostalCodesByCity: Maybe<PostalCode[]>;
  getPostalCodesByState: Maybe<PostalCode[]>;
  getQr: Maybe<Scalars["String"]["output"]>;
  getSeatByGuestAndEvent: SeatPayload;
  getSeatList: SeatPayload[];
  getSecurityQuestions: SecurityQuestionPayload[];
  getStateByName: Maybe<State>;
  getStatesByCountry: State[];
  getStreetByName: Maybe<Street>;
  getUserAddressesByUserId: UserAddressPayload[];
  getUserList: UserPayload[];
  getWhatsappChats: Chat[];
  getWhatsappMessages: Message[];
  getWhatsappState: Scalars["String"]["output"];
  invitation: InvitationPayload;
  invitations: InvitationPayload[];
  kc_users: KcUser[];
  latestLayoutVersion: Maybe<LayoutVersionPayload>;
  layoutChangeLog: LayoutChangeLogPayload[];
  layoutVersions: LayoutVersionPayload[];
  listWebAuthnDevices: WebAuthnDevicePayload[];
  me: UserPayload;
  meAuth: KcUser;
  meByToken: KcUser;
  mediaUrl: Scalars["String"]["output"];
  mediaVariantUrl: Scalars["String"]["output"];
  myEvents: EventPayload[];
  myInvitations: InvitationPayload[];
  myNotifications: NotificationPayload[];
  notification: NotificationPayload;
  notifications: NotificationPayload[];
  pnpm: UserPayload;
  publicEventTree: EventTreePayload;
  /** Load all security scan logs of a ticket */
  scanLogsByTicket: ScanLogPayload[];
  seat: Maybe<SeatPayload>;
  seatAssignmentLogs: SeatAssignmentLogPayload[];
  seatLayout: SectionPayload[];
  seatPresencesByEvent: SeatPresencePayload[];
  seats: SeatPayload[];
  seatsBySection: SeatPayload[];
  seatsByTable: SeatPayload[];
  section: Maybe<SectionPayload>;
  sections: SectionPayload[];
  table: TablePayload[];
  tablesBySection: TablePayload[];
  templates: TemplatePayload[];
  test: Maybe<Scalars["String"]["output"]>;
  /** Fetch a single ticket by its cuid */
  ticketById: TicketPayload;
  /** Find the ticket created for a specific invitationId */
  ticketByInvitation: TicketPayload;
  /** Fetch all tickets belonging to a specific event */
  ticketsByEvent: TicketPayload[];
  /** Find tickets linked to a specific guestProfileId */
  ticketsByGuest: TicketPayload[];
  userAddressById: Maybe<UserAddress>;
  userAddresses: UserAddress[];
  userById: UserPayload;
  users: UserPayload[];
  validateAddress: AddressValidationPayload;
}

export interface QueryActiveTemplateArgs {
  channel: Channel;
  key: Scalars["String"]["input"];
  locale: InputMaybe<Scalars["String"]["input"]>;
}

export interface QueryAddressAutocompleteArgs {
  countryCode: InputMaybe<Scalars["String"]["input"]>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  text: Scalars["String"]["input"];
}

export interface QueryAdminGetEventArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryCheckEmailArgs {
  email: Scalars["String"]["input"];
}

export interface QueryCheckUsernameArgs {
  username: Scalars["String"]["input"];
}

export interface QueryEventArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryEventAddressByIdArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryEventChildrenArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryEventGuestsArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryEventInvitationArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryEventRsvpArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryEventTablesArgs {
  sectionId: Scalars["ID"]["input"];
}

export interface QueryEventTreeArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryGeocodeAddressArgs {
  input: GeocodeAddressInput;
}

export interface QueryGetByIdArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryGetByUsernameArgs {
  username: Scalars["String"]["input"];
}

export interface QueryGetCitiesByPostalCodeArgs {
  postalCodeId: Scalars["ID"]["input"];
}

export interface QueryGetCitiesByStateArgs {
  stateId: Scalars["ID"]["input"];
}

export interface QueryGetCityByNameAndStateArgs {
  name: Scalars["String"]["input"];
  stateId: Scalars["ID"]["input"];
}

export interface QueryGetCountryByNameArgs {
  name: Scalars["String"]["input"];
}

export interface QueryGetEventAddressByEventIdArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryGetFullByEventIdsArgs {
  eventIds: Scalars["ID"]["input"][];
}

export interface QueryGetGeoLocationInfoArgs {
  countryCode: InputMaybe<Scalars["String"]["input"]>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  text: Scalars["String"]["input"];
}

export interface QueryGetHouseNumberByNameArgs {
  name: Scalars["String"]["input"];
}

export interface QueryGetPlusOnesByInvitationArgs {
  invitationId: Scalars["ID"]["input"];
}

export interface QueryGetPostalCodeByNameAndCityArgs {
  cityId: Scalars["ID"]["input"];
  code: Scalars["String"]["input"];
}

export interface QueryGetPostalCodesByCityArgs {
  cityId: Scalars["ID"]["input"];
}

export interface QueryGetPostalCodesByStateArgs {
  stateId: Scalars["ID"]["input"];
}

export interface QueryGetSeatByGuestAndEventArgs {
  input: GuestEventSeatInput;
}

export interface QueryGetSeatListArgs {
  seatIds: Scalars["ID"]["input"][];
}

export interface QueryGetStateByNameArgs {
  name: Scalars["String"]["input"];
}

export interface QueryGetStatesByCountryArgs {
  countryId: Scalars["ID"]["input"];
}

export interface QueryGetStreetByNameArgs {
  name: Scalars["String"]["input"];
}

export interface QueryGetUserAddressesByUserIdArgs {
  userId: Scalars["ID"]["input"];
}

export interface QueryGetUserListArgs {
  userIds: Scalars["ID"]["input"][];
}

export interface QueryGetWhatsappMessagesArgs {
  chatId: Scalars["String"]["input"];
}

export interface QueryInvitationArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryLatestLayoutVersionArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryLayoutChangeLogArgs {
  eventId: Scalars["ID"]["input"];
  limit: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryLayoutVersionsArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryMediaUrlArgs {
  mediaId: Scalars["String"]["input"];
}

export interface QueryMediaVariantUrlArgs {
  format: Scalars["String"]["input"];
  mediaId: Scalars["String"]["input"];
  width: Scalars["Float"]["input"];
}

export interface QueryMyNotificationsArgs {
  limit: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryNotificationArgs {
  id: Scalars["String"]["input"];
}

export interface QueryNotificationsArgs {
  filter: InputMaybe<NotificationFilterInput>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryPnpmArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryPublicEventTreeArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryScanLogsByTicketArgs {
  ticketId: Scalars["ID"]["input"];
}

export interface QuerySeatArgs {
  id: Scalars["ID"]["input"];
}

export interface QuerySeatAssignmentLogsArgs {
  eventId: Scalars["String"]["input"];
}

export interface QuerySeatLayoutArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QuerySeatPresencesByEventArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QuerySeatsArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QuerySeatsBySectionArgs {
  sectionId: Scalars["ID"]["input"];
}

export interface QuerySeatsByTableArgs {
  tableId: Scalars["ID"]["input"];
}

export interface QuerySectionArgs {
  id: Scalars["ID"]["input"];
}

export interface QuerySectionsArgs {
  eventId: Scalars["String"]["input"];
}

export interface QueryTableArgs {
  sectionId: Scalars["ID"]["input"];
}

export interface QueryTablesBySectionArgs {
  sectionId: Scalars["ID"]["input"];
}

export interface QueryTemplatesArgs {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  search: InputMaybe<Scalars["String"]["input"]>;
}

export interface QueryTicketByIdArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryTicketByInvitationArgs {
  invitationId: Scalars["ID"]["input"];
}

export interface QueryTicketsByEventArgs {
  eventId: Scalars["ID"]["input"];
}

export interface QueryTicketsByGuestArgs {
  guestProfileId: Scalars["ID"]["input"];
}

export interface QueryUserAddressByIdArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryUserAddressesArgs {
  filter: InputMaybe<UserAddressFilter>;
}

export interface QueryUserByIdArgs {
  id: Scalars["ID"]["input"];
}

export interface QueryValidateAddressArgs {
  input: AddressValidationInput;
}

/** RSVP input for an invitation. A YES response may include optional contact information. */
export interface RsvpInput {
  /** The RSVP response: YES, NO, or MAYBE. */
  choice: RsvpChoice;
  /** ID of the invitation for which the guest is submitting an RSVP. */
  invitationId: Scalars["ID"]["input"];
  /** Additional contact info provided when the guest RSVPs YES. Ignored when choice !== YES. */
  replyInput: InputMaybe<AcceptRsvpInput>;
}

export type RealmRoleType = "ADMIN" | "BASIC" | "ELITE" | "GUEST" | "SUPREME" | "USER";

export type RelationshipType =
  | "BUSINESS_PARTNER"
  | "CHILD"
  | "COLLEAGUE"
  | "COUSIN"
  | "FAMILY"
  | "FRIEND"
  | "OTHER"
  | "PARENT"
  | "PARTNER"
  | "RELATIVE"
  | "SIBLING";

export interface RemoveTimelineInput {
  id: Scalars["ID"]["input"];
}

export interface RemoveUserFromEventInput {
  eventId: Scalars["String"]["input"];
  eventRole: UserRoleType;
  userId: Scalars["String"]["input"];
}

export interface RenameConflict {
  __typename: "RenameConflict";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
}

export interface RenamePayload {
  __typename: "RenamePayload";
  affectedSeats: Scalars["Float"]["output"];
  success: Scalars["Boolean"]["output"];
}

export interface RenameSectionInput {
  newName: Scalars["String"]["input"];
  sectionId: Scalars["ID"]["input"];
}

export interface RenameTableInput {
  newName: Scalars["String"]["input"];
  tableId: Scalars["ID"]["input"];
}

export interface ResetVerificationPayload {
  __typename: "ResetVerificationPayload";
  mfaMethod: MfaPreference;
  mfaRequired: Scalars["Boolean"]["output"];
}

export interface RevokeTicketInput {
  reason: InputMaybe<Scalars["String"]["input"]>;
  ticketId: Scalars["ID"]["input"];
}

export type RsvpChoice = "MAYBE" | "NO" | "YES";

export interface SaveLayoutVersionInput {
  data: Scalars["JSON"]["input"];
  eventId: Scalars["ID"]["input"];
  label: InputMaybe<Scalars["String"]["input"]>;
  version: Scalars["Int"]["input"];
}

export interface ScanInput {
  deviceId: Scalars["String"]["input"];
  gate: InputMaybe<Scalars["String"]["input"]>;
  signature: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
}

export interface ScanLogPayload {
  __typename: "ScanLogPayload";
  actorId: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  deviceId: Maybe<Scalars["String"]["output"]>;
  direction: PresenceState;
  eventId: Scalars["String"]["output"];
  gate: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  nonce: Maybe<Scalars["Int"]["output"]>;
  ticketId: Scalars["ID"]["output"];
  verdict: ScanVerdict;
}

export interface ScanPayload {
  __typename: "ScanPayload";
  log: ScanLogPayload;
  message: Scalars["String"]["output"];
  ticket: TicketPayload;
  verdict: ScanVerdict;
}

/** The result of a ticket scan, including anti-sharing cases. */
export type ScanVerdict =
  | "BLOCKED"
  | "DEVICE_MISMATCH"
  | "EXPIRED_EVENT"
  | "INVALID_NONCE"
  | "OK"
  | "REPLAY"
  | "REVOKED"
  | "UNKNOWN";

export type SeatAssignmentAction = "ASSIGNED" | "MOVED" | "UNASSIGNED";

export interface SeatAssignmentLogPayload {
  __typename: "SeatAssignmentLogPayload";
  action: SeatAssignmentAction;
  createdAt: Scalars["DateTime"]["output"];
  data: Maybe<Scalars["JSON"]["output"]>;
  eventId: Scalars["ID"]["output"];
  guestId: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  invitationId: Maybe<Scalars["ID"]["output"]>;
  seatId: Scalars["ID"]["output"];
}

export interface SeatConfigInput {
  count: Scalars["Int"]["input"];
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  shape: Scalars["String"]["input"];
}

export interface SeatPayload {
  __typename: "SeatPayload";
  createdAt: Scalars["DateTime"]["output"];
  eventId: Scalars["String"]["output"];
  guestId: Maybe<Scalars["ID"]["output"]>;
  height: Maybe<Scalars["Float"]["output"]>;
  hidden: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  invitationId: Maybe<Scalars["ID"]["output"]>;
  label: Maybe<Scalars["String"]["output"]>;
  locked: Scalars["Boolean"]["output"];
  meta: Maybe<Scalars["JSON"]["output"]>;
  note: Maybe<Scalars["String"]["output"]>;
  number: Maybe<Scalars["Float"]["output"]>;
  radius: Maybe<Scalars["Float"]["output"]>;
  rotation: Maybe<Scalars["Float"]["output"]>;
  seatType: Maybe<SeatType>;
  section: SectionPayload;
  sectionId: Scalars["String"]["output"];
  shape: SeatShape;
  status: Scalars["String"]["output"];
  table: Maybe<TablePayload>;
  tableId: Maybe<Scalars["String"]["output"]>;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
  width: Maybe<Scalars["Float"]["output"]>;
  x: Maybe<Scalars["Float"]["output"]>;
  y: Maybe<Scalars["Float"]["output"]>;
  zIndex: Maybe<Scalars["Int"]["output"]>;
}

export interface SeatPresencePayload {
  __typename: "SeatPresencePayload";
  checkedInAt: Maybe<Scalars["DateTime"]["output"]>;
  presenceState: PresenceState;
  revoked: Scalars["Boolean"]["output"];
  revokedAt: Maybe<Scalars["DateTime"]["output"]>;
  seatId: Scalars["ID"]["output"];
}

export type SeatShape = "CIRCLE" | "RECTANGLE" | "SQUARE";

export type SeatType = "CHILD" | "RESERVED" | "STAFF" | "STANDARD" | "STANDING" | "VIP";

export interface SectionInput {
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
  order: InputMaybe<Scalars["Int"]["input"]>;
  shape: Scalars["String"]["input"];
  tables: TableConfigInput[];
}

export interface SectionPayload {
  __typename: "SectionPayload";
  capacity: Maybe<Scalars["Float"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  eventId: Scalars["String"]["output"];
  height: Maybe<Scalars["Float"]["output"]>;
  id: Scalars["ID"]["output"];
  meta: Scalars["JSON"]["output"];
  name: Scalars["String"]["output"];
  order: Scalars["Float"]["output"];
  rotation: Maybe<Scalars["Float"]["output"]>;
  seats: SeatPayload[];
  shape: SectionShape;
  tables: TablePayload[];
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
  width: Maybe<Scalars["Float"]["output"]>;
  x: Scalars["Float"]["output"];
  y: Scalars["Float"]["output"];
}

export type SectionShape = "CIRCLE" | "POLYGON" | "RECTANGLE";

export interface SecurityQuestionAnswerInput {
  answer: Scalars["String"]["input"];
  questionId: Scalars["String"]["input"];
}

/** Specifies the type/category of a phone number. */
export type SecurityQuestionEnum =
  | "BIRTH_CITY"
  | "BIRTH_DATE"
  | "CHILDHOOD_BEST_FRIEND"
  | "FAVORITE_SCHOOL_SUBJECT"
  | "FAVOURITE_COMPANY"
  | "FIRST_PET"
  | "MOTHER_MAIDEN_NAME";

export interface SecurityQuestionPayload {
  __typename: "SecurityQuestionPayload";
  id: Scalars["ID"]["output"];
  key: SecurityQuestionEnum;
  question: Scalars["String"]["output"];
}

export interface SendEmail {
  body: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  subject: Scalars["String"]["input"];
}

export interface SendInAppMessageInput {
  important: InputMaybe<Scalars["Boolean"]["input"]>;
  message: Scalars["String"]["input"];
  secret: InputMaybe<Scalars["Boolean"]["input"]>;
  userId: Scalars["String"]["input"];
  viewOnce: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface SendInvitationsInput {
  guests: InvitationGuestInput[];
  hostName: InputMaybe<Scalars["String"]["input"]>;
}

export interface SendWhatsappMessageInput {
  message: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
}

export interface SendWhatsappMessageInput2 {
  chatId: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
}

export interface SetTimelineInput {
  eventId: Scalars["ID"]["input"];
  timelines: TimelineUpsertInput[];
}

export interface SettingsPayload {
  __typename: "SettingsPayload";
  allowGuestSeatSelection: Scalars["Boolean"]["output"];
  allowPlusOneUpdate: Scalars["Boolean"]["output"];
  allowPublicPlusOne: Scalars["Boolean"]["output"];
  allowPublicRsvp: Scalars["Boolean"]["output"];
  allowPublicRsvpWebsite: Scalars["Boolean"]["output"];
  allowReEntry: Scalars["Boolean"]["output"];
  allowSeatOverbooking: Scalars["Boolean"]["output"];
  approvalMode: InvitationApprovalMode;
  category: EventCategory;
  createdAt: Scalars["DateTime"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  dressCode: Maybe<Scalars["String"]["output"]>;
  endsAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  invitedByOptions: Scalars["String"]["output"][];
  isActive: Scalars["Boolean"]["output"];
  isPublic: Scalars["Boolean"]["output"];
  maxPlusOnes: Scalars["Float"]["output"];
  maxSeats: Scalars["Float"]["output"];
  publicRsvpWebsite: Maybe<Scalars["String"]["output"]>;
  requireApprovalForPlusOnes: Scalars["Boolean"]["output"];
  rotateSeconds: Scalars["Float"]["output"];
  rsvpDeadline: Maybe<Scalars["DateTime"]["output"]>;
  startsAt: Scalars["DateTime"]["output"];
  ticketReleaseAt: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
}

export interface SignUpPayload {
  __typename: "SignUpPayload";
  message: Maybe<Scalars["String"]["output"]>;
  password: Scalars["String"]["output"];
  token: Maybe<TokenPayload>;
  user: Maybe<KcUser>;
  userId: Maybe<Scalars["ID"]["output"]>;
  username: Maybe<Scalars["String"]["output"]>;
}

export interface SignUpResultsPayload {
  __typename: "SignUpResultsPayload";
  email: Scalars["String"]["output"];
  password: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
}

/**
 * =====================================================
 * STATE TYPE
 * =====================================================
 */
export interface State {
  __typename: "State";
  code: Scalars["String"]["output"];
  country: Country;
  id: Scalars["ID"]["output"];
  iso3166Code: Maybe<Scalars["String"]["output"]>;
  latitude: Maybe<Scalars["Float"]["output"]>;
  level: Maybe<Scalars["Int"]["output"]>;
  longitude: Maybe<Scalars["Float"]["output"]>;
  name: Scalars["String"]["output"];
  parent: Maybe<State>;
  population: Maybe<Scalars["Int"]["output"]>;
  timezones: Timezone[];
  type: Maybe<Scalars["String"]["output"]>;
}

/**
 * =====================================================
 * FILTER INPUT
 * =====================================================
 */
export interface StateFilterInput {
  code: InputMaybe<Scalars["String"]["input"]>;
  countryId: InputMaybe<Scalars["ID"]["input"]>;
  countryIso2: InputMaybe<Scalars["String"]["input"]>;
  countryIso3: InputMaybe<Scalars["String"]["input"]>;
  iso3166_2: InputMaybe<Scalars["String"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  type: InputMaybe<Scalars["String"]["input"]>;
}

/**
 * =====================================================
 * PAGINATION WRAPPER
 * =====================================================
 */
export interface StatePage {
  __typename: "StatePage";
  content: State[];
  number: Scalars["Int"]["output"];
  size: Scalars["Int"]["output"];
  totalElements: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
}

export type StatusType = "ACTIVE" | "BLOCKED" | "CLOSED" | "INACTIVE" | "PENDING" | "SUSPENDED";

export interface StepUpVerificationInputGql {
  answers: InputMaybe<SecurityQuestionAnswerInput[]>;
  code: InputMaybe<Scalars["String"]["input"]>;
  credentialResponse: InputMaybe<Scalars["JSON"]["input"]>;
  token: Scalars["String"]["input"];
}

export interface Street {
  __typename: "Street";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
}

export interface Subregion {
  __typename: "Subregion";
  continent: Continent;
  countries: Country[];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
}

/** Generic success response payload used across mutations. Includes a boolean status flag and an optional human-readable message. */
export interface SuccessPayload {
  __typename: "SuccessPayload";
  /** Optional human-readable message providing additional context about the operation result. */
  message: Maybe<Scalars["String"]["output"]>;
  /** Indicates whether the operation was successful. */
  ok: Scalars["Boolean"]["output"];
}

export interface TableConfigInput {
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  order: InputMaybe<Scalars["Int"]["input"]>;
  seats: SeatConfigInput;
  shape: Scalars["String"]["input"];
}

export interface TablePayload {
  __typename: "TablePayload";
  capacity: Maybe<Scalars["Float"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  eventId: Scalars["String"]["output"];
  height: Maybe<Scalars["Float"]["output"]>;
  id: Scalars["ID"]["output"];
  meta: Scalars["JSON"]["output"];
  name: Scalars["String"]["output"];
  order: Scalars["Float"]["output"];
  rotation: Maybe<Scalars["Float"]["output"]>;
  seats: SeatPayload[];
  section: SectionPayload;
  sectionId: Scalars["String"]["output"];
  shape: TableShape;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
  width: Maybe<Scalars["Float"]["output"]>;
  x: Scalars["Float"]["output"];
  y: Scalars["Float"]["output"];
}

export type TableShape = "OVAL" | "RECTANGLE" | "ROUND" | "ROW";

export interface TemplatePayload {
  __typename: "TemplatePayload";
  body: Scalars["String"]["output"];
  channel: Channel;
  createdAt: Scalars["DateTime"]["output"];
  format: ContentFormat;
  id: Scalars["ID"]["output"];
  isActive: Scalars["Boolean"]["output"];
  key: Scalars["String"]["output"];
  locale: Scalars["String"]["output"];
  subject: Maybe<Scalars["String"]["output"]>;
  tags: Scalars["String"]["output"][];
  updatedAt: Scalars["DateTime"]["output"];
  variables: Scalars["JSON"]["output"];
  version: Scalars["Float"]["output"];
}

export interface TicketPayload {
  __typename: "TicketPayload";
  checkedInAt: Maybe<Scalars["DateTime"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  currentState: PresenceState;
  deviceActivationAt: Maybe<Scalars["DateTime"]["output"]>;
  deviceActivationIP: Maybe<Scalars["String"]["output"]>;
  deviceId: Maybe<Scalars["String"]["output"]>;
  devicePublicKey: Maybe<Scalars["String"]["output"]>;
  eventId: Scalars["ID"]["output"];
  guestProfileId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  invitationId: Scalars["ID"]["output"];
  lastNonce: Maybe<Scalars["Int"]["output"]>;
  nextNonce: Maybe<Scalars["Int"]["output"]>;
  revoked: Scalars["Boolean"]["output"];
  revokedAt: Maybe<Scalars["DateTime"]["output"]>;
  revokedBy: Maybe<Scalars["String"]["output"]>;
  revokedReason: Maybe<Scalars["String"]["output"]>;
  seatId: Scalars["ID"]["output"];
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
}

export interface TimelineUpsertInput {
  id: InputMaybe<Scalars["ID"]["input"]>;
  label: Scalars["String"]["input"];
  timestamp: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
}

export interface Timezone {
  __typename: "Timezone";
  abbreviation: Scalars["String"]["output"];
  countries: Country[];
  gmtOffset: Scalars["String"]["output"];
  gmtOffsetName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  tzName: Scalars["String"]["output"];
  zoneName: Scalars["String"]["output"];
}

export interface TokenPayload {
  __typename: "TokenPayload";
  accessToken: Scalars["String"]["output"];
  expiresIn: Scalars["String"]["output"];
  idToken: Scalars["String"]["output"];
  refreshExpiresIn: Scalars["String"]["output"];
  refreshToken: Scalars["String"]["output"];
  scope: Scalars["String"]["output"];
}

export interface TotpSetupPayload {
  __typename: "TotpSetupPayload";
  otpauth: Maybe<Scalars["String"]["output"]>;
  secret: Maybe<Scalars["String"]["output"]>;
  uri: Maybe<Scalars["String"]["output"]>;
}

export interface TransferInput {
  eventId: Scalars["ID"]["input"];
  newOwnerId: Scalars["ID"]["input"];
}

export interface UpdateEventAddressInput {
  additionalInfo: InputMaybe<Scalars["String"]["input"]>;
  cityId: InputMaybe<Scalars["ID"]["input"]>;
  countryId: InputMaybe<Scalars["ID"]["input"]>;
  eventId: Scalars["ID"]["input"];
  houseNumber: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  postalCodeId: InputMaybe<Scalars["ID"]["input"]>;
  stateId: InputMaybe<Scalars["ID"]["input"]>;
  street: InputMaybe<Scalars["String"]["input"]>;
}

export interface UpdateEventInput {
  eventId: Scalars["String"]["input"];
  name: InputMaybe<Scalars["String"]["input"]>;
  parentId: InputMaybe<Scalars["String"]["input"]>;
  settings: InputMaybe<UpdateSettingsInput>;
  tags: InputMaybe<Scalars["String"]["input"][]>;
}

export interface UpdateKcUserInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  firstName: InputMaybe<Scalars["String"]["input"]>;
  lastName: InputMaybe<Scalars["String"]["input"]>;
  password: InputMaybe<Scalars["String"]["input"]>;
}

export interface UpdateMeInput {
  personalInfo: InputMaybe<PersonalInfoInput>;
}

export interface UpdateMyProfileInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  firstName: InputMaybe<Scalars["String"]["input"]>;
  lastName: InputMaybe<Scalars["String"]["input"]>;
  username: InputMaybe<Scalars["String"]["input"]>;
}

export interface UpdatePlusOneInput {
  email: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  lastName: Scalars["String"]["input"];
  phoneNumbers: InputMaybe<PhoneNumberInput[]>;
  plusOneAgeCategory: PlusOneAgeCategory;
}

export interface UpdateSeatInput {
  id: Scalars["ID"]["input"];
  label: InputMaybe<Scalars["String"]["input"]>;
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  note: InputMaybe<Scalars["String"]["input"]>;
  number: InputMaybe<Scalars["Int"]["input"]>;
  rotation: InputMaybe<Scalars["Float"]["input"]>;
  seatType: InputMaybe<SeatType>;
  x: InputMaybe<Scalars["Float"]["input"]>;
  y: InputMaybe<Scalars["Float"]["input"]>;
}

export interface UpdateSectionInput {
  capacity: InputMaybe<Scalars["Int"]["input"]>;
  height: InputMaybe<Scalars["Float"]["input"]>;
  id: Scalars["ID"]["input"];
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  order: InputMaybe<Scalars["Int"]["input"]>;
  shape: InputMaybe<SectionShape>;
  width: InputMaybe<Scalars["Float"]["input"]>;
  x: InputMaybe<Scalars["Float"]["input"]>;
  y: InputMaybe<Scalars["Float"]["input"]>;
}

export interface UpdateSettingsInput {
  allowGuestSeatSelection: InputMaybe<Scalars["Boolean"]["input"]>;
  allowPlusOneUpdate: InputMaybe<Scalars["Boolean"]["input"]>;
  allowPublicPlusOne: InputMaybe<Scalars["Boolean"]["input"]>;
  allowPublicRsvp: InputMaybe<Scalars["Boolean"]["input"]>;
  allowPublicRsvpWebsite: InputMaybe<Scalars["Boolean"]["input"]>;
  allowReEntry: InputMaybe<Scalars["Boolean"]["input"]>;
  allowSeatOverbooking: InputMaybe<Scalars["Boolean"]["input"]>;
  approvalMode: InputMaybe<InvitationApprovalMode>;
  category: InputMaybe<EventCategory>;
  description: InputMaybe<Scalars["String"]["input"]>;
  dressCode: InputMaybe<Scalars["String"]["input"]>;
  endsAt: InputMaybe<Scalars["DateTime"]["input"]>;
  invitedByOptions: InputMaybe<Scalars["String"]["input"][]>;
  isActive: InputMaybe<Scalars["Boolean"]["input"]>;
  isPublic: InputMaybe<Scalars["Boolean"]["input"]>;
  maxPlusOnes: InputMaybe<Scalars["Int"]["input"]>;
  maxSeats: InputMaybe<Scalars["Int"]["input"]>;
  publicRsvpWebsite: InputMaybe<Scalars["String"]["input"]>;
  requireApprovalForPlusOnes: InputMaybe<Scalars["Boolean"]["input"]>;
  rotateSeconds: InputMaybe<Scalars["Int"]["input"]>;
  rsvpDeadline: InputMaybe<Scalars["DateTime"]["input"]>;
  startsAt: InputMaybe<Scalars["DateTime"]["input"]>;
  ticketReleaseAt: InputMaybe<Scalars["DateTime"]["input"]>;
}

export interface UpdateTableInput {
  capacity: InputMaybe<Scalars["Int"]["input"]>;
  height: InputMaybe<Scalars["Float"]["input"]>;
  id: Scalars["ID"]["input"];
  meta: InputMaybe<Scalars["JSON"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  order: InputMaybe<Scalars["Int"]["input"]>;
  rotation: InputMaybe<Scalars["Float"]["input"]>;
  shape: InputMaybe<TableShape>;
  width: InputMaybe<Scalars["Float"]["input"]>;
  x: InputMaybe<Scalars["Float"]["input"]>;
  y: InputMaybe<Scalars["Float"]["input"]>;
}

export interface UpdateTemplateInput {
  body: InputMaybe<Scalars["String"]["input"]>;
  bumpVersion: Scalars["Boolean"]["input"];
  format: InputMaybe<ContentFormat>;
  id: Scalars["ID"]["input"];
  locale: InputMaybe<Scalars["String"]["input"]>;
  subject: InputMaybe<Scalars["String"]["input"]>;
  tags: InputMaybe<Scalars["String"]["input"][]>;
  variables: InputMaybe<Scalars["String"]["input"][]>;
}

export interface UpdateTimelineInput {
  id: Scalars["ID"]["input"];
  label: Scalars["String"]["input"];
  timestamp: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
}

export interface UpdateUserAddressInput {
  additionalInfo: InputMaybe<Scalars["String"]["input"]>;
  addressType: InputMaybe<AddressType>;
  id: Scalars["ID"]["input"];
}

export interface UpdateUserInput {
  id: Scalars["ID"]["input"];
  status: InputMaybe<PersonStatusType>;
  userType: InputMaybe<UserType>;
}

export interface UpdateUserPasswordInput {
  id: InputMaybe<Scalars["ID"]["input"]>;
  newPassword: InputMaybe<Scalars["String"]["input"]>;
}

export interface UserAddress {
  __typename: "UserAddress";
  additionalInfo: Maybe<Scalars["String"]["output"]>;
  addressType: AddressType;
  cityId: Maybe<Scalars["String"]["output"]>;
  countryId: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["String"]["output"];
  houseNumberId: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  postalCodeId: Maybe<Scalars["String"]["output"]>;
  stateId: Maybe<Scalars["String"]["output"]>;
  streetId: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["String"]["output"];
  userId: Scalars["ID"]["output"];
}

export interface UserAddressFilter {
  addressType: InputMaybe<AddressType>;
  cityId: InputMaybe<Scalars["ID"]["input"]>;
  countryId: InputMaybe<Scalars["ID"]["input"]>;
  postalCodeId: InputMaybe<Scalars["ID"]["input"]>;
  userId: InputMaybe<Scalars["ID"]["input"]>;
}

export interface UserAddressInput {
  additionalInfo: InputMaybe<Scalars["String"]["input"]>;
  addressType: Scalars["String"]["input"];
  cityId: Scalars["ID"]["input"];
  countryId: Scalars["ID"]["input"];
  houseNumber: InputMaybe<Scalars["String"]["input"]>;
  postalCodeId: InputMaybe<Scalars["ID"]["input"]>;
  stateId: InputMaybe<Scalars["ID"]["input"]>;
  street: InputMaybe<Scalars["String"]["input"]>;
}

export interface UserAddressPayload {
  __typename: "UserAddressPayload";
  additionalInfo: Maybe<Scalars["String"]["output"]>;
  addressType: AddressType;
  city: Maybe<Scalars["String"]["output"]>;
  country: Maybe<Scalars["String"]["output"]>;
  houseNumber: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  postalCode: Maybe<Scalars["String"]["output"]>;
  state: Maybe<Scalars["String"]["output"]>;
  street: Maybe<Scalars["String"]["output"]>;
  userId: Scalars["ID"]["output"];
}

export interface UserPayload {
  __typename: "UserPayload";
  contacts: Maybe<ContactPayload[]>;
  createdAt: Scalars["DateTime"]["output"];
  customer: Maybe<CustomerPayload>;
  employee: Maybe<EmployeePayload>;
  id: Scalars["ID"]["output"];
  personalInfo: Maybe<PersonalInfoPayload>;
  role: Maybe<RealmRoleType>;
  status: PersonStatusType;
  updatedAt: Scalars["DateTime"]["output"];
  userType: UserType;
  username: Scalars["String"]["output"];
}

export interface UserRolePayload {
  __typename: "UserRolePayload";
  eventId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  role: UserRoleType;
  userId: Scalars["String"]["output"];
}

/** Role of a user inside an event */
export type UserRoleType = "ADMIN" | "GUEST" | "SECURITY";

export type UserType = "CUSTOMER" | "EMPLOYEE" | "GUEST";

export interface WebAuthnDevicePayload {
  __typename: "WebAuthnDevicePayload";
  backedUp: Scalars["Boolean"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  credentialId: Scalars["String"]["output"];
  deviceType: Scalars["String"]["output"];
  lastUsedAt: Maybe<Scalars["DateTime"]["output"]>;
  nickname: Maybe<Scalars["String"]["output"]>;
  revokedAt: Maybe<Scalars["DateTime"]["output"]>;
}
