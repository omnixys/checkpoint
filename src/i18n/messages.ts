import event from "../../messages/en/event.json";
import auth from "../../messages/en/auth.json";
// import calendar from "../../messages/en/calendar.json";
import invitation from "../../messages/en/invitation.json";
// import ticket from "../../messages/en/ticket.json";
// import security from "../../messages/en/security.json";
// import settings from "../../messages/en/settings.json";
// import seat from "../../messages/en/seat.json";
// import notification from "../../messages/en/notification.json";
// import user from "../../messages/en/user.json";
import layout from "../../messages/en/layout.json";
import home from "../../messages/en/home.json";
import error from "../../messages/en/error.json";
import rsvp from "../../messages/en/rsvp.json";
import common from "../../messages/en/common.json";
import create from "../../messages/en/create.json";
import onboarding from "../../messages/en/onboarding.json";

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
};

export type Messages = typeof messages;
