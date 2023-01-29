# BlogPost REST API
This is a simple REST API for a blog post. It is built using Node.js, Express, and MongoDB.


# Usage
Create a .env file in the root directory and add the following

```
JWT_SECRET
EMAIL
PASSWORD
```

Install dependencies

```
npm install
```

Run App

```
npm start
```


# Endpoints
| Endpoint | Method | Description | Autherization | Body 
| --- | --- | --- | --- | --- |
/ | GET | Get data of 10 posts | No | No
/?page=N | GET | Get data of 10 posts on page N | No | No
/api/register | POST | Register a new user | No | name, email, password
/api/login | POST | Login a user | No | email, password
/api/reset_password | POST | Reset password | No | email, password
/api/create | POST | Create a new post | Yes | title, content
/api/update | PUT | Update a post | Yes | title, content, id
/api/delete | DELETE | Delete a post | Yes | id