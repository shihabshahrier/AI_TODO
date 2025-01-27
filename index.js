import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { todosTable } from './db/schema.js';
import db from './db/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import readlineSync from 'readline-sync';

// Todo List Functionality
const addTodo = async (title) => {
    const res = await db.insert(todosTable).values({ title });
    return res;
};

const getAllTodos = async () => {
    const todos = await db.select().from(todosTable);
    return todos;
};

const searchTodos = async (key) => {
    const todos = await db.select().from(todosTable).where('title', 'like', `%${key}%`);
    return todos;
};

const completeTodo = async (id) => {
    const todo = await db.update(todosTable).set({ completed: true }).where(eq('id', id));
    return todo;
};

const deleteTodo = async (id) => {
    const todo = await db.delete(todosTable).where(eq('id', id));
    return todo;
};

const tools = {
    addTodo,
    getAllTodos,
    searchTodos,
    completeTodo,
    deleteTodo,
};

// Initialize Gemini AI Model
const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PROMPT = `
You are an AI Todo list assistant. You can add, search, delete, and complete todos.
You must strictly follow the following json text output format. Do not wrap the output in a json object.

Todo db schema:
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar(255).notNull(),
    completed: boolean().notNull().default(false),
    created_at: timestamp().notNull().default("now()"),
    updated_at: timestamp().notNull().default("now()"),

Available Tools:
    - addTodo(): Add a todo to the list and return the id of the todo.
    - getAllTodos(): Get all todos from the list and return the todos.
    - searchTodos(key): Search a todo by key and return the todo.
    - completeTodo(): Complete a todo by id and return the todo.
    - deleteTodo(): Delete a todo by id and return the todo.

Example:
START
{"type": "user", "user": "Add a task for shopping vegetables."}
{"type":"plan", "plan": "I will add the task to the todo list."}
{"type":"output", "output": "Can you clarify what sort of vegetables you want to buy?"}
{"type": "user", "user": "I want to buy potatoes, tomatoes, and onions."}
{"type":"plan", "plan": "I will add the task to the todo list."}
{"type": "action", "function": "addTodo", "input": "buy potatoes, tomatoes, and onions."}
{"type":"output", "output": "I have added the task to the todo list."}
`;

// Store conversation history
const messages = [
    { role: "system", content: PROMPT }
];

// Main function to interact with user
async function main() {
    while (true) {
        // Get user input
        const query = readlineSync.question("You: ");
        const userMessage = { role: "user", content: query };
        messages.push({ role: "user", content: JSON.stringify(userMessage) });

        try {
            // Request the response from the Gemini model
            const result = await model.generateContent(JSON.stringify(messages));

            // Log the response (for debugging purposes)
            console.log(result.response.text());

            // Split response into parts and process each action
            const res = result.response.text().split("\n").slice(1, -2); // Skip start and end of the response
            console.log(res);
            for (const r of res) {
                try {
                    const output = JSON.parse(r);
                    messages.push({ role: "AI", content: JSON.stringify(output) });

                    // Check for different types of action in the output
                    const action = output;
                    if (action.type === "output") {
                        console.log(action.output);
                    } else if (action.type === "action") {
                        const fn = tools[action.function];
                        if (!fn) {
                            console.error(`Function ${action.function} not found.`);
                            break;
                        }
                        console.log(fn);
                        const result = await fn(action.input);
                        const observation = { type: "observation", observation: result };
                        messages.push({ role: "AI", content: JSON.stringify(observation) });
                    } else if (action.type === "plan") {
                        const observation = { type: "observation", observation: "1" };
                        messages.push({ role: "AI", content: JSON.stringify(observation) });
                        console.log(action.plan);
                    } else {
                        console.error("Invalid action type.");
                    }

                    // Check if we already added the task to prevent recursion loop
                    if (action.type === "action" && action.function === "addTodo") {
                        // Check if this task is already added to avoid recursion
                        const allTodos = await getAllTodos();
                        const taskExists = allTodos.some(todo => todo.title === action.input);
                        if (taskExists) {
                            console.log(`Task "${action.input}" is already in the todo list.`);
                        }
                    }

                } catch (err) {
                    console.error("Error parsing response:", err.message);
                    break; // Move to the next response if there’s a parsing issue
                }
            }
        } catch (err) {
            console.error("Error:", err.message);
            break; // Stop execution if the error is critical
        }
    }
}

main();
