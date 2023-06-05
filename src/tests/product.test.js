const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");
require("../models");

let token;
let productId;

beforeAll(async () => {
  const credentials = {
    email: "usertest@gmail.com",
    password: "usertest",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("POST/ create product", async () => {
  const category = await Category.create({ name: "tech" });
  const product = {
    title: "SmartPhone",
    description: "xiaomi poco f3",
    price: 300,
    brand: "Xiaomi",
    categoryId: category.id,
  };
  const res = await request(app)
    .post("/products")
    .send(product)
    .set("Authorization", `Bearer ${token}`);
  productId = res.body.id;
  await category.destroy();
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("GET/ get products", async () => {
  const res = await request(app)
    .get("/products")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("POST/ /products/:id/images", async () => {
  const image = await ProductImg.create({
    url: "http://falseurl.com",
    publicId: "false id",
  });
  const res = await request(app)
    .post(`/products/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("PUT/ update product", async () => {
  const updateProduct = {
    title: "SmartPhone update",
  };
  const res = await request(app)
    .put(`/products/${productId}`)
    .send(updateProduct)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(updateProduct.title);
});

/*--- --- --- --- --- --- --- --- --- --- --- ---*/

test("DELETE/ delete product", async () => {
  const res = await request(app)
    .delete(`/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
