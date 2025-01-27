# AI_TODO

AI_TODO is a command-line Todo List application enhanced with Google Gemini AI integration. It allows users to add, search, delete, and complete tasks using natural language commands, leveraging AI to streamline task management.

## Features

- **Add Todos:** Easily add new tasks to your todo list.
- **Search Todos:** Find tasks using keywords.
- **Complete Todos:** Mark tasks as completed.
- **Delete Todos:** Remove tasks from the list.
- **AI Integration:** Utilize Google Gemini AI for intelligent task management.

## Technologies Used

- **Node.js:** JavaScript runtime environment.
- **Drizzle ORM:** Lightweight ORM for database interactions.
- **PostgreSQL:** Relational database managed via Docker.
- **Docker Compose:** Orchestrate Docker containers.
- **Google Generative AI:** AI model for enhanced functionality.

## Prerequisites

- **Node.js:** Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **Docker:** Install Docker for managing the PostgreSQL container. [Download Docker](https://www.docker.com/get-started)

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/shihabshahrier/AI_TODO.git
    cd AI_TODO
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**
   
   Create a `.env` file in the root directory and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_gemini_api_key
    ```

4. **Start PostgreSQL with Docker Compose:**
    ```bash
    docker-compose up -d
    ```

5. **Run Database Migrations:**
    ```bash
    npm run migrate
    ```

## Usage

Start the application by running:
```bash
node index.js
```

Interact with the Todo list using natural language commands. The AI will assist in managing your tasks efficiently.

## Scripts

- **Test:**
    ```bash
    npm test
    ```
- **Generate Drizzle ORM:**
    ```bash
    npm run generate
    ```
- **Run Migrations:**
    ```bash
    npm run migrate
    ```
- **Start Drizzle Studio:**
    ```bash
    npm run studio
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


For any questions or support, please visit the [GitHub Issues](https://github.com/shihabshahrier/AI_TODO/issues) page.