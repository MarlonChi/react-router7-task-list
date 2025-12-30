import { TasksList } from "~/features/tasks/task-list";
import { prisma } from "~/lib/prisma";

export async function loader() {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
      steps: true,
      estimated_time: true,
      implementation_suggestion: true,
      acceptance_criteria: true,
      suggested_tests: true,
      content: true,
      chat_history: true,
    },
  });

  return { tasks };
}
export default function Tasks() {
  return <TasksList />;
}
