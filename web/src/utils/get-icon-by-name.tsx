import * as Icons from "lucide-react";

import type { LucideIcon } from "lucide-react";

export function getIconByName(icon: string): JSX.Element {
    const Icon = Icons[icon as keyof typeof Icons] as LucideIcon | undefined;

    return Icon ? <Icon className="size-5" /> : <Icons.Loader2 className="size-5 animate-spin" />;
}