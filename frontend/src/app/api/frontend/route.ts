import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export function POST(req: NextRequest) {
    const directoryPath = path.join(process.cwd(), 'src/lib/sample'); // Change 'your-folder' to your target directory
    const archive = archiver('zip', { zlib: { level: 9 } });

    console.log({ directoryPath });
    // res.attachment('archive.zip'); // Set the filename for the download

    // Pipe the archive data to the response
    const stream = new Readable({
        read() {}
      });
    
      archive.on('data', (chunk) => {
        stream.push(chunk); 
      });
    
      archive.on('end', () => {
        stream.push(null); 
      });
    
    // Function to recursively append files to the archive
    const appendFilesToArchive = (dir:string, basePath:string) => {
        console.log({ dir, basePath });
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error(err);
                return NextResponse.json({ error: 'Failed to read directory' });
            }

            // Process each file and directory in the current directory
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const relativePath = path.relative(basePath, filePath); // Get relative path for the archive

                if (fs.statSync(filePath).isDirectory()) {
                    // Recursively append files in the subdirectory
                    appendFilesToArchive(filePath, basePath);
                } else {
                    // Append the file to the archive
                    archive.file(filePath, { name: relativePath });
                }
            });

            // Finalize the archive once all files are processed
            archive.finalize().catch(err => {
                console.error(err);
                return NextResponse.json({ error: 'Failed to create archive' });
            });
        });
    };

    // Start appending files from the target directory
    appendFilesToArchive(directoryPath, directoryPath);
    try {
        return new NextResponse(
          new ReadableStream({
            start(controller) {
              stream.on('data', (chunk) => {
                controller.enqueue(chunk);
              });
      
              stream.on('end', () => {
                controller.close();
              });
      
              stream.on('error', (err) => {
                controller.error(err); 
              });
            },
          }),
          {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename=${name}.zip`,
            },
          }
        );
      } catch (error) {
        console.error('Error while generating backend:', error);
        NextResponse.json({ error: 'Failed to generate backend' });
      }
}
