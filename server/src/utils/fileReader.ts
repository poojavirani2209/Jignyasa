import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

export async function readTextFromFiles(filePaths: string[]): Promise<string> {
  let fullText = "";

  for (const filePath of filePaths) {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case ".pdf":
        fullText += await readPdf(filePath);
        break;

      default:
        console.warn(`Unsupported file type: ${ext}`);
        break;
    }
  }

  return fullText;
}

async function readPdf(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  const pdf = await pdfParse(data);
  return `\n${pdf.text}`;
}
