import { TasksList } from "~/features/tasks/task-list";
import { prisma } from "~/lib/prisma";

export async function loader() {
  const tasks = await prisma.task.findMany({
    include: {
      chat_message: true,
    },
  });

  return { tasks };
}

export default function () {
  return <TasksList />;
}
