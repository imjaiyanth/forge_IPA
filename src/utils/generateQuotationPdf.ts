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

export async function generateQuotationPdf(data: QuotationData) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const halfWidth = contentWidth / 2;
    let y = 15;

    const fmt = (n: number) =>
        "$ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    /* ───────────── HEADER LOGO & ADDRESS ───────────── */
    try {
        const logoUrl = "/j3m_logo.png";
        const imgBytes = await fetch(logoUrl).then((res) => {
             if (!res.ok) throw new Error("Logo not found");
             return res.arrayBuffer();
        });
        const logoUint8 = new Uint8Array(imgBytes);
        
        // Add logo (Left) - Adjust dimensions as needed (approx ratio 3:1 based on file size/shape, assuming landscape logo)
        // Logo width approx 50mm
        doc.addImage(logoUint8, "PNG", margin, 10, 50, 15); 
    } catch (err) {
        console.error("Failed to load logo", err);
        // Fallback text if logo fails
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("J3M FABRICATION LLC", margin, 20);
    }

    // Address (Right)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const companyName = "J3M Fabrication LLC";
    const addressLine = "Houston, Texas, US";
    
    // Right align relative to contentWidth + margin
    const rightX = pageWidth - margin;
    
    doc.text(companyName, rightX, 15, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(addressLine, rightX, 20, { align: "right" });
    
    // Move Y down after header
    y = 35;

    /* ───────────── DETAILS TABLE ───────────── */
    autoTable(doc, {
        startY: y,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0],
            valign: "top"
        },
        columnStyles: {
            0: { cellWidth: halfWidth },
            1: { cellWidth: halfWidth },
        },
        body: [
            // We pass empty content here because we will draw it manually in didDrawCell
            // to support mixed bold/normal text.
            ["", ""], 
            ["", ""]
        ],
        didDrawCell: (hookData) => {
            if (hookData.section === 'body') {
                // RESET TEXT COLOR TO BLACK FOR MANUAL DRAWING
                doc.setTextColor(0, 0, 0);

                const cellX = hookData.cell.x + 3; // + padding
                let cellY = hookData.cell.y + 3; // Start tighter to top
                
                doc.setFontSize(9);
                const lineHeight = 5;

                // Row 1: To / Prepared By
                if (hookData.row.index === 0) {
                    if (hookData.column.index === 0) {
                        // Left Cell: To
                        doc.setFont("helvetica", "bold");
                        doc.text("To", cellX, cellY);
                        cellY += lineHeight;
                        
                        doc.setFont("helvetica", "normal");
                        // Company Name
                        doc.text(data.clientName || "(Company Name Here)", cellX, cellY);
                        cellY += lineHeight;

                        // POC
                        doc.setFont("helvetica", "bold");
                        doc.text("POC:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.clientPoc || "(Contact Person Name)", cellX + 10, cellY); 
                        cellY += lineHeight;

                        // Email
                        doc.setFont("helvetica", "bold");
                        doc.text("Email:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.clientEmail || "(N/A)", cellX + 12, cellY);
                        cellY += lineHeight;

                        // Phone
                        doc.setFont("helvetica", "bold");
                        doc.text("Phone:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.clientPhone || "(N/A)", cellX + 13, cellY);
                    } else {
                        // Right Cell: Prepared By
                        doc.setFont("helvetica", "bold");
                        doc.text("Prepared By", cellX, cellY);
                        cellY += lineHeight;
                        
                        doc.setFont("helvetica", "normal");
                        doc.text(data.companyName || "J3M Fabrication LLC", cellX, cellY);
                        cellY += lineHeight;

                        // POC
                        doc.setFont("helvetica", "bold");
                        doc.text("POC:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.companyPoc || "TPS_Admin | Sales Engineer", cellX + 10, cellY);
                        cellY += lineHeight;

                        // Email
                        doc.setFont("helvetica", "bold");
                        doc.text("Email:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.companyEmail || "admin@j3mfabrication.com", cellX + 12, cellY);
                        cellY += lineHeight;

                        // Phone
                        doc.setFont("helvetica", "bold");
                        doc.text("Phone:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.companyPhone || "480-900-8401", cellX + 13, cellY);
                    }
                }
                // Row 2: Proposal Info
                else if (hookData.row.index === 1) {
                     // Reset Y for row 2 to optimize vertical centering
                     cellY = hookData.cell.y + 4;

                     if (hookData.column.index === 0) {
                        // Proposal No
                        doc.setFont("helvetica", "bold");
                        doc.text("Proposal No:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.proposalNo || "TPS_23XXX", cellX + 22, cellY);
                        cellY += lineHeight;

                        // Project
                        doc.setFont("helvetica", "bold");
                        doc.text("Project:", cellX, cellY);
                        doc.setFont("helvetica", "normal");
                        doc.text(data.projectName || "PROJECT NAME", cellX + 14, cellY);

                     } else {
                        // Right align calculations
                        const cellRightX = hookData.cell.x + hookData.cell.width - 3;
                        
                        // Valid Until
                        doc.setFont("helvetica", "normal");
                        const validText = data.validThru || "MM/DD/YYYY";
                        doc.text(validText, cellRightX, cellY + lineHeight, { align: "right" });
                        
                        doc.setFont("helvetica", "bold");
                        const validLabel = "Valid Until: ";
                        doc.text(validLabel, cellRightX - doc.getTextWidth(validText) - 1, cellY + lineHeight, { align: "right" });

                        // Proposal Date (Above Valid Until)
                        doc.setFont("helvetica", "normal");
                        const dateText = data.proposalDate || "MM/DD/YYYY";
                        doc.text(dateText, cellRightX, cellY, { align: "right" });
                        
                        doc.setFont("helvetica", "bold");
                        const dateLabel = "Proposal Date: ";
                        doc.text(dateLabel, cellRightX - doc.getTextWidth(dateText) - 1, cellY, { align: "right" });
                     }
                }
            }
        },
        // Force row height to accommodate the manual text
        willDrawCell: (hookData) => {
            if (hookData.section === 'body') {
                 if (hookData.row.index === 0) {
                    hookData.row.height = 36; // Reduced height to remove gap
                 } else if (hookData.row.index === 1) {
                    hookData.row.height = 15; // Compact height for Proposal details
                 }
            }
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [255, 255, 255], // Hide the placeholder text (newlines)
            valign: "top",
            overflow: "visible" 
        },
        body: [
             // Body with spaces to force some height calculation if minHeight fails, 
             // but minHeight is key.
             ["\n\n\n\n\n\n", "\n\n\n\n\n\n"], 
             ["\n\n", "\n\n"]
        ],
        theme: 'grid'
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

    /* ───────────── 2. NOTES ───────────── */
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. Notes:", margin, y);
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
