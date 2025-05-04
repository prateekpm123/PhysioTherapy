import React, { useRef } from "react";
import { iExcerciseData } from "../models/ExcerciseInterface";
import { PDFExcerciseView1 } from "./PDFExcerciseView1";
import { PDFGeneration } from "./PDFGeneration";

export interface iPDFPreview {
  plannerList: iExcerciseData[];
}

export const PDFPreview = ({ plannerList }: iPDFPreview) => {
  const previewPageRef = useRef<HTMLDivElement>(null);

  const onGeneratePDFClick = () => {
    if (previewPageRef.current) {
      const pdfGenerator = () => PDFGeneration(previewPageRef as React.RefObject<HTMLDivElement>);
      pdfGenerator();
    }
  };

  return (
    <div className="w-full h-full p-10" >
      {/* PDF Body */}
      <div ref={previewPageRef} style={{ height: "95%" }} className="w-full overflow-scroll overflow-y-scroll">
        {plannerList.map((excercise: iExcerciseData, index: number) => (
          <PDFExcerciseView1 key={index} {...excercise}></PDFExcerciseView1>
        ))}
      </div>
      <button
        className="bg-slate-800 p-2 rounded-md w-full m-1 justify-end sticky text-slate-100"
        onClick={onGeneratePDFClick}
      >
        Generate PDF
      </button>
    </div>
  );
};
