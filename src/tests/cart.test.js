const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

let token;
let cartId;

beforeAll(async () => {
  const credentials = {
    email: "usertest@gmail.com",
    password: "usertest",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("POST/ create cart", async () => {
  const product = await Product.create({
    title: "Poco F5 pro",
    description: "12ram, 8k, snapdragon gen2",
    price: 600,
    brand: "Xiaomi",
  });
  const cart = {
    productId: product.id,
    quantity: 2,
  };
  const res = await request(app)
    .post("/carts")
    .send(cart)
    .set("Authorization", `Bearer ${token}`);
  cartId = res.body.id;
  await product.destroy();
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("GET/ get cart", async () => {
  const res = await request(app)
    .get("/carts")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("PUT/ update cart", async () => {
  const updateCart = {
    quantity: 4,
  };
  const res = await request(app)
    .put(`/carts/${cartId}`)
    .send(updateCart)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(updateCart.quantity);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("DELETE/ delete cart", async () => {
  const res = await request(app)
    .delete(`/carts/${cartId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
