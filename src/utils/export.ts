import Papa from "papaparse";

export const exportAsCSV = (filename: string, data: any[], fields?: string[]) => {
  const csv = Papa.unparse({
    fields,
    data,
  });
  const blob = new Blob([csv]);
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}