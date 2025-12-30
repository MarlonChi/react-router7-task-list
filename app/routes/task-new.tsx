import { TaskChatbot } from "~/features/tasks/task-chatbot";
import type { Route } from "../+types/root";
import type { ChatMessage } from "~/features/tasks/types";
import { prisma } from "~/lib/prisma";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const chatId = url.searchParams.get("chat");

  let messages = [] as ChatMessage[];

  if (chatId) {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      return redirect("/task/new");
    }

    messages = JSON.parse(chat?.content ?? "");
  }

  return {
    chatId,
    messages,
  };
}

export default function () {
  return <TaskChatbot />;
}
