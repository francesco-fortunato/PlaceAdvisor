# PlaceAdvisor

Our web application, **PlaceAdvisor**, is designed with the aim of simplifying the search for points of interest in a specific area or city. After obtaining all the relevant information about a point of interest (address, map, historical background, and more), users can also view reviews from other users and, if desired, contribute their own reviews.

###### Technologies Used
- **Swagger**: To provide well-documented APIs.
- **OpenWeatherMap API**: Used for obtaining daily weather information for a given point of interest.
- **HERE API**: Utilized for obtaining maps of points of interest.
- **OpenTripMap API**: The primary API for our service, enabling us to obtain information about places and details about them.
- **Google Photos**: Used for uploading photos in reviews or feedback, with OAuth access.
- **Facebook**: Utilized for OAuth access and sharing posts.
- **RabbitMQ**: Employed for sending feedback to the feedback consumer.
- **Web Socket**: Used for logging and chat with support.
- **CouchDB**: Utilized for data storage.
- **OpenSSL**: Enables secure HTTPS connections.
- **Docker**

###### API
- OpenTripMap:  https://opentripmap.io/docs#/ + categories: https://opentripmap.io/catalog
- Facebook Oauth: https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow?locale=it_IT
- Google Oauth & Google Photos: https://developers.google.com/photos/library/guides/get-started
- HERE API: https://developer.here.com/documentation/maps/3.1.25.0/dev_guide/topics/get-started.html
- OpenWeatherMap API: https://openweathermap.org/current

## Installation
***
Instruction:
```
$ git clone https://github.com/francesco-fortunato/PlaceAdvisor.git
$ cd PlaceAdvisor/
$ npm install
$ npm start
```
[Backlog, user stories](https://docs.google.com/spreadsheets/d/1l9VxjUQX7xAIwvrpfBEcYI7EuRXECv_waNIPeZOM3lQ/edit#gid=432542262)
[slide](https://docs.google.com/presentation/d/1jWPYtxWfY7Kokwy4PX7y3f6Q65fq7V1jPYSkkGITGZA/edit#slide=id.g2909063f93f_0_230)
