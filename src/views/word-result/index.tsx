import { useEffect, useState } from "react";
import DetailWord from "../../components/details-word";
import SearchResult from "../../components/search-result";
import LookupArea from "../../components//lookups";
import { useSearchParams } from "react-router-dom";

const WordResult = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const textFromUrl = searchParams.get("text") || "";
    setSearchText(textFromUrl);
  }, [searchParams]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full h-full p-4 mb-8">
        <LookupArea />

        <div className="flex bg-gray-100">
          <div className="w-80 border-r border-gray-200 bg-white rounded-2xl mr-4">
            <SearchResult
              searchText={searchText}
              onSelectWord={setSelectedWord}
            />
          </div>
          <div className="flex-1 overflow-auto bg-white rounded-2xl">
            <DetailWord wordId={selectedWord} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordResult;
