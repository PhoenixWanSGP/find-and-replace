import React, { ChangeEvent } from "react";
import { ReplaceParams } from "@/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ReplaceComponentProps {
  replaceParams: ReplaceParams;
  onReplace: (params: ReplaceParams, replaceAll: boolean) => void;
  onUpdateReplaceParams: (newParams: Partial<ReplaceParams>) => void;
}

const ReplaceComponent: React.FC<ReplaceComponentProps> = ({
  replaceParams,
  onReplace,
  onUpdateReplaceParams,
}) => {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onUpdateReplaceParams({ newValue: event.target.value });
  };

  const handleReplace = () => {
    onReplace(replaceParams, false);
  };

  const handleReplaceAll = () => {
    onReplace({ ...replaceParams, nodeId: "" }, true);
  };

  return (
    <div className="w-full flex flex-col justify-center ml-2 mt-1">
      <Input
        className=" w-96 flex justify-center"
        placeholder="Enter replacement text..."
        value={replaceParams.newValue}
        onChange={handleTextChange}
      />
      <div className="flex w-full justify-end max-w-sm space-x-2 mt-2">
        <Button
          className="w-24 border-2 border-blue-500 text-blue-500"
          variant="outline"
          onClick={handleReplace}
        >
          Replace
        </Button>
        <Button
          className="w-24 bg-blue-500 text-white hover:bg-blue-700"
          onClick={handleReplaceAll}
        >
          Replace all
        </Button>
      </div>
    </div>
  );
};

export default ReplaceComponent;
