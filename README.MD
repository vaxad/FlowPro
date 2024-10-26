# FlowPro

**FlowPro** is a powerful tool for developers to effortlessly design, build, and deploy backend systems by creating ER diagrams through an intuitive frontend UI, a form-based entity editor, or by directly inputting JSON. FlowPro takes your entity relationships and generates a full Express backend, complete with Prisma ORM, authentication, body validation, parsing, and an admin panel with Next.js for managing data—all without writing a line of code. You can also leverage AI to generate ER diagrams from project requirement docs or prompts.

---

## Features

- **ER Diagram Creation**: Draw ER diagrams directly on the UI or input entities and relationships using forms or JSON.
- **Backend Generation**: With your ER diagram as input, FlowPro generates:
  - An Express backend with CRUD functionality for all entities
  - Authentication setup for secured endpoints
  - Prisma ORM for seamless database interaction
  - Comprehensive body validation and parsing for structured API requests
- **Admin Panel**: A Next.js admin panel is automatically created, allowing you to manage and visualize all your data.
- **AI-Enhanced ER Diagram Generation**: Use prompts or project requirement documents to automatically generate ER diagrams, powered by LangChain and LLaMA.
- **Documentation & Queries**: Query the system to receive detailed documentation and insights on the generated backend code.

---

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Express, Prisma, FastAPI
- **AI & NLP**: LangChain, LLaMA for prompt-based ER diagram generation

---

## Getting Started

### Prerequisites

- Node.js and npm
- Python and FastAPI
- Prisma setup for database configuration

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vaxad/flowpro.git
   cd flowpro
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Prisma**:
   - Configure your database in `prisma/schema.prisma`.
   - Run the migrations:
     ```bash
     npx prisma migrate dev
     ```

4. **Run FastAPI Service** (for AI capabilities):
   - Install required Python packages:
     ```bash
     pip install -r requirements.txt
     ```
   - Start the FastAPI server:
     ```bash
     uvicorn backend.app:app --reload
     ```

5. **Start the Application**:
   ```bash
   npm run dev
   ```

### Usage

- **Generate ER Diagrams**:
  - Navigate to the diagram editor to visually create relationships or use the form input for detailed entity definitions.
  - Alternatively, input project requirement docs or prompts to automatically generate ER diagrams with AI.
  
- **Generate Backend**:
  - Once the ER diagram is complete, FlowPro will create a backend with full CRUD operations, authentication, and an admin panel.
  
- **Documentation & Queries**:
  - Use the query panel to access documentation on the generated backend structure and operations.

---

With FlowPro, you can effortlessly transform your ER diagrams into fully functional backend systems, reducing development time and enabling rapid iteration.
