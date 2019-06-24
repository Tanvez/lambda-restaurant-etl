# Lambda to extract, transform and load data into the database

Pros: Could trigger the lambda via CloudWatch triggers(cron).
Cons: Lambda functions have a limit of 15mins to finish executing or it will timeout.
Possible solution: could spin up an EC2 server instead

## Environment Variables ".env"
`DB_USERNAME="restaurants"`<br>
`DB_PASSWORD="xxxxx.us-east-1.rds.amazonaws.com"`<br>
`DB_DATABASE="restaurants"`<br>
`DB_HOST=5432` <br>
`URL='https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD'` <br>
`DB_COLS = '["camis","dba","boro","building","street","zip","phone","action","score","grade", "cuisineDescription","inspectionDate","violationCode","violationDescription","criticalFlag","gradeDate","recordDate","inspectionType","createdAt","updatedAt"]'` <br>


## Testing

```sh
npm install
npm run test
```