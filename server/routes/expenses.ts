import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const expenseSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})
type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true });

const expenses: Expense[] = [
    { id: 1, title: "Rent", amount: 1000 },
    { id: 2, title: "Groceries", amount: 200 },
    { id: 3, title: "Internet", amount: 50 },
]
export const expensesRoute = new Hono()
    .get("/", (c) => {
        return c.json({ expenses: []});
    })
    // HTTP req検証用ミドルウェア
    .post("/", zValidator("json", createPostSchema), async (c) => {
        const data = await c.req.valid("json");
        const expense = createPostSchema.parse(data);

        expenses.push({ id: expenses.length + 1, ...expense });
        c.status(201);
        return c.json({ expense });
    })
    .get("/total", (c) => {
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        return c.json({ totalSpent });
    })
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const expense = expenses.find((e) => e.id === id);
        if (!expense) {
            return c.notFound();
        }
        return c.json({ expense });
    })
    .delete("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const index = expenses.findIndex((e) => e.id === id);
        if (index === -1) {
            return c.notFound();
        }

        const deletedExpense = expenses.splice(index, 1);
        return c.json({ deletedExpense });
    })
