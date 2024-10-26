/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import archiver from "archiver";
import { Entity } from '@/lib/types/project';
import { Readable } from 'stream';
import { GenerateFormData } from '@/lib/types/generate-form';

function generatePrismaSchema(entities: Entity[], relations: any[]): string {
    let schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

  `;
  
    
    entities.forEach((entity) => {
      schemaContent += `\nmodel ${entity.name} {\n`;
      schemaContent += `  id String @id @default(uuid()) @map("_id")\n`;
      
      
      entity.attributes.forEach((attr) => {
        let type = "String";
        if (attr.type === "number") type = "Int";
        if (attr.type === "boolean") type = "Boolean";
        if (attr.type === "Date") type = "DateTime";
        
        const optional = attr.constraint?.type === "optional" ? "?" : "";
        if (attr.type.includes("[]")) {
          type = `${type}[]`;
        }
        
        schemaContent += `  ${attr.name} ${type}${optional}\n`;
      });
  
      
      relations
        .filter((relation) => relation.from === entity.name || relation.to === entity.name)
        .forEach((relation) => {
          if (relation.from === entity.name) {
            if (relation.type === "1-m") {
              schemaContent += `  ${relation.to.toLowerCase()}s ${relation.to}[] @relation("${relation.from}To${relation.to}")\n`;
            } else if (relation.type === "m-1" || relation.type === "1-1") {
              schemaContent += `  ${relation.to.toLowerCase()} ${relation.to}? @relation("${relation.from}To${relation.to}", fields: [${relation.to.toLowerCase()}Id], references: [id])\n`;
              schemaContent += `  ${relation.to.toLowerCase()}Id String?\n`;
            }
          } else {
            if (relation.type === "1-m") {
              schemaContent += `  ${relation.from.toLowerCase()} ${relation.from} @relation("${relation.from}To${relation.to}", fields: [${relation.from.toLowerCase()}Id], references: [id])\n`;
              schemaContent += `  ${relation.from.toLowerCase()}Id String\n`;
            }
          }
        });
  
      schemaContent += `}\n`;
    });
  
    return schemaContent;
}

function generatePydanticModel(entity: Entity, relations: any[]): string {
  let modelContent = `class ${entity.name}Base(BaseModel):
`;
  
  entity.attributes.forEach((attr) => {
    let type = "str";
    if (attr.type === "number") type = "int";
    if (attr.type === "boolean") type = "bool";
    if (attr.type === "Date") type = "datetime";
    if (attr.type.includes("[]")) type = `List[${type}]`;
    
    const optional = attr.constraint?.type === "optional" ? " | None = None" : "";
    modelContent += `    ${attr.name}: ${type}${optional}\n`;
  });

  modelContent += `\n\nclass ${entity.name}Create(${entity.name}Base):
    pass\n`;

  modelContent += `\n\nclass ${entity.name}(${entity.name}Base):
    id: str
`;

  
  relations
    .filter((relation) => relation.from === entity.name)
    .forEach((relation) => {
      if (relation.type === "1-m") {
        modelContent += `    ${relation.to.toLowerCase()}_ids: List[str] = []\n`;
      } else if (relation.type === "m-1" || relation.type === "1-1") {
        modelContent += `    ${relation.to.toLowerCase()}_id: str | None = None\n`;
      }
    });

  modelContent += `\n    class Config:\n        orm_mode = True\n`;

  return modelContent;
}

export async function POST(req: NextRequest) {
  const body: GenerateFormData = await req.json();
  const { entities, relations } = body;
  const { auth, name, description } = body;

  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = new Readable({ read() {} });

  archive.on('data', (chunk) => stream.push(chunk));
  archive.on('end', () => stream.push(null));

  
  const prismaSchema = generatePrismaSchema(entities, relations);
  archive.append(prismaSchema, { name: 'prisma/schema.prisma' });

  
  let appContent = `from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from prisma import Prisma
from .models import ${entities.map(e => `${e.name}, ${e.name}Create`).join(', ')}${auth ? ', UserLogin, UserCreate, User' : ''}
from .utils import ${auth ? 'get_current_user, get_password_hash, verify_password, create_access_token' : ''}
from .constants import ${auth ? 'SECRET_KEY, ALGORITHM' : ''}
from typing import List
import uvicorn

app = FastAPI(
    title="${name}",
    description="${description || 'Generated by FastAPI Generator'}"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prisma = Prisma()

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()
`;

  
  entities.forEach((entity) => {
    const entityLower = entity.name.toLowerCase();
    appContent += `

@app.get("/${entityLower}s", response_model=List[${entity.name}])
${auth ? `async def get_all_${entityLower}s(current_user: User = Depends(get_current_user)):` : `async def get_all_${entityLower}s():`}
    ${entityLower}s = await prisma.${entity.name.toLowerCase()}.find_many()
    return ${entityLower}s

@app.post("/${entityLower}s", response_model=${entity.name})
${auth ? `async def create_${entityLower}(${entityLower}: ${entity.name}Create, current_user: User = Depends(get_current_user)):` : `async def create_${entityLower}(${entityLower}: ${entity.name}Create):`}
    ${entityLower}_dict = ${entityLower}.dict()
    ${auth ? `${entityLower}_dict["user_id"] = current_user.id` : ''}
    new_${entityLower} = await prisma.${entity.name.toLowerCase()}.create(data=${entityLower}_dict)
    return new_${entityLower}

@app.put("/${entityLower}s/{${entityLower}_id}", response_model=${entity.name})
${auth ? `async def update_${entityLower}(${entityLower}_id: str, ${entityLower}: ${entity.name}Create, current_user: User = Depends(get_current_user)):` : `async def update_${entityLower}(${entityLower}_id: str, ${entityLower}: ${entity.name}Create):`}
    try:
        updated_${entityLower} = await prisma.${entity.name.toLowerCase()}.update(
            where={"id": ${entityLower}_id},
            data=${entityLower}.dict()
        )
        return updated_${entityLower}
    except:
        raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/${entityLower}s/{${entityLower}_id}")
${auth ? `async def delete_${entityLower}(${entityLower}_id: str, current_user: User = Depends(get_current_user)):` : `async def delete_${entityLower}(${entityLower}_id: str):`}
    try:
        await prisma.${entity.name.toLowerCase()}.delete(where={"id": ${entityLower}_id})
        return {"message": "Item deleted successfully"}
    except:
        raise HTTPException(status_code=404, detail="Item not found")`;
  });

  if (auth) {
    appContent += `

@app.post("/auth/register", response_model=User)
async def register(user: UserCreate):
    existing_user = await prisma.user.find_first(where={"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    new_user = await prisma.user.create(data=user_dict)
    return new_user

@app.post("/auth/login")
async def login(user_credentials: UserLogin):
    user = await prisma.user.find_first(where={"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user`;
  }

  archive.append(appContent, { name: 'backend/app.py' });

  
  let modelsContent = `from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
`;

  entities.forEach((entity) => {
    modelsContent += `\n\n${generatePydanticModel(entity, relations)}`;
  });

  if (auth) {
    modelsContent += `

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    password: str

    class Config:
        orm_mode = True`;
  }

  archive.append(modelsContent, { name: 'backend/models.py' });

  
  const utilsContent = `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
from .constants import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from .models import User
from prisma import Prisma

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
prisma = Prisma()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await prisma.user.find_first(where={"email": email})
    if user is None:
        raise credentials_exception
    return user`;

  archive.append(utilsContent, { name: 'backend/utils.py' });

  
  const constantsContent = `from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Authentication settings
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY environment variable set")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))`;

  archive.append(constantsContent, { name: 'backend/constants.py' });

  
  const envContent = `# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30`;

  archive.append(envContent, { name: '.env.example' });

  
  const requirementsContent = `fastapi==0.68.1
uvicorn==0.15.0
prisma==0.9.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.5
python-dotenv==0.19.0
pydantic==1.8.2`;

  archive.append(requirementsContent, { name: 'requirements.txt' });

  
  const readmeContent = `# ${name}

This is a FastAPI backend application with Prisma ORM generated automatically.

## Setup

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Set up your database and update the DATABASE_URL in .env file

3. Generate Prisma client:
\`\`\`bash
prisma generate
\`\`\`

4. Run database migrations:
\`\`\`bash
prisma migrate dev
\`\`\`

5. Run the application:
\`\`\`bash
uvicorn backend.app:app --reload
\`\`\`

6. Access the API documentation at http:

## Features

- Prisma ORM integration
- PostgreSQL database
- Async/await syntax
- Full CRUD operations for all entities
${auth ? '- JWT Authentication\n- User registration and login' : ''}
- Swagger UI documentation
- CORS middleware enabled

## Project Structure

- \`prisma/schema.prisma\`: Prisma schema file
- \`backend/app.py\`: Main application file with all routes
- \`backend/models.py\`: Pydantic models for data validation
- \`backend/utils.py\`: Utility functions${auth ? ' and authentication logic' : ''}
- \`backend/constants.py\`: Configuration constants

## API Endpoints

${entities.map(entity => `### ${entity.name}
- GET /${entity.name.toLowerCase()}s
- POST /${entity.name.toLowerCase()}s
- PUT /${entity.name.toLowerCase()}s/{id}
- DELETE /${entity.name.toLowerCase()}s/{id}`).join('\n\n')}
${auth ? '\n### Authentication\n- POST /auth/register\n- POST /auth/login\n- GET /auth/me' : ''}`;

  archive.append(readmeContent, { name: 'README.md' });

  archive.finalize();

  try {
    return new NextResponse(
      new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => controller.enqueue(chunk));
          stream.on('end', () => controller.close());
          stream.on('error', (err) => controller.error(err));
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
    return NextResponse.json({ error: 'Failed to generate backend' });
  }
}