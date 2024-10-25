import Code from "./code-block";

export default function GeneratedDocs() {
    return (
        <div className="pt-6">
            <h1 className="font-semibold text-2xl underline">FlowPI Backend Documentation</h1>
            <p className="text-lg pt-2">
                Welcome to the documentation for your auto-generated backend API using <strong>Express.js</strong> and <strong>Prisma</strong>. This API is designed to provide CRUD functionality for your defined entities and relations, along with optional authentication features.
            </p>

            <h2 className="text-lg pt-8">Table of Contents:</h2>
            <ul className="list-disc px-4 md:px-12">
                <li className="text-xl font-bold hover:underline"><a href="#setup">Setup</a></li>
                <li className="text-xl font-bold hover:underline"><a href="#authentication">Authentication</a></li>
                <li className="text-xl font-bold hover:underline"><a href="#routes">Routes</a></li>
                <li className="text-xl font-bold hover:underline"><a href="#database">Database (Prisma)</a></li>
                <li className="text-xl font-bold hover:underline"><a href="#run">Run</a></li>
                <li className="text-xl font-bold hover:underline"><a href="#deployment">Deployment</a></li>
            </ul>

            <section className="pt-16" id="setup">
                <h2 className="text-2xl font-semibold">1. Setup</h2>
                <p className="text-lg pt-2">
                    To get started with your backend, follow these steps:
                </p>
                <ol className="list-decimal px-6 md:px-24 pt-2">
                    <li>Make sure you have <a className="text-blue-600 underline" href="https://nodejs.org/en/download/">Node.js</a> installed.</li>
                    <li>Clone or download the generated project files.</li>
                    <li>Navigate to the project directory and install the dependencies:</li>
                </ol>
                <Code
                    code="npm install"
                    language="bash"
                />
                <h3 className="text-xl font-medium pt-4">Environment Variables</h3>
                <p>
                    Create a `.env` file at the root of your project and add the following variables:
                </p>
                <Code
                    code={`DATABASE_URL="your-database-url"\nJWT_SECRET="your-secret-key"\nPORT=3000`}
                    language="bash"
                />
            </section>

            <section className="pt-16" id="authentication">
                <h2 className="text-2xl font-semibold">2. Authentication</h2>
                <p className="text-lg pt-2">
                    If you enabled authentication during the generation, JWT-based authentication is built into the backend. This includes:
                </p>
                <ul className="list-decimal px-6 md:px-24 pt-2">
                    <li>Signup and Login routes for user creation and authentication.</li>
                    <li>A middleware that protects routes by verifying the user&apos;s JWT token.</li>
                </ul>
                <h3 className="text-lg pt-2 font-medium">Using Authentication Middleware</h3>
                <p>
                    Add the `authMiddleware` to any route to secure it:
                </p>
                <Code
                    code={`router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!' });
});`}
                    language="js"
                />
            </section>

            <section className="pt-16" id="routes">
                <h2 className="text-2xl font-semibold">3. Routes</h2>
                <p className="text-lg pt-2">
                    The backend provides CRUD operations for all your entities. Here&apos;s an example of the auto-generated routes:
                </p>
                <ul className="list-disc px-6 md:px-24 pt-2">
                    <li>GET /entity-name</li>
                    <li>POST /entity-name</li>
                    <li>PUT /entity-name/:id</li>
                    <li>DELETE /entity-name/:id</li>
                </ul>
                <p>Replace `entity-name` with your entity&apos;s actual name in lowercase.</p>
            </section>

            <section className="pt-16" id="database">
                <h2 className="text-2xl font-semibold">4. Database (Prisma)</h2>
                <p className="text-lg pt-2">
                    The project uses <a className="text-blue-600 underline" href="https://www.prisma.io/">Prisma</a> to interact with your database. Here&apos;s an example of the Prisma schema that was generated:
                </p>
                <Code
                    code={`model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
}`}
                    language="prisma"
                />
                <p className="text-lg pt-2">To apply changes to your database schema, run the following commands:</p>
                <Code
                    code={`npx prisma generate`}
                    language="bash"
                />
            </section>

            <section className="pt-16" id="run">
                <h2 className="text-2xl font-semibold">5. Run</h2>
                <p className="text-lg pt-2">
                    To run your backend, after <a className="text-blue-600 underline" href="#setup">setting up the environment</a> and the <a className="text-blue-600 underline" href="#database">database</a>, use the following command:
                </p>
                <Code
                    code={`npm run dev`}
                    language="bash"
                />
            </section>

            <section className="pt-16" id="deployment">
                <h2 className="text-2xl font-semibold">6. Deployment</h2>
                <p className="text-lg pt-2">
                    To deploy your backend, you can use services like <a className="text-blue-600 underline" href="https://www.heroku.com/">Heroku</a>, <a className="text-blue-600 underline" href="https://vercel.com/">Vercel</a>, or <a className="text-blue-600 underline" href="https://railway.app/">Railway</a>. Make sure to set up your environment variables on the hosting platform.
                </p>
            </section>
        </div>
    );
};

