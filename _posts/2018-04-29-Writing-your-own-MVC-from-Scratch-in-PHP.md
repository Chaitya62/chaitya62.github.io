---
layout: post
title: "Write your own MVC from scratch in PHP"
tagline: ""
categories:
image: /test.png
author: "Chaitya Shah"
meta: "Web Development"
---


In this post, we will learn what is MVC and how I created a MVC framework from scratch.



## What the heck is MVC ?

![MVC](https://qph.fs.quoracdn.net/main-qimg-5fe8c013edf4456a85967713963ac590)

The Model-View-Controller (MVC) is an architectural pattern. It divides the application into three logical components viz. Model, View, Controller.

- Model

This is the memory of the application all the database operations are done in this area/module/folder.

- View
This is the frontend of the application. Most framework have a templating  engine, which helps to integrate the backend and the front end easily.

- Controller

This is the heart and soul of the application. All the logical components, the conversation between the backend and the front end happends in this part of the application.

In layman terms MVC is nothing but a division of you app into modules which talk to each other to do specific task.

This is useful because now you can easily track the problems and error and pin point the part which is not behaving the way you want it too.

For example if your database is not acting the way it should, you know there is something wrong in the model and you go and fix it. No need to read through the complex login and authentication code you wrote. You dont' have to scroll through the php page which contains all the html and php to find the database code.

This pattern is famous on the web, but many mobile applications also follow a variant of this pattern.

## So let's get started

Now we know what MVC is, now to start writing our first MVC.

What we want is a single entry point that routes to the that particular component or module.

We have two options to do This

1. We can have a associative array which maps each url to a controller.
2. We can directly have the controller in the url.

I will be using the latter but you can easily implement the first one too.

Let's see how we will route our requests.

So the user will enter something like.

`localhost/Appname/index.php/ControllerName/functionName/args.../args../moreargs/``
