# Welcome to the Waterfalls 1.0 App  


## Overview  

The Waterfalls 1.0 App is a Point‑of‑Interest (PoI) manager that allows users to add as many PoIs as they wish.

The app is designed with waterfall PoIs in mind. Users can mark waterfall locations, add descriptions, and include additional details such as transportation, restaurants, and accommodation coordinates, making them easy to view on the map.

Waterfalls 1.0 can be described as a personal planner or diary for storing information about waterfalls and related points of interest, such as viewpoints, attractions and activities, restaurants, safety and emergency services (e.g., fire brigade, hospitals), and more.

It is considered a personal planner because it is limited to the user who created the content. Future development will focus on transforming the app into a collaborative platform.


## Usage & Features  

The website is accessible at: https://hdipcs-sem3-fswd1-asgmt1-waterfalls-1-0.onrender.com  


## Technologies Used  

- ***Frontend***: Hapi Vision, Handlebars, Inert, HTML5, CSS3
- ***Backend***: Node.js, Hapi.js, Cookie Auth, JWT Auth, Mongoose, MongoDB, Cloudinary
- ***Validation tools***:  Joi, Hapi validation, Mongoose schema validation
- ***Testing***: Mocha, Chai, Axios
- ***Dev Tools***: ESLint, Prettier, Nodemon
- ***Hosting***: Render + MongoDB Atlas


## Contributors  

Leandro de Oliveira Santos - Higher Diploma in Computer Science Student at SETU.  


## Acknowledgments  

This README.md followed the template from the Github user "comp1800" – [web_template](https://github.com/comp1800/web_template). Thank you, comp1800.  
Thank you to all who have been listed in this project reference.  
Thank you, Professor ***Eamonn de Leastar***, for the incredible lectures.  


## Limitations and Future Work  


### Limitations  
Due to the steep learning curve and the fact that the project was developed by a single person, the app currently lacks several features that would improve the user experience. These will be implemented as development continues.


### Future Work  
Sub‑PoIs (attributes within a PoI) were grouped by category. The PoIs themselves (the waterfalls) were not grouped in this version, but the same grouping method can be applied. Grouping can also be enhanced to allow users to filter by tags such as easy, moderate, hard to reach, or by user‑defined collections like to visit, visited, reviewed, as well as facilities such as transport available, accommodation nearby, restaurants available.

Currently, Waterfalls 1.0 functions as an individual planner rather than a collaborative platform. A future enhancement will allow users to share PoIs as read‑only and eventually enable community collaboration, allowing others to contribute additional information about specific waterfalls.


## License
There is no license attributed to this project, but this project is live on [Render.com](https://hdipcs-sem3-fswd1-asgmt1-waterfalls-1-0.onrender.com) and on my [GitHub](https://github.com/shyllenno/HDipCS-Sem3-FSWD1-Asgmt1-Waterfalls-1.0) account.  


## Project Structure  
```
HDipCS-Sem1-WD2-Asgmt-WeatherTop
├── .env_example
├── .eslintrc.json
├── .gitignore
├── .prettierrc.json
├── README.md
├── package-lock.json
├── package.json
├── public
│   └── images
│       ├── RestauranteLaRueda1975.jpg
│       ├── RestauranteLaRueda1975.txt
│       ├── devilstroat.jpg
│       ├── devilstroat.txt
│       ├── hospital-turistico.jpeg
│       ├── hospital-turistico.txt
│       ├── iguazufalls.jpg
│       ├── iguazufalls.txt
│       ├── niagara-falls.jpg
│       ├── niagara-falls.txt
│       ├── powerscourt-house-gardens.jpg
│       ├── powerscourt-house-gardens.txt
│       ├── powerscourt-waterfall.jpg
│       ├── powerscourt-waterfall.txt
│       ├── victoria-falls.jpg
│       ├── victoria-falls.txt
│       ├── waterfall1.jpg
│       ├── waterfall1.txt
│       ├── waterfall2.jpg
│       ├── waterfall2.txt
│       ├── waterfall3.jpg
│       └── waterfall3.txt
├── src
│   ├── api-routes.js
│   ├── api
│   │   ├── jwt-utils.js
│   │   ├── logger.js
│   │   ├── poi-api.js
│   │   ├── user-api.js
│   │   └── waterfall-api.js
│   ├── controllers
│   │   ├── about-controller.js
│   │   ├── accounts-controller.js
│   │   ├── dashboard-controller.js
│   │   └── waterfall-controller.js
│   ├── models
│   │   ├── db.js
│   │   ├── image-store.js
│   │   ├── joi-schemas.js
│   │   ├── json
│   │   │   ├── poi-json-store.js
│   │   │   ├── store-utils.js
│   │   │   ├── user-json-store.js
│   │   │   └── waterfall-json-store.js
│   │   ├── mem
│   │   │   ├── poi-mem-store.js
│   │   │   ├── user-mem-store.js
│   │   │   └── waterfall-mem-store.js
│   │   └── mongo
│   │       ├── connect.js
│   │       ├── mongoSchemas.js
│   │       ├── poi-mongo-store.js
│   │       ├── seed-data.js
│   │       ├── user-mongo-store.js
│   │       └── waterfall-mongo-store.js
│   ├── server.js
│   ├── views
│   │   ├── about-view.hbs
│   │   ├── admin-dashboard-view.hbs
│   │   ├── dashboard-view.hbs
│   │   ├── edit-view.hbs
│   │   ├── layouts
│   │   │   └── layout.hbs
│   │   ├── login-view.hbs
│   │   ├── main.hbs
│   │   ├── partials
│   │   │   ├── add-points-of-interest.hbs
│   │   │   ├── add-waterfall.hbs
│   │   │   ├── edit-points-of-interest.hbs
│   │   │   ├── edit-waterfall.hbs
│   │   │   ├── error.hbs
│   │   │   ├── gallery-points-of-interest.hbs
│   │   │   ├── image-selection-button.hbs
│   │   │   ├── list-points-of-interest.hbs
│   │   │   ├── list-waterfalls.hbs
│   │   │   ├── menu.hbs
│   │   │   ├── poi-category-dropdown.hbs
│   │   │   ├── search-bar.hbs
│   │   │   ├── waterfall-brand.hbs
│   │   │   └── welcome-menu.hbs
│   │   ├── signup-view.hbs
│   │   ├── user-profile-view.hbs
│   │   ├── waterfall-group.hbs
│   │   └── waterfall-view.hbs
│   └── web-routes.js
└── test
    ├── api
    │   ├── auth-api-test.js
    │   ├── poi-api-test.js
    │   ├── user-api-test.js
    │   ├── waterfall-api-test.js
    │   └── waterfall-service.js
    ├── fixtures.js
    ├── models
    │   ├── poi-model-test.js
    │   ├── user-model-test.js
    │   └── waterfall-model-test.js
    └── test-utils.js
```

