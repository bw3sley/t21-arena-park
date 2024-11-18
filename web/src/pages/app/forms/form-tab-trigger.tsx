import { TabsTrigger } from "@/components/ui/tabs";

import { getIconByName } from "@/utils/get-icon-by-name";

import { ChevronRight } from "lucide-react";

interface FormTabTriggerProps {
    section: {
        id: number,

        title: string,
        icon: string,

        questions: {
            id: number,

            title: string,
            type:
            "INPUT" |
            "CHECKBOX" |
            "SELECT" |
            "MULTI_SELECT" |
            "DATE" |
            "RADIO",

            description: string | null,
            observation: string | null,
            
            answer: string | string[] | null,
            
            options?: {
                label: string,
                value: string
            }[]
        }[]
    }
}

export function FormTabTrigger({ section }: FormTabTriggerProps) {
    return (
        <TabsTrigger key={section.id} value={`${section.id}`} className="space-x-3">
            {getIconByName(section.icon)}

            <span className="text-start mr-auto text-base hover:text-slate-300 hidden lg:flex flex-1">
                {section.title}
            </span>

            <ChevronRight className="size-4 hidden lg:inline-block" />
        </TabsTrigger>
    )
}