import { format } from "date-fns";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Input, Control } from "@/components/ui/input";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import { MultiSelect } from "@/components/ui/multi-select";

import { Checkbox } from "@/components/ui/checkbox";

import { Calendar } from "@/components/ui/calendar";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { CalendarIcon } from "lucide-react";

import { formatDate } from "@/utils/formatters/format-date";

import { useState } from "react";

interface FormQuestionProps {
    question: {
        id: number;

        title: string;
        type:
        | "INPUT"
        | "TEXTAREA"
        | "CHECKBOX"
        | "SELECT"
        | "MULTI_SELECT"
        | "DATE"
        | "RADIO";

        description: string | null;
        observation: string | null;

        answer: string | string[] | null;

        options?: {
            label: string;
            value: string;
        }[];
    },

    setValue: any,

    register: any,
    control: any
}

export function FormQuestion({ question, register, control, setValue }: FormQuestionProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="flex flex-col gap-4">
            <Label htmlFor={`question-${question.id}`} className="text-sm text-slate-200">{question.title}</Label>

            {question.type === "INPUT" && (
                <Input>
                    <Control
                        id={`question-${question.id}`}
                        className="text-sm"
                        placeholder="Digite sua resposta"
                        {...register(`questions.${question.id}.answer`)}
                    />
                </Input>
            )}

            {question.type === "TEXTAREA" && (
                <Textarea
                    id={`question-${question.id}`}
                    placeholder="Digite sua resposta"
                    {...register(`questions.${question.id}.answer`)}
                />
            )}

            {question.type === "RADIO" && question.options && (
                <>
                    <Controller
                        control={control}
                        name={`questions.${question.id}.answer`}
                        render={({ field }) => (
                            <RadioGroup
                                className="flex items-center gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {question.options && question.options.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`question-${question.id}-option-${option.value}`}
                                        />

                                        <Label htmlFor={`question-${question.id}-option-${option.value}`}>
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <Textarea
                        placeholder="Digite uma observação (opcional)"
                        
                        {...register(`questions.${question.id}.observation`)}
                    />
                </>
            )}

            {question.type === "CHECKBOX" && question.options && (
                <>
                    {question.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name={`questions.${question.id}.answer.${option.value}`}
                                render={({ field }) => (
                                    <Checkbox
                                        id={`question-${question.id}-option-${option.value}`}
                                        checked={field.value || false}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                )}
                            />

                            <Label htmlFor={`question-${question.id}-option-${option.value}`}>
                                {option.label}
                            </Label>
                        </div>
                    ))}

                    <Textarea
                        placeholder="Digite uma observação (opcional)"
                        {...register(`questions.${question.id}.observation`)}
                    />
                </>
            )}

            {question.type === "SELECT" && question.options && (
                <>
                    <Controller
                        control={control}
                        name={`questions.${question.id}.answer`}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger
                                    id={`question-${question.id}`}
                                    className="bg-slate-900 h-12"
                                >
                                    <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>

                                <SelectContent>
                                    {question.options && question.options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    <Textarea
                        placeholder="Digite uma observação (opcional)"
                        {...register(`questions.${question.id}.observation`)}
                    />
                </>
            )}

            {question.type === "MULTI_SELECT" && question.options && (
                <>
                    <Controller
                        control={control}
                        name={`questions.${question.id}.answer`}
                        render={({ field }) => (
                            <MultiSelect
                                options={question.options!}
                                onValueChange={field.onChange}
                                defaultValue={field.value || []}
                                maxCount={6}
                                className="bg-slate-900 min-h-12 hover:bg-slate-900/60"
                                placeholder="Selecione as opções"
                            />
                        )}
                    />

                    <Textarea
                        placeholder="Digite uma observação (opcional)"
                        {...register(`questions.${question.id}.observation`)}
                    />
                </>
            )}

            {question.type === "DATE" && (
                <Popover>
                    <Input>
                        <Control
                            type="text"
                            id={`question-${question.id}`}
                            placeholder="DD/MM/AAAA"
                            className="text-sm min-h-12"
                            maxLength={10}
                            onInput={(event) => (event.currentTarget.value = formatDate(event.currentTarget.value))}
                            {...register(`question-${question.id}`)}
                        />

                        <PopoverTrigger asChild className="cursor-pointer">
                            <Button type="button" size="icon" className="size-8">
                                <CalendarIcon className="size-4 text-slate-400" />
                            </Button>
                        </PopoverTrigger>
                    </Input>

                    <PopoverContent align="end" className="w-fit">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                                setDate(selectedDate);

                                setValue(`question-${question.id}`, selectedDate ? format(selectedDate, "dd/MM/yyyy") : "");
                            }}
                            disabled={{ after: new Date() }}
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}
