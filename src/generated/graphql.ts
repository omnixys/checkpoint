import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

/** Optional contact information submitted when a guest RSVPs YES. This data is stored in the invitation or forwarded to the ephemeral contact store. */
export type AcceptRsvpInput = {
  /** Email address of the guest. Optional. */
  email: InputMaybe<Scalars['String']['input']>;
  /** First name of the guest submitting the RSVP. */
  firstName: InputMaybe<Scalars['String']['input']>;
  /** Last name of the guest submitting the RSVP. */
  lastName: InputMaybe<Scalars['String']['input']>;
  /** Optional list of phone numbers for contact. */
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  /** Optional list of additional guests (plus-ones) */
  plusOnes: InputMaybe<Array<PublicPlusOneInput>>;
};

export type ActivateDeviceInput = {
  deviceId: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
  ticketId: Scalars['String']['input'];
};

export type AddContactInput = {
  Contact: Scalars['String']['input'];
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
  /** Seat to assign when approving the invitation. */
  eventName: Scalars['String']['input'];
  /** ID of the invitation to approve/unapprove (cuid). */
  invitationId: Scalars['ID']['input'];
  /** Eventname of the invitation. */
  seat: Scalars['String']['input'];
  /** Eventname of the invitation. */
  seatId: InputMaybe<Scalars['ID']['input']>;
};

/** Input used by admins to approve or unapprove an invitation. All other fields are system-managed. */
export type ApproveInvitationInput = {
  /** Admin approval flag (true = approved, false = unapproved). Requires admin permissions. */
  approved: Scalars['Boolean']['input'];
  /** Seat to assign when approving the invitation. */
  eventName: Scalars['String']['input'];
  /** ID of the invitation to approve/unapprove (cuid). */
  invitationId: Scalars['ID']['input'];
  /** Eventname of the invitation. */
  seat: Scalars['String']['input'];
  /** Eventname of the invitation. */
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
  withdrawalLimit: InputMaybe<Scalars['Float']['input']>;
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
};

export type CreateMediaDto = {
  eventId: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  key: Scalars['String']['input'];
  mimetype: Scalars['String']['input'];
  size: Scalars['Float']['input'];
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
  allowPublicPlusOne: Scalars['Boolean']['input'];
  allowPublicRsvp: Scalars['Boolean']['input'];
  allowPublicRsvpWebsite: Scalars['Boolean']['input'];
  allowReEntry: Scalars['Boolean']['input'];
  category: EventCategory;
  coverImageUrl: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  dressCode: InputMaybe<Scalars['String']['input']>;
  endsAt: InputMaybe<Scalars['DateTime']['input']>;
  isActive: Scalars['Boolean']['input'];
  isPublic: Scalars['Boolean']['input'];
  logoUrl: InputMaybe<Scalars['String']['input']>;
  maxSeats: Scalars['Int']['input'];
  publicRsvpWebsite: InputMaybe<Scalars['String']['input']>;
  rotateSeconds: Scalars['Int']['input'];
  startsAt: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateTableInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  eventId: Scalars['ID']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  order: InputMaybe<Scalars['Int']['input']>;
  sectionId: Scalars['String']['input'];
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
  addresses: Array<UserAddressInput>;
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
  city: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
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
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  myRole: Maybe<UserRoleType>;
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  parentId: Maybe<Scalars['String']['output']>;
  path: Maybe<Scalars['String']['output']>;
  settings: SettingsPayload;
  timeline: Array<EventTimelinePayload>;
  updatedAt: Scalars['DateTime']['output'];
  userRoles: Array<UserRolePayload>;
};

export type EventTimelinePayload = {
  __typename: 'EventTimelinePayload';
  eventId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
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
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  eventId: Scalars['ID']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  guestProfileId: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  invitedByInvitationId: Maybe<Scalars['ID']['output']>;
  invitedByUserId: Maybe<Scalars['ID']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
  maxInvitees: Scalars['Int']['output'];
  /** Pointer to PII record inside Ephemeral Redis Store. */
  pendingContactId: Maybe<Scalars['String']['output']>;
  phoneNumber: Maybe<Scalars['String']['output']>;
  phoneNumbers: Array<PhoneNumberPayload>;
  plusOnes: Array<InvitationPayload>;
  rsvpAt: Maybe<Scalars['DateTime']['output']>;
  rsvpChoice: Maybe<RsvpChoice>;
  status: InvitationStatus;
  type: InvitationType;
  updatedAt: Scalars['DateTime']['output'];
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
  assignRealmRole: Scalars['Boolean']['output'];
  assignSeat: SeatPayload;
  assignUserToEvent: Scalars['Boolean']['output'];
  autoGenerateLayout: Scalars['Boolean']['output'];
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
  updatedAt: Scalars['DateTime']['output'];
};

export type PhoneNumberType =
  | 'HOME'
  | 'MOBILE'
  | 'OTHER'
  | 'PRIVATE'
  | 'WHATSAPP'
  | 'WORK';

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
};

export type PublicRsvpInput = {
  email: InputMaybe<Scalars['String']['input']>;
  /** Public event identifier (eventId or slug) */
  eventId: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  /** Optional RSVP message from guest */
  message: InputMaybe<Scalars['String']['input']>;
  phoneNumbers: InputMaybe<Array<PhoneNumberInput>>;
  /** Optional list of additional guests (plus-ones) */
  plusOnes: InputMaybe<Array<PublicPlusOneInput>>;
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
  eventTree: Array<EventPayload>;
  getAllCountries: Array<Country>;
  getAllInterestCategories: Array<InterestCategoryPayload>;
  getAllInterests: Array<InterestPayload>;
  /** Fetch a single ticket by its cuid */
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
  /** Load all security scan logs of a ticket */
  scanLogsByTicket: Array<ScanLogPayload>;
  seat: Maybe<SeatPayload>;
  seatAssignmentLogs: Array<SeatAssignmentLogPayload>;
  seatLayout: Array<SectionPayload>;
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
  user: UserPayload;
  userAddressById: Maybe<UserAddress>;
  userAddresses: Array<UserAddress>;
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


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAddressByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAddressesArgs = {
  filter: InputMaybe<UserAddressFilter>;
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
  updatedAt: Scalars['DateTime']['output'];
  width: Maybe<Scalars['Float']['output']>;
  x: Maybe<Scalars['Float']['output']>;
  y: Maybe<Scalars['Float']['output']>;
  zIndex: Maybe<Scalars['Int']['output']>;
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
  updatedAt: Scalars['DateTime']['output'];
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
  allowReEntry: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  dressCode: Maybe<Scalars['String']['output']>;
  endsAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  maxSeats: Scalars['Float']['output'];
  rotateSeconds: Scalars['Float']['output'];
  startsAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
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
  id: Scalars['ID']['output'];
  meta: Scalars['JSON']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Float']['output'];
  rotation: Maybe<Scalars['Float']['output']>;
  seats: Array<SeatPayload>;
  section: SectionPayload;
  sectionId: Scalars['String']['output'];
  shape: TableShape;
  updatedAt: Scalars['DateTime']['output'];
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
  currentState: Scalars['String']['output'];
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
  updatedAt: Scalars['DateTime']['output'];
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
  id: Scalars['ID']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<Scalars['Int']['input']>;
  x: InputMaybe<Scalars['Float']['input']>;
  y: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateSettingsInput = {
  allowReEntry: InputMaybe<Scalars['Boolean']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  dressCode: InputMaybe<Scalars['String']['input']>;
  endsAt: InputMaybe<Scalars['DateTime']['input']>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  maxSeats: InputMaybe<Scalars['Int']['input']>;
  rotateSeconds: InputMaybe<Scalars['Int']['input']>;
  startsAt: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateTableInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  meta: InputMaybe<Scalars['JSON']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  order: InputMaybe<Scalars['Int']['input']>;
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

export type AutocompleteAddressQueryVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type AutocompleteAddressQuery = { __typename: 'Query', addressAutocomplete: Array<{ __typename: 'AddressAutocompletePayload', formatted: string | null, street: string | null, houseNumber: string | null, postalCode: string | null, city: string | null, state: string | null, country: string | null, confidence: number | null, lat: number | null, lon: number | null }> };

export type GetAllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = { __typename: 'Query', getAllCountries: Array<{ __typename: 'Country', id: string, name: string, flagSvg: string | null, flagPng: string | null, iso2: string, callingCode: { __typename: 'CallingCode', id: string, code: string } | null }> };

export type GetAllCallingCodesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCallingCodesQuery = { __typename: 'Query', getAllCountries: Array<{ __typename: 'Country', name: string, flagSvg: string | null, iso2: string, callingCode: { __typename: 'CallingCode', code: string } | null }> };

export type GetCitiesByPostalCodeQueryVariables = Exact<{
  postalCodeId: Scalars['ID']['input'];
}>;


export type GetCitiesByPostalCodeQuery = { __typename: 'Query', getCitiesByPostalCode: { __typename: 'City', id: string, name: string } };

export type GetCitiesByStateQueryVariables = Exact<{
  stateId: Scalars['ID']['input'];
}>;


export type GetCitiesByStateQuery = { __typename: 'Query', getCitiesByState: Array<{ __typename: 'City', id: string, name: string }> | null };

export type GetPostalCodesByCityQueryVariables = Exact<{
  cityId: Scalars['ID']['input'];
}>;


export type GetPostalCodesByCityQuery = { __typename: 'Query', getPostalCodesByCity: Array<{ __typename: 'PostalCode', id: string, code: string }> | null };

export type GetPostalCodesByStateQueryVariables = Exact<{
  stateId: Scalars['ID']['input'];
}>;


export type GetPostalCodesByStateQuery = { __typename: 'Query', getPostalCodesByState: Array<{ __typename: 'PostalCode', id: string, code: string }> | null };

export type GetStatesByCountryQueryVariables = Exact<{
  countryId: Scalars['ID']['input'];
}>;


export type GetStatesByCountryQuery = { __typename: 'Query', getStatesByCountry: Array<{ __typename: 'State', id: string, code: string, name: string }> };

export type GetUserAddressesByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserAddressesByUserIdQuery = { __typename: 'Query', getUserAddressesByUserId: Array<{ __typename: 'UserAddressPayload', id: string, userId: string, country: string | null, state: string | null, city: string | null, postalCode: string | null, street: string | null, houseNumber: string | null, additionalInfo: string | null, addressType: AddressType }> };

export type CreateEventAddressMutationVariables = Exact<{
  input: CreateEventAddressInput;
}>;


export type CreateEventAddressMutation = { __typename: 'Mutation', createEventAddress: { __typename: 'EventAddressPayload', additionalInfo: string | null, city: string | null, country: string | null, eventId: string, houseNumber: string | null, id: string, postalCode: string | null, state: string | null, street: string | null } };

export type DeleteEventAddressByEventIdMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type DeleteEventAddressByEventIdMutation = { __typename: 'Mutation', deleteEventAddressByEventId: boolean };

export type GetEventAddressesByEventIdQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventAddressesByEventIdQuery = { __typename: 'Query', getEventAddressByEventId: { __typename: 'EventAddressPayload', additionalInfo: string | null, city: string | null, country: string | null, houseNumber: string | null, id: string, postalCode: string | null, state: string | null, street: string | null, lat: number | null, lon: number | null } | null };

export type GetGeoLocationInfoQueryVariables = Exact<{
  countryCode: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
}>;


export type GetGeoLocationInfoQuery = { __typename: 'Query', getGeoLocationInfo: { __typename: 'GeoLocationInfo', lat: number | null, lon: number | null, cityId: string, countryId: string, houseNumberId: string, postalCodeId: string, stateId: string, streetId: string, country: string | null, state: string | null, city: string | null, postalCode: string | null, street: string | null, houseNumber: string | null } | null };

export type ValidateAddressQueryVariables = Exact<{
  input: AddressValidationInput;
}>;


export type ValidateAddressQuery = { __typename: 'Query', validateAddress: { __typename: 'AddressValidationPayload', valid: boolean, reason: string, confidence: number | null, formatted: string | null, lon: number | null, lat: number | null } };

export type AuthTokenFragment = { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string };

export type AuthUserFragment = { __typename: 'KcUser', id: string, username: string, firstName: string, lastName: string, email: string, role: RealmRoleType | null };

export type ChangeMyPasswordMutationVariables = Exact<{
  input: ChangeMyPasswordInput;
}>;


export type ChangeMyPasswordMutation = { __typename: 'Mutation', changeMyPassword: { __typename: 'SuccessPayload', ok: boolean, message: string | null } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename: 'Mutation', deleteKcUser: boolean };

export type LoginTotpMutationVariables = Exact<{
  input: LoginTotpInput;
}>;


export type LoginTotpMutation = { __typename: 'Mutation', loginTotp: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } };

export type LoginMutationVariables = Exact<{
  input: LogInInput;
}>;


export type LoginMutation = { __typename: 'Mutation', credentialsLogin: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename: 'Mutation', logout: { __typename: 'SuccessPayload', ok: boolean, message: string | null } };

export type GeneratePasswordlessOptionsMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GeneratePasswordlessOptionsMutation = { __typename: 'Mutation', generatePasswordlessOptions: any };

export type RefreshMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshMutation = { __typename: 'Mutation', refresh: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } };

export type SendMagicLinkMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendMagicLinkMutation = { __typename: 'Mutation', sendMagicLink: boolean };

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput;
}>;


export type UpdateMyProfileMutation = { __typename: 'Mutation', updateMyProfile: { __typename: 'SuccessPayload', ok: boolean, message: string | null } };

export type VerifyGuestSignUpMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyGuestSignUpMutation = { __typename: 'Mutation', verifyGuestSignUp: { __typename: 'GuestSignUpPayload', message: string | null, results: Array<{ __typename: 'SignUpResultsPayload', userId: string, username: string, password: string, email: string }> | null } };

export type VerifyMagicLinkMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyMagicLinkMutation = { __typename: 'Mutation', verifyMagicLink: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } };

export type VerifySignUpMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifySignUpMutation = { __typename: 'Mutation', verifySignUp: { __typename: 'SignUpPayload', message: string | null, username: string | null, userId: string | null, password: string, token: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } | null, user: { __typename: 'KcUser', id: string, username: string, firstName: string, lastName: string, email: string, role: RealmRoleType | null } | null } };

export type GenerateWebAuthnAuthOptionsMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateWebAuthnAuthOptionsMutation = { __typename: 'Mutation', generateWebAuthnAuthOptions: any };

export type VerifyWebAuthnAuthenticationMutationVariables = Exact<{
  response: Scalars['JSON']['input'];
}>;


export type VerifyWebAuthnAuthenticationMutation = { __typename: 'Mutation', verifyWebAuthnAuthentication: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } };

export type VerifyPasswordlessAuthenticationMutationVariables = Exact<{
  response: Scalars['JSON']['input'];
}>;


export type VerifyPasswordlessAuthenticationMutation = { __typename: 'Mutation', verifyPasswordlessAuthentication: { __typename: 'TokenPayload', accessToken: string, expiresIn: string, refreshToken: string, refreshExpiresIn: string, idToken: string, scope: string } };

export type GetSecurityQuestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSecurityQuestionsQuery = { __typename: 'Query', getSecurityQuestions: Array<{ __typename: 'SecurityQuestionPayload', id: string, question: string, key: SecurityQuestionEnum }> };

export type ListWebAuthnDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListWebAuthnDevicesQuery = { __typename: 'Query', listWebAuthnDevices: Array<{ __typename: 'WebAuthnDevicePayload', credentialId: string, nickname: string | null, deviceType: string, backedUp: boolean, createdAt: any, lastUsedAt: any | null, revokedAt: any | null }> };

export type MeAuthQueryVariables = Exact<{ [key: string]: never; }>;


export type MeAuthQuery = { __typename: 'Query', meAuth: { __typename: 'KcUser', id: string, username: string, firstName: string, lastName: string, email: string, role: RealmRoleType | null } };

export type EventBaseFragment = { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null };

export type EventSettingsFragment = { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any };

export type EventTimelineFragment = { __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string };

export type EventUserRoleFragment = { __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType };

export type EventFullFragment = { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> };

export type ActivateEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ActivateEventMutation = { __typename: 'Mutation', activateEvent: boolean };

export type AddTimeLinesMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  input: Array<CreateTimelineInput> | CreateTimelineInput;
}>;


export type AddTimeLinesMutation = { __typename: 'Mutation', addTimeLines: { __typename: 'EventPayload', timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }> } };

export type AssignUserRoleToEventMutationVariables = Exact<{
  input: AssignUserRoleInput;
}>;


export type AssignUserRoleToEventMutation = { __typename: 'Mutation', assignUserToEvent: boolean };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename: 'Mutation', createEvent: { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null } };

export type DeactivateEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeactivateEventMutation = { __typename: 'Mutation', deactivateEvent: boolean };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename: 'Mutation', deleteEvent: boolean };

export type RemoveTimeLinesMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  input: Array<RemoveTimelineInput> | RemoveTimelineInput;
}>;


export type RemoveTimeLinesMutation = { __typename: 'Mutation', removeTimeLines: { __typename: 'EventPayload', timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }> } };

export type RemoveUserFromEventMutationVariables = Exact<{
  input: RemoveUserFromEventInput;
}>;


export type RemoveUserFromEventMutation = { __typename: 'Mutation', removeUserFromEvent: boolean };

export type TransferEventOwnershipMutationVariables = Exact<{
  input: TransferInput;
}>;


export type TransferEventOwnershipMutation = { __typename: 'Mutation', transferEventOwnership: boolean };

export type UpdateEventMutationVariables = Exact<{
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename: 'Mutation', updateEvent: { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> } };

export type UpdateTimeLinesMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  input: Array<UpdateTimelineInput> | UpdateTimelineInput;
}>;


export type UpdateTimeLinesMutation = { __typename: 'Mutation', updateTimeLines: { __typename: 'EventPayload', timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }> } };

export type AdminEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminEventsQuery = { __typename: 'Query', adminEvents: Array<{ __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> }> };

export type AdminGetEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AdminGetEventQuery = { __typename: 'Query', adminGetEvent: { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> } | null };

export type EventChildrenQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventChildrenQuery = { __typename: 'Query', eventChildren: Array<{ __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null }> };

export type EventGuestsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventGuestsQuery = { __typename: 'Query', eventGuests: Array<string> };

export type EventTreeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventTreeQuery = { __typename: 'Query', eventTree: Array<{ __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> }> };

export type GetEventByIdRsvpQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEventByIdRsvpQuery = { __typename: 'Query', eventRsvp: { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null } | null };

export type EventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventQuery = { __typename: 'Query', event: { __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> } | null };

export type MyEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyEventsQuery = { __typename: 'Query', myEvents: Array<{ __typename: 'EventPayload', id: string, name: string, owner: string, parentId: string | null, path: string | null, depth: number, createdAt: any, updatedAt: any, myRole: UserRoleType | null, settings: { __typename: 'SettingsPayload', id: string, allowReEntry: boolean, rotateSeconds: number, maxSeats: number, dressCode: string | null, description: string | null, isActive: boolean, startsAt: any, endsAt: any, createdAt: any, updatedAt: any }, timeline: Array<{ __typename: 'EventTimelinePayload', id: string, eventId: string, type: string, timestamp: any, label: string }>, userRoles: Array<{ __typename: 'UserRolePayload', id: string, eventId: string, userId: string, role: UserRoleType }> }> };

export type InvitationBaseFragment = { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null };

export type InvitationContactFragment = { __typename: 'InvitationPayload', phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> };

export type InvitationPlusOneFragment = { __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> };

export type InvitationFullFragment = { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> };

export type ApproveInvitationMutationVariables = Exact<{
  input: ApproveInvitationInput;
}>;


export type ApproveInvitationMutation = { __typename: 'Mutation', approveInvitation: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type BulkApproveInvitationsMutationVariables = Exact<{
  input: BulkApproveInvitationInput;
}>;


export type BulkApproveInvitationsMutation = { __typename: 'Mutation', bulkApproveInvitations: Array<{ __typename: 'InvitationPayload', id: string, status: InvitationStatus, approvedAt: any | null }> };

export type CreateInvitationFromRsvpMutationVariables = Exact<{
  input: PublicRsvpInput;
}>;


export type CreateInvitationFromRsvpMutation = { __typename: 'Mutation', createInvitationFromRsvp: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type CreateInvitationMutationVariables = Exact<{
  input: InvitationCreateInput;
}>;


export type CreateInvitationMutation = { __typename: 'Mutation', createInvitation: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type CreatePlusOnesInvitationMutationVariables = Exact<{
  input: CreatePlusOneInput;
}>;


export type CreatePlusOnesInvitationMutation = { __typename: 'Mutation', createPlusOnesInvitation: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type ImportInvitationsMutationVariables = Exact<{
  input: ImportInvitationsInput;
}>;


export type ImportInvitationsMutation = { __typename: 'Mutation', importInvitations: { __typename: 'ImportInvitationsResult', total: number, imported: number, skipped: number, duplicates: Array<string>, errors: Array<string> } };

export type RemoveAllPlusOnesByInvitationIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveAllPlusOnesByInvitationIdMutation = { __typename: 'Mutation', removeAllPlusOnesByInvitationId: Array<{ __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> }> };

export type RemoveInvitationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveInvitationMutation = { __typename: 'Mutation', removeInvitation: { __typename: 'SuccessPayload', ok: boolean, message: string | null } };

export type RemovePlusOneInvitationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemovePlusOneInvitationMutation = { __typename: 'Mutation', removePlusOneInvitation: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type ReplyInvitationMutationVariables = Exact<{
  input: RsvpInput;
}>;


export type ReplyInvitationMutation = { __typename: 'Mutation', replyInvitation: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type UpdatePlusOnesInvitationMutationVariables = Exact<{
  input: UpdatePlusOneInput;
}>;


export type UpdatePlusOnesInvitationMutation = { __typename: 'Mutation', updatePlusOnesInvitation: { __typename: 'InvitationPayload', id: string } };

export type EventInvitationQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type EventInvitationQuery = { __typename: 'Query', eventInvitation: Array<{ __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> }> };

export type GetFullEventInvitationQueryVariables = Exact<{
  eventIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetFullEventInvitationQuery = { __typename: 'Query', getFullByEventIds: Array<{ __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> }> };

export type InvitationQueryVariables = Exact<{
  invitationId: Scalars['ID']['input'];
}>;


export type InvitationQuery = { __typename: 'Query', invitation: { __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }>, plusOnes: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> } };

export type InvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitationsQuery = { __typename: 'Query', invitations: Array<{ __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null }> };

export type MyInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyInvitationsQuery = { __typename: 'Query', myInvitations: Array<{ __typename: 'InvitationPayload', id: string, type: InvitationType, firstName: string | null, lastName: string | null, eventId: string, guestProfileId: string | null, email: string | null, status: InvitationStatus, createdAt: any, updatedAt: any, pendingContactId: string | null, phoneNumber: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, maxInvitees: number, invitedByInvitationId: string | null, invitedByUserId: string | null }> };

export type GetPlusOnesByInvitationQueryVariables = Exact<{
  invitationId: Scalars['ID']['input'];
}>;


export type GetPlusOnesByInvitationQuery = { __typename: 'Query', getPlusOnesByInvitation: Array<{ __typename: 'InvitationPayload', id: string, firstName: string | null, lastName: string | null, email: string | null, status: InvitationStatus, guestProfileId: string | null, pendingContactId: string | null, rsvpChoice: RsvpChoice | null, rsvpAt: any | null, approvedAt: any | null, approvedByUserId: string | null, invitedByInvitationId: string | null, invitedByUserId: string | null, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> }> };

export type SendBulkInvitationsMutationVariables = Exact<{
  input: SendInvitationsInput;
}>;


export type SendBulkInvitationsMutation = { __typename: 'Mutation', sendInvitations: boolean };

export type SeatBasicFragment = { __typename: 'SeatPayload', id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null };

export type SeatLayoutSectionFragment = { __typename: 'SectionPayload', id: string, name: string, x: number, y: number, meta: any, tables: Array<{ __typename: 'TablePayload', id: string, name: string, x: number, y: number, meta: any, sectionId: string, seats: Array<{ __typename: 'SeatPayload', id: string, x: number | null, y: number | null, rotation: number | null, number: number | null, status: string, meta: any | null, sectionId: string, tableId: string | null }> }>, seats: Array<{ __typename: 'SeatPayload', id: string, x: number | null, y: number | null, rotation: number | null, number: number | null, status: string, meta: any | null, sectionId: string, tableId: string | null }> };

export type SeatWithRelationsFragment = { __typename: 'SeatPayload', id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string, eventId: string, order: number, capacity: number | null, shape: SectionShape, x: number, y: number, width: number | null, height: number | null, rotation: number | null, meta: any, createdAt: any, updatedAt: any }, table: { __typename: 'TablePayload', name: string, id: string, eventId: string, sectionId: string, order: number, capacity: number | null, shape: TableShape, x: number, y: number, rotation: number | null, meta: any, createdAt: any, updatedAt: any } | null };

export type SeatFullFragment = { __typename: 'SeatPayload', seatType: SeatType | null, shape: SeatShape, x: number | null, y: number | null, width: number | null, height: number | null, radius: number | null, rotation: number | null, zIndex: number | null, locked: boolean, hidden: boolean, guestId: string | null, invitationId: string | null, meta: any | null, createdAt: any, updatedAt: any, id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null };

export type SectionFullFragment = { __typename: 'SectionPayload', id: string, eventId: string, name: string, order: number, capacity: number | null, shape: SectionShape, x: number, y: number, width: number | null, height: number | null, rotation: number | null, meta: any, createdAt: any, updatedAt: any };

export type TableFullFragment = { __typename: 'TablePayload', id: string, eventId: string, sectionId: string, name: string, order: number, capacity: number | null, shape: TableShape, x: number, y: number, rotation: number | null, meta: any, createdAt: any, updatedAt: any };

export type AssignSeatMutationVariables = Exact<{
  input: AssignSeatInput;
}>;


export type AssignSeatMutation = { __typename: 'Mutation', assignSeat: { __typename: 'SeatPayload', seatType: SeatType | null, shape: SeatShape, x: number | null, y: number | null, width: number | null, height: number | null, radius: number | null, rotation: number | null, zIndex: number | null, locked: boolean, hidden: boolean, guestId: string | null, invitationId: string | null, meta: any | null, createdAt: any, updatedAt: any, id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null } };

export type BulkRenameSectionsMutationVariables = Exact<{
  input: Array<RenameSectionInput> | RenameSectionInput;
}>;


export type BulkRenameSectionsMutation = { __typename: 'Mutation', bulkRenameSections: { __typename: 'BulkRenamePayload', success: boolean, affectedSeats: number, affectedSections: number | null, affectedTables: number | null, conflicts: Array<{ __typename: 'RenameConflict', type: string, id: string, name: string }> } };

export type BulkRenameTablesMutationVariables = Exact<{
  input: Array<RenameTableInput> | RenameTableInput;
}>;


export type BulkRenameTablesMutation = { __typename: 'Mutation', bulkRenameTables: { __typename: 'BulkRenamePayload', success: boolean, affectedTables: number | null, affectedSeats: number, conflicts: Array<{ __typename: 'RenameConflict', type: string, id: string, name: string }> } };

export type RenameSectionMutationVariables = Exact<{
  input: RenameSectionInput;
}>;


export type RenameSectionMutation = { __typename: 'Mutation', renameSection: { __typename: 'RenamePayload', success: boolean, affectedSeats: number } };

export type RenameTableMutationVariables = Exact<{
  input: RenameTableInput;
}>;


export type RenameTableMutation = { __typename: 'Mutation', renameTable: { __typename: 'RenamePayload', success: boolean, affectedSeats: number } };

export type GetSeatByGuestAndEventQueryVariables = Exact<{
  input: GuestEventSeatInput;
}>;


export type GetSeatByGuestAndEventQuery = { __typename: 'Query', getSeatByGuestAndEvent: { __typename: 'SeatPayload', id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null } };

export type SeatLayoutQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SeatLayoutQuery = { __typename: 'Query', seatLayout: Array<{ __typename: 'SectionPayload', id: string, name: string, x: number, y: number, meta: any, tables: Array<{ __typename: 'TablePayload', id: string, name: string, x: number, y: number, meta: any, sectionId: string, seats: Array<{ __typename: 'SeatPayload', id: string, x: number | null, y: number | null, rotation: number | null, number: number | null, status: string, meta: any | null, sectionId: string, tableId: string | null }> }>, seats: Array<{ __typename: 'SeatPayload', id: string, x: number | null, y: number | null, rotation: number | null, number: number | null, status: string, meta: any | null, sectionId: string, tableId: string | null }> }> };

export type GetSeatListQueryVariables = Exact<{
  seatIdList: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetSeatListQuery = { __typename: 'Query', getSeatList: Array<{ __typename: 'SeatPayload', id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null }> };

export type SeatQueryVariables = Exact<{
  seatId: Scalars['ID']['input'];
}>;


export type SeatQuery = { __typename: 'Query', seat: { __typename: 'SeatPayload', seatType: SeatType | null, shape: SeatShape, x: number | null, y: number | null, width: number | null, height: number | null, radius: number | null, rotation: number | null, zIndex: number | null, locked: boolean, hidden: boolean, guestId: string | null, invitationId: string | null, meta: any | null, createdAt: any, updatedAt: any, id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null } | null };

export type SeatsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SeatsQuery = { __typename: 'Query', seats: Array<{ __typename: 'SeatPayload', seatType: SeatType | null, shape: SeatShape, x: number | null, y: number | null, width: number | null, height: number | null, radius: number | null, rotation: number | null, zIndex: number | null, locked: boolean, hidden: boolean, guestId: string | null, invitationId: string | null, meta: any | null, createdAt: any, updatedAt: any, id: string, status: string, eventId: string, number: number | null, label: string | null, note: string | null, section: { __typename: 'SectionPayload', name: string, id: string }, table: { __typename: 'TablePayload', name: string, id: string } | null }> };

export type ScanLogFragment = { __typename: 'ScanLogPayload', id: string, ticketId: string, eventId: string, actorId: string, direction: PresenceState, gate: string | null, verdict: ScanVerdict, nonce: number | null, deviceId: string | null, createdAt: any };

export type ScanResultFragment = { __typename: 'ScanPayload', verdict: ScanVerdict, message: string, ticket: { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null }, log: { __typename: 'ScanLogPayload', id: string, ticketId: string, eventId: string, actorId: string, direction: PresenceState, gate: string | null, verdict: ScanVerdict, nonce: number | null, deviceId: string | null, createdAt: any } };

export type TicketBasicFragment = { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any };

export type TicketSecurityFragment = { __typename: 'TicketPayload', deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revoked: boolean, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null };

export type TicketFullFragment = { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null };

export type ActivateDeviceMutationVariables = Exact<{
  input: ActivateDeviceInput;
}>;


export type ActivateDeviceMutation = { __typename: 'Mutation', activateDevice: { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null } };

export type GenerateTokenMutationVariables = Exact<{
  ticketId: Scalars['ID']['input'];
}>;


export type GenerateTokenMutation = { __typename: 'Mutation', generateToken: string };

export type RevokeTicketMutationVariables = Exact<{
  input: RevokeTicketInput;
}>;


export type RevokeTicketMutation = { __typename: 'Mutation', revokeTicket: { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null } };

export type ScanTokenMutationVariables = Exact<{
  input: ScanInput;
}>;


export type ScanTokenMutation = { __typename: 'Mutation', scanToken: { __typename: 'ScanPayload', verdict: ScanVerdict, message: string, ticket: { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null }, log: { __typename: 'ScanLogPayload', id: string, ticketId: string, eventId: string, actorId: string, direction: PresenceState, gate: string | null, verdict: ScanVerdict, nonce: number | null, deviceId: string | null, createdAt: any } } };

export type GetMyTicketsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyTicketsQuery = { __typename: 'Query', getMyTickets: Array<{ __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null }> };

export type TicketByIdQueryVariables = Exact<{
  ticketId: Scalars['ID']['input'];
}>;


export type TicketByIdQuery = { __typename: 'Query', ticketById: { __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any, deviceId: string | null, devicePublicKey: string | null, deviceActivationAt: any | null, deviceActivationIP: string | null, lastNonce: number | null, nextNonce: number | null, checkedInAt: any | null, revokedAt: any | null, revokedBy: string | null, revokedReason: string | null } };

export type TicketsByEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type TicketsByEventQuery = { __typename: 'Query', ticketsByEvent: Array<{ __typename: 'TicketPayload', id: string, eventId: string, invitationId: string, seatId: string, guestProfileId: string, currentState: string, revoked: boolean, createdAt: any, updatedAt: any }> };

export type ContactFragment = { __typename: 'ContactPayload', id: string, userId: string, contactId: string, relationship: RelationshipType, withdrawalLimit: number, emergency: boolean, startDate: any | null, endDate: any | null, createdAt: any, updatedAt: any };

export type InterestFragment = { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any };

export type CustomerInterestFragment = { __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null };

export type CustomerFragment = { __typename: 'CustomerPayload', id: string, subscribed: boolean, state: StatusType, contactOptions: Array<ContactOptionsType>, createdAt: any, updatedAt: any, customerInterest: Array<{ __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null }> | null };

export type EmployeeFragment = { __typename: 'EmployeePayload', id: string, department: string | null, position: string | null, role: string | null, salary: number | null, hireDate: any | null, isExternal: boolean, createdAt: any, updatedAt: any };

export type PersonalInfoFragment = { __typename: 'PersonalInfoPayload', id: string, email: string, firstName: string, lastName: string, birthDate: any | null, gender: GenderType | null, maritalStatus: MaritalStatusType | null, createdAt: any, updatedAt: any };

export type PhoneNumberFragment = { __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any };

export type UserFullFragment = { __typename: 'UserPayload', id: string, username: string, userType: UserType, status: PersonStatusType, createdAt: any, updatedAt: any, role: RealmRoleType | null, personalInfo: { __typename: 'PersonalInfoPayload', id: string, email: string, firstName: string, lastName: string, birthDate: any | null, gender: GenderType | null, maritalStatus: MaritalStatusType | null, createdAt: any, updatedAt: any, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> | null } | null, contacts: Array<{ __typename: 'ContactPayload', id: string, userId: string, contactId: string, relationship: RelationshipType, withdrawalLimit: number, emergency: boolean, startDate: any | null, endDate: any | null, createdAt: any, updatedAt: any }> | null, customer: { __typename: 'CustomerPayload', id: string, subscribed: boolean, state: StatusType, contactOptions: Array<ContactOptionsType>, createdAt: any, updatedAt: any, customerInterest: Array<{ __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null }> | null } | null, employee: { __typename: 'EmployeePayload', id: string, department: string | null, position: string | null, role: string | null, salary: number | null, hireDate: any | null, isExternal: boolean, createdAt: any, updatedAt: any } | null };

export type UserBaseFragment = { __typename: 'UserPayload', id: string, username: string, userType: UserType, status: PersonStatusType, createdAt: any, updatedAt: any, role: RealmRoleType | null };

export type CheckEmailQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type CheckEmailQuery = { __typename: 'Query', checkEmail: boolean };

export type CheckUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type CheckUsernameQuery = { __typename: 'Query', checkUsername: boolean };

export type GetUserListQueryVariables = Exact<{
  guesIdList: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetUserListQuery = { __typename: 'Query', getUserList: Array<{ __typename: 'UserPayload', id: string, username: string, userType: UserType, status: PersonStatusType, createdAt: any, updatedAt: any, role: RealmRoleType | null, personalInfo: { __typename: 'PersonalInfoPayload', id: string, email: string, firstName: string, lastName: string, birthDate: any | null, gender: GenderType | null, maritalStatus: MaritalStatusType | null, createdAt: any, updatedAt: any, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> | null } | null, contacts: Array<{ __typename: 'ContactPayload', id: string, userId: string, contactId: string, relationship: RelationshipType, withdrawalLimit: number, emergency: boolean, startDate: any | null, endDate: any | null, createdAt: any, updatedAt: any }> | null, customer: { __typename: 'CustomerPayload', id: string, subscribed: boolean, state: StatusType, contactOptions: Array<ContactOptionsType>, createdAt: any, updatedAt: any, customerInterest: Array<{ __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null }> | null } | null, employee: { __typename: 'EmployeePayload', id: string, department: string | null, position: string | null, role: string | null, salary: number | null, hireDate: any | null, isExternal: boolean, createdAt: any, updatedAt: any } | null }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me: { __typename: 'UserPayload', id: string, username: string, userType: UserType, status: PersonStatusType, createdAt: any, updatedAt: any, role: RealmRoleType | null, personalInfo: { __typename: 'PersonalInfoPayload', id: string, email: string, firstName: string, lastName: string, birthDate: any | null, gender: GenderType | null, maritalStatus: MaritalStatusType | null, createdAt: any, updatedAt: any, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> | null } | null, contacts: Array<{ __typename: 'ContactPayload', id: string, userId: string, contactId: string, relationship: RelationshipType, withdrawalLimit: number, emergency: boolean, startDate: any | null, endDate: any | null, createdAt: any, updatedAt: any }> | null, customer: { __typename: 'CustomerPayload', id: string, subscribed: boolean, state: StatusType, contactOptions: Array<ContactOptionsType>, createdAt: any, updatedAt: any, customerInterest: Array<{ __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null }> | null } | null, employee: { __typename: 'EmployeePayload', id: string, department: string | null, position: string | null, role: string | null, salary: number | null, hireDate: any | null, isExternal: boolean, createdAt: any, updatedAt: any } | null } };

export type UserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserQuery = { __typename: 'Query', user: { __typename: 'UserPayload', id: string, username: string, userType: UserType, status: PersonStatusType, createdAt: any, updatedAt: any, role: RealmRoleType | null, personalInfo: { __typename: 'PersonalInfoPayload', id: string, email: string, firstName: string, lastName: string, birthDate: any | null, gender: GenderType | null, maritalStatus: MaritalStatusType | null, createdAt: any, updatedAt: any, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> | null } | null, contacts: Array<{ __typename: 'ContactPayload', id: string, userId: string, contactId: string, relationship: RelationshipType, withdrawalLimit: number, emergency: boolean, startDate: any | null, endDate: any | null, createdAt: any, updatedAt: any }> | null, customer: { __typename: 'CustomerPayload', id: string, subscribed: boolean, state: StatusType, contactOptions: Array<ContactOptionsType>, createdAt: any, updatedAt: any, customerInterest: Array<{ __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null }> | null } | null, employee: { __typename: 'EmployeePayload', id: string, department: string | null, position: string | null, role: string | null, salary: number | null, hireDate: any | null, isExternal: boolean, createdAt: any, updatedAt: any } | null } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename: 'Query', users: Array<{ __typename: 'UserPayload', id: string, username: string, userType: UserType, status: PersonStatusType, createdAt: any, updatedAt: any, role: RealmRoleType | null, personalInfo: { __typename: 'PersonalInfoPayload', id: string, email: string, firstName: string, lastName: string, birthDate: any | null, gender: GenderType | null, maritalStatus: MaritalStatusType | null, createdAt: any, updatedAt: any, phoneNumbers: Array<{ __typename: 'PhoneNumberPayload', id: string, number: string, type: PhoneNumberType, label: string | null, infoId: string, isPrimary: boolean | null, countryCode: string, createdAt: any, updatedAt: any }> | null } | null, contacts: Array<{ __typename: 'ContactPayload', id: string, userId: string, contactId: string, relationship: RelationshipType, withdrawalLimit: number, emergency: boolean, startDate: any | null, endDate: any | null, createdAt: any, updatedAt: any }> | null, customer: { __typename: 'CustomerPayload', id: string, subscribed: boolean, state: StatusType, contactOptions: Array<ContactOptionsType>, createdAt: any, updatedAt: any, customerInterest: Array<{ __typename: 'CustomerInterestPayload', id: string, customerId: string, interestId: string, level: number | null, isPrimary: boolean | null, createdAt: any, interest: { __typename: 'InterestPayload', id: string, key: InterestType, name: string, categoryId: string, icon: string | null, createdAt: any, updatedAt: any } | null }> | null } | null, employee: { __typename: 'EmployeePayload', id: string, department: string | null, position: string | null, role: string | null, salary: number | null, hireDate: any | null, isExternal: boolean, createdAt: any, updatedAt: any } | null }> };

export const AuthTokenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<AuthTokenFragment, unknown>;
export const AuthUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"KcUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<AuthUserFragment, unknown>;
export const EventBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}}]} as unknown as DocumentNode<EventBaseFragment, unknown>;
export const EventSettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<EventSettingsFragment, unknown>;
export const EventTimelineFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]} as unknown as DocumentNode<EventTimelineFragment, unknown>;
export const EventUserRoleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<EventUserRoleFragment, unknown>;
export const EventFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<EventFullFragment, unknown>;
export const InvitationBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}}]} as unknown as DocumentNode<InvitationBaseFragment, unknown>;
export const PhoneNumberFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PhoneNumberFragment, unknown>;
export const InvitationContactFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<InvitationContactFragment, unknown>;
export const InvitationPlusOneFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<InvitationPlusOneFragment, unknown>;
export const InvitationFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}}]} as unknown as DocumentNode<InvitationFullFragment, unknown>;
export const SeatLayoutSectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatLayoutSection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SectionPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"seats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"seats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}}]}}]}}]} as unknown as DocumentNode<SeatLayoutSectionFragment, unknown>;
export const SeatBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SeatBasicFragment, unknown>;
export const SectionFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SectionFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SectionPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SectionFullFragment, unknown>;
export const TableFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TableFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TablePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<TableFullFragment, unknown>;
export const SeatWithRelationsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatWithRelations"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SectionFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TableFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SectionFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SectionPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TableFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TablePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SeatWithRelationsFragment, unknown>;
export const SeatFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}},{"kind":"Field","name":{"kind":"Name","value":"seatType"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"guestId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SeatFullFragment, unknown>;
export const TicketBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<TicketBasicFragment, unknown>;
export const TicketSecurityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}}]} as unknown as DocumentNode<TicketSecurityFragment, unknown>;
export const TicketFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}}]} as unknown as DocumentNode<TicketFullFragment, unknown>;
export const ScanLogFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScanLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScanLogPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ticketId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"gate"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ScanLogFragment, unknown>;
export const ScanResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScanResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScanPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"log"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScanLog"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScanLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScanLogPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ticketId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"gate"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ScanResultFragment, unknown>;
export const UserBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<UserBaseFragment, unknown>;
export const PersonalInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalInfoPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PersonalInfoFragment, unknown>;
export const ContactFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContactPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalLimit"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ContactFragment, unknown>;
export const InterestFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<InterestFragment, unknown>;
export const CustomerInterestFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CustomerInterestFragment, unknown>;
export const CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contactOptions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerInterest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerInterest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}}]} as unknown as DocumentNode<CustomerFragment, unknown>;
export const EmployeeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Employee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<EmployeeFragment, unknown>;
export const UserFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBase"}},{"kind":"Field","name":{"kind":"Name","value":"personalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Contact"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Employee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalInfoPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContactPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalLimit"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contactOptions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerInterest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerInterest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Employee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UserFullFragment, unknown>;
export const AutocompleteAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutocompleteAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressAutocomplete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formatted"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]} as unknown as DocumentNode<AutocompleteAddressQuery, AutocompleteAddressQueryVariables>;
export const GetAllCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"flagSvg"}},{"kind":"Field","name":{"kind":"Name","value":"flagPng"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"callingCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCountriesQuery, GetAllCountriesQueryVariables>;
export const GetAllCallingCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCallingCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"flagSvg"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"callingCode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCallingCodesQuery, GetAllCallingCodesQueryVariables>;
export const GetCitiesByPostalCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCitiesByPostalCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postalCodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCitiesByPostalCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postalCodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postalCodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCitiesByPostalCodeQuery, GetCitiesByPostalCodeQueryVariables>;
export const GetCitiesByStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCitiesByState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCitiesByState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCitiesByStateQuery, GetCitiesByStateQueryVariables>;
export const GetPostalCodesByCityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostalCodesByCity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostalCodesByCity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<GetPostalCodesByCityQuery, GetPostalCodesByCityQueryVariables>;
export const GetPostalCodesByStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostalCodesByState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostalCodesByState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<GetPostalCodesByStateQuery, GetPostalCodesByStateQueryVariables>;
export const GetStatesByCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatesByCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStatesByCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"countryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetStatesByCountryQuery, GetStatesByCountryQueryVariables>;
export const GetUserAddressesByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserAddressesByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserAddressesByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"additionalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"addressType"}}]}}]}}]} as unknown as DocumentNode<GetUserAddressesByUserIdQuery, GetUserAddressesByUserIdQueryVariables>;
export const CreateEventAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEventAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEventAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"additionalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"street"}}]}}]}}]} as unknown as DocumentNode<CreateEventAddressMutation, CreateEventAddressMutationVariables>;
export const DeleteEventAddressByEventIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEventAddressByEventId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEventAddressByEventId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}]}]}}]} as unknown as DocumentNode<DeleteEventAddressByEventIdMutation, DeleteEventAddressByEventIdMutationVariables>;
export const GetEventAddressesByEventIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventAddressesByEventId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventAddressByEventId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"additionalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]} as unknown as DocumentNode<GetEventAddressesByEventIdQuery, GetEventAddressesByEventIdQueryVariables>;
export const GetGeoLocationInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGeoLocationInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGeoLocationInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"countryCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}},{"kind":"Field","name":{"kind":"Name","value":"cityId"}},{"kind":"Field","name":{"kind":"Name","value":"countryId"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumberId"}},{"kind":"Field","name":{"kind":"Name","value":"postalCodeId"}},{"kind":"Field","name":{"kind":"Name","value":"stateId"}},{"kind":"Field","name":{"kind":"Name","value":"streetId"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}}]}}]}}]} as unknown as DocumentNode<GetGeoLocationInfoQuery, GetGeoLocationInfoQueryVariables>;
export const ValidateAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressValidationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valid"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"formatted"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}}]}}]}}]} as unknown as DocumentNode<ValidateAddressQuery, ValidateAddressQueryVariables>;
export const ChangeMyPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeMyPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeMyPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeMyPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ChangeMyPasswordMutation, ChangeMyPasswordMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteKcUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const LoginTotpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginTotp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginTotpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginTotp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<LoginTotpMutation, LoginTotpMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credentialsLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const GeneratePasswordlessOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GeneratePasswordlessOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatePasswordlessOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<GeneratePasswordlessOptionsMutation, GeneratePasswordlessOptionsMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const SendMagicLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMagicLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMagicLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendMagicLinkMutation, SendMagicLinkMutationVariables>;
export const UpdateMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMyProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMyProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMyProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const VerifyGuestSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyGuestSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyGuestSignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<VerifyGuestSignUpMutation, VerifyGuestSignUpMutationVariables>;
export const VerifyMagicLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyMagicLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyMagicLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<VerifyMagicLinkMutation, VerifyMagicLinkMutationVariables>;
export const VerifySignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifySignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifySignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"KcUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<VerifySignUpMutation, VerifySignUpMutationVariables>;
export const GenerateWebAuthnAuthOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateWebAuthnAuthOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateWebAuthnAuthOptions"}}]}}]} as unknown as DocumentNode<GenerateWebAuthnAuthOptionsMutation, GenerateWebAuthnAuthOptionsMutationVariables>;
export const VerifyWebAuthnAuthenticationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyWebAuthnAuthentication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"response"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyWebAuthnAuthentication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"response"},"value":{"kind":"Variable","name":{"kind":"Name","value":"response"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<VerifyWebAuthnAuthenticationMutation, VerifyWebAuthnAuthenticationMutationVariables>;
export const VerifyPasswordlessAuthenticationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyPasswordlessAuthentication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"response"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyPasswordlessAuthentication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"response"},"value":{"kind":"Variable","name":{"kind":"Name","value":"response"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthToken"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TokenPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]} as unknown as DocumentNode<VerifyPasswordlessAuthenticationMutation, VerifyPasswordlessAuthenticationMutationVariables>;
export const GetSecurityQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSecurityQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSecurityQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<GetSecurityQuestionsQuery, GetSecurityQuestionsQueryVariables>;
export const ListWebAuthnDevicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWebAuthnDevices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listWebAuthnDevices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credentialId"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"backedUp"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastUsedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}}]}}]}}]} as unknown as DocumentNode<ListWebAuthnDevicesQuery, ListWebAuthnDevicesQueryVariables>;
export const MeAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MeAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meAuth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"KcUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<MeAuthQuery, MeAuthQueryVariables>;
export const ActivateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ActivateEventMutation, ActivateEventMutationVariables>;
export const AddTimeLinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTimeLines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTimelineInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTimeLines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]} as unknown as DocumentNode<AddTimeLinesMutation, AddTimeLinesMutationVariables>;
export const AssignUserRoleToEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignUserRoleToEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignUserToEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AssignUserRoleToEventMutation, AssignUserRoleToEventMutationVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const DeactivateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeactivateEventMutation, DeactivateEventMutationVariables>;
export const DeleteEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteEventMutation, DeleteEventMutationVariables>;
export const RemoveTimeLinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTimeLines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveTimelineInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTimeLines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]} as unknown as DocumentNode<RemoveTimeLinesMutation, RemoveTimeLinesMutationVariables>;
export const RemoveUserFromEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveUserFromEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveUserFromEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUserFromEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RemoveUserFromEventMutation, RemoveUserFromEventMutationVariables>;
export const TransferEventOwnershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferEventOwnership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferEventOwnership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<TransferEventOwnershipMutation, TransferEventOwnershipMutationVariables>;
export const UpdateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}}]} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>;
export const UpdateTimeLinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTimeLines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTimelineInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTimeLines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]} as unknown as DocumentNode<UpdateTimeLinesMutation, UpdateTimeLinesMutationVariables>;
export const AdminEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}}]} as unknown as DocumentNode<AdminEventsQuery, AdminEventsQueryVariables>;
export const AdminGetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminGetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}}]} as unknown as DocumentNode<AdminGetEventQuery, AdminGetEventQueryVariables>;
export const EventChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}}]} as unknown as DocumentNode<EventChildrenQuery, EventChildrenQueryVariables>;
export const EventGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventGuests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<EventGuestsQuery, EventGuestsQueryVariables>;
export const EventTreeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventTree"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventTree"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}}]} as unknown as DocumentNode<EventTreeQuery, EventTreeQueryVariables>;
export const GetEventByIdRsvpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventByIdRsvp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventRsvp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}}]} as unknown as DocumentNode<GetEventByIdRsvpQuery, GetEventByIdRsvpQueryVariables>;
export const EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Event"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}}]} as unknown as DocumentNode<EventQuery, EventQueryVariables>;
export const MyEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"myRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowReEntry"}},{"kind":"Field","name":{"kind":"Name","value":"rotateSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"maxSeats"}},{"kind":"Field","name":{"kind":"Name","value":"dressCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventTimeline"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventTimelinePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRolePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventBase"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventTimeline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserRole"}}]}}]}}]} as unknown as DocumentNode<MyEventsQuery, MyEventsQueryVariables>;
export const ApproveInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ApproveInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<ApproveInvitationMutation, ApproveInvitationMutationVariables>;
export const BulkApproveInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkApproveInvitations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkApproveInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkApproveInvitations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}}]}}]}}]} as unknown as DocumentNode<BulkApproveInvitationsMutation, BulkApproveInvitationsMutationVariables>;
export const CreateInvitationFromRsvpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvitationFromRsvp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PublicRsvpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvitationFromRsvp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<CreateInvitationFromRsvpMutation, CreateInvitationFromRsvpMutationVariables>;
export const CreateInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<CreateInvitationMutation, CreateInvitationMutationVariables>;
export const CreatePlusOnesInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlusOnesInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlusOneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlusOnesInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<CreatePlusOnesInvitationMutation, CreatePlusOnesInvitationMutationVariables>;
export const ImportInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportInvitations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportInvitationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importInvitations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"imported"}},{"kind":"Field","name":{"kind":"Name","value":"skipped"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<ImportInvitationsMutation, ImportInvitationsMutationVariables>;
export const RemoveAllPlusOnesByInvitationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAllPlusOnesByInvitationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAllPlusOnesByInvitationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitedByInvitationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<RemoveAllPlusOnesByInvitationIdMutation, RemoveAllPlusOnesByInvitationIdMutationVariables>;
export const RemoveInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RemoveInvitationMutation, RemoveInvitationMutationVariables>;
export const RemovePlusOneInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePlusOneInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePlusOneInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<RemovePlusOneInvitationMutation, RemovePlusOneInvitationMutationVariables>;
export const ReplyInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReplyInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RSVPInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replyInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<ReplyInvitationMutation, ReplyInvitationMutationVariables>;
export const UpdatePlusOnesInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlusOnesInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePlusOneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlusOnesInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdatePlusOnesInvitationMutation, UpdatePlusOnesInvitationMutationVariables>;
export const EventInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<EventInvitationQuery, EventInvitationQueryVariables>;
export const GetFullEventInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFullEventInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFullByEventIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<GetFullEventInvitationQuery, GetFullEventInvitationQueryVariables>;
export const InvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Invitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationContact"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plusOnes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}}]} as unknown as DocumentNode<InvitationQuery, InvitationQueryVariables>;
export const InvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}}]} as unknown as DocumentNode<InvitationsQuery, InvitationsQueryVariables>;
export const MyInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"maxInvitees"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}}]}}]} as unknown as DocumentNode<MyInvitationsQuery, MyInvitationsQueryVariables>;
export const GetPlusOnesByInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlusOnesByInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPlusOnesByInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InvitationPlusOne"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InvitationPlusOne"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvitationPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"pendingContactId"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpChoice"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByInvitationId"}},{"kind":"Field","name":{"kind":"Name","value":"invitedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}}]} as unknown as DocumentNode<GetPlusOnesByInvitationQuery, GetPlusOnesByInvitationQueryVariables>;
export const SendBulkInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendBulkInvitations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendInvitationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendInvitations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendBulkInvitationsMutation, SendBulkInvitationsMutationVariables>;
export const AssignSeatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignSeat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignSeatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignSeat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}},{"kind":"Field","name":{"kind":"Name","value":"seatType"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"guestId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AssignSeatMutation, AssignSeatMutationVariables>;
export const BulkRenameSectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkRenameSections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameSectionInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkRenameSections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inputs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"affectedSeats"}},{"kind":"Field","name":{"kind":"Name","value":"affectedSections"}},{"kind":"Field","name":{"kind":"Name","value":"affectedTables"}},{"kind":"Field","name":{"kind":"Name","value":"conflicts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BulkRenameSectionsMutation, BulkRenameSectionsMutationVariables>;
export const BulkRenameTablesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkRenameTables"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameTableInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkRenameTables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inputs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"affectedTables"}},{"kind":"Field","name":{"kind":"Name","value":"affectedSeats"}},{"kind":"Field","name":{"kind":"Name","value":"conflicts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BulkRenameTablesMutation, BulkRenameTablesMutationVariables>;
export const RenameSectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameSection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameSectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameSection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"affectedSeats"}}]}}]}}]} as unknown as DocumentNode<RenameSectionMutation, RenameSectionMutationVariables>;
export const RenameTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameTableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"affectedSeats"}}]}}]}}]} as unknown as DocumentNode<RenameTableMutation, RenameTableMutationVariables>;
export const GetSeatByGuestAndEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSeatByGuestAndEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GuestEventSeatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSeatByGuestAndEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetSeatByGuestAndEventQuery, GetSeatByGuestAndEventQueryVariables>;
export const SeatLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeatLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seatLayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatLayoutSection"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatLayoutSection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SectionPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"tables"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"seats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"seats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"sectionId"}},{"kind":"Field","name":{"kind":"Name","value":"tableId"}}]}}]}}]} as unknown as DocumentNode<SeatLayoutQuery, SeatLayoutQueryVariables>;
export const GetSeatListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSeatList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seatIdList"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSeatList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"seatIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seatIdList"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetSeatListQuery, GetSeatListQueryVariables>;
export const SeatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Seat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}},{"kind":"Field","name":{"kind":"Name","value":"seatType"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"guestId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SeatQuery, SeatQueryVariables>;
export const SeatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Seats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeatFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeatPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeatBasic"}},{"kind":"Field","name":{"kind":"Name","value":"seatType"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"radius"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"guestId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"table"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SeatsQuery, SeatsQueryVariables>;
export const ActivateDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActivateDeviceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activateDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}}]} as unknown as DocumentNode<ActivateDeviceMutation, ActivateDeviceMutationVariables>;
export const GenerateTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketId"}}}]}]}}]} as unknown as DocumentNode<GenerateTokenMutation, GenerateTokenMutationVariables>;
export const RevokeTicketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeTicket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RevokeTicketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeTicket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}}]} as unknown as DocumentNode<RevokeTicketMutation, RevokeTicketMutationVariables>;
export const ScanTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScanToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scanToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScanResult"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScanLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScanLogPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ticketId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"gate"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"nonce"}},{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScanResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScanPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"log"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScanLog"}}]}}]}}]} as unknown as DocumentNode<ScanTokenMutation, ScanTokenMutationVariables>;
export const GetMyTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyTickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyTickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}}]} as unknown as DocumentNode<GetMyTicketsQuery, GetMyTicketsQueryVariables>;
export const TicketByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TicketById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketSecurity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"devicePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationAt"}},{"kind":"Field","name":{"kind":"Name","value":"deviceActivationIP"}},{"kind":"Field","name":{"kind":"Name","value":"lastNonce"}},{"kind":"Field","name":{"kind":"Name","value":"nextNonce"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"}},{"kind":"Field","name":{"kind":"Name","value":"revokedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketSecurity"}}]}}]} as unknown as DocumentNode<TicketByIdQuery, TicketByIdQueryVariables>;
export const TicketsByEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TicketsByEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketsByEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"seatId"}},{"kind":"Field","name":{"kind":"Name","value":"guestProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"currentState"}},{"kind":"Field","name":{"kind":"Name","value":"revoked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<TicketsByEventQuery, TicketsByEventQueryVariables>;
export const CheckEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<CheckEmailQuery, CheckEmailQueryVariables>;
export const CheckUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<CheckUsernameQuery, CheckUsernameQueryVariables>;
export const GetUserListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guesIdList"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guesIdList"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalInfoPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContactPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalLimit"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contactOptions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerInterest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerInterest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Employee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBase"}},{"kind":"Field","name":{"kind":"Name","value":"personalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Contact"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Employee"}}]}}]}}]} as unknown as DocumentNode<GetUserListQuery, GetUserListQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalInfoPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContactPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalLimit"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contactOptions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerInterest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerInterest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Employee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBase"}},{"kind":"Field","name":{"kind":"Name","value":"personalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Contact"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Employee"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalInfoPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContactPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalLimit"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contactOptions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerInterest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerInterest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Employee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBase"}},{"kind":"Field","name":{"kind":"Name","value":"personalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Contact"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Employee"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalInfoPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"maritalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhoneNumber"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumberPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"infoId"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContactPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalLimit"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Interest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerInterest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInterestPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"interestId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"interest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Interest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contactOptions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customerInterest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerInterest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Employee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBase"}},{"kind":"Field","name":{"kind":"Name","value":"personalInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalInfo"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PhoneNumber"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Contact"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Employee"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;