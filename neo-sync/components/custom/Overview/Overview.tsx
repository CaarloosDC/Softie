import InfoCard from "./InfoCard";
import SearchBar from "./SearchBar";
import { KanbanBoard } from "./Kanban/KanbanBoard";
import CustomSeparator from "./CustomSeparator";
import Header from "@/components/global/Header";

export default function Overview() {
  return (
    <>
      <div className="pt-16 flex flex-col gap-3 mx-auto max-w-6xl">
        <Header />
        <CustomSeparator />
        <InfoCard />
        <CustomSeparator />
        <SearchBar />
        <KanbanBoard />
      </div>
    </>
  );
}
