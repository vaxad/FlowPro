import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { NextRequest, NextResponse } from 'next/server';

const getAllFiles = async (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = await fs.promises.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
};

export async function POST(req: NextRequest) {
  try {
    const directoryPath = path.join(process.cwd(), 'src/lib/sample');
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const chunks: Uint8Array[] = [];
    

    archive.on('data', (chunk) => {
      chunks.push(chunk);
    });

    const files = await getAllFiles(directoryPath);

    for (const filePath of files) {
      const relativePath = path.relative(directoryPath, filePath);
      archive.file(filePath, { name: relativePath });
    }

    const archiveFinalized = new Promise<Uint8Array>((resolve, reject) => {
      archive.on('end', () => {
        const concatenatedChunks = new Uint8Array(
          chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        );
        
        let offset = 0;
        for (const chunk of chunks) {
          concatenatedChunks.set(chunk, offset);
          offset += chunk.length;
        }
        
        resolve(concatenatedChunks);
      });

      archive.on('error', (err) => {
        reject(err);
      });
    });

    await archive.finalize();

    const finalBuffer = await archiveFinalized;

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(finalBuffer);
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=archive.zip',
        'Content-Length': finalBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error creating zip file:', error);
    return NextResponse.json(
      { error: 'Failed to create zip file' },
      { status: 500 }
    );
  }
}