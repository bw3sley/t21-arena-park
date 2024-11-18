import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import "@/lib/react-pdf";

export interface ResponsibilityDocumentProps {
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

export function ResponsibilityDocument({ data }: ResponsibilityDocumentProps) {
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
                        Termo de responsabilidade
                    </Text>
                </View>

                <View style={styles.main}>
                    <Text style={{ marginBottom: 12 }}>
                        Eu,{" "}
                        {handleValueOrPlaceholder(data.guardian.name)}, portador do RG nº{" "}
                        {handleValueOrPlaceholder(data.guardian.rg)}, inscrito no CPF sob nº{" "}
                        {handleValueOrPlaceholder(data.guardian.cpf)}, responsável pelo atleta{" "}
                        {handleValueOrPlaceholder(data.athlete.name)}, tenho consciência de que o T21 Arena Park não
                        pode se responsabilizar pela integridade física do aluno durante as aulas, jogos, torneios e
                        campeonatos, pelo fato do futebol se caracterizar como um esporte de contato físico.
                    </Text>

                    <Text style={{ marginBottom: 12 }}>
                        O responsável declara estar ciente de que, como qualquer outra atividade física, podem ocorrer
                        lesões ou ferimentos nas aulas e/ou treinamentos, jogos, torneios e campeonatos. Sendo desejo
                        do atleta e do responsável que o primeiro participe desses eventos, ambos isentam o projeto de
                        Futsal Down T21 Arena Park de qualquer responsabilidade por eventuais lesões físicas, fraturas,
                        acidentes em geral ou danos de qualquer natureza que venham ocorrer durante as atividades,
                        cabendo-nos unicamente a prestar assistência imediata no local em casos de ferimentos e pequenas
                        contusões.
                    </Text>

                    <Text style={{ marginBottom: 12 }}>
                        Lembrando que a afirmativa se refere ao período dentro da quadra de futsal durante as aulas,
                        treinos, jogos, torneios e campeonatos no município de Itajubá e outras cidades.
                    </Text>

                    <Text style={{ marginBottom: 12 }}>
                        Por estar de acordo com os itens estabelecidos, autorizo a participação do atleta nas atividades.
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
    )
}