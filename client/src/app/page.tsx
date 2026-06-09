import Input from "@/components/core/form/input";
import { useTranslations } from "next-intl";
import Test from "./test/page";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="bg-primary">
      <h1>{t("title")}</h1>
      <Test/>
      
    </main>
  );
}
