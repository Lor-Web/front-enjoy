import { Globe } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import {
  type SimpleIcon,
  siDiscord,
  siGithub,
  siTelegram,
  siVk,
} from "simple-icons";
import type { ContactKey } from "../model/types";

type IconProps = SVGProps<SVGSVGElement>;

function BrandIcon({ icon, ...props }: IconProps & { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d={icon.path} />
    </svg>
  );
}

function TelegramIcon(props: IconProps) {
  return <BrandIcon icon={siTelegram} {...props} />;
}

function VkIcon(props: IconProps) {
  return <BrandIcon icon={siVk} {...props} />;
}

function DiscordIcon(props: IconProps) {
  return <BrandIcon icon={siDiscord} {...props} />;
}

function GitHubIcon(props: IconProps) {
  return <BrandIcon icon={siGithub} {...props} />;
}

export { GitHubIcon };

export const contactIcons: Record<ContactKey, ComponentType<IconProps>> = {
  telegram: TelegramIcon,
  vk: VkIcon,
  discord: DiscordIcon,
  website: Globe,
};

export const contactIconClass: Record<ContactKey, string> = {
  telegram: "text-[#26A5E4]",
  vk: "text-[#0077FF]",
  discord: "text-[#5865F2]",
  website: "text-primary",
};
