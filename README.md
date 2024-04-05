<!-- Title -->
<h1 align="center">
  News React Native App
</h1>

<p>
    The app is build using container view architecture separating logic and view
</p>

<!-- Body -->

```sh
git clone https://github.com/deepgandhi00/newsApp.git
cd news
npx react-native run-android
```

## Folder Structure

- src (root folder for project)
  - components (contains common components like cards)
  - navigator (all the navigators like stack navigator used in application are stored here)
  - screens (all the screens for the app)
  - utils (contains utils files like common styles, colors, networking, utility functions and helper files for shared preferences, background task, sql db)
- assets (contains assets like images and screenshots)

## Library Used

- react-navigation
- axios
- react-native-background-actions
- react-native-default-preference
- react-native-sqlite-storage
- react-native-swipeable-item

## Screens

<h3>Splash</h3>

<p>
    Here connection for DB is created and table is created if it does not exists and also background service is started if data does not exists in table.
</p>

<img src="assets/screenshots/splash.png" alt="Splash" style="height:450px; width:200px;"/>



<h3>News List</h3>

<p>
    Here news are fetched from DB and showed in list form, interval is set to fetch new news items every 10 secs or if manually refresh triggered by user.
</p>

<img src="assets/screenshots/list.png" alt="News List" style="height:450px; width:200px;"/>


## Flow

- App loaded and db helper instance is created in app.js file which is passed through context to the screens.
- Initial Splash screen is loaded which creates a connection to SQLLite DB and creates table if it does not exists, it also check for the data presents on every launch of the app.
  - if data is not present then it triggers background task. After the initialization user is redirected to news list screen.
  - if data is present the then user is redirected to the list screen.
- In the background task the api is called and 100 news items are fetched and stored inside SQLLite DB.
- In news list screen it checks for the data in the table.
  - if data does not exists then regular interval is created to check if data is fetched from the api and is available in DB.
  - if data exists then initial items are fetched from DB and an interval is also created which fetches new items from DB after every 10 secs.
  - if any user manually triggers the refresh then the interval resets again to 10 secs and after the new data is fetched from DB.
  - if during fetching from DB the threshold limit is crossed then the background task would be triggered and news api would be called and the response would be stored in the DB.


https://github.com/deepgandhi00/newsApp/assets/45937003/14a23c2b-5152-40ee-94e9-30acf88e248c

