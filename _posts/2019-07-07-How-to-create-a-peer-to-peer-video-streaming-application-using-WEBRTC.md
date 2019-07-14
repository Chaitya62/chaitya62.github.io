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


Hello, It's been a long time since I blogged about almost anything. Recently, I have been learning great deal of new technologies. Here is one technology. I believe all software developers must be aware of. This is not a new or cutting-edge tech. It has been around for almost 9 years now. Yet many browsers have only recently started supporting it and many few devs are aware or know how this technology works.

In this blog, I'll explain this technology in the way, I understood it. I don't claim this to be the absolute truth about it and I may dumb down a few things for lucidity.
But, if something is incorrect or false which might be conceptually wrong drop a message or comment down below. I'll try to fix it. One Other reason of writing this blog is while I was trying to get a grasp of this tech it was tough for me to find a proper resource that explained everything clearly with a proper coding example that was easy to understand.

Enough banter let's start. 


WebRTC is a project that allows web browsers and mobile applications to develop complex Real-time Communication (RTC) application using a simple API. You can have a solid RTC application without having to write any low level RTC programs on your own by using the simple API. This API provides 2 functionalities for the developer writing the application: 

1. Get Users Media like Audio and Video 

2. Setup a peer-to-peer connection


The first part of getting user media is very simple and straight forward. It just asks for the user permission and provides you with a stream object that you can pass around as you may see fit.

Here is a simple example of getting a user's video and audio.

```javascript

// for get the audio you can pass audio: true as well
navigator.mediaDevices.getUserMedia({video: true}, function(stream){
	// do whatever you want with the stream
	// One thing you can do is 
	// get a video element via id and set it's srcObject to this stream
	// that will show the video on that video element
})

```
Now, the API changes with every new release, but it won't be difficult to find the exact example for your device or usecase. But for most cases this should work.

One more thing this will work only if your website or webpage is either on the `localhost` or uses `https` protocol for more details read [this](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins).


Let's move on to the interesting part of actually creating a peer connection

Steps to create a peer connection ( Don't worry, I will explain each in detail)

1. Create a RTCPeerConnection Object

2. Create an SDP Offer and send it to the other peer

3. Create an SDP Answer from the other peer and send it to the first peer

4. Transfer the ICE Candidates of both the peers to one another


*Note:* This is a simple 2 peer connection. A multi-peer connection is not in the scope of this post.

Before we move on to understand each steps, a few technical terms that are used above.

### Session Description Protocol (SDP) 

It's a protocol for describing streaming media communications which is used for session announcement, session invitiation and negotiate a connection.
Since webRTC makes everything easy for us, we don't have to understand the details and format for SDP. However, you can find details on it [here](https://en.wikipedia.org/wiki/Session_Description_Protocol)


### Interactive Connectivity Establishment (ICE)

Protocols establishing communication sessions between peers typically involve exchanging IP addresses and ports for the data sources and sinks which can be very tricky. 
Interactive Connectivity Establishment (ICE) is a technique used in computer networking to find ways for two computers to talk to each other as directly as possible in peer-to-peer networking. We don't have to understand this in details too, but there is a step where ICE Candidates are exchanged. To understand why we do that, we should know about ICE.

ICE Candidates have a transport address: a combination of IP address and port for a particular transport protocol.

[This](https://tools.ietf.org/id/draft-ietf-ice-rfc5245bis-14.html#rfc.section.2.1) is a detailed specification for ICE.


### Signaling Server

Before establishing a connection between the two peers we need a mechanism to transfer the SDP offer, answers and ICE candidates between the peers. We can use a signaling server for this. A signaling server can be an actual server or you can go ahead and copy paste the SDP and ICE Candidates back and forth on the peers, send a mail or text to the other peer and then manually add it. However in the [example](https://github.com/Chaitya62/WebRTCExample) I have created for reference on the github contains a simple socket server for signaling.



#### Step 1: Create a  RTCPeerConnection Object

This is a simples step. Here we create an object for the RTCPeerConnection which is provided by the webRTC API. Each browser have their own prefix for example `webkit` for chrome

The generic creation of RTCPeerConnection looks like

```javascript

// we can optionally pass in an object
// for more configuration
// I won't be going into those but that exists

const peerConnection = new RTCPeerConnection();

// browser specific version 

const peerConnection = new webkitRTCPeerConnection();


```



### Step 2: Create a SDP Offer

Either of the peer can create an Offer for the other peer. However you need to note, that once a peer has created an offer it will only react to an Answer for that peer or you can just reset the state by creating a new RTCPeerConnection Object.


```javascript

// you can also optionally pass OfferToRecieveAudio.
peerConnection.createOffer({OfferToRecieveVideo: true }, function(offer){
	
	// setting a local description for the peer is important
	peerConnection.setLocalDescription(offer);

	// magic to send the offer to the other peer
})


```

There is a promise based function for the same, which I have used in my Github [repo](https://github.com/Chaitya62/WebRTCExample)


### Step 3: Create a SDP Answer

On receiving the `offer` from the first peer, the second peer has to create an SDP answer for it and set the `offer` as a remote descriptor.


```javascript

// Note: This peerConneciton Object is not the same as the first peer, it is on the other peer (duh.)

var offer = //magic to receive the offer

peerConnection.setRemoteDescription(offer);

peerConnection.createAnswer(function(answer){

	// set the answer as local descriptor for this peer

	peerConnection.setLocalDescription(answer);

	// magic to send the offer to the first peer 

})


```

### Step 4: Create ICE Candidates of both the peers 

Firstly, this isn't step 4, as forming a connection using SDP and ICE isn't exactly sequential. As soon as we set the local Description of a peer, they create ICE candidates. It happens parallely in the whole connection process


The following has to be done on both the peers

```javascript

// same code can be used on both the peers

// First listen for creation of ICE Candidates on the peer

// suggest better variable name for candidate )
peerConnection.addEventListner('icecandidate', function(candidate){
	if(candidate.candidate){
		// magic to send candidate to the other peer
	}
})


// on receiving the candidate


const iceCandidate = // magic to receive ICE Candidate from other peer

peerConnection.addIceCandidate(iceCandidate)


```

That's it. if all the steps work out properly and you are on the same network, the peers should have a RTC connection open.


#### Why on the same network ? 

You can obviously do this on peers which are not on the same connection. 
However that isn't that simple, as peers maybe behind firewalls which cannot be bypassed by ICE alone.

For having a connection between peers not on the same network you have to use TURN and STUN servers.

STUN and TURN server are concepts of ICE.

### Session Traversal Utilities for NAT

A STUN server allows clients to discover their public IP address and the type of NAT they are behind. This information is used to establish the media connection. 
Usually a STUN server is used to establish a connection between clients, once it is established clients talk to each other directly.


### Traversal using relay NAT (TURN)

If a STUN server cannot establish the connection, ICE can turn to TURN. Unlike STUN the TURN server remains in the path of the communication. We often want to avoid the use of TURN but it is not always possible, as some networks can't be found just by using the STUN. ( details about the complexity are not in the scope of the post )


*Note*: You can mention the `STUN` and `TURN` server in the optional configuration while creating the object for `RTCPeerConnection`.



This is all you need to know about webRTC at the most basic level. There are details I have left regarding - SDP and ICE. 
Further reading on both will enhance your understanding of the functioning of webRTC. You can however make a simple application with the knowledge of this post.

*Cautions*: If you plan to use webRTC in production, always have a fallback and make sure you understand it well.

[Here](https://github.com/Chaitya62/WebRTCExample) is the github repo for the example application.


Peace!













