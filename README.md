Rigsketball 2013 Bracket
=========

An interface for signing up for, updating, and visualizing the 2013 rigsketball bracket

####Deployment:

install dependencies:

    npm install .
    npm install -g config-heroku

copy and edit the below with your credentials, then paste it into the command line:

    '{
      "environment" : "production",
      "signupFormId" : "<google sign up form id>",
      "db" : {
        "name" : "<db name>",
        "host" : "<db host>",
        "port" : <db port>,
        "auth" : true,
        "user" : "<db username>",
        "pass" : "<db password>"
      },
      "rootuser" : "<root user name>",
      "rootpass" : "<root pass>"
    }' > config/heroku.json
    
    heroku create <your app name>
    config-heroku save
    git push heroku master

Boom. A bracket is now visible & editable at <your app name>.herokuapp.com.

####Embed:

<iframe src="http://<your app name>.herokuapp.com" width="998" height="730" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>