import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Brand colors — Manual de Imagen Corporativo
const NAVY = [44, 61, 105];  // #2C3D69
const GOLD = [251, 198, 0];  // #ECBF26
const IVA = 0.19;
const M = 13; // page margin

const fmt = (val) => `USD ${Number(val).toFixed(2)}`;

export const parseDimensions = (dimensions) => {
  if (!dimensions || dimensions.includes("_")) return null;
  const parts = dimensions.split(" x ");
  if (parts.length !== 3) return null;
  const [w, l, h] = parts.map(parseFloat);
  if (isNaN(w) || isNaN(l) || isNaN(h)) return null;
  return { width: w, length: l, height: h, volume: +(w * l * h).toFixed(6) };
};

const drawHeader = (doc, logoBase64) => {
  const pageW = doc.internal.pageSize.getWidth();

  // Top navy accent bar
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 4, "F");

  const LOGO_X = M, LOGO_Y = 8, LOGO_W = 62, LOGO_H = 47;
  const INFO_X = M + LOGO_W + 5;
  const INFO_W = pageW - INFO_X - M;
  const INFO_CX = INFO_X + INFO_W / 2;

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
  }

  // Company info box
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.5);
  doc.rect(INFO_X, LOGO_Y, INFO_W, LOGO_H);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("GOLD CARGO SAS", INFO_CX, LOGO_Y + 7, { align: "center" });

  // NIT line — mixed bold/normal
  doc.setFontSize(8.5);
  doc.setTextColor(...NAVY);
  const nitPrefix = "NIT: 900412076-2  |  ";
  const nitSuffix = "Régimen simple";
  doc.setFont("helvetica", "normal");
  const w1 = doc.getTextWidth(nitPrefix);
  doc.setFont("helvetica", "bold");
  const w2 = doc.getTextWidth(nitSuffix);
  const nitX = INFO_CX - (w1 + w2) / 2;
  doc.setFont("helvetica", "normal");
  doc.text(nitPrefix, nitX, LOGO_Y + 13);
  doc.setFont("helvetica", "bold");
  doc.text(nitSuffix, nitX + w1, LOGO_Y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text("Antioquia / Envigado / Calle 36D Sur # 27 D 166 Int 116", INFO_CX, LOGO_Y + 19, { align: "center" });
  doc.text("Teléfonos: 3167465762", INFO_CX, LOGO_Y + 24, { align: "center" });
  doc.text("Email: gerencia@goldcargo.com.co", INFO_CX, LOGO_Y + 29, { align: "center" });
  doc.text("Página web: www.goldcargo.com.co", INFO_CX, LOGO_Y + 34, { align: "center" });

  // Gold divider
  const divY = LOGO_Y + LOGO_H + 5;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(M, divY, pageW - M, divY);

  return divY;
};

const drawDocTitle = (doc, divY) => {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("COTIZACIÓN DE CARGA", pageW / 2, divY + 8, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, pageW / 2, divY + 14, { align: "center" });

  return divY + 22;
};

const drawShipmentTable = (doc, quoteData, startY) => {
  const isLcl = quoteData.selectedLoadType.value === "lcl";

  const rows = [
    ["Origen (POL)", quoteData.selectedOriginPort ?? "-"],
    ["Destino", quoteData.selectedDestinationPort?.name ?? "-"],
    ["Tipo de Carga", quoteData.selectedLoadType?.name ?? "-"],
  ];

  if (isLcl) {
    const dims = parseDimensions(quoteData.dimensions);
    rows.push(["Peso", `${(Number(quoteData.weight) / 1000).toFixed(3)} toneladas`]);
    if (dims) {
      rows.push(["Dimensiones (m)", quoteData.dimensions]);
      rows.push(["Volumen", `${dims.volume.toFixed(3)} m³`]);
    }
  } else {
    rows.push(["Tipo de Contenedor", quoteData.selectedContainerType?.name ?? "-"]);
    rows.push(["Peso", `${(Number(quoteData.weight) / 1000).toFixed(3)} toneladas`]);
  }

  const extras = [];
  if (quoteData.loadEnsurance) extras.push("Seguro de Carga");
  if (quoteData.originPickup) extras.push("Recogida en Origen");
  if (quoteData.destinationDelivery) extras.push("Entrega en Destino");
  if (extras.length) rows.push(["Servicios Adicionales", extras.join(", ")]);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Información del Envío", M, startY);

  autoTable(doc, {
    startY: startY + 4,
    head: [["Campo", "Detalle"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [235, 240, 250] },
    styles: { fontSize: 9, textColor: [30, 30, 30] },
    margin: { left: M, right: M },
  });

  return doc.lastAutoTable.finalY;
};

const drawFclCostTable = (doc, quoteData, income, fclFlete, startY) => {
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Cálculo de la Cotización (FCL)", M, startY);

  const rows = [];
  let grandTotal = 0;

  // Flete — no IVA
  const containerName = quoteData.selectedContainerType?.name ?? "-";
  if (fclFlete != null) {
    rows.push([`Flete (Contenedor ${containerName})`, fmt(fclFlete), "-", fmt(fclFlete)]);
    grandTotal += fclFlete;
  } else {
    rows.push([`Flete (Contenedor ${containerName})`, "No disponible", "-", "-"]);
  }

  const fees = [
    { label: "Emisión BL",        base: Number(income.emisionEnDestinoBL) || 0 },
    { label: "Gastos en Destino", base: Number(income.gastosEnDestino) || 0 },
    { label: "Radicación BL",     base: Number(income.radicacionBL) || 0 },
  ];

  for (const fee of fees) {
    const iva = fee.base * IVA;
    const total = fee.base + iva;
    grandTotal += total;
    rows.push([fee.label, fmt(fee.base), fmt(iva), fmt(total)]);
  }

  rows.push([
    { content: "TOTAL", styles: { fontStyle: "bold", textColor: [255, 255, 255], fillColor: NAVY } },
    { content: "", styles: { fillColor: NAVY } },
    { content: "", styles: { fillColor: NAVY } },
    { content: fmt(grandTotal), styles: { fontStyle: "bold", textColor: [...NAVY], fillColor: GOLD } },
  ]);

  autoTable(doc, {
    startY: startY + 4,
    head: [["Concepto", "Base (USD)", "IVA 19%", "Total (USD)"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [235, 240, 250] },
    styles: { fontSize: 9, textColor: [30, 30, 30] },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40 }, 2: { cellWidth: 30 }, 3: { cellWidth: 35 } },
    margin: { left: M, right: M },
  });

  const afterY = doc.lastAutoTable.finalY + 9;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("TOTAL COTIZACIÓN:", pageW / 2 - 2, afterY, { align: "right" });
  doc.setTextColor(...GOLD);
  doc.text(fmt(grandTotal), pageW / 2 + 1, afterY, { align: "left" });
};

const drawCostTable = (doc, quoteData, income, mwRate, minima, startY) => {
  const pageW = doc.internal.pageSize.getWidth();
  const dims = parseDimensions(quoteData.dimensions);
  const pesoTons = Number(quoteData.weight) / 1000;
  const volumenM3 = dims ? dims.volume : 0;
  const ganaPeso = pesoTons >= volumenM3;
  const winner = ganaPeso ? pesoTons : volumenM3;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Cálculo de la Cotización (LCL)", M, startY);

  const rows = [];
  let totalBase = 0;
  let totalIva = 0;
  let totalGrand = 0;

  if (mwRate !== null) {
    const mw = Number(mwRate);
    const min = minima !== null ? Number(minima) : 0;
    const fleteCalc = winner * mw;
    const fleteBase = min > 0 ? Math.max(fleteCalc, min) : fleteCalc;
    const usedMinima = min > 0 && fleteCalc < min;

    const fleteDesc = usedMinima
      ? `Mínima: ${winner.toFixed(3)} × USD ${mw.toFixed(2)} = USD ${fleteCalc.toFixed(2)} < Mín USD ${min.toFixed(2)}`
      : `${winner.toFixed(3)} × USD ${mw.toFixed(2)}`;

    rows.push([`Flete`, fleteDesc, "-", fmt(fleteBase)]);
    totalBase += fleteBase;
    totalGrand += fleteBase;
  } else {
    rows.push(["Flete", "Tarifa W/M no disponible para este origen", "-", "-"]);
  }

  const fees = [
    { label: "Radicación del BL", base: Number(income.radicacionBL) || 0 },
    { label: "Gastos en Destino", base: Number(income.gastosEnDestino) || 0 },
    { label: "Collect Fee", base: Number(income.collectFee) || 0 },
    { label: "Emisión en Destino BL", base: Number(income.emisionEnDestinoBL) || 0 },
  ];

  for (const fee of fees) {
    const iva = fee.base * IVA;
    const total = fee.base + iva;
    totalBase += fee.base;
    totalIva += iva;
    totalGrand += total;
    rows.push([fee.label, fmt(fee.base), fmt(iva), fmt(total)]);
  }

  rows.push([
    { content: "TOTAL", styles: { fontStyle: "bold", textColor: [255, 255, 255], fillColor: NAVY } },
    { content: fmt(totalBase), styles: { fontStyle: "bold", textColor: [255, 255, 255], fillColor: NAVY } },
    { content: fmt(totalIva), styles: { fontStyle: "bold", textColor: [255, 255, 255], fillColor: NAVY } },
    { content: fmt(totalGrand), styles: { fontStyle: "bold", textColor: [...NAVY], fillColor: GOLD } },
  ]);

  autoTable(doc, {
    startY: startY + 4,
    head: [["Concepto", "Cálculo / Base (USD)", "IVA 19%", "Total (USD)"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [235, 240, 250] },
    styles: { fontSize: 9, textColor: [30, 30, 30] },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 80 }, 2: { cellWidth: 25 }, 3: { cellWidth: 30 } },
    margin: { left: M, right: M },
  });

  const afterY = doc.lastAutoTable.finalY + 9;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("TOTAL COTIZACIÓN:", pageW / 2 - 2, afterY, { align: "right" });
  doc.setTextColor(...GOLD);
  doc.text(fmt(totalGrand), pageW / 2 + 1, afterY, { align: "left" });
};

const drawWarningCallout = (doc, startY) => {
  const pageW = doc.internal.pageSize.getWidth();
  const boxX = M;
  const boxW = pageW - M * 2;
  const padding = 4;
  const iconW = 8;
  const msg =
    "Los servicios adicionales preseleccionados no se encuentran incluidos en la cotización generada. " +
    "Nuestro equipo comercial se comunicará con usted a la brevedad posible para informarle el costo de dichos servicios.";

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(msg, boxW - padding * 2 - iconW);
  const lineH = 4.5;
  const boxH = lines.length * lineH + padding * 2;

  // Background
  doc.setFillColor(255, 248, 220);
  doc.roundedRect(boxX, startY, boxW, boxH, 2, 2, "F");

  // Left accent bar (gold)
  doc.setFillColor(...GOLD);
  doc.roundedRect(boxX, startY, 3, boxH, 1, 1, "F");

  // Border
  doc.setDrawColor(220, 170, 0);
  doc.setLineWidth(0.4);
  doc.roundedRect(boxX, startY, boxW, boxH, 2, 2, "S");

  // Warning icon (triangle ⚠)
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 120, 0);
  doc.text("!", boxX + 3 + 3, startY + padding + lineH * 0.9, { align: "center" });

  // Message text
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 70, 0);
  doc.text(lines, boxX + padding + iconW, startY + padding + lineH * 0.8);

  return startY + boxH;
};

const drawFooter = (doc) => {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFillColor(...NAVY);
  doc.rect(0, pageH - 9, pageW, 9, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, pageH - 9, 28, 4, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(210, 210, 210);
  doc.text(
    "Valores en USD. IVA 19% aplica sobre gastos en destino.  |  Esta cotización es un estimado y puede variar.",
    pageW / 2,
    pageH - 2.5,
    { align: "center" }
  );
};

/**
 * Builds and downloads the quote PDF.
 * @param {object} quoteData     - Shipment fields from the quote store
 * @param {object} income        - Destination fees from the /income API
 * @param {number|null} mwRate   - W/M rate from the LCL rates table
 * @param {number|null} minima   - Minimum charge from the LCL rates table
 * @param {number|null} fclFlete - Flete from the FCL rates table (flete20 or flete40)
 * @param {string|null} logoBase64 - Company logo as a data URL
 */
export const buildQuotePdf = (quoteData, income, mwRate, minima, fclFlete, logoBase64) => {
  const doc = new jsPDF();
  const isLcl = quoteData.selectedLoadType.value === "lcl";

  const divY = drawHeader(doc, logoBase64);
  const contentY = drawDocTitle(doc, divY);
  const afterShipY = drawShipmentTable(doc, quoteData, contentY);

  let lastY = afterShipY;
  if (isLcl) {
    drawCostTable(doc, quoteData, income, mwRate, minima, afterShipY + 9);
    lastY = doc.lastAutoTable.finalY + 18;
  } else {
    drawFclCostTable(doc, quoteData, income, fclFlete, afterShipY + 9);
    lastY = doc.lastAutoTable.finalY + 18;
  }

  const hasExtras = quoteData.loadEnsurance || quoteData.originPickup || quoteData.destinationDelivery;
  if (hasExtras) {
    drawWarningCallout(doc, lastY + 6);
  }

  drawFooter(doc);

  const prefix = isLcl ? "LCL" : "FCL";
  doc.save(`${prefix}_Cotizacion_GoldCargo_${new Date().toISOString().slice(0, 10)}.pdf`);
};
