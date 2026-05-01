import auth from "../../messages/en/checkpoint/auth.json";
import common from "../../messages/en/checkpoint/common.json";
import create from "../../messages/en/checkpoint/create.json";
import error from "../../messages/en/checkpoint/error.json";
import event from "../../messages/en/checkpoint/event.json";
import home from "../../messages/en/checkpoint/home.json";
// import calendar from "../../messages/en/checkpoint/calendar.json";
import invitation from "../../messages/en/checkpoint/invitation.json";
// import ticket from "../../messages/en/checkpoint/ticket.json";
// import security from "../../messages/en/checkpoint/security.json";
// import settings from "../../messages/en/checkpoint/settings.json";
// import seat from "../../messages/en/checkpoint/seat.json";
// import notification from "../../messages/en/checkpoint/notification.json";
// import user from "../../messages/en/checkpoint/user.json";
import layout from "../../messages/en/checkpoint/layout.json";
import onboarding from "../../messages/en/checkpoint/onboarding.json";
import qr from "../../messages/en/checkpoint/qr.json";
import rsvp from "../../messages/en/checkpoint/rsvp.json";
import scanner from "../../messages/en/checkpoint/scanner.json";
import ticket from "../../messages/en/checkpoint/ticket.json";

export const messages = {
  auth,
  event,
  // calendar,
  invitation,
  // ticket,
  // security,
  // settings,
  // seat,
  // notification,
  // user,
  layout,
  home,
  error,
  rsvp,
  common,
  create,
  onboarding,
  scanner,
  qr,
  ticket,
};

export type Messages = typeof messages;
