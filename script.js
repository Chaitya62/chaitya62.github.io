function Aboutme(){
	$(".cover").toggleClass("is-clicked");
  $(".aboutMe").toggleClass("is-clicked");
}
function Resume(){
	$(".cover").toggleClass("is-clicked");
  $(".Resume").toggleClass("is-clicked");
}

if($(".cover").hasClass("is-clicked")){
	$("#AboutMenav").click(Aboutme);
}
$("#AboutMe").click(Aboutme);
$("#AboutMe1").click(Aboutme);
$("#Resume").click(Resume);
$("#Resume1").click(Resume);
function Home(){
	$(".cover").removeClass("is-clicked");
  $(".aboutMe").removeClass("is-clicked");
  $(".Resume").removeClass("is-clicked");
}

$('#Home').click(Home);