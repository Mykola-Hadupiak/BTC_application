# BTC application

**Before start:** </br>

I used the default one DB_USER and DB_PASSWORD.

Also, insert SMTP_USER and SMTP_PASSWORD that I send, to the .env file.</br></br>

**_INSTRUCTIONS_**

1. To initialize the database, run the file setup.js like</br>
**node ./src/setup.js**</br>
Now you have tables in DB which are implemented in src/models

3. Start your app which is ./src/app.js</br></br>


**_METHODOLOGY_**

  basePath: '/api'</br></br>

**- Emails**
1. Sending a GET request to **/emails** will give you a full array of email objects that are subscribed or unsubscribed with status 200.</br>
In form like:
```
  [
    {
      "email": "example@example.com",
      "status": "subscribed"
    },
    {
      "email": "example2@example.com",
      "status": "unsubscribed"
    }
  ]
```
  In DB you also have createdAt, deletedAt (if necessary, we can also show it here)
  
2. To subscribe a new email, you need to send a POST request to **/emails** and write the email in the body like:
```
  {
    "email": "example@example.com"
  }
```
Email must be a string and must be, otherwise you will get a 400 error.

Also, if the email already exists, you will not be able to add it and will receive a 409 error "Email already exists".

Also, if you want to re-subscribe an email, you can do this if the email has previously unsubscribed from the list.

3. To unsubscribe an email, you need to send a DELETE request to **/emails** and write the email in the body like:
```
  {
    "email": "example@example.com"
  }
```
In response you will receive a status of 200 "Email deleted".</br>
If such an email does not exist you will receive an error 404 "Email not found".</br></br>

**- Rate** </br>

  Rate is using free api described here: https://btc-trade.com.ua/page/api_documentation

  So we will have BTC to UAH in form like:
  ```
    {
      "btc_uah": {
        ...
        "buy": "99999999.999"
        ...
      }
    }
  ```

1. Sending a GET request to **/rate** will give you a rate in format:
```
  {
    "rate": 99999999.999
  }
```

  and write it to DB with updatedAt (to use it in the future when sending emails if the price has changed by more than 5%, etc)

2. Sending a POST request to **/rate** will send emails with the current rate to all subscribed emails, and will also return the following data:
```
  {
    "message": "Rate successfully sent to active subscriptions",
    "emails": [
      "example@example.com"
    ],
    "errors": [
      "example2@example.com"
    ]
  }
```

The email will look like:
```
  subject: 'BTC UAH Exchange Rate Update',
  html: 'Current Rate: 9,999,999.99 UAH'
```
</br>

**- Metrics**

1. Sending a GET request to **/metrics** will give you a metrics with:

email_subscribe_count</br>
email_unsubscribe_count</br>
email_send_count</br>
email_send_error_count</br>
exchange_rate

</br>

**_ADDITIONAL_**

1. There is also a daily email newsletter at 9.00 am Kyiv time, where the current exchange rate will be indicated.
2. And also, every hour the current rate is checked and compared with the previous one, and if it has changed by more than 5%, we send an email.
