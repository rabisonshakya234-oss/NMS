const PDFDocument = require('pdfkit');

// "My note!" -> "My-note-" so it is safe inside a file name.
const safeName = (name) => name.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 50) || 'notes';

const sendMarkdown = (res, notes, name) => {
  const text = notes
    .map((note) => {
      const tags = note.tags.length > 0 ? `Tags: ${note.tags.join(', ')}\n\n` : '';
      return `# ${note.title}\n\n${tags}${note.content}`;
    })
    .join('\n\n---\n\n');

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName(name)}.md"`);
  res.send(text);
};

// Each note starts on a new page. The content is written as plain text.
const sendPdf = (res, notes, name) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName(name)}.pdf"`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  notes.forEach((note, index) => {
    if (index > 0) doc.addPage();
    doc.fontSize(20).fillColor('black').text(note.title);
    if (note.tags.length > 0) doc.moveDown(0.5).fontSize(10).fillColor('gray').text(`Tags: ${note.tags.join(', ')}`);
    doc.moveDown().fontSize(12).fillColor('black').text(note.content);
  });

  doc.end();
};

module.exports = { sendMarkdown, sendPdf };
