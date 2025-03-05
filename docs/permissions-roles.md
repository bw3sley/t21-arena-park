# Permissões e papéis (roles) na plataforma

## 1\. Introdução

* **Objetivo:** o objetivo deste documento é detalhar os papéis e permissões atribuídos aos diferentes tipos de usuários na plataforma de gestão de atletas e voluntários da ONG. Este documento fornece uma visão clara das operações que cada papel pode realizar no sistema, garantindo uma administração segura e eficiente.
* **Escopo:** este documento abrange a descrição das permissões atribuídas aos papéis "**Owner**", "**Administrator**", "**Volunteer**" e "**Anonymous**" dentro da plataforma. As permissões descritas incluem operações como criação, leitura, atualização e exclusão de dados, além de outras operações críticas para a gestão dos usuários e atletas. Este documento não inclui detalhes de implementação técnica das permissões.

## 2\. Conteúdo Principal

* **2.1 Papéis na Plataforma**
  * **Owner:**
    * O Owner é considerado um administrador com controle total sobre a plataforma, possuindo todas as permissões disponíveis.
  * **Administrator:**
    * Responsável pela gestão ampla da plataforma, incluindo a administração de usuários, atletas e a configuração da plataforma.
  * **Volunteer:**
    * Usuário com permissões limitadas, focadas em interações diretas com os atletas que estão sob sua supervisão.
  * **Anonymous:**
    * Usuário não autenticado, com acesso extremamente restrito, apenas para visualizações públicas, se houver.

  **2.2 Tabela de Permissões**

  | **Permissão** | **Owner** | **Administrator** | **Volunteer** | **Anonymous** |
  | -- | -- | -- | -- | -- |
  | Atualizar as observações de um atleta | ✅ | ✅ | ⚠ | ❌ |
  | Atualizar os dados de um voluntário | ✅ | ✅ | ❌ | ❌ |
  | Visualizar o perfil do atleta | ✅ | ✅ | ✅ | ❌ |
  | Listar os atletas | ✅ | ✅ | ✅ | ❌ |
  | Atualizar os dados de um atleta | ✅ | ✅ | ✅ | ❌ |
  | Criar um novo atleta | ✅ | ✅ | ✅ | ❌ |
  | Visualizar os dados do responsável de um atleta | ✅ | ✅ | ✅ | ❌ |
  | Atualizar o status de um atleta | ✅ | ✅ | ✅ | ❌ |
  | Exportar os dados do atleta | ✅ | ✅ | ✅ | ❌ |
  | Atualizar os dados de um responsável | ✅ | ✅ | ✅ | ❌ |
  | Listar atletas por nome | ✅ | ✅ | ✅ | ❌ |
  | Atualizar os dados da anamnese de um atleta | ✅ | ✅ | ✅ | ❌ |
  | Visualizar as métricas da plataforma | ✅ | ✅ | ✅ | ❌ |
  | Importar os dados dos atletas | ✅ | ✅ | ✅ | ❌ |
  | Trocar senha da conta | ✅ | ⚠ | ⚠ | ❌ |

  **Legenda:**
  * ✅ = Permitido
  * ⚠ = Permitido com condições
  * ❌ = Não permitido

  **2.3 Condições Especiais**
  * **Troca de Senha:**
    * Somente é possível trocar a senha da própria conta.
  * **Atualização de Observações:**
    * Os voluntários podem atualizar apenas as observações que eles mesmos cadastraram, ou se for relacionado à função específica que eles desempenham.

## 3\. Recursos Visuais (se aplicável)

*(Não aplicável neste documento.)*

## 4\. Anexos (se aplicável)

*(Não há anexos aplicáveis no momento.)*