"https://something-samuelc.pythonanywhere.com/" ==> Our app domain

https://something-samuelc.pythonanywhere.com/admin ==> access to our sqlite3.db GUI
superuser(admin credential) exists


1. Every user's task(either created manually or requested from Canvas) are saved in sqlite3.db
2. weather, location, temperature, and username displayed by live api communications (home/ home_week)
3. weekview/dailyview automatically displays and save with today's date.
4. Canvas's assignment can be imported by "sync canvas" button. First time users are prompted to input their access-token. They don't need to since then (db stores user's token) 
                                        how to generate access-toke: go to Canvas -> profile - > settings -> generate access-token
                                         we can later access it by Canvas credentials, but we need to register our app on Canvas' side


