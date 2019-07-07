---
layout: post
title: "How to create a peer to peer video streaming application using webRTC"
tagline: ""
categories:
image: /test.png
author: "Chaitya Shah"
meta: "peer-to-peer, webrtc, video-streaming, simple video-streaming apps, web-dev, nodejs, javascript"
comments: true
---


Hello, It's been a long time since I blogged about almost anything. Recently, I have been learning great deal of new technologies. Here is one technology. I beleive all software developers must be aware of. This is not a new or cutting-edge tech. It has been around for almost 9 years now. Yet many browsers have only recently started supporting it and many few devs are aware or know how this technology works.

In this blog, I'll explain this technology in the way, I understood it. I don't claim this to be the absolute truth about it and I may dumb down a few things for lucidity.
But, if somethings incorrect or false which might be conceptually wrong drop a message or comment down below. I'll try to fix it. One Other reason of writing this blog is while I was trying to get a grasp of this tech it was tough for me to find a proper resource that explained everything clearly with a proper coding example that was easy to understand.

Enough banter let's start. 


WebRTC is a project that allows web browsers and mobile applications to develop complex RTC application using a simple API. You can have a solid RTC application without having to write any low level RTC programs on your own by using the simple API. This API provides 2 functionalities for the developer writing the application: 

1. Get Users Media like Audio and Video 

2. Setup a peer-to-peer connection


The first part of getting user media is very simple and straight forward. It just asked for the user permission and provides you with a stream object that you can pass around as you may see fit.

Here is a simple example of getting a user's video and audio.

```javascript

navigator.mediaDevices.getUserMedia({video: true}, function(stream){
	// do whatever you want with the stream
	// One thing you can do is 
	// get a video element via id and set it's srcObject to this stream
	// that will show the video on that video element
})

```
Now, the API changes with every new release and you don't always get this to work, but it won't be difficult to find the exact example for your device. But for most cases this should work.
One more thing this will work only if your website or webpage is either on the `localhost` or uses `https` protocol for more details read [this](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins).








