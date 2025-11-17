import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export function Welcome() {
  return (
    <main>
      <Card>
        Olá
        <Button variant="outline">Hello world</Button>
      </Card>
    </main>
  );
}
