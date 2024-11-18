import { AxiosError } from "axios";

import { toast } from "sonner";

export function errorHandler(error: unknown) {
    if (error instanceof AxiosError) {
        if (error.response) {
            toast.error(error.response.data.message);
        }

        else {
            toast.error("Aconteceu um erro inesperado! Tente novamente.");
        }
    }

    else {
        toast.error(`Aconteceu um erro: ${error}`);
    }
}