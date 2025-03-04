# Requisitos Funcionais, Não Funcionais e Regras de Negócio

## 1\. Introdução

* **Objetivo:** este documento descreve os requisitos funcionais, não funcionais e as regras de negócio para o sistema de gestão de atletas e voluntários da ONG. O objetivo é garantir que o desenvolvimento do sistema atenda às necessidades identificadas pelo cliente, proporcionando uma ferramenta eficiente e segura para o gerenciamento dos atletas e voluntários.
* **Escopo:** o escopo deste documento abrange os requisitos funcionais e não funcionais essenciais para o funcionamento da plataforma, bem como as regras de negócio que regem as interações dos usuários com o sistema. Questões de design de interface e implementação técnica específica estão fora do escopo deste documento.

## 2\. Conteúdo Principal

**2.1 Requisitos Funcionais**

* Deve ser possível cadastrar e excluir um voluntário na tela de configuração da plataforma.
* Deve ser possível atualizar os dados da plataforma na tela de configuração, como senha e endereço.
* Deve ser possível se autenticar utilizando e-mail e senha.
* Deve ser possível trocar e recuperar a senha.
* Deve ser possível obter o perfil de um usuário logado e gerenciar seus dados, como nome, endereço e senha.
* Deve ser possível obter o perfil de um atleta pelo nome.
* Deve ser possível cadastrar, editar e excluir um atleta.
* Deve ser possível cadastrar e editar um responsável.
* Deve ser possível obter métricas dos atletas cadastrados na plataforma.
* Deve ser possível cadastrar e editar uma anamnese de um atleta.
* Deve ser possível visualizar e imprimir os termos de autorização de imagem e responsabilidade.
* Deve ser possível cadastrar e editar observações dos atletas para cada área da plataforma.
* Deve ser possível importar dados de novos atletas por meio de um arquivo .csv.
* Deve ser possível gerar e visualizar uma observação do atleta que possui a anamnese completa por IA.

**2.2 Requisitos Não Funcionais**

* Os dados da aplicação devem ser persistidos em um banco PostgreSQL.
* Todas as listas de dados devem estar paginadas com 10 itens por página.
* A senha do usuário deve estar criptografada.
* As telas devem ter boa usabilidade, permitindo a navegação pelo teclado.
* As telas devem ser responsivas para diversos dispositivos.

**2.3 Regras de Negócio**

* Administradores e voluntários devem poder cadastrar novos atletas.
* Voluntários não podem cadastrar informações de atletas em áreas que não monitoram.
* Administradores não podem cadastrar voluntários com e-mails duplicados.
* Não é permitido cadastrar mais de uma anamnese para um atleta.
* Caso os usuários importados já existam, os dados devem ser atualizados.
* Voluntários podem cadastrar observações para os atletas, mas só podem atualizar as observações que eles mesmos cadastraram ou se forem da mesma função do usuário que cadastrou.

## 3\. Recursos Visuais (se aplicável)

(Se aplicável, insira diagramas ou gráficos que ilustrem os requisitos ou o fluxo de trabalho do sistema.)

## 4\. Anexos (se aplicável)

* **Documentos Relacionados:** referências de layout podem ser encontrados em: [referências de layout](https://fepi-t21.notion.site/Refer-ncias-de-layout-6555a18dc4624b5fae5068145463a373).