# Welcome to the Waterfalls 2.0 App  


## Overview  

The Waterfalls 2.0 App is the improved version for the beloved Waterfalls 1.0 app, which is a Point‑of‑Interest (PoI) manager that allows users to add as many PoIs as they wish.

The app is designed with waterfall PoIs in mind. Users can mark waterfall locations, add descriptions, and include additional details such as transportation, restaurants, and accommodation coordinates, making them easy to view on the map.

Waterfalls 1.0 is described as a personal planner or diary for storing information about waterfalls and related points of interest, such as viewpoints, attractions and activities, restaurants, safety and emergency services (e.g., fire brigade, hospitals), and more.

Waterfalls 2.0 take all the goods of the Waterfalls 1.0 to create a collaborative platform, where users can now share their favourite waterfalls spots through public posting, which includes all the marvellous PoI information for that particular Waterfall. 

Waterfalls can now also be rated and reviewed. The rate system is from 1 to 5 stars, and the user can leave a comment as well.

Waterfalls can be shared accross other plataforms.

Security has been improved with the implementation of Sanitisation of Inputs & Outputs, passwords have benn Salted & Hashed, and OAuth is in development.


## Usage & Features  

The website is accessible at: https://hdipcs-sem3-fswd1-asgmt2-waterfalls-2-0.onrender.com


## Technologies Used  

- ***Frontend***: Hapi Vision, Handlebars, Inert, HTML5, CSS3
- ***Backend***: Node.js, Hapi.js, Cookie Auth, JWT Auth, Mongoose, MongoDB, Cloudinary
- ***Validation tools***:  Joi, Hapi validation, Mongoose schema validation
- ***Testing***: Mocha, Chai, Axios
- ***Dev Tools***: ESLint, Prettier, Nodemon
- ***Hosting***: Render + MongoDB Atlas
- ***Covarage Reports***: Instanbul NYC
- ***Sanitisation***: Sanitise-HTML
- ***Salt & Hashing***: BCRYPT
- ***OAuth***: Hapi/Bell (In progress)


## Contributors  

Leandro de Oliveira Santos - Higher Diploma in Computer Science Student at SETU.  


## Acknowledgments  

This README.md followed the template from the Github user "comp1800" – [web_template](https://github.com/comp1800/web_template). Thank you, comp1800.  
Thank you to all who have been listed in this project reference.  
Thank you, Professor ***Eamonn de Leastar***, for the incredible lectures.  


## Limitations and Future Work  


### Limitations  



### Future Work  
The rating system composed of rating stars from 1 to 5 and a comment field, is not locking the POI owner to rate and comment their own POIs, as well as, it is not limiting the number of ratings and comments that a user can give for the same POI.



## License
There is no license attributed to this project, but this project is live on [Render.com](https://hdipcs-sem3-fswd1-asgmt2-waterfalls-2-0.onrender.com) and on my [GitHub](https://github.com/shyllenno/HDipCS-Sem3-FSWD1-Asgmt1-Waterfalls-2.0) account.  


## Project Structure  
```
HDipCS-Sem3-FWSD1-Asgmt2-Waterfalls-2.0
├── package.json
├── package-lock.json
├── public
│   ├── images
│   │   ├── devilstroat.jpg
│   │   ├── devilstroat.txt
│   │   ├── hospital-turistico.jpeg
│   │   ├── hospital-turistico.txt
│   │   ├── iguazufalls.jpg
│   │   ├── iguazufalls.txt
│   │   ├── niagara-falls.jpg
│   │   ├── niagara-falls.txt
│   │   ├── powerscourt-house-gardens.jpg
│   │   ├── powerscourt-house-gardens.txt
│   │   ├── powerscourt-waterfall.jpg
│   │   ├── powerscourt-waterfall.txt
│   │   ├── RestauranteLaRueda1975.jpg
│   │   ├── RestauranteLaRueda1975.txt
│   │   ├── victoria-falls.jpg
│   │   ├── victoria-falls.txt
│   │   ├── waterfall1.jpg
│   │   ├── waterfall1.txt
│   │   ├── waterfall2.jpg
│   │   ├── waterfall2.txt
│   │   ├── waterfall3.jpg
│   │   └── waterfall3.txt
│   └── temp.img
├── README.md
├── References_for_Coverage_Reports.txt
├── src
│   ├── api
│   │   ├── jwt-utils.js
│   │   ├── logger.js
│   │   ├── poi-api.js
│   │   ├── review-api.js
│   │   ├── user-api.js
│   │   └── waterfall-api.js
│   ├── api-routes.js
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
│   │       ├── review-mongo-store.js
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
│   │   │   ├── add-review.hbs
│   │   │   ├── add-waterfall.hbs
│   │   │   ├── edit-points-of-interest.hbs
│   │   │   ├── edit-waterfall.hbs
│   │   │   ├── error.hbs
│   │   │   ├── gallery-points-of-interest.hbs
│   │   │   ├── image-selection-button.hbs
│   │   │   ├── list-points-of-interest.hbs
│   │   │   ├── list-reviews.hbs
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
    │   ├── review-api-test.js
    │   ├── user-api-test.js
    │   ├── waterfall-api-test.js
    │   └── waterfall-service.js
    ├── fixtures.js
    ├── models
    │   ├── poi-model-test.js
    │   ├── review-model-test.js
    │   ├── user-model-test.js
    │   └── waterfall-model-test.js
    └── test-utils.js
```

