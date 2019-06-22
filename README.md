# Lambda to extract transform and load data into the database

## Environment Variables ".env"
`DB_USERNAME="restaurants"`<br>
`DB_PASSWORD="xxxxx.us-east-1.rds.amazonaws.com"`<br>
`DB_DATABASE="restaurants"`<br>
`DB_HOST=5432` <br>
`URL='https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD'` <br>
`DB_COLS = '["camis","dba","boro","building","street","zip","phone","action","score","grade"]'` <br>