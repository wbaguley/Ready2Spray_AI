import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { APP_TITLE } from "@/const";

interface AuditLogData {
  id: number;
  userName?: string | null;
  action: string;
  entityType: string;
  entityId: number | null;
  changes?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string | Date;
}

export function exportAuditLogsToCSV(logs: any[]) {
  const headers = [
    "ID",
    "User",
    "Action",
    "Entity Type",
    "Entity ID",
    "Changes",
    "IP Address",
    "User Agent",
    "Timestamp",
  ];

  const rows = logs.map((log) => [
    log.id,
    log.userName || "Unknown",
    log.action,
    log.entityType,
    log.entityId,
    log.changes ? formatChangesForCSV(String(log.changes)) : "",
    log.ipAddress || "",
    log.userAgent || "",
    new Date(log.createdAt).toLocaleString(),
  ]);

  // Escape CSV fields
  const escapeCsvField = (field: any) => {
    const str = String(field);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCsvField).join(","),
    ...rows.map((row) => row.map(escapeCsvField).join(",")),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `Audit-Log-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAuditLogsToPDF(logs: any[]) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241); // Primary color
  doc.text(APP_TITLE, 14, 15);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Audit Log Report", 14, 23);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 29);
  doc.text(`Total Records: ${logs.length}`, 14, 34);

  // Prepare table data
  const tableData = logs.map((log) => [
    log.id.toString(),
    log.userName || "Unknown",
    log.action.toUpperCase(),
    log.entityType,
    log.entityId.toString(),
    log.changes ? formatChangesForPDF(String(log.changes)) : "N/A",
    new Date(log.createdAt).toLocaleString(),
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["ID", "User", "Action", "Entity", "Entity ID", "Changes", "Timestamp"]],
    body: tableData,
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 80 },
      6: { cellWidth: 40 },
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${APP_TITLE} - Audit Log Report - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save(`Audit-Log-${new Date().toISOString().split("T")[0]}.pdf`);
}

function formatChangesForCSV(changes: string): string {
  try {
    const parsed = JSON.parse(changes);
    return JSON.stringify(parsed);
  } catch {
    return changes;
  }
}

function formatChangesForPDF(changes: string): string {
  try {
    const parsed = JSON.parse(changes);
    if (parsed.created) {
      return "Created new record";
    } else if (parsed.updated) {
      const fields = Object.keys(parsed.updated);
      return `Updated: ${fields.slice(0, 3).join(", ")}${fields.length > 3 ? "..." : ""}`;
    } else if (parsed.deleted) {
      return "Deleted record";
    } else if (parsed.before && parsed.after) {
      return "Modified record";
    }
    return "Changed";
  } catch {
    return changes.substring(0, 50);
  }
}
