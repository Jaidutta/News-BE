/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("endpoints");
        expect(body.endpoints).toEqual(endpointsJson);
        expect(typeof body.endpoints).toBe("object"); 
      });
  });
});