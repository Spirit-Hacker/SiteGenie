import { Button } from "./ui/button";

export function TemplateButtons() {
  return (
    <div className="p-[2px] rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 inline-flex shadow-[0_0_20px_rgba(59,130,246,0.5)]">
      <div className="flex gap-2 bg-black rounded-3xl px-2 py-1">
        <Button className="text-white rounded-2xl px-4 py-2 bg-black cursor-pointer" variant={"default"}>
          Build a Chess App
        </Button>
        <Button className="text-white rounded-2xl px-4 py-2 bg-black cursor-pointer" variant={"default"}>
          Create a Todo App
        </Button>
        <Button className="text-white rounded-2xl px-4 py-2 bg-black cursor-pointer" variant={"default"}>
          Create a Docs App
        </Button>
        <Button className="text-white rounded-2xl px-4 py-2 bg-black cursor-pointer" variant={"default"}>
          Create a Base App
        </Button>
      </div>
    </div>
  );
}
