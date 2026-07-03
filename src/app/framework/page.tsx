import type { Metadata } from "next";
import FrameworkPage from "@/components/pages/FrameworkPage";

export const metadata: Metadata = {
  title: "How It Works — FourFlowOS",
  description:
    "Flow has conditions. FourFlow maps twelve of them across four dimensions, so you can find the one blocking you and train it.",
};

export default function Framework() {
  return <FrameworkPage />;
}
