# BKMS-Project
Project Repository for BKMS Project.

To start:
1. install nodejs (lts) version and npm for the local environment. (nvm is recommended)
2. npm i
3. add .env file for postgres connection.
   ```env
   USER=
   PASSWORD=
   DATABASE=
   HOST=
   PORT=
   ```
4. cd ./data && edit files at ./data folder for postgres connection
5. download movielens dataset and rename the dataset columns. (ex. rating.csv: ratingId -> id)
5. preprocess.py vector_processing.ipynb at ./data folder
6. cd ../
7. npm start
