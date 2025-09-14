# Animals and Nature

This is a message board where animal enthusiasts could engage in discussions pertaining to animals and nature.  Users could create an account with a valid email.  Once an account is set up, users could start discussions by posting questions, comments, and media. Users could also send feedback via email regarding the platform.  The web application was hosted using Amazon Web Services.  Please note that this site may not be currently hosted due to the cost of hosting.  You could view a demonstration of the application via this [link](https://project-videos-vs.s3.amazonaws.com/animals-and-nature/animals-and-nature-demo.mp4).

There is a complimentary web application, Animals and Nature Messages, where administrators could easily login and read customer feedback pertaining to Animals and Nature.  You would need an adminstrator account to view messages.  A Next.js application provides the user interface and OpenID Connect was used for authentication.  Vercel was used for deployment of the user interface.

A Spring Boot REST API provides CRUD operations for the emails.  AWS SNS and AWS Lambda was used to receive email messages and send the messages to the API.  Authorization was built in using OAuth 2.0.  The API was hosted on Google Cloud Platform.  Please note that this application may not be currently hosted due to the cost of hosting.
