// src/components/ui/SearchInput.tsx
import React, { ChangeEvent, KeyboardEvent } from "react";
import { SearchParams } from "@/types"; // Ensure the paths are correct
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchInputProps {
  searchParams: SearchParams;
  onSearch: () => void;
  onUpdateSearchParams: (newParams: Partial<SearchParams>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchParams,
  onSearch,
  onUpdateSearchParams,
}) => {
  const { query, type, caseSensitive, matchWholeWord } = searchParams;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type: inputType } = event.target;
    onUpdateSearchParams({
      ...searchParams,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div>
      <div className="flex w-full justify-center max-w-sm space-x-2 m-1">
        <Input
          className="w-72"
          placeholder={`Enter your ${type} term...`}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          name="query"
        />
        <Button
          className="w-24 bg-blue-500 text-white hover:bg-blue-700"
          onClick={onSearch}
        >
          Find next
        </Button>
      </div>

      <div className="flex justify-start w-full max-w-sm space-x-8 mt-2 mb-2 pl-3">
        <div className="flex justify-start space-x-1">
          <input
            type="checkbox"
            id="caseSensitiveCheckbox"
            checked={caseSensitive}
            onChange={handleChange}
            name="caseSensitive"
            className="form-checkbox w-4 h-4"
          />
          <label
            htmlFor="caseSensitiveCheckbox"
            className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Case sensitive
          </label>
        </div>

        <div className="flex justify-start space-x-1">
          <input
            type="checkbox"
            id="matchWholeWordCheckbox"
            checked={matchWholeWord}
            onChange={handleChange}
            name="matchWholeWord"
            className="form-checkbox w-4 h-4"
          />
          <label
            htmlFor="matchWholeWordCheckbox"
            className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Match whole words
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
