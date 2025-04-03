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

    test("GET 200 : Responds with an array of article object sorted by the sort_by query parameter (descending by default), if the sort_by column exists in the table", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).not.toHaveLength(0);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author", { descending: true });
        })
    })

    test("GET 200 : Repsonds with an array of article objects sorted by date in ascending order queried by the client", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).not.toHaveLength(0);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        })
    })

    test("200 : Repsonds with an array of article objects sorted by author in ascending order queried by the client ", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).not.toHaveLength(0);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author", { ascending: true });
        });
    });
    
    test("400 : Responds with Bad Request error message if sort by coloumn doesn't exist in the table", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_id")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Column Input");
        });
    });
  
    test("400 : Responds with Bad Request error message if sort by coloumn exists in the table but isn't a valid sorting column", () => {
      return request(app)
        .get("/api/articles?sort_by=article_img_url")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Column Input");
        });
    });
  
    test("400 : Responds with Bad Request error message if input sort order isn't ASC or DESC", () => {
      return request(app)
        .get("/api/articles?order=alphabetically")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Sort Order Input");
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
        const article_id = 99999999
        return request(app)
          .get(`/api/articles/${article_id}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`The Article id: 99999999 does NOT exist`);
          });
      });

      test("400: responds with an error message if the article id is of invalid data type", () => {
        return request(app)
          .get("/api/articles/banana")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });

    describe("/api/articles/:article_id/comments", () => {
      describe("GET", () => {
        test("GET 200: responds with an array of comments for the given article_id", () => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).toBe(2);
              comments.forEach((comment) => {
                const { comment_id, votes, created_at, author, body, article_id } = comment
                expect(typeof comment_id).toBe("number");
                expect(typeof votes).toBe("number");

                const createdAtDate = new Date(created_at);
                expect(createdAtDate).toBeInstanceOf(Date);
                expect(createdAtDate).not.toBeNull();

                expect(typeof author).toBe("string");
                expect(typeof body).toBe("string");
                expect(article_id).toBe(9);
              });
            });
        });

        test("GET 200: comments are sorted by created_at in descending order(latest comment first)", () => {
          return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).toBe(2);
              expect(comments).toBeSortedBy("created_at", { descending: true });
            });
        });

        test("GET 200: responds with an empty array when the article has no comments", () => {
          return request(app)
            .get("/api/articles/11/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toEqual([]);
            });
        });

        test("GET 404: responds with an error message when the article_id does not exist", () => {
          const article_id = 999999
          return request(app)
            .get("/api/articles/999999/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(`The Article id: ${article_id} does NOT exist`);
            });
        });

        test("400: responds with an error message if the article id is of invalid data type", () => {
          return request(app)
            .get("/api/articles/banana/comments")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });

      })
      describe("POST /api/articles/:article_id/comments", () => {
        describe("Happy Path", () => {
          test("POST 201: adds a comment to an existing article and returns the posted comment", () => {
            const payload = { username: 'lurker', body: "I am a new comment" };
            return request(app)
              .post("/api/articles/5/comments")
              .send(payload)
              .expect(201)
              .then(({ body: { comment } }) => {
                const { comment_id, votes, created_at, author, body, article_id } = comment;
                expect(typeof comment_id).toBe("number");
                expect(typeof votes).toBe("number");
                expect(typeof created_at).toBe("string");

                const createdAtDate = new Date(created_at);
                expect(createdAtDate).toBeInstanceOf(Date);
                expect(createdAtDate).not.toBeNull();

                expect(author).toBe(payload.username);
                expect(body).toBe(payload.body);
                expect(article_id).toBe(5);
              });
          });
        });
        describe("Error Handling", () => {
          test("POST 404: responds with an error for a non-existent article_id", () => {
            const invalidId = 999999;
            const payload = { username: 'lurker', body: "This is a new comment" };
            return request(app)
              .post(`/api/articles/${invalidId}/comments`)
              .send(payload)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(`The Article id: ${invalidId} does NOT exist`);
              });
          });

          test("POST 400: responds with an error when username is missing", () => {
            const payload = { body: "I am a new comment" };
            return request(app)
              .post("/api/articles/5/comments")
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("missing required fields");
              });
          });

          test("POST 400: responds with an error when body is missing", () => {
            const payload = { username: 'lurker' };
            return request(app)
              .post("/api/articles/5/comments")
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("missing required fields");
              });
          });

          test("POST 404: responds with an error when the username does not exist", () => {
            const payload = { username: 'nonexistentuser', body: "This is a new comment" };
            return request(app)
              .post("/api/articles/5/comments")
              .send(payload)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("username not found");
              });
          });

          test("POST 400: responds with an error for an invalid article_id format", () => {
            const invalidArticleId = "banana";
            const payload = { username: "lurker", body: "This is a new comment" };
            return request(app)
              .post(`/api/articles/${invalidArticleId}/comments`)
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request");
              });
          });

          test("POST 400: responds with an error when username is an empty string", () => {
            const payload = { username: "", body: "This is a new comment" };
            return request(app)
              .post("/api/articles/5/comments")
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("username and body cannot be empty");
              });
          });

          test("POST 400: responds with an error when the request body includes invalid fields", () => {
            const payload = {
              username: "lurker",
              body: "This is a new comment",
              extra_field: "This field is not needed"
            };
            return request(app)
              .post("/api/articles/5/comments")
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid request body");
              });
          });
        });
      });

      describe('PATCH /api/articles/:article_id', () => {
        describe('Happy Path', () => {
          test('PATCH 200: updates the article votes and returns the updated article', () => {
            const payload = { inc_votes: 10 };
            return request(app)
              .patch('/api/articles/1')
              .send(payload)
              .expect(200)
              .then(({ body: { article } }) => {
                const { votes, article_id, title, topic, author, created_at, article_img_url, comment_count } = article;

                expect(votes).toBe(110);
                expect(typeof article_id).toBe("number");
                expect(typeof title).toBe("string");
                expect(typeof topic).toBe("string");
                expect(typeof author).toBe("string");

                const createdAtDate = new Date(created_at);
                expect(createdAtDate).toBeInstanceOf(Date);
                expect(createdAtDate).not.toBeNull();

                expect(typeof article_img_url).toBe("string");
                expect(typeof comment_count).toBe("number");
              });
          });

          test('PATCH 200: updates the article votes and returns the updated article with negative votes', () => {
            const payload = { inc_votes: -50 };
            return request(app)
              .patch('/api/articles/1')
              .send(payload)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).toBe(50);
              });
          });
        });

        describe('Error Handling', () => {
          test('PATCH 404: responds with an error when article_id does not exist', () => {
            const payload = { inc_votes: 10 };
            const invalidId = 99999
            return request(app)
              .patch(`/api/articles/${invalidId}`)
              .send(payload)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(`The Article id: ${invalidId} does NOT exist`);
              });
          });

          test('PATCH 400: responds with an error when inc_votes is missing', () => {
            const payload = {};
            return request(app)
              .patch('/api/articles/1')
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('inc_votes is required');
              });
          });

          test('PATCH 400: responds with an error when inc_votes is not a number', () => {
            const payload = { inc_votes: 'Incorrect Data type' };
            return request(app)
              .patch('/api/articles/1')
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('inc_votes must be a number');
              });
          });

          test('PATCH 400: responds with an error when article_id is invalid', () => {
            const payload = { inc_votes: 10 };
            return request(app)
              .patch('/api/articles/banana')
              .send(payload)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('bad request');
              });
          });
        });
      });
    })
  })
});

describe("comments api", () => {
  describe("/api/comments/:comment_id", () => {
    describe("Happy Path", () => {
      test("DELETE 204: deletes the comment and responds with no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
    });

    describe("Error Handling", () => {
      test("DELETE 404: responds with an error when comment_id does not exist", () => {
        const comment_id = 99999
        return request(app)
          .delete(`/api/comments/${comment_id}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`Comment ${comment_id} not found`);
          });
      });

      test("DELETE 400: responds with an error when comment_id is invalid", () => {
        return request(app)
          .delete("/api/comments/banana")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
  });
});

describe("users api", () => {
  describe('GET /api/users', () => {
    test('GET 200: responds with an array of user objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe('string');
            expect(typeof user.name).toBe('string');
            expect(typeof user.avatar_url).toBe('string');
          });

        });
    });
  });
})

describe("Path Not Found Error Handler", () => {
  test("404: responds with an error message if endpoint not found", () => {
    return request(app)
      .get("/api/tooopicsss")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path Not Found");
      });
  });
})