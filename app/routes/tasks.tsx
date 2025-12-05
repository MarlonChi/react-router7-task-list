import { TaskList } from "~/features/tasks/task-list";

export async function loader() {
  return {};
}

export default function Tasks() {
  return <TaskList />;
}
