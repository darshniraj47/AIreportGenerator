/**
 * exportHelpers.js — PDF & DOCX Export Utilities
 * ────────────────────────────────────────────────
 * Client-side export functions using jsPDF and docx libraries.
 * No backend endpoint required for exports.
 */

import { jsPDF } from 'jspdf';
import {
 Document,
 Packer,
 Paragraph,
 TextRun,
 HeadingLevel,
 AlignmentType,
 BorderStyle,
 PageBreak,
} from 'docx';
import { saveAs } from 'file-saver';

// ─── Shared Utilities ───────────────────────────────────────────────────────────

/**
 * Strip Markdown syntax from text for clean plain-text exports.
 * Keeps the text readable without rendering artifacts.
 */
const stripMarkdown = (text) => {
 return text
 .replace(/#{1,6}\s+/g, '') // headings
 .replace(/\*\*(.+?)\*\*/g, '$1') // bold
 .replace(/\*(.+?)\*/g, '$1') // italic
 .replace(/`(.+?)`/g, '$1') // inline code
 .replace(/```[\s\S]*?```/g, '') // code blocks
 .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
 .replace(/^[-*+]\s+/gm, '• ') // bullet points
 .replace(/^\d+\.\s+/gm, '') // numbered lists
 .replace(/^>\s+/gm, '') // blockquotes
 .replace(/---+/g, '─'.repeat(40)) // horizontal rules
 .replace(/\n{3,}/g, '\n\n') // excess newlines
 .trim();
};

/**
 * Generate a safe filename from topic and content type.
 */
const generateFilename = (topic, contentType) => {
 const safe = topic
 .toLowerCase()
 .replace(/[^a-z0-9\s]/g, '')
 .replace(/\s+/g, '_')
 .slice(0, 40);
 const ts = new Date().toISOString().slice(0, 10);
 return `${contentType}_${safe}_${ts}`;
};

// ─── PDF Export ─────────────────────────────────────────────────────────────────

/**
 * Export generated content as a PDF file.
 *
 * @param {string} content - Markdown or plain text content
 * @param {string} topic - Topic name (used in header and filename)
 * @param {string} contentType - Content type label
 * @param {string} tone - Tone label
 */
export const downloadAsPDF = (content, topic, contentType, tone) => {
 const doc = new jsPDF({
 orientation: 'portrait',
 unit: 'mm',
 format: 'a4',
 });

 const pageWidth = doc.internal.pageSize.getWidth();
 const pageHeight = doc.internal.pageSize.getHeight();
 const margin = 20;
 const maxWidth = pageWidth - margin * 2;

 // ── Header ──
 // Gradient-like header bar
 doc.setFillColor(99, 102, 241); // primary-500
 doc.rect(0, 0, pageWidth, 30, 'F');

 doc.setTextColor(255, 255, 255);
 doc.setFont('helvetica', 'bold');
 doc.setFontSize(14);
 doc.text('AI Report & Content Generator', margin, 12);

 doc.setFont('helvetica', 'normal');
 doc.setFontSize(9);
 doc.text(`${contentType} • Tone: ${tone} • Generated: ${new Date().toLocaleDateString()}`, margin, 22);

 // ── Topic Title ──
 doc.setTextColor(30, 30, 60);
 doc.setFont('helvetica', 'bold');
 doc.setFontSize(16);
 const titleLines = doc.splitTextToSize(topic, maxWidth);
 doc.text(titleLines, margin, 44);

 // ── Divider ──
 doc.setDrawColor(99, 102, 241);
 doc.setLineWidth(0.5);
 doc.line(margin, 50 + titleLines.length * 6, pageWidth - margin, 50 + titleLines.length * 6);

 // ── Content ──
 const plainContent = stripMarkdown(content);
 const lines = plainContent.split('\n');
 let y = 58 + titleLines.length * 6;

 doc.setFont('helvetica', 'normal');
 doc.setFontSize(10);
 doc.setTextColor(51, 51, 51);

 for (const line of lines) {
 if (!line.trim()) {
 y += 4; // blank line spacing
 continue;
 }

 // Detect section headers (lines ending with ':' or all-caps)
 const isHeader = line.startsWith('•') === false && line.length < 60 && (
 line.toUpperCase() === line || line.endsWith(':')
 );

 if (isHeader && line.length > 0) {
 doc.setFont('helvetica', 'bold');
 doc.setFontSize(11);
 doc.setTextColor(99, 102, 241);
 } else {
 doc.setFont('helvetica', 'normal');
 doc.setFontSize(10);
 doc.setTextColor(51, 51, 51);
 }

 const textLines = doc.splitTextToSize(line, maxWidth);

 for (const tLine of textLines) {
 if (y > pageHeight - 20) {
 // ── Footer on current page ──
 doc.setFont('helvetica', 'italic');
 doc.setFontSize(8);
 doc.setTextColor(150, 150, 150);
 doc.text(`AI Report Generator • Page ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

 doc.addPage();
 y = 20;

 // Reset styles for new page
 doc.setFont('helvetica', 'normal');
 doc.setFontSize(10);
 doc.setTextColor(51, 51, 51);
 }

 doc.text(tLine, margin, y);
 y += isHeader ? 7 : 5.5;
 }

 if (isHeader) y += 2;
 }

 // ── Footer on last page ──
 doc.setFont('helvetica', 'italic');
 doc.setFontSize(8);
 doc.setTextColor(150, 150, 150);
 doc.text(
 `AI Report Generator • Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
 pageWidth / 2,
 pageHeight - 10,
 { align: 'center' }
 );

 // ── Save ──
 const filename = generateFilename(topic, contentType);
 doc.save(`${filename}.pdf`);
};

// ─── DOCX Export ────────────────────────────────────────────────────────────────

/**
 * Export generated content as a DOCX file.
 *
 * @param {string} content - Markdown content
 * @param {string} topic - Topic name
 * @param {string} contentType - Content type label
 * @param {string} tone - Tone label
 */
export const downloadAsDOCX = async (content, topic, contentType, tone) => {
 // Parse markdown lines into DOCX paragraphs
 const lines = content.split('\n');
 const paragraphs = [];

 // ── Title ──
 paragraphs.push(
 new Paragraph({
 text: `${contentType}: ${topic}`,
 heading: HeadingLevel.TITLE,
 alignment: AlignmentType.CENTER,
 spacing: { after: 400 },
 })
 );

 // ── Metadata ──
 paragraphs.push(
 new Paragraph({
 children: [
 new TextRun({ text: `Content Type: `, bold: true, color: '6366F1' }),
 new TextRun({ text: contentType }),
 new TextRun({ text: ' | ' }),
 new TextRun({ text: 'Tone: ', bold: true, color: '6366F1' }),
 new TextRun({ text: tone }),
 new TextRun({ text: ' | ' }),
 new TextRun({ text: 'Generated: ', bold: true, color: '6366F1' }),
 new TextRun({ text: new Date().toLocaleDateString() }),
 ],
 spacing: { after: 400 },
 border: {
 bottom: { style: BorderStyle.SINGLE, size: 6, color: '6366F1' },
 },
 })
 );

 // ── Content lines ──
 for (const line of lines) {
 const trimmed = line.trim();

 if (!trimmed) {
 paragraphs.push(new Paragraph({ text: '', spacing: { after: 120 } }));
 continue;
 }

 // Heading levels
 if (trimmed.startsWith('# ')) {
 paragraphs.push(new Paragraph({
 text: trimmed.slice(2),
 heading: HeadingLevel.HEADING_1,
 spacing: { before: 400, after: 200 },
 }));
 } else if (trimmed.startsWith('## ')) {
 paragraphs.push(new Paragraph({
 text: trimmed.slice(3),
 heading: HeadingLevel.HEADING_2,
 spacing: { before: 300, after: 160 },
 }));
 } else if (trimmed.startsWith('### ')) {
 paragraphs.push(new Paragraph({
 text: trimmed.slice(4),
 heading: HeadingLevel.HEADING_3,
 spacing: { before: 240, after: 120 },
 }));
 }
 // Bullet points
 else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
 paragraphs.push(new Paragraph({
 text: trimmed.replace(/^[-•]\s+/, ''),
 bullet: { level: 0 },
 spacing: { after: 80 },
 }));
 }
 // Regular paragraph — handle **bold** and *italic* inline
 else {
 const runs = parseInlineMarkdown(trimmed);
 paragraphs.push(new Paragraph({
 children: runs,
 spacing: { after: 160 },
 }));
 }
 }

 // ── Build document ──
 const doc = new Document({
 creator: 'AI Report Generator',
 title: `${contentType}: ${topic}`,
 description: `Generated ${contentType} about ${topic}`,
 sections: [{
 properties: {
 page: {
 margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
 },
 },
 children: paragraphs,
 }],
 });

 // ── Save ──
 const buffer = await Packer.toBlob(doc);
 const filename = generateFilename(topic, contentType);
 saveAs(buffer, `${filename}.docx`);
};

/**
 * Parse inline Markdown (bold/italic) into docx TextRun array.
 */
const parseInlineMarkdown = (text) => {
 const runs = [];
 // Simple regex-based parser for **bold** and *italic*
 const regex = /\*\*(.+?)\*\*|\*(.+?)\*|(.+?)(?=\*\*|\*|$)/g;
 let match;

 while ((match = regex.exec(text)) !== null) {
 if (match[0] === '') break;

 if (match[1]) {
 runs.push(new TextRun({ text: match[1], bold: true }));
 } else if (match[2]) {
 runs.push(new TextRun({ text: match[2], italics: true }));
 } else if (match[3]) {
 runs.push(new TextRun({ text: match[3] }));
 }
 }

 return runs.length > 0 ? runs : [new TextRun({ text })];
};

/**
 * Copy text content to clipboard.
 * Returns true on success, false on failure.
 */
export const copyToClipboard = async (text) => {
 try {
 await navigator.clipboard.writeText(text);
 return true;
 } catch {
 // Fallback for older browsers
 const el = document.createElement('textarea');
 el.value = text;
 el.style.position = 'fixed';
 el.style.opacity = '0';
 document.body.appendChild(el);
 el.select();
 const success = document.execCommand('copy');
 document.body.removeChild(el);
 return success;
 }
};
