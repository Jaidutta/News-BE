/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

require("jest-sorted");
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

describe("articles api", () => {
  describe("/api/articles/", () => {
    test("GET 200: responds with an array of article objects", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: {articles} }) => {
        expect(articles.length).toBe(13);
        articles.forEach(article => {
          const {article_id, title, topic, author, created_at, votes, article_img_url, comment_count} = article
          expect(typeof article_id).toBe("number");
          expect(typeof title).toBe("string");
          expect(typeof topic).toBe("string");
          expect(typeof author).toBe("string");

          const createdAtDate = new Date(created_at);
          expect(createdAtDate).toBeInstanceOf(Date);
          expect(createdAtDate).not.toBeNull();

          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");

          expect(article).not.toHaveProperty("body")
        })
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
    })

  })
  
})