package com.chefmanager.util;

import com.chefmanager.model.InventoryItem;
import com.chefmanager.model.PayrollEntry;
import com.chefmanager.model.Sale;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    // ===================== CSV EXPORTS =====================
    public byte[] toCsvSales(List<Sale> sales) {
        StringBuilder sb = new StringBuilder("ID,Cliente,Total,Fecha\n");
        for (Sale s : sales) {
            sb.append(s.getId()).append(",")
                    .append(escape(s.getCustomer())).append(",")
                    .append(s.getTotal()).append(",")
                    .append(s.getCreatedAt()).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] toCsvInventory(List<InventoryItem> items) {
        StringBuilder sb = new StringBuilder("ID,SKU,Nombre,Cantidad,Precio\n");
        for (InventoryItem i : items) {
            sb.append(i.getId()).append(",")
                    .append(escape(i.getSku())).append(",")
                    .append(escape(i.getName())).append(",")
                    .append(i.getQuantity()).append(",")
                    .append(i.getPrice()).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] toCsvPayroll(List<PayrollEntry> payrolls) {
        StringBuilder sb = new StringBuilder("ID,Empleado,Inicio,Fin,Sueldo Bruto,Sueldo Neto\n");
        for (PayrollEntry p : payrolls) {
            sb.append(p.getId()).append(",")
                    .append(escape(p.getEmployeeName())).append(",")
                    .append(p.getPeriodStart()).append(",")
                    .append(p.getPeriodEnd()).append(",")
                    .append(p.getGrossPay()).append(",")
                    .append(p.getNetPay()).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escape(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    // ===================== PDF EXPORTS =====================

    public byte[] toPdfSales(List<Sale> sales) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        document.open();

        document.add(new Paragraph("Reporte de Ventas",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        document.add(new Paragraph("Generado: " +
                java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        addHeader(table, "ID", "Cliente", "Total", "Fecha");

        double totalGeneral = 0;
        for (Sale s : sales) {
            addRow(table, String.valueOf(s.getId()),
                    s.getCustomer(),
                    String.format("$%.2f", s.getTotal()),
                    s.getCreatedAt().toString());
            totalGeneral += s.getTotal() != null ? s.getTotal() : 0;
        }

        PdfPCell totalCell = new PdfPCell(new Phrase("TOTAL GENERAL: $" + String.format("%.2f", totalGeneral)));
        totalCell.setColspan(4);
        totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(totalCell);

        document.add(table);
        document.close();
        return baos.toByteArray();
    }

    public byte[] toPdfInventory(List<InventoryItem> items) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        doc.add(new Paragraph("Reporte de Inventario", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        doc.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        addHeader(table, "ID", "SKU", "Nombre", "Cantidad", "Precio Unitario");

        double totalValor = 0;
        for (InventoryItem i : items) {
            double valor = (i.getQuantity() != null && i.getPrice() != null)
                    ? i.getQuantity() * i.getPrice() : 0;
            addRow(table,
                    String.valueOf(i.getId()),
                    i.getSku(),
                    i.getName(),
                    String.valueOf(i.getQuantity()),
                    String.format("$%.2f", i.getPrice()));
            totalValor += valor;
        }

        PdfPCell totalCell = new PdfPCell(new Phrase("VALOR TOTAL DE INVENTARIO: $" + String.format("%.2f", totalValor)));
        totalCell.setColspan(5);
        totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(totalCell);

        doc.add(table);
        doc.close();
        return baos.toByteArray();
    }

    public byte[] toPdfPayroll(List<PayrollEntry> payrolls) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        doc.add(new Paragraph("Reporte de Nómina", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        doc.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        addHeader(table, "ID", "Empleado", "Inicio", "Fin", "Bruto", "Neto");

        double totalBruto = 0, totalNeto = 0;
        for (PayrollEntry p : payrolls) {
            addRow(table,
                    String.valueOf(p.getId()),
                    p.getEmployeeName(),
                    p.getPeriodStart() != null ? p.getPeriodStart().toString() : "",
                    p.getPeriodEnd() != null ? p.getPeriodEnd().toString() : "",
                    String.format("$%.2f", p.getGrossPay()),
                    String.format("$%.2f", p.getNetPay()));

            totalBruto += p.getGrossPay() != null ? p.getGrossPay() : 0;
            totalNeto += p.getNetPay() != null ? p.getNetPay() : 0;
        }

        PdfPCell totalCell = new PdfPCell(
                new Phrase(String.format("TOTALES → Bruto: $%.2f   Neto: $%.2f", totalBruto, totalNeto)));
        totalCell.setColspan(6);
        totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(totalCell);

        doc.add(table);
        doc.close();
        return baos.toByteArray();
    }

    // ===================== UTILIDADES =====================
    private void addHeader(PdfPTable table, String... headers) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(new java.awt.Color(220, 220, 220));
            table.addCell(cell);
        }
    }

    private void addRow(PdfPTable table, String... values) {
        for (String v : values) {
            PdfPCell cell = new PdfPCell(new Phrase(v));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }
}

