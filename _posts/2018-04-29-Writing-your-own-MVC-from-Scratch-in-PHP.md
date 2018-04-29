---
layout: post
title: "Write your own MVC from scratch in PHP"
tagline: ""
categories:
image: /test.png
author: "Chaitya Shah"
meta: "Web Development"
---


# Post in Progress not Complete.

In this post, we will learn what is MVC and how I created a MVC framework from scratch.



## What the heck is MVC ?

![MVC](https://qph.fs.quoracdn.net/main-qimg-5fe8c013edf4456a85967713963ac590)

The Model-View-Controller (MVC) is an architectural pattern. It divides the application into three logical components viz. Model, View, Controller.

- Model

  > This is the memory of the application all the database operations are done in this area/module/folder.


- View
  > This is the frontend of the application. Most framework have a templating  engine, which helps to integrate the backend and the front end easily.


- Controller

  > This is the heart and soul of the application. All the logical components, the conversation between the backend and the front end happends in this part of the application.

In layman terms MVC is nothing but a division of you app into modules which talk to each other to do specific task.

This is useful because now you can easily track the problems and error and pin point the part which is not behaving the way you want it too.

For example if your database is not acting the way it should, you know there is something wrong in the model and you go and fix it. No need to read through the complex login and authentication code you wrote. You dont' have to scroll through the php page which contains all the html and php to find the database code.

This pattern is famous on the web, but many mobile applications also follow a variant of this pattern.

## Let's get started

Now we know what MVC is, now to start writing our first MVC.

What we want is a single entry point that routes to the that particular component or module.

We have two options to do This

1. We can have a associative array which maps each url to a controller.
2. We can directly have the controller in the url.

I will be using the latter but you can easily implement the first one too.

Let's see how we will route our requests.

So the user will enter something like.

`localhost/Appname/index.php/ControllerName/functionName/args.../args../moreargs/`

in normal php we already use the pattern
`localhost/Appname/whateverPhpFileWeWant.php`

now instead of using different PHP files we just route the request to them by using  `index.php`

For routing we need to know the arguments passed in the url after `index.php`.

This piece of code helps me find the start index of the arguments we need.

```PHP

function getArgumentStart($uri){
		foreach ($uri as $key => $value){
			if($value == 'index.php'){
				if($key == count($uri) - 1 ) return -1;
				return $key+1;
			}
		}
}

```

here `$uri` is `parse_url($_SERVER['REQUEST_URI']);`.

This function return  `-1` if the url is incorrect, otherwise we get the index where **ControllerName** starts

Now all we need to do is call the function belonging to a specific controller.

Before doing that let's look at the structure of the controller.

So the controller will be a class that extends to the base class `CJ_Controller.php`
CJ_Controller will have all the helper functions we need in the Controller.

```PHP

class CJ_Controller{

	function __construct(){
		echo "CJ_Controller created";
	}
	function load_view($view, $args){
		foreach ($args as $vname => $vvalue) {

			$$vname = $vvalue;
		}
		require_once(__DIR__.'/../view/'.$view.'.php');

	}
}


```
