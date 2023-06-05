const request = require("supertest");
const app = require("../app");

let userId;
let token;

test("POST/ create user", async () => {
  const user = {
    firstName: "Eliseo",
    lastName: "Quispe",
    email: "santy@gmail.com",
    password: "password",
    phone: "2974008515",
  };
  const res = await request(app).post("/users").send(user);
  userId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("Login /users/login", async () => {
  const credentials = {
    email: "santy@gmail.com",
    password: "password",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("GET/ get users", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("PUT/ update user", async () => {
  const updateUser = {
    firstName: "Eliseo update",
  };
  const res = await request(app)
    .put(`/users/${userId}`)
    .send(updateUser)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(updateUser.firstName);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("Login /users/login invalid credentials", async () => {
  const credentials = {
    email: "invalidsanty@gmail.com",
    password: "invalidpassword",
  };
  const res = await request(app).post("/users/login").send(credentials);

  expect(res.status).toBe(401);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("DELETE/ delete user", async () => {
  const res = await request(app)
    .delete(`/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
