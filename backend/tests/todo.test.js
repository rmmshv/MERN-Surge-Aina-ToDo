import request from "supertest";
import app from "../index.js";

describe("Todos API", () => {
    it("GET /api/todos should return an array", async() => {
        const res = await request(app).get("/api/todos");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /api/todos should create a todo", async() => {
        const res = await request(app)
            .post("/api/todos")
            .send({ text: "Test Todo" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.text).toBe("Test Todo");
    });
});