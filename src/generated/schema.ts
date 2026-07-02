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

export type AddressType =
  | 'BILLING'
  | 'HOME'
  | 'SHIPPING'
  | 'WORK';

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

export type CallingCode = {
  __typename: 'CallingCode';
  code: Scalars['String']['output'];
  countries: Array<Country>;
  id: Scalars['ID']['output'];
};

export type ChangeMyPasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type Channel =
  | 'EMAIL'
  | 'IN_APP'
  | 'PUSH'
  | 'SMS'
  | 'WHATSAPP';

export type Chat = {
  __typename: 'Chat';
  chatId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isGroup: Scalars['Boolean']['output'];
  name: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

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

export type ContactOptionsType =
  | 'EMAIL'
  | 'LETTER'
  | 'PHONE'
  | 'SMS'
  | 'WHATSAPP';

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

export type ContentFormat =
  | 'HTML'
  | 'MARKDOWN'
  | 'TEXT';

export type Continent = {
  __typename: 'Continent';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subregion: Array<Subregion>;
};

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
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  order: InputMaybe<Scalars['Int']['input']>;
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
  invitedByOptions: Array<Scalars['String']['input']>;
  isActive: Scalars['Boolean']['input'];
  isPublic: Scalars['Boolean']['input'];
  maxPlusOnes: Scalars['Int']['input'];
  maxSeats: Scalars['Int']['input'];
  publicRsvpWebsite: InputMaybe<Scalars['String']['input']>;
  requireApprovalForPlusOnes: Scalars['Boolean']['input'];
  rotateSeconds: Scalars['Int']['input'];
  rsvpDeadline: InputMaybe<Scalars['DateTime']['input']>;
  startsAt: InputMaybe<Scalars['DateTime']['input']>;
  ticketReleaseAt: InputMaybe<Scalars['DateTime']['input']>;
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

export type EventCategory =
  | 'GENERAL'
  | 'KONFERENZ'
  | 'MUSIK'
  | 'SOCIAL'
  | 'SPORTS'
  | 'WORKSHOP';

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
  myRole: Maybe<UserRoleType>;
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  parentId: Maybe<Scalars['String']['output']>;
  path: Maybe<Scalars['String']['output']>;
  settings: Maybe<SettingsPayload>;
  tags: Array<Scalars['String']['output']>;
  timeline: Array<EventTimelinePayload>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  userRoles: Array<UserRolePayload>;
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

export type GenderType =
  | 'DIVERSE'
  | 'FEMALE'
  | 'MALE'
  | 'UNKNOWN';

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

export type InterestCategoryType =
  | 'FINANCE'
  | 'LIFESTYLE'
  | 'MUSIC'
  | 'REAL_ASSETS'
  | 'SPORTS'
  | 'TECHNOLOGY';

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

export type InterestType =
  | 'BANK_PRODUCTS_AND_SERVICES'
  | 'BASKETBALL'
  | 'CLASSIC'
  | 'CREDIT_AND_DEBT'
  | 'FINANCIAL_EDUCATION_AND_COUNSELING'
  | 'FOOTBALL'
  | 'HIPHOP'
  | 'INSURANCE'
  | 'INVESTMENTS'
  | 'RAP'
  | 'REAL_ESTATE'
  | 'ROCK'
  | 'RUGBY'
  | 'SAVING_AND_FINANCE'
  | 'SOCCER'
  | 'SUSTAINABLE_FINANCE'
  | 'TECHNOLOGY_AND_INNOVATION'
  | 'TRAVEL';

export type InvitationApprovalMode =
  | 'AUTO'
  | 'AUTO_INVITE_ONLY'
  | 'AUTO_PUBLIC_ONLY'
  | 'MANUAL';

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

export type InvitationStatus =
  | 'ACCEPTED'
  | 'APPROVED'
  | 'CANCELED'
  | 'DECLINED'
  | 'PENDING'
  | 'REJECTED';

export type InvitationType =
  | 'PRIVATE'
  | 'PUBLIC';

export type KcUser = {
  __typename: 'KcUser';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  role: Maybe<RealmRoleType>;
  username: Scalars['String']['output'];
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

export type LayoutChangeType =
  | 'AUTO_GENERATE_GEOMETRY_V4'
  | 'LAYOUT_VERSION_SAVED'
  | 'SEAT_ASSIGN'
  | 'SEAT_ASSIGNED'
  | 'SEAT_CREATE'
  | 'SEAT_DELETE'
  | 'SEAT_MOVED'
  | 'SEAT_UNASSIGNED'
  | 'SEAT_UPDATE'
  | 'SECTION_CLONED'
  | 'SECTION_CREATE'
  | 'SECTION_DELETE'
  | 'SECTION_MOVED'
  | 'SECTION_RENAME'
  | 'SECTION_UPDATE'
  | 'TABLE_CREATE'
  | 'TABLE_DELETE'
  | 'TABLE_DUPLICATED'
  | 'TABLE_MOVED'
  | 'TABLE_RENAME'
  | 'TABLE_UPDATE';

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

export type LogInInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginTotpInput = {
  code: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type MaritalStatusType =
  | 'DIVORCED'
  | 'MARRIED'
  | 'SINGLE'
  | 'WIDOWED';

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

export type MediaType =
  | 'COVER'
  | 'GALLERY'
  | 'LOGO';

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
  body: Maybe<Scalars['String']['output']>;
  chatId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  direction: MessageDirection;
  from: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mediaUrl: Maybe<Scalars['String']['output']>;
  messageId: Maybe<Scalars['String']['output']>;
  to: Scalars['String']['output'];
};

export type MessageDirection =
  | 'INBOUND'
  | 'OUTBOUND';

export type MfaPreference =
  | 'BACKUP_CODES'
  | 'NONE'
  | 'SECURITY_QUESTIONS'
  | 'TOTP'
  | 'WEBAUTHN';

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
  /** Bind a device to a ticket (first activation) */
  activateDevice: TicketPayload;
  activateEvent: Scalars['Boolean']['output'];
  addContact: Scalars['Boolean']['output'];
  addPhoneNumbers: Scalars['Boolean']['output'];
  addTimeLines: EventPayload;
  adminChangePassword: Scalars['Boolean']['output'];
  adminSignUp: TokenPayload;
  adminUpdateUser: Scalars['Boolean']['output'];
  approveInvitation: InvitationPayload;
  archiveNotification: NotificationPayload;
  assignChat: Chat;
  assignRealmRole: Scalars['Boolean']['output'];
  assignSeat: SeatPayload;
  assignUserToEvent: Scalars['Boolean']['output'];
  autoGenerateLayout: Scalars['Boolean']['output'];
  autoGenerateSeatMap: Scalars['Boolean']['output'];
  bulkApproveInvitations: Array<InvitationPayload>;
  bulkRenameSections: BulkRenamePayload;
  bulkRenameTables: BulkRenamePayload;
  cancelNotification: NotificationPayload;
  changeMyPassword: SuccessPayload;
  claimChat: Chat;
  claimWhatsappChat: Chat;
  cloneSection: SectionPayload;
  completePasswordReset: Scalars['Boolean']['output'];
  confirmTotp: Scalars['Boolean']['output'];
  createEvent: EventPayload;
  createEventAddress: EventAddressPayload;
  createInvitation: InvitationPayload;
  createInvitationFromRsvp: InvitationPayload;
  createMedia: Scalars['String']['output'];
  createNotification: NotificationPayload;
  createPlusOnesInvitation: InvitationPayload;
  createSeat: SeatPayload;
  createSection: SectionPayload;
  createSignupVerification: Scalars['Boolean']['output'];
  createTable: TablePayload;
  createTemplate: TemplatePayload;
  createUserAddress: UserAddress;
  credentialsLogin: TokenPayload;
  deactivateEvent: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteEventAddressByEventId: Scalars['Boolean']['output'];
  deleteKcUser: Scalars['Boolean']['output'];
  deleteNotification: Scalars['Boolean']['output'];
  deleteSeat: Scalars['Boolean']['output'];
  deleteSection: Scalars['Boolean']['output'];
  deleteTable: Scalars['Boolean']['output'];
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
  markNotificationAsRead: NotificationPayload;
  markNotificationAsUnread: NotificationPayload;
  moveSeat: SeatPayload;
  moveSection: SeatPayload;
  moveTable: SeatPayload;
  redoLayout: Scalars['Boolean']['output'];
  refresh: TokenPayload;
  regenerateBackupCodes: Array<Scalars['String']['output']>;
  removeAllPlusOnesByInvitationId: Array<InvitationPayload>;
  removeContact: Scalars['Boolean']['output'];
  removeInvitation: SuccessPayload;
  removePhoneNumbers: Scalars['Boolean']['output'];
  removePlusOneInvitation: InvitationPayload;
  removeRealmRole: Scalars['Boolean']['output'];
  removeTimeLines: EventPayload;
  removeUserFromEvent: Scalars['Boolean']['output'];
  renameSection: RenamePayload;
  renameTable: RenamePayload;
  renameWebAuthnCredential: Scalars['Boolean']['output'];
  replyInvitation: InvitationPayload;
  requestPasswordReset: Scalars['Boolean']['output'];
  /** Revoke a ticket (security or admin) */
  revokeTicket: TicketPayload;
  revokeWebAuthnCredential: Scalars['Boolean']['output'];
  saveLayoutVersion: LayoutVersionPayload;
  scanToken: ScanPayload;
  sendEmail: Scalars['Boolean']['output'];
  sendInAppMessage: Scalars['Boolean']['output'];
  sendInvitations: Scalars['Boolean']['output'];
  sendMagicLink: Scalars['Boolean']['output'];
  sendWhatsappMessage: Message;
  sendWhatsappMessage2: Message;
  setMfaPreference: Scalars['Boolean']['output'];
  setTimelines: EventPayload;
  transferEventOwnership: Scalars['Boolean']['output'];
  unarchiveNotification: NotificationPayload;
  unassignSeat: SeatPayload;
  undoLayout: Scalars['Boolean']['output'];
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


export type MutationActivateDeviceArgs = {
  input: ActivateDeviceInput;
};


export type MutationActivateEventArgs = {
  eventId: Scalars['ID']['input'];
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


export type MutationArchiveNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationAssignChatArgs = {
  chatId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAssignRealmRoleArgs = {
  id: Scalars['ID']['input'];
  roleName: RealmRoleType;
};


export type MutationAssignSeatArgs = {
  input: AssignSeatInput;
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


export type MutationCancelNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeMyPasswordArgs = {
  input: ChangeMyPasswordInput;
};


export type MutationClaimChatArgs = {
  chatId: Scalars['String']['input'];
};


export type MutationClaimWhatsappChatArgs = {
  chatId: Scalars['String']['input'];
};


export type MutationCloneSectionArgs = {
  input: CloneSectionInput;
};


export type MutationCompletePasswordResetArgs = {
  input: CompleteResetInputGql;
};


export type MutationConfirmTotpArgs = {
  code: Scalars['String']['input'];
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateEventAddressArgs = {
  input: CreateEventAddressInput;
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


export type MutationCreateSeatArgs = {
  input: CreateSeatInput;
};


export type MutationCreateSectionArgs = {
  input: CreateSectionInput;
};


export type MutationCreateSignupVerificationArgs = {
  createUserInput: CreateUserInput;
};


export type MutationCreateTableArgs = {
  input: CreateTableInput;
};


export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


export type MutationCreateUserAddressArgs = {
  input: CreateUserAddressInput;
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


export type MutationDeleteKcUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNotificationArgs = {
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


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkNotificationAsUnreadArgs = {
  id: Scalars['String']['input'];
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


export type MutationReplyInvitationArgs = {
  input: RsvpInput;
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationRevokeTicketArgs = {
  input: RevokeTicketInput;
};


export type MutationRevokeWebAuthnCredentialArgs = {
  credentialId: Scalars['String']['input'];
};


export type MutationSaveLayoutVersionArgs = {
  input: SaveLayoutVersionInput;
};


export type MutationScanTokenArgs = {
  input: ScanInput;
};


export type MutationSendEmailArgs = {
  input: SendEmail;
};


export type MutationSendInAppMessageArgs = {
  input: SendInAppMessageInput;
};


export type MutationSendInvitationsArgs = {
  input: SendInvitationsInput;
};


export type MutationSendMagicLinkArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendWhatsappMessageArgs = {
  input: SendWhatsappMessageInput;
};


export type MutationSendWhatsappMessage2Args = {
  input: SendWhatsappMessageInput2;
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


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput;
};


export type MutationUpdatePlusOnesInvitationArgs = {
  input: UpdatePlusOneInput;
};


export type MutationUpdateSeatArgs = {
  input: UpdateSeatInput;
};


export type MutationUpdateSectionArgs = {
  input: UpdateSectionInput;
};


export type MutationUpdateTableArgs = {
  input: UpdateTableInput;
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
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
  channel: Channel;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Maybe<Scalars['String']['output']>;
  deliveredAt: Maybe<Scalars['DateTime']['output']>;
  expiresAt: Maybe<Scalars['DateTime']['output']>;
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
  updatedAt: Scalars['DateTime']['output'];
  variables: Scalars['JSON']['output'];
};

export type NotificationStatus =
  | 'ARCHIVED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'READ'
  | 'SENT';

export type PersonStatusType =
  | 'ACTIVE'
  | 'BLOCKED'
  | 'CLOSED'
  | 'DELETED'
  | 'DISABLED'
  | 'INACTIVE';

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

export type PhoneNumberType =
  | 'HOME'
  | 'MOBILE'
  | 'OTHER'
  | 'PRIVATE'
  | 'WHATSAPP'
  | 'WORK';

export type PlusOneAgeCategory =
  | 'OVER_SIX'
  | 'UNDER_SIX';

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
export type PresenceState =
  | 'INSIDE'
  | 'OUTSIDE';

export type Priority =
  | 'HIGH'
  | 'LOW'
  | 'NORMAL'
  | 'URGENT';

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
  checkEmail: Scalars['Boolean']['output'];
  checkUsername: Scalars['Boolean']['output'];
  event: Maybe<EventPayload>;
  eventAddressById: Maybe<EventAddress>;
  eventChildren: Array<EventPayload>;
  eventGuests: Array<Scalars['String']['output']>;
  eventInvitation: Array<InvitationPayload>;
  eventRsvp: Maybe<EventPayload>;
  eventTables: Array<TablePayload>;
  eventTree: EventTreePayload;
  geocodeAddress: Maybe<GeocodeResultPayload>;
  getAllCountries: Array<Country>;
  getAllInterestCategories: Array<InterestCategoryPayload>;
  getAllInterests: Array<InterestPayload>;
  /** Fetch all tickets */
  getAllTickets: Array<TicketPayload>;
  getById: KcUser;
  getByUsername: KcUser;
  getChats: Array<Chat>;
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
  getQr: Maybe<Scalars['String']['output']>;
  getSeatByGuestAndEvent: SeatPayload;
  getSeatList: Array<SeatPayload>;
  getSecurityQuestions: Array<SecurityQuestionPayload>;
  getStateByName: Maybe<State>;
  getStatesByCountry: Array<State>;
  getStreetByName: Maybe<Street>;
  getUserAddressesByUserId: Array<UserAddressPayload>;
  getUserList: Array<UserPayload>;
  getWhatsappChats: Array<Chat>;
  getWhatsappMessages: Array<Message>;
  getWhatsappState: Scalars['String']['output'];
  invitation: InvitationPayload;
  invitations: Array<InvitationPayload>;
  kc_users: Array<KcUser>;
  latestLayoutVersion: Maybe<LayoutVersionPayload>;
  layoutChangeLog: Array<LayoutChangeLogPayload>;
  layoutVersions: Array<LayoutVersionPayload>;
  listWebAuthnDevices: Array<WebAuthnDevicePayload>;
  me: UserPayload;
  meAuth: KcUser;
  meByToken: KcUser;
  mediaUrl: Scalars['String']['output'];
  mediaVariantUrl: Scalars['String']['output'];
  myEvents: Array<EventPayload>;
  myInvitations: Array<InvitationPayload>;
  myNotifications: Array<NotificationPayload>;
  notification: NotificationPayload;
  notifications: Array<NotificationPayload>;
  pnpm: UserPayload;
  publicEventTree: EventTreePayload;
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
  table: Array<TablePayload>;
  tablesBySection: Array<TablePayload>;
  templates: Array<TemplatePayload>;
  test: Maybe<Scalars['String']['output']>;
  /** Fetch a single ticket by its cuid */
  ticketById: TicketPayload;
  /** Find the ticket created for a specific invitationId */
  ticketByInvitation: TicketPayload;
  /** Fetch all tickets belonging to a specific event */
  ticketsByEvent: Array<TicketPayload>;
  /** Find tickets linked to a specific guestProfileId */
  ticketsByGuest: Array<TicketPayload>;
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


export type QueryCheckEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryCheckUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
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


export type QueryEventRsvpArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventTablesArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QueryEventTreeArgs = {
  eventId: Scalars['ID']['input'];
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


export type QueryGetUserAddressesByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserListArgs = {
  userIds: Array<Scalars['ID']['input']>;
};


export type QueryGetWhatsappMessagesArgs = {
  chatId: Scalars['String']['input'];
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


export type QueryMediaUrlArgs = {
  mediaId: Scalars['String']['input'];
};


export type QueryMediaVariantUrlArgs = {
  format: Scalars['String']['input'];
  mediaId: Scalars['String']['input'];
  width: Scalars['Float']['input'];
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

/** RSVP input for an invitation. A YES response may include optional contact information. */
export type RsvpInput = {
  /** The RSVP response: YES, NO, or MAYBE. */
  choice: RsvpChoice;
  /** ID of the invitation for which the guest is submitting an RSVP. */
  invitationId: Scalars['ID']['input'];
  /** Additional contact info provided when the guest RSVPs YES. Ignored when choice !== YES. */
  replyInput: InputMaybe<AcceptRsvpInput>;
};

export type RealmRoleType =
  | 'ADMIN'
  | 'BASIC'
  | 'ELITE'
  | 'GUEST'
  | 'SUPREME'
  | 'USER';

export type RelationshipType =
  | 'BUSINESS_PARTNER'
  | 'CHILD'
  | 'COLLEAGUE'
  | 'COUSIN'
  | 'FAMILY'
  | 'FRIEND'
  | 'OTHER'
  | 'PARENT'
  | 'PARTNER'
  | 'RELATIVE'
  | 'SIBLING';

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

export type ResetVerificationPayload = {
  __typename: 'ResetVerificationPayload';
  mfaMethod: MfaPreference;
  mfaRequired: Scalars['Boolean']['output'];
};

export type RevokeTicketInput = {
  reason: InputMaybe<Scalars['String']['input']>;
  ticketId: Scalars['ID']['input'];
};

export type RsvpChoice =
  | 'MAYBE'
  | 'NO'
  | 'YES';

export type SaveLayoutVersionInput = {
  data: Scalars['JSON']['input'];
  eventId: Scalars['ID']['input'];
  label: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
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
export type ScanVerdict =
  | 'BLOCKED'
  | 'DEVICE_MISMATCH'
  | 'EXPIRED_EVENT'
  | 'INVALID_NONCE'
  | 'OK'
  | 'REPLAY'
  | 'REVOKED'
  | 'UNKNOWN';

export type SeatAssignmentAction =
  | 'ASSIGNED'
  | 'MOVED'
  | 'UNASSIGNED';

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

export type SeatConfigInput = {
  count: Scalars['Int']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  shape: Scalars['String']['input'];
};

export type SeatPayload = {
  __typename: 'SeatPayload';
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

export type SeatShape =
  | 'CIRCLE'
  | 'RECTANGLE'
  | 'SQUARE';

export type SeatType =
  | 'CHILD'
  | 'RESERVED'
  | 'STAFF'
  | 'STANDARD'
  | 'STANDING'
  | 'VIP';

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

export type SectionShape =
  | 'CIRCLE'
  | 'POLYGON'
  | 'RECTANGLE';

export type SecurityQuestionAnswerInput = {
  answer: Scalars['String']['input'];
  questionId: Scalars['String']['input'];
};

/** Specifies the type/category of a phone number. */
export type SecurityQuestionEnum =
  | 'BIRTH_CITY'
  | 'BIRTH_DATE'
  | 'CHILDHOOD_BEST_FRIEND'
  | 'FAVORITE_SCHOOL_SUBJECT'
  | 'FAVOURITE_COMPANY'
  | 'FIRST_PET'
  | 'MOTHER_MAIDEN_NAME';

export type SecurityQuestionPayload = {
  __typename: 'SecurityQuestionPayload';
  id: Scalars['ID']['output'];
  key: SecurityQuestionEnum;
  question: Scalars['String']['output'];
};

export type SendEmail = {
  body: Scalars['String']['input'];
  email: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type SendInAppMessageInput = {
  important: InputMaybe<Scalars['Boolean']['input']>;
  message: Scalars['String']['input'];
  secret: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['String']['input'];
  viewOnce: InputMaybe<Scalars['Boolean']['input']>;
};

export type SendInvitationsInput = {
  guests: Array<InvitationGuestInput>;
  hostName: InputMaybe<Scalars['String']['input']>;
};

export type SendWhatsappMessageInput = {
  message: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type SendWhatsappMessageInput2 = {
  chatId: Scalars['String']['input'];
  message: Scalars['String']['input'];
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
  startsAt: Scalars['DateTime']['output'];
  ticketReleaseAt: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
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

export type StatusType =
  | 'ACTIVE'
  | 'BLOCKED'
  | 'CLOSED'
  | 'INACTIVE'
  | 'PENDING'
  | 'SUSPENDED';

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

/** Generic success response payload used across mutations. Includes a boolean status flag and an optional human-readable message. */
export type SuccessPayload = {
  __typename: 'SuccessPayload';
  /** Optional human-readable message providing additional context about the operation result. */
  message: Maybe<Scalars['String']['output']>;
  /** Indicates whether the operation was successful. */
  ok: Scalars['Boolean']['output'];
};

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

export type TableShape =
  | 'OVAL'
  | 'RECTANGLE'
  | 'ROUND'
  | 'ROW';

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
  invitedByOptions: InputMaybe<Array<Scalars['String']['input']>>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  isPublic: InputMaybe<Scalars['Boolean']['input']>;
  maxPlusOnes: InputMaybe<Scalars['Int']['input']>;
  maxSeats: InputMaybe<Scalars['Int']['input']>;
  publicRsvpWebsite: InputMaybe<Scalars['String']['input']>;
  requireApprovalForPlusOnes: InputMaybe<Scalars['Boolean']['input']>;
  rotateSeconds: InputMaybe<Scalars['Int']['input']>;
  rsvpDeadline: InputMaybe<Scalars['DateTime']['input']>;
  startsAt: InputMaybe<Scalars['DateTime']['input']>;
  ticketReleaseAt: InputMaybe<Scalars['DateTime']['input']>;
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
export type UserRoleType =
  | 'ADMIN'
  | 'GUEST'
  | 'SECURITY';

export type UserType =
  | 'CUSTOMER'
  | 'EMPLOYEE'
  | 'GUEST';

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
