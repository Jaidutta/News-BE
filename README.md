# NC News

NC News is a RESTful API for the Northcoders news application. The Northcoders news is a web application where users can read, search, and post articles and comments.

The API is hosted at the following location:

[https://news-be-api.onrender.com/api](https://news-be-api.onrender.com/api)

This will currently provide a list of public endpoints to interact with.

## Installation

### Requirements

The following applications need to be installed:

* Node.js (minimum version v23.5.0)
* PostgreSQL (minimum version v8.13.3)

### Getting Started

1.  **Clone the repository to your local machine:**

    ```bash
    git clone [https://github.com/Jaidutta/News-BE.git](https://github.com/Jaidutta/News-BE.git)
    ```

2.  **Install relevant packages:**

    ```bash
    npm install
    ```

3.  **Set environment variables:**

    * `PGDATABASE`: The PostgreSQL database name.
    * `DATABASE_URL`: To be added to the `.env.production` file.

### Development Environment Setup

1.  Create a new file named `.env.development`.
2.  Add the following variable to it:

    ```
    PGDATABASE=nc_news
    ```

3.  Ensure that the `.env.development` file is added to `.gitignore`.

### Test Environment Setup

1.  Create a new file named `.env.test`.
2.  Add the following variable to it:

    ```
    PGDATABASE=nc_news_test
    ```

3.  Ensure that the `.env.test` file is added to `.gitignore`.

### Production Environment Setup

1.  Create a new file named `.env.production`.
2.  Add the following variable to it:

    ```
    DATABASE_URL=postgresql://postgres.[USERNAME]:[PASSWORD]@[aws-0-eu-west-2.pooler.supabase.com:6543/postgres](https://www.google.com/search?q=https://aws-0-eu-west-2.pooler.supabase.com:6543/postgres)
    ```

    * Replace `[USERNAME]` and `[PASSWORD]` with the relevant information.

3.  Ensure that the `.env.production` file is added to `.gitignore`.

### Generating the Databases

To create the development and test databases, run:

```bash
npm run setup-dbs
```