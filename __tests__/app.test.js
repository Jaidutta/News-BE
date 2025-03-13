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

describe("topics api", () => {
  describe("/api/topics", () => {
    test("GET 200: responds with an array of topic objects having properties slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            const { slug, description } = topic;
            expect(typeof slug).toBe("string");
            expect(typeof description).toBe("string");
          });
        });
    });
  });
});

describe("articles api", () => {
  describe("/api/articles/", () => {
    test("GET 200: responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            const {
              article_id,
              title,
              topic,
              author,
              created_at,
              votes,
              article_img_url,
              comment_count,
            } = article;
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

            expect(article).not.toHaveProperty("body");
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    test("GET 200: responds with an article object", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          const {
            article_id,
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          } = article;
          expect(article_id).toBe(2);

          expect(title).toBe("Sony Vaio; or, The Laptop");
          expect(topic).toBe("mitch");
          expect(author).toBe("icellusedkars");
          expect(body).toBe("Call me Mitchell. Some years ago..");

          const createdAtDate = new Date(created_at);
          expect(createdAtDate).toBeInstanceOf(Date);
          expect(createdAtDate).not.toBeNull();

          expect(votes).toBe(0);
          expect(article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("404: responds with an error message if the id is NOT found in the database", () => {
      return request(app)
        .get("/api/articles/99999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("not found");
        });
    });

    test("400, responds with an error message if the id is of invalid data type", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
  });
});

describe("Path Not Found Error Handler", () => {
  test("404: responds with an error message if endpoint not found", () => {
    return request(app)
      .get("/api/tooopicsss")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path Not Found");
      });
  });
});