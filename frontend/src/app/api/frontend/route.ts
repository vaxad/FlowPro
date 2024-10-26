import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { NextRequest, NextResponse } from 'next/server';
import { GenerateFormData } from '@/lib/types/generate-form';
import { attributeTypeToPrismaType, ensureRelations, generateRelationField, handleConstraints } from '@/lib/maps/project';
import { Entity } from '@/lib/types/project';

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
    const body: GenerateFormData =  await req.json();
  let { entities, relations } =  body
  const { auth:bodyAuth, name, description } =  body

  const auth = bodyAuth && (bodyAuth as unknown as string) != 'false' ;
  
  relations = ensureRelations(relations);
    const directoryPath = path.join(process.cwd(), 'src/lib/sample');
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const chunks: Uint8Array[] = [];
    
    archive.on('data', (chunk:any) => {
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
    
    let prismaSchema = `generator client {
      provider = "prisma-client-js"
    }
    
    datasource db {
      provider = "mongodb"
      url      = env("DATABASE_URL")
    }\n\n`;
    entities.forEach((entity: Entity) => {
      prismaSchema += `model ${entity.name} {\n id  String  @id @default(auto()) @map("_id") @db.ObjectId\n`;
  
      entity.attributes.forEach((attr) => {
          prismaSchema += `  ${attr.name} ${attributeTypeToPrismaType(attr.type)}${handleConstraints(attr)}\n`;
        });
  
      relations
        .filter((relation) => relation.from === entity.name)
        .forEach((relation) => {
          prismaSchema += `  ${generateRelationField(relation)}\n`;
        });
      prismaSchema += "   fpca DateTime @default(now())\n";
      prismaSchema += '}\n\n';
    });
  
    archive.append(prismaSchema, { name: `prisma/schema.prisma` });
  
    let content = `import { Entity } from "./types";\n`
    
    content += entities.map((entity) => {
      return `
  export const ${entity.name.toLowerCase()}Entity: Entity = {
    name: '${entity.name}',
    attributes: ${JSON.stringify(entity.attributes, null, 2)}
  };
      `;
    }).join('\n');

    archive.append(content, { name: `src/lib/entities.ts` });

  
    for (const entity of entities) {
      // Define the content for the route page
      const pageContent = `import Dashboard from '@/components/dashboard-01';
  import React from 'react';
  import db from '@/lib/prisma';
  import { ${entity.name.toLowerCase()}Entity } from '@/lib/entities';
  
  export default async function page() {
      const ${entity.name.toLowerCase()}s = await db.${entity.name.toLowerCase()}.findMany();
      return (
          <Dashboard records={${entity.name.toLowerCase()}s} entity={${entity.name.toLowerCase()}Entity} />
      );
  }
  `;
  
      // Create the page file
      archive.append(pageContent, { name: `src/app/(routes)/${entity.name.toLowerCase()}/page.tsx` });
    }
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