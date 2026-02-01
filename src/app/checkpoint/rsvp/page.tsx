import { Suspense, JSX } from "react";
import RsvpClient from "./RsvpClient";
import RsvpLoading from "./loading";

export default function RsvpPage(): JSX.Element {
  return (
    <Suspense fallback={<RsvpLoading />}>
      <RsvpClient />
    </Suspense>
  );
}
