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

Now we know what MVC is,let's start writing our MVC.

We want a single entry point that routes to the a particular component or module.

We have two options to do this

1. We can have a associative array which maps each url to a controller.
2. We can directly have the controller in the url.

I will be using the latter but you can easily implement the first one too.

Let's see how we will route our requests.

Our url will look something like.

```

localhost/Appname/index.php/ControllerName/functionName/args.../args../moreargs/

```
in normal php we already use the pattern `localhost/Appname/whateverPhpFileWeWant.php`

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

A generic controller will look like

```PHP
// we need to import the CI_Controller we wrote in order to extend it
require_once(__DIR__.'/../core/CJ_Controller.php');

class Test extends CJ_Controller{
	function __construct(){
		echo 'CLASS CREATED '."<br />";

	}

	function hello_get(...$args){

    echo "Hello, World! from GET";
	}

  function hello_post(...$args){

    echo "Hello, World! from POST";
  }

}


```
Now the function names have \_get that means that the functions handle GET requests.

We will see in the `index.php` how we handle the `\_get` and `\_post`.

So now we have the Controller ready and the functions we want to call. We just have to make sure that the url routes to the correct controller and function.

Getting the juice from the url

```PHP
// converting url to array
$parameters = explode('/', $uri['path']);

// get the start where controllerr starts
$start = getArgumentStart($parameters);

// now we will just do a simple error handling

if($start != -1){

  $controller_name = $parameters[$start];

  $function_name = $parameters[$start+1];

  // now we can pack the rest of the values as arguments.

// for that we will create a simple array

$args = array()

// setting the correct index
$start+=2;

for(;$start<count($parameters);$start++){
  array_push($args, $parameters[$start]);
}

// Now the only thing that is left is to call the function

}else{

  // you can load a 404.html or some other page too.
  echo "404 not found";
}


```
So far we have collected all the necessary values we need to route our request. Now let's see how can we call our funciton.

All we need is to create an instance of the controller using `$controller_name` and call `$function_name`. Now this is tough in some other languages but PHP has [variable variable](http://php.net/manual/en/language.variables.variable.php) No! not a typo. click on the link to know more.

But after some research, I found a much simpler way of doing this, even without using **variable variable**.

This sweet function __[call_user_func_array](http://php.net/manual/en/function.call-user-func-array.php)__ does everything for you.
It takes two parameters one is a callback and second is the parameter array you want to pass to the callback.

Here is a simple example from the official documentation.

```PHP

function foobar($arg, $arg2) {
    echo __FUNCTION__, " got $arg and $arg2\n";
}
class foo {
    function bar($arg, $arg2) {
        echo __METHOD__, " got $arg and $arg2\n";
    }
}


// Call the foobar() function with 2 arguments
call_user_func_array("foobar", array("one", "two"));


// We are interested in this method
// Call the $foo->bar() method with 2 arguments
$foo = new foo;
call_user_func_array(array($foo, "bar"), array("three", "four"));


```

This is what was missing.


let's update the `index.php`

```PHP
// converting url to array
$parameters = explode('/', $uri['path']);

// get the start where controllerr starts
$start = getArgumentStart($parameters);

// now we will just do a simple error handling

if($start != -1){

  $controller_name = $parameters[$start];

  $function_name = $parameters[$start+1];

  // now we can pack the rest of the values as arguments.

// for that we will create a simple array

$args = array()

// setting the correct index
$start+=2;

for(;$start<count($parameters);$start++){
  array_push($args, $parameters[$start]);
}

call_user_func_array(array(new $controller_name, $function_name), $args); // <===

}else{

  // you can load a 404.html or some other page too.
  echo "404 not found";
}


```


Now with this much code our MVC is working we can route our requests to the controller and function we want.

But we are not handling the `GET` and `POST`  methods yet.

Let's quickly take care of it.

Change the assignment of the `$function_name` to

```PHP
$function_name = $parameters[$start+1] . "_" . strtolower($_SERVER['REQUEST_METHOD']);

```
This will append the method to the function name, just like how we named our function in the controller, Simple isn't it.

Only element left is the **Model**
