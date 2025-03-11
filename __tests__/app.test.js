/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

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

describe.only("topics api", () => {
  describe("/api/topics", () => {
    test("GET 200: responds with an array of topic objects having properties    slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          topics.forEach(topic => {
            const { slug, description } = topic
            expect(typeof slug).toBe("string")
            expect(typeof description).toBe("string")
          })
        });
    })
    test("404: responds with an error message if endpoint not found", () => {
      return request(app)
        .get("/api/tooopicsss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path Not Found");
         
        });
    })

  })
})