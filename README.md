# NC News Seeding

- To set up the .env files for connecting to the databases (test and development), you need to create two files in the project's root directory:
  1. env.development – for the development database 
      - The environment variable should be PGDATABASE, and the database name is nc_news
         - PGDATABASE=nc_news
  2. .env.test – for the test database
      - The environment variable should be PGDATABASE, and the database name is nc_news_test
         - PGDATABASE=nc_news_test