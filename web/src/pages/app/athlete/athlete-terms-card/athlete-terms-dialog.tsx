import { Button } from "@/components/ui/button";

import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { ImageAuthorizationDocument } from "@/documents/image-authorization-document";
import { ResponsibilityDocument } from "@/documents/responsibility-document";

import { Document, pdf, PDFViewer, usePDF } from "@react-pdf/renderer";

import { saveAs } from "file-saver";

import { Loader2 } from "lucide-react";

interface AthleteTermsDialogProps {
    controller: (open: boolean) => void,

    type: "RESPONSIBILITY" | "IMAGE",

    data: {
        guardian: {
            name: string,
            rg: string,
            cpf: string
        },

        athlete: {
            name: string
        }
    }
}

export function AthleteTermsDialog({ controller, type, data }: AthleteTermsDialogProps) {
    const [instance, _] = usePDF({ document: <Document /> });

    const isLoading = instance.loading;

    async function handleEmptyDocument() {
        const _data = {
            guardian: {
                name: "",
                cpf: "",
                rg: ""
            },

            athlete: { name: "" }
        }

        const blob = await pdf(
            <Document>
                {type === "RESPONSIBILITY" ? (
                    <ResponsibilityDocument data={_data} />
                ) : (
                    <ImageAuthorizationDocument data={_data} />
                )}
            </Document>
        ).toBlob();

        const fileName = `Documento ${type === "RESPONSIBILITY" ? "de Responsabilidade" : "de Autorização de Imagem"} - T21 Arena Park.pdf`;

        saveAs(blob, fileName);

        controller(false);
    }

    async function handleDocument() {
        const blob = await pdf(
            <Document>
                {type === "RESPONSIBILITY" ? (
                    <ResponsibilityDocument data={data} />
                ) : (
                    <ImageAuthorizationDocument data={data} />
                )}
            </Document>
        ).toBlob();

        const fileName = `Documento ${type === "RESPONSIBILITY" ? "de Responsabilidade" : "de Autorização de Imagem"} de ${data.athlete.name} - T21 Arena Park.pdf`;

        saveAs(blob, fileName);

        controller(false);
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Impressão de termo</DialogTitle>
                <DialogDescription>
                    Baixe o documento para formalizar e documentar o consentimento necessário.
                </DialogDescription>
            </DialogHeader>

            <div className="flex gap-4 p-4 border rounded-md border-slate-700 bg-slate-900/80 overflow-hidden">
                {isLoading ? (
                    <div className="w-full flex items-center justify-center h-[400px]">
                        <Loader2 className="size-6 text-slate-600 animate-spin" />
                    </div>
                ) : (
                    <PDFViewer width="100%" height="400" showToolbar={false}>
                        <Document>
                            {type === "RESPONSIBILITY" ? <ResponsibilityDocument key="RESPONSIBILITY" data={data} /> : <ImageAuthorizationDocument key="IMAGE" data={data} />}
                        </Document>
                    </PDFViewer>
                )}
            </div>

            <DialogFooter>
                {data.guardian.name && (
                    <Button type="button" disabled={isLoading} variant="secondary" className="rounded-md" size="sm" onClick={handleEmptyDocument}>
                        Baixar documento vazio
                    </Button>
                )}

                <Button size="sm" variant="primary" disabled={isLoading} onClick={handleDocument}>
                    <span>Baixar documento</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
