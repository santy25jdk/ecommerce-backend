const request = require("supertest");
const app = require("../app");
require("../models");

let token;
let categoryId;

beforeAll(async () => {
  const credentials = {
    email: "usertest@gmail.com",
    password: "usertest",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("POST/ create category", async () => {
  const category = {
    name: "tech",
  };
  const res = await request(app)
    .post("/categories")
    .send(category)
    .set("Authorization", `Bearer ${token}`);
  categoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("GET/ get categories", async () => {
  const res = await request(app)
    .get("/categories")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("PUT/ update categories", async () => {
  const updateCategory = {
    name: "tech update",
  };
  const res = await request(app)
    .put(`/categories/${categoryId}`)
    .send(updateCategory)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(updateCategory.name);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("DELETE/ delete category", async () => {
  const res = await request(app)
    .delete(`/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
