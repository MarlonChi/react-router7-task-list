import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import { ChatMessageRole } from "~/generated/prisma/enums";
import { prisma } from "~/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env["GOOGLE_API_KEY"] || "");

const SYSTEM_PROMPT = `
Você é um gerente de projetos muito experiente, especializado em soluções web e mobile.
Você receberá um pedido para entregar instruções detalhadas sobre como construir uma funcionalidade e deve responder como se estivesse criando especificações para tal funcionalidade, da melhor forma possível.
Este é um projeto contínuo que utiliza React Router 7 (modo framework), Tailwind CSS, ShadcnUI, SQLite e Prisma ORM. Para testes, o app utiliza Vitest e React Testing Library e a estratégia de testes é: apenas testes unitários.
Evite sugerir a instalação de qualquer uma dessas dependências. Elas já estão declaradas para apoiar suas decisões de ferramentas adicionais.
Por favor, refine a seguinte descrição de tarefa e retorne um JSON com: título, descrição, etapas, tempo estimado e sugestão de implementação.
Sempre entregue os resultados em português brasileiro (pt_BR), independentemente do idioma da mensagem do usuário.

Pontos extremamente importantes:
- Caso a mensagem de usuário não possa gerar uma tarefa válida, retorne um JSON vazio ("{}")
- Caso uma conversa já possua uma mensagem anterior do modelo contendo um JSON válido, use-a para compor sua resposta.
- Quando usuário solicitar alteração na tarefa refinada, faça a alteração de forma cirúrgica.

Saída JSON esperada:
{
  "title": "Formulário de Login Seguro com Autenticação",
  "description": "Implemente um formulário de login moderno...",
  "steps": ["..."],
  "acceptance_criteria": ["..."],
  "suggested_tests": ["..."],
  "estimated_time": "2 dias",
  "implementation_suggestion": "..."
}
`;

type Message = {
  role: ChatMessageRole;
  content: string;
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function getChatCompletions(messages: Message[]) {
  const history: Content[] = messages
    .filter((msg) => msg.role !== ChatMessageRole.system)
    .map((msg) => ({
      role: msg.role === ChatMessageRole.user ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

  try {
    const result = await model.generateContent({
      contents: history,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    throw error;
  }
}

export async function createChatMessages(
  chatId: string,
  chatMessage: Message,
  answer: Message
) {
  await prisma.chatMessage.createMany({
    data: [
      {
        chat_id: chatId,
        ...chatMessage,
      },
      { chat_id: chatId, ...answer },
    ],
  });
}
