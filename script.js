function Aboutme(){
	$(".cover").toggleClass("is-clicked");
  $(".aboutMe").toggleClass("is-clicked");
  $("#Home").toggleClass("HAboutme")
}
function Home(){
	$(".cover").toggleClass("is-clicked");
  $(".aboutMe").toggleClass("is-clicked");
}
function Resume(){
	$(".cover").toggleClass("is-clicked");
  $(".Resume").toggleClass("is-clicked");
}

$("#AboutMenav").click(Aboutme);
$("#AboutMe").click(Aboutme);
$("#AboutMe1").click(Aboutme);
$("#Resume").click(Resume);
$("#Resume1").click(Resume);