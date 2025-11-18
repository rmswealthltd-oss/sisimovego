/**
 * Create & trigger browser download for text/blob.
 */
export function downloadFile(
  filename: string,
  content: string | Blob,
  mime = "text/plain"
) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mime });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 500);
}

/**
 * Direct blob download.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 500);
}

/* ------------------------------------------------------------------ */
/* 📄 CSV EXPORT */
/* ------------------------------------------------------------------ */

export function exportCSV(filename: string, rows: any[]) {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]).join(",");
  const data = rows
    .map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const csv = `${headers}\n${data}`;
  downloadFile(filename, csv, "text/csv");
}

/* ------------------------------------------------------------------ */
/* 📊 EXCEL EXPORT (XLSX) */
/* ------------------------------------------------------------------ */

import * as XLSX from "xlsx";

export function exportExcel(filename: string, rows: any[]) {
  const sheet = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, "Sheet1");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadBlob(blob, filename);
}

/* ------------------------------------------------------------------ */
/* 🧾 PDF EXPORT (jsPDF) */
/* ------------------------------------------------------------------ */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPDF(filename: string, rows: any[]) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const headers = [Object.keys(rows[0])];
  const body = rows.map((r) => Object.values(r));

  autoTable(pdf, {
    head: headers,
    body,
    startY: 40,
    margin: 20,
    styles: { fontSize: 10 },
  });

  pdf.save(filename);
}

/* ------------------------------------------------------------------ */
/* 🧬 JSON EXPORT */
/* ------------------------------------------------------------------ */

export function exportJSON(filename: string, data: any) {
  downloadFile(filename, JSON.stringify(data, null, 2), "application/json");
}
