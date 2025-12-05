import { turso } from "~/lib/turso";
import type { Route } from "./+types/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader() {
  const response = await turso.execute("SELECT * FROM users");

  return {
    users: response.rows,
  };
}

interface LoaderData {
  users: Array<{
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: string;
    updated_at: string;
    is_active: number;
    last_login: string | null;
  }>;
}

export default function ({ loaderData }: { loaderData: LoaderData }) {
  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Is Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loaderData.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
