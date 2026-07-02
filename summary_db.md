# summary_db.md

## 1. Executive Summary

### Welche Business-Logik aktuell im Frontend liegt

Das Checkpoint-Frontend enthält umfangreiche clientseitige Business-Logik:

1. **Event-Konfiguration wird clientseitig ausgewertet und als Mutation-Parameter weitergereicht** – Das Frontend lädt `endsAt`, `approvalMode`, `eventName`, `allowGuestSeatSelection`, `invitedByOptions` aus dem Event Service und reicht diese Daten als Eingabeparameter an Invitation- und Ticket-Mutationen weiter.
2. **RSVP-Validierung und Approval-Check sind clientseitig** – Die Approval-Prüfung (`invitation.approved === false`) wurde im RSVP-Container auskommentiert (`RsvpContainer.tsx:77-84`) und die gesamte Gültigkeitsprüfung (Pflichtfelder, Plus-One-Alterskategorie) läuft nur im Client.
3. **Ticket-Status, QR-Lebensdauer und Gate-Identität sind hartcodiert** – Der Scanner verwendet `MAIN_GATE`, QR-Lifetime-Konstanten (45s/8s/5s) sind hardcoded, Device-Activation-Prüfung erfolgt clientseitig.
4. **Seat-Belegung wird clientseitig determiniert** – `isSeatOccupied()` prüft nur `guestId`/`invitationId`, ignoriert `seat.status`.
5. **Security Dashboard ist vollständig gemockt** – Keinerlei Backend-Integration.
6. **Mehrere Service-Antworten werden clientseitig zusammengeführt** – Ticket + Seat + User werden in mehreren Komponenten clientseitig gejoint.

### Warum das problematisch ist

- **Sicherheitslücken**: Client kann `eventEndsAt` fälschen, Approval-Checks umgehen, Tickets für revoked Devices generieren.
- **Inkonsistenzen**: `eventEndsAt` wird aus unterschiedlichen Quellen bezogen (rootEvent vs. per-invitation-event).
- **Staleness**: Clientseitig gecachte Event-Daten können veraltet sein.
- **Deploy-Kopplung**: Neue Status-Werte erfordern Frontend-Deploys.
- **Fehlende Audit-Trails**: Entscheidungen im Client sind nicht protokolliert.

### Betroffene Services

| Service | Bisherige Projection | Benötigte neue Projection |
|---------|---------------------|--------------------------|
| Invitation Service | `EventRoleProjection` (Rollen) | `event_invitation_projection` (Event-Settings) |
| Ticket Service | `EventRoleProjection` (Rollen) | `event_ticket_projection` (Ticket-relevante Settings) |
| Seat Service | `EventRoleProjection` (Rollen) | `event_seat_projection` (Seat-relevante Settings) |
| Scan Service | – | `event_scan_projection` (Scan-relevante Settings) |

---

## 2. Gefundene Frontend-Business-Logik

| Bereich | Datei/Komponente | Aktuelle Logik im Frontend | Problem | Ziel-Service |
|---------|-----------------|---------------------------|---------|-------------|
| **EventEndsAt-Weitergabe** | `InvitationCreateDialog.tsx:130-145` | Liest `selectedEvent.settings.endsAt` aus EventTree und übergibt es als `eventEndsAt` an `InvitationCreateInput` | Client bestimmt Enddatum | Invitation |
| **EventEndsAt-Weitergabe** | `InvitationDetailDialog.tsx:111-134` | Liest `logic.getEventEndsAt(inv.eventId)` und übergibt es an `ApproveInvitationInput` | Client bestimmt Endzeit | Invitation |
| **EventEndsAt-Weitergabe** | `InvitationDetailMobileDialog.tsx:98-121` | Gleiches Muster | Client bestimmt Endzeit | Invitation |
| **EventEndsAt-Weitergabe** | `InvitationCardView.tsx:136-154` | Gleiches Muster | Client bestimmt Endzeit | Invitation |
| **EventEndsAt-Weitergabe** | `useInvitationLogic.ts:513-541` (bulkApprove) | Liest `rootEvent.settings.endsAt` und übergibt es an `bulkApproveInvitations` | Nutzt rootEvent-Endzeit für ALLE Invitations | Invitation |
| **EventEndsAt-Weitergabe** | `useRsvpForm.ts:308-322` | Liest `invitation.eventEndsAt` und übergibt es an `ReplyInvitation` | Client darf Endzeit setzen | Invitation |
| **EventEndsAt-Weitergabe** | `RsvpClient.tsx:328-339` | Baut `eventEndsAt` aus EventTree für `createPublicInvitation` | Öffentl. Client bestimmt Endzeit | Invitation |
| **EventName-Weitergabe** | `InvitationCreateDialog.tsx:130-145` | Übergibt `selectedEvent?.name ?? null` als `eventName` | Client bestimmt Event-Namen | Invitation |
| **AutoApproveOnAccept** | `InvitationCreateDialog.tsx:140` | Hardcoded `false` | Ignoriert `approvalMode`-Konfiguration | Invitation |
| **Approval-Gate auskommentiert** | `RsvpContainer.tsx:77-84` | `// if (requiresApproval)` | **KRITISCH**: Unapproved Invitations können RSVP | Invitation |
| **Hardcodierte Status-Liste** | `RsvpContainer.tsx:97-102` | `["REJECTED","CANCELED","EXPIRED"]` blockieren RSVP | Neue Status erfordern Frontend-Deploy | Invitation |
| **PlusOne-Filterung** | `usePlusOnes.ts:128-145` | Filtert Plus-Ones ohne `plusOneAgeCategory` | Client entscheidet über Gültigkeit | Invitation |
| **Invitee-Validierung** | `rsvp.validation.ts:9-56` | Name required, Email OR Phone required | Nur clientseitig | Invitation |
| **Phone-Primary-Enforcement** | `usePhoneNumbers.ts:53-99` | Erzwingt genau eine Primary-Phone | Backend muss Primary setzen | Invitation |
| **Event-Selection-Logik** | `RsvpClient.tsx:317-326` | Client entscheidet Root/Sub-Event | Business-Logik | Invitation |
| **invitedByOptions-Resolution** | `RsvpClient.tsx:219-236` | Auflösung aus EventSettings | Client bestimmt Optionen | Invitation |
| **Zeitbasierte Filterung** | `useFilteredEvents.ts:25-43` | `Date.now()` vs `startsAt/endsAt` | Client-Uhr entscheidet | Event |
| **Seat-Belegung** | `useSeats.ts:91-98` | `Boolean(seat.guestId) \|\| Boolean(seat.invitationId)` | Ignoriert `seat.status` | Seat |
| **Seat-Holder-Name** | `useSeats.ts:131-150` | Ruft Name aus Invitation/Guest-Map ab | Seat Service sollte auflösen | Seat |
| **QR-Gate** | `useScanTicket.ts:63` | Hardcoded `MAIN_GATE` | Gate aus Scanner-Konfiguration | Ticket |
| **QR-Lifetime** | `QrCard.tsx:39-44` | `QR_TOKEN_LIFETIME_SECONDS = 45` | Sollte `rotateSeconds` sein | Ticket |
| **QR-Generation-Guard** | `QrCard.tsx:199-247` | Prüft revoked/activated clientseitig | Backend muss prüfen | Ticket |
| **Device-Activation-Check** | `QrCard.tsx:101-104` | Prüft 3 Felder clientseitig | Backend validieren | Ticket |
| **Non-Revoked-Filter** | `useTicketQuery.ts:36-48` | `filter((t) => !t.revoked)` | Backend pre-filtern | Ticket |
| **Ticket-Seat-Join** | `TicketList.tsx:17-24` | N+1 Seat-Abfragen | Ticket-Query erweitern | Ticket |
| **Scan-Result-Join** | `ScanContent.tsx:85-101` | User + Seat separat nach Scan | Scan-Response vervollständigen | Ticket |
| **Security-Guest-Aggregation** | `useSecurityGuests.ts:33-50` | Joint Ticket+Guest+Seat clientseitig | Security View vom Backend | Security/Ticket |
| **ActiveEvent-Persistenz** | `ActiveEventProvider.tsx:58-66` | localStorage + Cookie ohne Validation | Server-Validierung | Event/Invitation |
| **Bulk-Approve-Seat-Cache** | `useInvitationLogic.ts:257-283` | Seat-Liste clientseitig gecached | Staleness-Risiko | Seat |
| **CSV-Seat-Import** | `SeatImportDialog.tsx` | Nur Client-Validation, Mutation TODO | Fehlt komplett | Seat |
| **Section/Table-Rename** | `SectionInfoDialog.tsx:27`, `TableInfoDialog.tsx:33` | TODO: conflict handling | Keine Konfliktprüfung | Seat |
| **Security Dashboard** | `SecurityDashboardClientPage.tsx` | Vollständig gemockt | Kein Backend | Security/Scan |
| **PhoneType-Konstanten** | `phone-number.constants.ts:13-18` | Hardcoded `["MOBILE","HOME","WORK","WHATSAPP"]` | Enum-Änderungen = Deploy | User/Invitation |
| **Hardcodierte Seat-Label-Fallback** | `useInvitationLogic.ts:530` | `"debug"` als Fallback | Unprofessionell | Seat |

---

## 3. Empfohlene Projections pro Service

### 3.1 Invitation Service – `event_invitation_projection`

**Zweck**: Lokale Kopie aller Event-Settings, die der Invitation Service für Invitation-Erstellung, RSVP-Validierung und Approval-Entscheidungen benötigt.

| Feld | Typ | Quelle | Zweck |
|------|-----|--------|-------|
| `eventId` | String/UUID | Event Service | Referenz |
| `eventName` | String | Event Service | Anzeige |
| `startsAt` | DateTime | Event Service | RSVP-Zeitraum |
| `endsAt` | DateTime | Event Service | **RSVP blockieren nach Event-Ende** |
| `isActive` | Boolean | Event Service | Nur aktive Events |
| `approvalMode` | Enum | Event Service | **Auto/Manual Approval** |
| `allowPublicRsvp` | Boolean | Event Service | Public RSVP erlaubt |
| `allowPublicPlusOne` | Boolean | Event Service | Plus-One bei Public RSVP |
| `allowPlusOneUpdate` | Boolean | Event Service | Nachträgliche Änderung |
| `maxPlusOnes` | Int | Event Service | Maximale Plus-Ones |
| `requireApprovalForPlusOnes` | Boolean | Event Service | Plus-One-Aprroval |
| `rsvpDeadline` | DateTime? | Event Service | RSVP-Frist |
| `invitedByOptions` | String[] | Event Service | "Wie gehört?"-Optionen |
| `isPublic` | Boolean | Event Service | Öffentlich sichtbar |
| `updatedAt` | DateTime | Event Service | Staleness |

### 3.2 Ticket Service – `event_ticket_projection`

| Feld | Typ | Quelle | Zweck |
|------|-----|--------|-------|
| `eventId` | String/UUID | Event Service | Referenz |
| `startsAt` | DateTime | Event Service | Scan-Zeitraum |
| `endsAt` | DateTime | Event Service | Scan-Zeitraum |
| `isActive` | Boolean | Event Service | Ticket-Generierung |
| `allowReEntry` | Boolean | Event Service | **Re-Entry beim Scannen** |
| `rotateSeconds` | Int | Event Service | **QR-Rotation** (aktuell 45s hardcoded) |
| `maxSeats` | Int | Event Service | Max Tickets |
| `updatedAt` | DateTime | Event Service | Staleness |

### 3.3 Seat Service – `event_seat_projection`

| Feld | Typ | Quelle | Zweck |
|------|-----|--------|-------|
| `eventId` | String/UUID | Event Service | Referenz |
| `maxSeats` | Int | Event Service | **Maximale Seat-Anzahl** |
| `allowGuestSeatSelection` | Boolean | Event Service | **Gast darf Sitz wählen** |
| `allowSeatOverbooking` | Boolean | Event Service | **Overbooking erlaubt** |
| `isActive` | Boolean | Event Service | Nur bei aktiven Events |
| `updatedAt` | DateTime | Event Service | Staleness |

### 3.4 Security/Scan Service – `event_scan_projection`

| Feld | Typ | Quelle | Zweck |
|------|-----|--------|-------|
| `eventId` | String/UUID | Event Service | Referenz |
| `startsAt` | DateTime | Event Service | Scan-Zeitraum |
| `endsAt` | DateTime | Event Service | Scan-Zeitraum |
| `isActive` | Boolean | Event Service | Nur aktive Events |
| `allowReEntry` | Boolean | Event Service | **Re-Entry beim Scannen** |
| `rotateSeconds` | Int | Event Service | QR-Rotation |
| `updatedAt` | DateTime | Event Service | Staleness |

---

## 4. Event-Driven Synchronisation

### Neue Domain Events (vom Event Service zu publizieren)

| Event | Publisher | Consumer | Projection | Zweck |
|-------|-----------|----------|------------|-------|
| `event.created` | Event Service | Alle Services | Alle Projections | Initiale Projection nach Event-Erstellung |
| `event.settingsChanged` | Event Service | Alle Services | Alle Projections | Settings-Update |
| `event.scheduleChanged` | Event Service | Alle Services | Alle Projections | Änderung startsAt/endsAt |
| `event.approvalPolicyChanged` | Event Service | Invitation Service | `event_invitation_projection` | Änderung approvalMode |
| `event.seatPolicyChanged` | Event Service | Seat Service | `event_seat_projection` | Änderung seat-bezogener Settings |
| `event.ticketPolicyChanged` | Event Service | Ticket Service | `event_ticket_projection` | Änderung ticket-bezogener Settings |
| `event.statusChanged` | Event Service | Alle Services | Alle Projections | isActive-Änderung |
| `event.deleted` | Event Service | Alle Services | Alle Projections | Projection löschen (bereits vorhanden) |

Der Event Service publiziert aktuell KEINE Events bei `updateEvent()` (Settings-Änderungen). Nur `roleAssigned`, `roleRemoved`, `ownerChanged` und `deleted` werden publiziert. Dies muss erweitert werden.

---

## 5. Backend-Verantwortlichkeiten

| Frontend-Logik | Neuer Owner-Service | Begründung |
|----------------|-------------------|-----------|
| `eventEndsAt` aus Event laden + weiterreichen | **Invitation Service** | Service liest aus Projection |
| `eventName` laden + weiterreichen | **Invitation Service** | Service resolvet aus Projection |
| `autoApproveOnAccept` hardcoded `false` | **Invitation Service** | Service leitet aus `approvalMode` ab |
| Approval-Gate (`invitation.approved`) | **Invitation Service** | Service prüft bei RSVP |
| Invitee/PlusOne-Validierung | **Invitation Service** | Backend validiert Pflichtfelder |
| QR-Lifetime (45s) | **Ticket Service** | Nutzt `rotateSeconds` aus Projection |
| Gate-Identität (`MAIN_GATE`) | **Ticket Service** | Gate aus Scanner-Kontext |
| Device-Activation-Prüfung | **Ticket Service** | Service prüft bei generateToken |
| Seat-Belegung (guestId/invitationId) | **Seat Service** | Nutzt `seat.status` |
| Seat-Holder-Name | **Seat Service** | Service joint selbst |
| Zeitbasierte Event-Filterung | **Event Service** | Server-Zeit als Quelle |
| Security Dashboard | **Ticket/Scan Service** | Echte Daten statt Mock |
| CSV-Seat-Import | **Seat Service** | Backend-Validierung + Import |
| Section/Table-Rename-Conflict | **Seat Service** | Namenskonflikte prüfen |
| Phone-Primary-Enforcement | **Invitation Service** | Service setzt Primary |
| ActiveEvent-Validierung | **Invitation/Ticket Service** | Service validiert Zugehörigkeit |

---

## 6. API-Anpassungen

### Invitation Create (vereinfacht)

**Aktuell** (Client sendet `eventName`, `eventEndsAt`, `autoApproveOnAccept`):
```json
{
  "eventId": "evt_123",
  "eventName": "Geburtstagsfeier",
  "eventEndsAt": "2026-07-15T23:00:00Z",
  "autoApproveOnAccept": false,
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "maxInvitees": 2,
  "phoneNumbers": []
}
```

**Zukünftig** (nur `eventId` und guest data):
```json
{
  "eventId": "evt_123",
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "maxInvitees": 2,
  "phoneNumbers": []
}
```

Der Invitation Service resolvet `eventName`, `eventEndsAt` und `autoApproveOnAccept` aus der eigenen Projection.

### RSVP Reply (vereinfacht)

**Aktuell** (Client sendet `eventEndsAt` im `replyInput`):
```json
{
  "invitationId": "inv_456",
  "choice": "YES",
  "replyInput": {
    "firstName": "Max",
    "eventEndsAt": "2026-07-15T23:00:00Z",
    "email": "max@example.com",
    "phoneNumbers": [],
    "plusOnes": []
  }
}
```

**Zukünftig** (ohne `eventEndsAt`):
```json
{
  "invitationId": "inv_456",
  "choice": "YES",
  "replyInput": {
    "firstName": "Max",
    "email": "max@example.com",
    "phoneNumbers": [],
    "plusOnes": []
  }
}
```

### Approve Invitation (vereinfacht)

**Aktuell** (Client sendet `eventEndsAt`, `eventName`, `seat`, `seatId`):
```json
{
  "eventEndsAt": "2026-07-15T23:00:00Z",
  "eventName": "",
  "seat": "",
  "seatId": "",
  "eventId": "evt_123",
  "invitationId": "inv_456",
  "approved": true
}
```

**Zukünftig** (nur `invitationId`, `approved`, `seatId`):
```json
{
  "invitationId": "inv_456",
  "approved": true,
  "seatId": "seat_789"
}
```

### Bulk Approve (vereinfacht)

**Aktuell** (Client sendet `eventEndsAt` top-level + per-invitation `eventEndAt`, `eventName`, `seat`):
```json
{
  "input": {
    "invitationIds": [
      { "invitationId": "inv_456", "eventEndAt": "...", "eventName": "...", "seat": "...", "seatId": null }
    ],
    "approved": true
  },
  "eventEndsAt": "2026-07-15T23:00:00Z"
}
```

**Zukünftig** (nur `invitationId`, `seatId`):
```json
{
  "input": {
    "invitationIds": [
      { "invitationId": "inv_456", "seatId": null }
    ],
    "approved": true
  }
}
```

### Scan Token

**Aktuell** (`gate: "MAIN_GATE"` hardcoded):
```json
{
  "token": "...",
  "signature": "...",
  "deviceId": "dev_123",
  "gate": "MAIN_GATE"
}
```

**Zukünftig** (Gate aus Scanner-Konfiguration/Kontext):
```json
{
  "token": "...",
  "signature": "...",
  "deviceId": "dev_123",
  "gate": "VIP_ENTRANCE"
}
```

---

## 7. Migrationsplan

1. **Frontend-Logik inventarisieren** ✅ (abgeschlossen, siehe Abschnitt 2)
2. **Projections definieren** (2-3 Wo) – Prisma-Modelle, Kafka-Consumer
3. **Event-Service Domain Events erweitern** (1-2 Wo) – `event.settingsChanged`, `event.created`, etc.
4. **Consumer in Zielservices implementieren** (2-3 Wo) – Analog zu bestehendem `EventRoleHandler`
5. **Backend-Validierungen ergänzen** (3-4 Wo) – `endsAt` aus Projection, Approval-Check, Seat-Status
6. **Frontend vereinfachen** (2-3 Wo) – Entfernen von `eventEndsAt`/`eventName` aus allen Inputs
7. **Alte clientseitige Business-Logik entfernen** (1 Wo)
8. **Tests ergänzen** (2-3 Wo)

**Geschätzter Gesamtaufwand: 16-24 Wochen**

---

## 8. Offene Fragen

1. **Gate-Identität** – Soll Gate aus Security-User-Profil, Scanner-Device oder QR-Code am Standort kommen?
2. **Security Service** – Neuer Service nötig oder Ticket Service erweitern? `scanToken` + `ScanLog` existieren bereits im Ticket Service.
3. **EventTree** – Soll der Invitation Service den EventTree ebenfalls als Projection halten (für Root/Sub-Event-Auflösung)?
4. **PhoneNumber-Typen** – Sollen serverseitig konfigurierbar sein?
5. **Public RSVP** – Wie `eventEndsAt`-Validierung für unauthentifizierte RSVPs? (Invitation Service nutzt Projection)
6. **Plus-One-Erstellung** – `AddPlusOne` nimmt `eventEndsAt` an; Service muss Event über `invitedByInvitationId → Invitation → eventId → Projection` auflösen
7. **ApprovalMode-Semantik** – Was bedeutet `AUTO_PUBLIC_ONLY` genau? Öffentliche RSVPs auto-approve, Admin-Invitations manuell?
8. **Event-Status** – Unterscheidung zwischen `isActive=false` und soft-delete?
9. **rsvpDeadline** – Im Modell vorhanden, aber Frontend wertet es nirgends aus. Soll Invitation Service RSVP nach Deadline blockieren?
10. **DTO-Location** – Neue Event-DTOs in `@omnixys/contracts` oder in den jeweiligen Services?
11. **event.created-Sequence** – Sollte ein separates `event.created` alle Projections initialisieren? (Bisher nur `roleAssigned`+`ownerChanged`)
12. **Auto-Approve-Logik** – `AUTO` = immer, `MANUAL` = manuell, `AUTO_PUBLIC_ONLY` = nur öffentliche, `AUTO_INVITE_ONLY` = nur Admin-erstellte – Klärung der Semantik erforderlich
