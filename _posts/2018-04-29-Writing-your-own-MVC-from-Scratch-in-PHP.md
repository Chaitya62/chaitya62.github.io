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

In this post, we will learn what is MVC and how to create a MVC framework from scratch.



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

This is useful because now you can easily track the problems and error and pin point the part which is not behaving the way you want it to.

For example if your database is not acting the way it should, you know there is something wrong in the model and you can go and fix it. No need to read through the complex login and authentication code you wrote. You dont' have to scroll through the php page which contains all the html and php to find the database code.

This pattern is famous on the web, but many mobile applications also follow a variant of this pattern.

## Let's get started


### Directory Structure

First we will look at the directory structure.


```bash

├───config
├───controller
├───core
│   └───database
├───model
└───view

```
`config`: It contains all the configuration files

`controller`: It contains all the controllers

`core`: Core files which we use to create our models and controllers

`database`: It contains the connection database drivers

`model`: It contains all the models

`view`: It contains all the views.




### Entry point

We want a single entry point that routes to a particular component or module.

We have two options to do this:

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

```php

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


### Controller

Before doing that let's look at the structure of the controller.

So the controller will be a class that extends to the base class `CJ_Controller.php`.

CJ_Controller will have all the helper functions we need in the Controller.

```php

class CJ_Controller{

	function __construct(){
		echo "CJ_Controller created";
	}

  // we will look at this in the view
	function load_view($view, $args){...}
}


```


A generic controller will look like

```php

// we need to import the CI_Controller to inherit from it
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

We will see in the `index.php` how we handle the `_get` and `_post`.

So now we have the Controller ready and the functions we want to call. We just have to make sure that the url routes to the correct controller and function.


### Routing

Getting the juice from the url

```php
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
So far we have collected all the necessary values we need to route our request. Now let's see how can we call our function.

All we need is to create an instance of the controller using `$controller_name` and call `$function_name`. Now this is tough in some other languages but PHP has [variable variable](http://php.net/manual/en/language.variables.variable.php) No! not a typo. click on the link to know more.

But after some research, I found a much simpler way of doing this, even without using **variable variable**.

This sweet function __[call_user_func_array](http://php.net/manual/en/function.call-user-func-array.php)__ does everything for you.
It takes two parameters one is a callback and second is the parameter array you want to pass to the callback.

Here is a simple example from the official documentation.

```php

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

```php
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


Now with this code our MVC is working we can route our requests to the controller and function we want.

But we are not handling the `GET` and `POST`  methods yet.

Let's quickly take care of it.

Change the assignment of the `$function_name` to

```php
$function_name = $parameters[$start+1] . "_" . strtolower($_SERVER['REQUEST_METHOD']);

```
This will append the method to the function name, just like how we named our function in the controller, Simple isn't it.


### Model

 The **Model** is the memory of the MVC and you cannot create a truly functional and dynamic app without database.

These methods were implemented:

- Read (select)
- Update (update)
- Delete (delete)
- Create (insert)
- Where clause

You can however increase the functionality or stick to pure SQL queries.

So we will just look at how we can use the model in the controller. You can build the Model class anyway you want.

So our model will inherit from our core class `CJ_Model.php`.

Here is how the `CJ_Model.php` looks like.

```php

// let's look at this next
require_once(__DIR__.'/database/CJ_Connection.php');

class CJ_Model{
	function __construct(){
		echo 'CJ_Model class created <br>';

    // the important part.
    $db = new CJ_Connection();
		$this->connection =  $db->getConnection();
	}

	function create($tableName,$insertWhat){...}

	function read($tableName,$args,$whereArgs){...}

  function update($tableName,$whatToSet,$whereArgs){...}

  function delete($tableName,$whereArgs){...}

  function where($sql,$whereArgs){...}

}

```

`CJ_Model` has all the helpers and it has the connection.

The connection is the most important part and you can get away without implementing the rest and just using classic SQL queries.

The `CJ_Connection.php` looks like


```php

class CJ_Connection{
	function __construct(){

    // this is the configuration file
		require_once(__DIR__.'/../../config/database.php');
		$this->db_params = $db_params;
	}

	function getConnection(){
		$conn = new mysqli($this->db_params['servername'],$this->db_params['username'],$this->db_params['password'],$this->db_params['dbname']);
		if($conn->connect_error){
			die("Connection Faild: ". $conn->connect_error);
		}
		return $conn;
	}
}

```


The generic model will look like


```php

// require the core CJ_Model
require_once(__DIR__.'/../core/CJ_Model.php');


class TestModel extends CJ_Model {

  function __construct(){
		parent::__construct();
		echo 'Test Model  CREATED '."<br />";
	}


  // test function to check model is working
  function sayHello($name){
		echo "Welcome to  ". $name;
	}

}

```


### Config

The config directory can contain many more files, but I have used it to store the database configuration.

So the config directory contains only one file `database.php`


```php

$db_params = array(
	'servername' => '',
	'username' => '',
	'password' => '',
	'dbname' => ''
);

```


### Connecting the Model and Controller

Inside the controller  `require` the model you want to use and then create an instance of the model's class in the constructor

The code will look something like


```php

// require the model
require_once(__DIR__.'/../model/TestModel.php');
require_once(__DIR__.'/../core/CJ_Controller.php');


class Test extends CJ_Controller{
	function __construct(){
    ...

    // create an instance of the model
    $this->test_model = new TestModel();

    ...
  }

  function hello_get(...$args){

		$this->test_model->sayHello('CJ_MODEL');
	}


  ....
}


```

That's it. Now you have the **Model** and the **Controller** working.


### View

By far this is the simplest to implement.

We will create a `load_view` function in `CJ_Controller.php` that will inject the parameters we pass in the view globally.

The view can be a simple php file and no fancy classes or inheritance is needed there.


The `load_view` function will look like


```php

function load_view($view, $args){
		foreach ($args as $vname => $vvalue) {

			$$vname = $vvalue;
		}
		require_once(__DIR__.'/../view/'.$view.'.php');

}


```

Now we can call a view from our controller using


```php

// inside the controller

function test_get(){		
		$this->load_view('home', array('content'=>'<h1>This content is sent from controller</h1>'));

  }


// home.php

echo $content;


```

That's it, we have a simple working MVC, which we created in less then 300 lines of code.

You can check the entire code on github [here](https://github.com/Chaitya62/CJ-MVC)

Thanks for reading so far. You can write to me at chaitya.shah@somaiya.edu if you have any suggestions or feedback.

Keep hacking....
