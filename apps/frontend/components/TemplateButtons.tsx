import { Button } from "./ui/button";

export function TemplateButtons() {
  return (
    <div className="flex gap-2">
      <Button
        className="cursor-pointer border-2 border-white bg-black text-white rounded-3xl"
        variant="outline"
      >
        Build a Chess App
      </Button>
      <Button
        className="cursor-pointer border-2 border-white bg-black text-white rounded-3xl"
        variant="outline"
      >
        Create a Todo App
      </Button>
      <Button
        className="cursor-pointer border-2 border-white bg-black text-white rounded-3xl"
        variant="outline"
      >
        Create a Docs App
      </Button>
      <Button
        className="cursor-pointer border-2 border-white bg-black text-white rounded-3xl"
        variant="outline"
      >
        Create a Base App
      </Button>
    </div>
  );
}
