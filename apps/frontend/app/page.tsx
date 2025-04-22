import { Appbar } from "@/components/Appbar";
import { Prompt } from "@/components/Prompt";
import { TemplateButtons } from "@/components/TemplateButtons";

export default function Home() {
  return (
    <div className="bg-black text-white h-screen">
      <Appbar />
      <div className="pt-32 mx-auto max-w-2xl">
        <div className="text-2xl font-bold text-center p-2">
          What do you want to build?
        </div>
        <div className="w-full text-sm text-muted-foreground text-center p-2">
          Prompt, click, generate and watch your app come to life
        </div>
        <div>
          <Prompt />
        </div>
        <div className="pt-32 flex justify-center">
          <TemplateButtons />
        </div>
      </div>
    </div>
  );
}
