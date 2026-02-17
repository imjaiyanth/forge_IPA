import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface QuotationData {
    // To (Client)
    clientName: string;
    clientPoc: string;
    clientEmail: string;
    clientPhone: string;
    // Prepared By (Company)
    companyName: string;
    companyPoc: string;
    companyEmail: string;
    companyPhone: string;
    // Proposal
    proposalNo: string;
    proposalDate: string;
    projectName: string;
    validThru: string;
    // Items
    items: {
        description: string;
        unitPrice: number;
        quantity: number;
        totalPrice: number;
    }[];
    // Schedule
    schedule: {
        description: string;
        date: string;
    }[];
    // Notes
    notes: string[];
}

export function generateQuotationPdf(data: QuotationData) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const halfWidth = contentWidth / 2;
    let y = 15;

    const fmt = (n: number) =>
        "$ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    /* ───────────── HEADER TABLE (To / Prepared By) ───────────── */
    const headerRows = [
        [{ content: "To", styles: { fontStyle: "bold" as const } }, { content: "Prepared By", styles: { fontStyle: "bold" as const } }],
        [data.clientName ? `(${data.clientName})` : "(Company Name Here)", data.companyName || "Tier Power Systems LLC"],
        [`POC: (${data.clientPoc || "Contact Person Name"})`, `POC: (${data.companyPoc || "Logged In person Name"}) | (Their Position)`],
        [`Email: (${data.clientEmail || "ClientEmail@clientemail.com"})`, `Email: (${data.companyEmail || "TPSEmail@TPSemail.com"})`],
        [`Phone: (${data.clientPhone || "+91 999999999999"})`, `Phone: (${data.companyPhone || "+91 999999999999"})`],
    ];

    autoTable(doc, {
        startY: y,
        body: headerRows,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            textColor: [0, 0, 0],
        },
        columnStyles: {
            0: { cellWidth: halfWidth },
            1: { cellWidth: halfWidth },
        },
        didParseCell: (data) => {
            if (data.row.index === 0) {
                data.cell.styles.fontStyle = "bold";
                data.cell.styles.fillColor = [255, 255, 255];
            }
        },
    });

    y = (doc as any).lastAutoTable.finalY + 4;

    /* ───────────── PROPOSAL INFO TABLE ───────────── */
    autoTable(doc, {
        startY: y,
        body: [
            [
                { content: `Proposal No : ${data.proposalNo || "TPS Proposal 23XXX"}`, styles: { fontStyle: "bold" as const } },
                { content: `Proposal Date: ${data.proposalDate || "(Document Created date/Today)"}`, styles: { fontStyle: "bold" as const } },
            ],
            [
                { content: `Project : ${data.projectName || "NAME"}`, styles: { fontStyle: "bold" as const } },
                { content: `Valid Thru : ${data.validThru || "DD/MM/YYYY (15 days from abv. date)"}`, styles: { fontStyle: "bold" as const } },
            ],
        ],
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            textColor: [0, 0, 0],
        },
        columnStyles: {
            0: { cellWidth: halfWidth },
            1: { cellWidth: halfWidth },
        },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    /* ───────────── 1. SUMMARY ───────────── */
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("1. Summary :", margin, y);
    y += 5;

    // Build item rows
    const itemRows = data.items.map((item, i) => [
        (i + 1).toString(),
        item.description || `Item - ${i + 1}`,
        fmt(item.unitPrice),
        item.quantity.toString(),
        fmt(item.totalPrice),
    ]);

    const grandTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);

    // Add Grand Total row
    itemRows.push([
        { content: "Grand Total", colSpan: 4, styles: { fontStyle: "bold" as const, halign: "left" as const } } as any,
        { content: fmt(grandTotal), styles: { fontStyle: "bold" as const } } as any,
    ]);

    autoTable(doc, {
        startY: y,
        head: [["#", "Description", "Unit  Price", "Quantity", "Total  Price"]],
        body: itemRows,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 2.5,
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [80, 80, 80],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        columnStyles: {
            0: { cellWidth: 15, halign: "center" },
            1: { cellWidth: 65 },
            2: { cellWidth: 35, halign: "right" },
            3: { cellWidth: 25, halign: "center" },
            4: { cellWidth: 42, halign: "right" },
        },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    /* ───────────── 2. PROJECT SCHEDULE & COMMERCIAL NOTES ───────────── */
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. Project Schedule & Commercial Notes:", margin, y);
    y += 5;

    const scheduleRows =
        data.schedule.length > 0
            ? data.schedule.map((s, i) => [(i + 1).toString(), s.description, s.date])
            : [
                ["1", "PO release date", "11/15/2025"],
                ["2", "Long lead submittal issued to client", "11/21/2025"],
                ["3", "Client approved long lead submittal", "11/28/2025"],
                ["4", "Approval Drawings issued to client", "12/12/2025"],
                ["5", "Client returning approval drawings", "12/19/2025"],
                ["6", "Shipment date", "4/24/2026"],
            ];

    autoTable(doc, {
        startY: y,
        head: [["S.No.", "Description", "Start Up Services"]],
        body: scheduleRows,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 2.5,
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [80, 80, 80],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        columnStyles: {
            0: { cellWidth: 20, halign: "center" },
            1: { cellWidth: 105 },
            2: { cellWidth: 57, halign: "right" },
        },
    });

    y = (doc as any).lastAutoTable.finalY + 4;

    /* ───────────── NOTES SECTION ───────────── */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const defaultNotes = [
        "· Commodity Price Escalation Clause: In the event of an increase in the costs of copper and sheet metal exceeding 8% from one year to the next, an additional charge will be applied. This additional charge, or \"adder,\" will be calculated based on the percentage increase above the 8% threshold.",
        "· Freight Not Included.",
        "· Every day not approved by client delays ship date by a minimum of one day.",
        "· Send purchase orders to email: TPS-SalesPM@TierPowerSystems.com",
    ];

    const notesArr = data.notes.length > 0 ? data.notes : defaultNotes;

    notesArr.forEach((note) => {
        const lines = doc.splitTextToSize(note, contentWidth);
        // Check if we need a new page
        if (y + lines.length * 4 > doc.internal.pageSize.getHeight() - 15) {
            doc.addPage();
            y = 15;
        }
        doc.text(lines, margin, y);
        y += lines.length * 3.5 + 1.5;
    });

    /* ───────────── SAVE ───────────── */
    const filename = `Quotation_${data.proposalNo || "Draft"}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
}
