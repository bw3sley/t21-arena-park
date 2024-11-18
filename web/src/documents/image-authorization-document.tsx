import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export interface ImageAuthorizationDocumentProps {
    data: {
        guardian: {
            name: string,
            rg: string,
            cpf: string,
        },

        athlete: {
            name: string
        }
    }
}

export function ImageAuthorizationDocument({ data }: ImageAuthorizationDocumentProps) {
    const styles = StyleSheet.create({
        page: { borderRadius: 6, fontFamily: "Roboto", padding: 24, alignItems: "center", justifyContent: "center", display: "flex" },
        header: {},
        heading: { fontWeight: "bold" },
        wrapper: { textAlign: "justify" },
        main: { marginTop: 32 },
        footer: {},
        highlight: { textDecoration: "underline", fontWeight: "bold" }
    });


    function handleValueOrPlaceholder(value: string) {
        if (value) {
            return <Text style={styles.highlight}>{value}</Text>
        }

        return <Text>___________________________________</Text>
    }

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.heading}>
                        Termo de Autorização do Uso de Imagem
                    </Text>
                </View>

                <View style={styles.main}>
                    <Text style={{ marginBottom: 12 }}>
                        Eu,{" "}
                        {handleValueOrPlaceholder(data.guardian.name)}, portador do RG nº{" "}
                        {handleValueOrPlaceholder(data.guardian.rg)}, inscrito no CPF sob nº{" "}
                        {handleValueOrPlaceholder(data.guardian.cpf)}, autorizo o uso da imagem do atleta{" "}
                        {handleValueOrPlaceholder(data.athlete.name)}, em todo material ligado aos meios de
                        comunicação, para ser utilizada em campanhas promocionais e redes sociais vinculadas ao Projeto
                        T21 Arena Park, sejam essas destinadas à divulgação ao público em geral e/ou apenas para uso
                        interno deste projeto, desde que não haja desvirtuamento da sua finalidade.
                    </Text>

                    <Text style={{ marginBottom: 12 }}>
                        A presente autorização é concedida a título gratuito, abrangendo o uso da imagem acima
                        mencionada em todo território nacional e no exterior, em todas as suas modalidades e, em
                        destaque, das seguintes formas: folhetos em geral (banner, encartes, mala direta, catálogo, etc.);
                        folder de apresentação; home page; instagram; facebook; cartazes.
                    </Text>

                    <Text style={{ marginBottom: 12 }}>
                        Por esta ser a expressão da minha vontade declaro que autorizo o uso acima descrito durante o
                        tempo que o atleta mencionado acima estiver participando do T21 Arena Park, sem que nada haja
                        a ser reclamado a título de direitos conexos à sua imagem ou a qualquer outro, e assino a presente
                        autorização.
                    </Text>
                </View>
                
                <View style={styles.footer}>
                    <Text style={{ marginTop: 24, textAlign: "right" }}>
                        Itajubá, ____ de __________ de {new Date().getFullYear()}.
                    </Text>

                    <View style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ marginTop: 40, textAlign: "center" }}>
                            __________________________________________________________
                        </Text>

                        <Text style={{ fontSize: 14, marginTop: 8 }}>Assinatura do Responsável</Text>
                    </View>
                </View>
            </View>
        </Page>
    );
}
