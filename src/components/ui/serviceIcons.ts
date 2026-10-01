import { IconAI, IconApps, IconAutomation, IconWeb } from "./icons";
import type { ServiceIcon } from "@/lib/services";

export const SERVICE_ICONS: Record<ServiceIcon, typeof IconApps> = {
  apps: IconApps,
  ai: IconAI,
  automation: IconAutomation,
  web: IconWeb,
};
