import { Button } from "@/components/ui/button";

import { TabsContent } from "@/components/ui/tabs";

import { FormQuestion } from "./form-question";

import { getIconByName } from "@/utils/get-icon-by-name";

import { useForm } from "react-hook-form";

import { Loader2 } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import { updateAthleteAnamnesis } from "@/api/update-athlete-anamnesis";

import { errorHandler } from "@/error-handler";

import { toast } from "sonner";

interface FormTabContentProps {
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
    },

    athleteId: string
}

export function FormTabContent({ athleteId, section }: FormTabContentProps) {
    const { register, control, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
        values: {
            questions: section.questions.reduce((acc, question) => {
                acc[question.id] = {
                    answer: question.answer || (question.type === "MULTI_SELECT" ? [] : ""),
                    observation: question.observation || "",
                };
                return acc;
            }, {} as Record<number, { answer: string | string[]; observation: string }>)
        }
    });
    
    const { mutateAsync: updateAthleteAnamnesisFn } = useMutation({
        mutationFn: updateAthleteAnamnesis,

        onSuccess: () => {
            toast.success("Anamnese atualizada com sucesso!");
        }
    })

    async function handleFormTabContent(data: any) {
        try {
            const _data = section.questions.map(question => {
                const answer = data.questions?.[question.id]?.answer || "";
                const observation = data.questions?.[question.id]?.observation || "";
    
                return {
                    id: question.id,
                    answer,
                    ...(observation && { observation })
                };
            });
    
            updateAthleteAnamnesisFn({
                athleteId,
                
                slug: "anamnesis",
                questions: _data
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <TabsContent key={section.id} value={`${section.id}`}>
            <div className="flex items-center gap-3 mb-8">
                {getIconByName(section.icon)}

                <h2 className="text-xl">{section.title}</h2>
            </div>

            <form method="POST" className="w-full flex flex-col gap-4" onSubmit={handleSubmit(handleFormTabContent)}>
                <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md space-y-6">
                    {section.questions.map(question => (
                        <FormQuestion 
                            key={question.id}

                            register={register}
                            control={control}
                            setValue={setValue}

                            question={question} 
                        />
                    ))}
                </div>

                <div className="self-end">
                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="size-5" /> : <span>Salvar</span>}
                    </Button>
                </div>
            </form>
        </TabsContent>
    )
}