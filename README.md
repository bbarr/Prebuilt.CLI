# Prebuilt - Dynamic Site Generator

__*These docs (and the project in general) are very much a work-in-progress.*__

## Installation
`yarn global add prebuilt-cli`

## Getting Started (with Moltin data, hosted on Netlify)

Create project directory and initialize site inside it:
```
$ mkdir my-project && cd my-project && prebuilt init
```

Configure your project with credentials for both Moltin and Netlify:

_config.yaml_

```
name: my project
data:
  moltin:
    client_id: my-client-key
    client_secret: my-client-secret
deploy:
  netlify:
    site_id: my-site-id
    access_token: my-access-token
```

Run:
```
$ prebuilt login
```
and follow the instructions until you are logged in. Basically, you will just be emailed a magic auth link which should feel similar to Slack's experience.

Run:
```
$ prebuilt deploy
```
to push config and current templates (at this point just some scaffolded files in input/) up to the Prebuilt server, where it will sync up with Moltin and deploy to Netlify whenever Moltin
data changes, or, when new templates get pushed up with `$ prebuilt deploy`.

Now, let's add some new templates to make better use of our Moltin data.

### Some template files to display our Moltin products
`input/_layout.html`
(_The underscore-prefix tells the generator to skip this file for rendering._)
```
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

`input/index.html`
```
---
layout: _layout.html
---
{% for product in data.products %}
<p><a href="/products/{{product.id}}.html">{{ product.name }}</a></p>
{% endfor %}
```

`input/product.html`
```
---
{% for product in data.products %}
-
  output: products/{{ product.id }}.html
  title: product.name
  layout: _layout.html
{% endfor %}
---

{{ product.name }}

```

Now run:
```
$ prebuilt build
```
And voila!, the `input/` files are rendered into `output/`.

Well, not quite. You synced up data and templates on the server, but not locally! If you look in your `data/` directory, it will just have our example data.

Let's change that by running:
```
$ prebuilt pull-data
```
and you will see the current data from Moltin available as JSON files in `data/`. This is useful for developing locally, and can be done whenever you want to pull down a fresh set of any remote data configured in `config.yaml`.

Want to keep developing locally and have your template files auto-built as they change?

Run:
```
$ prebuilt develop
```
and head to localhost:5000

Already, your site should be live, and syncing whenever Moltin data changes. Want to redeploy your fancy new template files? Just run `$ prebuilt deploy` again.

Speaking of commands, here is the full list, along with basic descriptions:

## Commands

>__prebuilt init__
Initialize new project in current directory.
Creates the following folders/files:
`input/`
`output/`
`data/`
`config.yaml`

>__prebuilt build__                
One-off build from input/ into output/

>__prebuilt develop__         
Start dev server, rebuilding on changes in data or input

>__prebuilt pull-data__   
Pulls data from remote to local. This does not happen automatically with "develop" command because you might want to customize or tweak your local data files while developing your templates.

>__prebuilt deploy__          
(Re)uploads config, templates, user-defined data files to Prebuilt's syncing servers for auto-redeploying on data changes

>__prebuilt env__                  
List all environment variables

>__prebuilt env:get [key]__        
Get env key

>__prebuilt env:set [key] [val]__  
Set env key

>__prebuilt env:unset [key]__      
Unset env key

>__prebuilt login__                
Login with a magic link sent to your email

>__prebuilt logout__               
Logout, removing the ability to deploy or sync remote data

>__prebuilt whoami__               
Prints out the email address of the current login

