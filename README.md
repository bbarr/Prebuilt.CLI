# Prebuilt - Dynamic Site Generator

__*These docs (and the project in general) are very much a work-in-progress.*__

## Installation
`yarn global add prebuilt-cli`

## Get Started
```
mkdir my-project
cd my-project
prebuilt init
```


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

## The General Idea
Prebuilt has two parts to it.

1. A very simple static site generator that uses Markdown for frontmatter and Liquid everywhere to make website creation infinitely flexible.

2. A syncing server that takes care of auto-deploying and syncing to external data sources.

Let's start with...
### The static site generator

There are 3 top level directories that matter:

```
input/
output/
data/
```

These are generated when you call `prebuilt init` in your project directory. `input/` holds your source files, `output/` the generated files, and 'data/' is 
where your data goes (only in the form of JSON files for now).

`prebuilt init` also creates a `config.yaml` file which we will get into later.

### Example: Hello world!
`input/index.html`:

```
Hello world!
```
Running `prebuilt build` would render a file `output/index.html` containing "Hello world!".

### Example: Custom output file name
Let's say we want to call the output file `output/hello-world.html`.

`input/index.html`:

```
---
output: hello-world.html
---
Hello world!
```

Running `prebuilt build` would render a file `output/hello-world.html` containing "Hello world!".

### Example: Multiple output files
Great! Now let's say we wanted to generate multiple output pages from the same template?

`input/index.html`:

```
---
-
  output: first.html
-
  output: second.html
---
hello world
```

That's right, our frontmatter is Markdown so we simply create a list in Markdown with multiple frontmatters, each generating its own output page.

Running `prebuilt build` would render the following files:

`output/first.html`:
```
Hello world!
```
`output/second.html`:
```
Hello world!
```

### Example: Data-driven multiple files
Let's say we want to generate some pages for some data in our `data/` folder. 

Given the following data:
`data/products.json`:

```
[ 
  { id: 1, name: 'product 1', price: 1000 }, 
  { id: 2, name: 'product 2', price: 2000 } 
]
```

And given the following template:
`input/product.html`:

```
---
{% for product in data.products %}
-
  output: shop/{{ product.name | slugify }}.html
{% endfor %}
---

<h1>{{ product.name }}</h1>
```

Running `prebuilt build` will generate:

`output/shop/product-1.html`:
```
<h1>product 1</h1>
```

`output/shop/product-2.html`:
```
<h1>product 2</h1>
```
