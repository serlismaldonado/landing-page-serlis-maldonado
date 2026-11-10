import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import SearchGrid from "@/components/SearchGrid";

export default function SearchGridIsland() {
  return (
    <ConvexClientProvider>
      <SearchGrid />
    </ConvexClientProvider>
  );
}
