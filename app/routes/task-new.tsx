import { prisma } from "~/lib/prisma";
import type { Route } from "./+types/task-new";
import { redirect } from "react-router";
import { ChatMessageRole } from "~/generated/prisma/enums";
import type { ChatMessage } from "~/generated/prisma/client";
import { TaskChatbot } from "~/features/tasks/task-chatbot";

type Task = {
  title: string;
  description: string;
  steps: string[];
  acceptance_criteria: string[];
  suggested_tests: string[];
  estimated_time: string;
  implementation_suggestion: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const chatId = url.searchParams.get("chat");

  let messages = [] as ChatMessage[];
  let taskJson;

  if (chatId) {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    });

    if (!chat) {
      return redirect("/task/new");
    }

    messages = chat.messages.map((message) => ({
      ...message,
      content:
        message.role === ChatMessageRole.assistant
          ? message.content === "{}"
            ? "🤷‍♂️ Sua pergunta gerou uma resposta inválida"
            : "✅ Solicitação atendida. Verifique o painel ao lado 👉"
          : message.content,
    }));
    ``;

    taskJson = chat.messages[messages.length - 1].content;
  }

  return {
    chatId,
    messages,
    task: JSON.parse(taskJson ?? "{}") as Task,
  };
}

export default function () {
  return <TaskChatbot />;
}
