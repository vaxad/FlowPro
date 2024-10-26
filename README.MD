<h1 align="center" id="title">FlowPro </h1>

**FlowPro** is a powerful tool for developers to effortlessly design, build, and deploy backend systems by creating ER diagrams through an intuitive frontend UI, a form-based entity editor, or by directly inputting JSON. FlowPro takes your entity relationships and generates a full Express backend, complete with Prisma ORM, authentication, body validation, parsing, and an admin panel with Next.js for managing data—all without writing a line of code. You can also leverage AI to generate ER diagrams from project requirement docs or prompts.


<div align="center">
 
https://github.com/user-attachments/assets/3a2079df-750e-498d-ae74-9608a988e551

</div>

---

<h2>Project Screenshots:</h2>

<table style="width: 100%; table-layout: fixed;">
  <tr>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/1c208831-52af-41a3-ac96-c164f17f04b9" alt="Landing Page" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/b4d9771b-0e57-431a-bf99-3414299ff349" alt="Home" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
  </tr>
  <tr>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/77cebb9b-d86f-47cf-b16c-0f1b0bde2714" alt="Video and Transcript" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/c6dd06cf-0865-4634-9687-ba850837bc66" alt="Quiz" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
  </tr>
  <tr>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/04945719-87a9-4635-b940-48ea5f0d8cca" alt="Video and Transcript" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/7a851a02-5217-4d9a-9091-35b26bdf3ee2" alt="Quiz" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
  </tr>
  <tr>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/03eed148-47ba-4426-add1-8437f4b2f968" alt="Analytics" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/user-attachments/assets/f143bbae-8613-4263-8af1-da9003d13f6c" alt="Analytics" style="width: 100%; height: 250px; object-fit: cover;">
    </td>
  </tr>
</table>

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

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,py,ts,fastapi,anaconda,express,ai,prisma,tailwind,vercel&perline=14" />
  </a>
</p>

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
