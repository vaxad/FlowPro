19
<img width="1470" alt="flowpi" src="https://res.cloudinary.com/db670bhmc/image/upload/v1727617717/Screenshot_2024-09-29_at_7.18.16_PM_fbyfvd.png">

# FlowPI

FlowPI is a powerful tool that generates a fully functional backend with Express + Node.js, including authentication middleware, Prisma for database management, customizable constraints, and body validation. Now, backend generation can be done using three different methods: through an ER diagram, a form-based UI, or by providing a JSON input.

## 🚀 Features

- **Entity-Relationship Diagram (ER Diagram) Generation**: Create an ER diagram using a canvas, connect entities with relationships, and generate the backend based on the visual representation.
- **Form-Based UI Generation**: A user-friendly form where entities and relations can be entered to generate a backend.
- **JSON-Based Generation**: Enter a valid JSON input in the required format to generate a backend.
- **Customizable Constraints**: Add custom constraints like required fields, unique fields, and default values to each attribute.
- **Body Validation and Parsing**: Automatically validates and parses request bodies according to your defined schema.
- **Authentication Middleware**: Secure your API endpoints with built-in JWT-based authentication.
- **Prisma Integration**: Seamlessly manage database models and migrations with Prisma ORM.
- **Next.js + TypeScript**: Built with modern web development technologies for the frontend.

## 📹 Demo

Check out the demo video to see FlowPI in action:  
[![FlowPI Demo](https://img.youtube.com/vi/bAbmS45fAhA/0.jpg)](https://youtu.be/8gNkaHTa4hU))

## 🛠️ Tech Stack

### For FlowPI: 
- **Frontend**: Next.js (for the project dashboard) + TypeScript + API routes

#### For Genrated API:
- **Backend**: Node.js, Express.js
- **Database**: Prisma (Supports MongoDB as of now)
- **Authentication**: JWT-based middleware

## 🧑‍💻 How It Works

1. **ER Diagram Method**: Use the canvas to create an ER diagram, connect entities with relations, and generate a backend from this visual structure.
2. **Form-Based UI Method**: Input your entities and relations through an intuitive form.
3. **JSON Method**: Enter a valid JSON object describing entities and relations in the correct format.
4. **Set Constraints**: Add constraints such as required fields, unique fields, default values, etc.
5. **Generate Backend**: FlowPI generates a fully functional backend with routes, controllers, and Prisma models.
6. **Authentication**: Enjoy out-of-the-box JWT authentication.
7. **Deployment Ready**: Deploy your backend on any Node.js server.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vaxad/flowpi.git
   ```
2. Install dependencies:
   ```bash
   cd flowpi
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Usage

1. Choose one of the following methods to define your entities and relationships:
   - **ER Diagram**: Use the flow feature to create an ER diagram.
   - **Form-Based UI**: Enter entities and relationships through the provided form.
   - **JSON Input**: Input a valid JSON structure.
2. **Set constraints** for each entity attribute.
3. Click **Generate** to scaffold your backend with Express, authentication, Prisma, and body validation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/vaxad/flowpi/issues).
