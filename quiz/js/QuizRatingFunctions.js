$(document).ready(function()
{
	setTimeout(function(){intro()},1000);

	var timer;
	var isBuffering;
	var animation;
	var stepOne
	var stepTwo
	var stepThree;
	var stepFour;
	var waitMessage;
	var testerKnows=false;
	var testStarted=false;
	//5 minutes
	var timerMinutes=5;
	const timeLimit=60000*timerMinutes;
	var timeLeft=timeLimit;

	addAlerts();

	function addAlerts()
	{
		var question=document.forms["form0"]["question 4"];
		for(var i=0; i<question.length; i++)
		{
			question[i].oninput=function(){
				almostDoneAlert1();
			};
		}
		var question=document.forms["form0"]["question 7"];
		for(var i=0; i<question.length; i++)
		{
			question[i].oninput=function(){
				almostDoneAlert2();
			};
		}
		var question=document.forms["form0"]["question 10"];
		for(var i=0; i<question.length; i++)
		{
			question[i].oninput=function(){
				almostDoneAlert3();
			};
		}
		var question=document.forms["form0"]["question 11"];
		for(var i=0; i<question.length; i++)
		{
			question[i].oninput=function(){
				almostDoneAlert4();
			};
		}

	}

	$( window ).onbeforeunload=function() {
	  confirm("You have are navigating away from the page.  Are you sure you want to leave?");
	};

	$("#yes").click(function(){
		$("#dialog").hide();
		startQuiz();
		document.getElementById('alarm').pause();
		document.getElementById('alarm').currentTime=0;
		document.getElementById('tick-tock').pause();
		document.getElementById('tick-tock').currentTime=0;
		document.getElementById('lightapplause').pause();
		document.getElementById('lightapplause').currentTime=0;
		document.getElementById('moderateapplause').pause();
		document.getElementById('moderateapplause').currentTime=0;
		document.getElementById('applause').pause();
		document.getElementById('applause').currentTime=0;
		document.getElementById('crowdboo').pause();
		document.getElementById('crowdboo').currentTime=0;
		document.getElementById('crowdlaughter').pause();
		document.getElementById('crowdlaughter').currentTime=0;
	  });
	  $("#no").click(function(){
	    window.open('../index.html','_parent');
	  });
	  $('#submit').click(function (event){
	    event.preventDefault();
	    return false; 
	  });

	function intro()
	{
		//testerKnows=false;
		display();
	}
	
	function startQuiz()
	{
		reset();
		testerKnows=false;
		testStarted=false;
		buffering();
		setTimeout(function(){
			startQuizAlert();
		},4000);
	}
		
	function buffering()
	{
		isBuffering=true;
		waitMessage="Please wait for quiz to start";
		$("#text").text(waitMessage);
		$("#yes").slideUp();
		$("#no").slideUp();
		display();
		animate();
	}
	function animate()
	{
		stepOne=setTimeout(function(){$("#text").text(waitMessage+" .")},1000);
		stepTwo=setTimeout(function(){$("#text").text(waitMessage+" . .")},2000);
		stepThree=setTimeout(function(){$("#text").text(waitMessage+" . . .")},3000);
		stepFour=setTimeout(function(){$("#text").text(waitMessage+" . . . .")},4000);
	} 

	function wait()
	{
		if(isBuffering==true || testStarted==false)
		{
			if(isSelected("question 1") || isSelected("question 2") ||isSelected("question 3") || isSelected("question 4") || isSelected("question 5") || isSelected("question 6") || isSelected("question 7")|| isSelected("question 8") || isSelected("question 9") || isSelected("question 10") || isSelected("question 11") || isSelected("question 12"))
			{
				//alert("Just one more");
				//$("#text").text("please wait for quiz to start. thank you :)");
				reset();
			}
		}
	}

	function reset()
	{
		timeLeft=timeLimit;
		//$("#timer").text(convertToSeconds(timeLeft));
		var form=document.forms["form0"];
		var question1;
		for(var i=1; i<=12;i++)
		{
			question1=form["question "+i];
			for(var j=0; j<question1.length; j++)
			{
				//alert("is choice "+question1[j].name+" in "+question1+" checked?");
				if(question1[j].checked)
				{
					//alert("choice "+question1[j].name+" in "+question1+" is checked.");
					question1[j].checked=false;
				}
			}
		}
	}

	function startQuizAlert()
	{
		isBuffering=false;
		clearTimeout(stepOne);
		clearTimeout(stepTwo);
		clearTimeout(stepThree);
		clearTimeout(stepFour);
		var min=timerMinutes;
		if(timerMinutes<=1)
		{
			min="minute";
		}
		else
		{
			min="minutes";
		}
		$("#text").text("Quiz started.  You have "+timerMinutes+" "+min+" to show how much you know about Passions.");
		testStarted=true;
		$("#blackOut").slideUp();
		//testerKnows=true;
		timer=setInterval(function(){
				timeLeft-=1000;
				$("#timer").text("Time left: "+convertTime(timeLeft));
				document.getElementById('tick-tock').play();
			},1000);
		quiz=setTimeout(function(){
			score1();
		}, timeLeft);
		setTimeout(function(){
			unDisplay();
		}, 5000);
	}

	function convertTime(time)
	{
		var totalSeconds=convertToSeconds(time);
		console.log("Total second: "+totalSeconds);
		var minutes=Math.floor(totalSeconds/60);
		var seconds=Math.floor(totalSeconds%60);
		return minutes+" minutes "+seconds+" seconds";
	}

	function convertToSeconds(time)
	{
		return time/1000;
	}

	function showAlert(quote)
	{
		if(testStarted==true && testerKnows==true)
		{
			 $("#text").text(quote);
			 $("#yes").slideUp();
			 $("#no").slideUp();
			 display();
			 setTimeout(function(){unDisplay();}, 5000);
		 }
	}

	function showResults(quote,music)
	{
		if(testStarted==true && testerKnows==true)
		{
			 document.getElementById(music).play();
			 $("#text").text(quote);
			 $("#yes").slideDown();
			 $("#no").slideDown();
			 display();
			 // setTimeout(function(){unDisplay();}, 300000);
		 }
	}
	function showResults1(quote)
	{
		if(testStarted==true && testerKnows==true)
		{
			 document.getElementById('alarm').play();
			 $("#text").text(quote);
			 $("#yes").slideDown();
			 $("#no").slideDown();
			 display();
			 //setTimeout(function(){unDisplay();}, 300000);
		 }
	}
	function display()
	{
		$("#dialog").slideDown();
		$("#timer").text("Time left: "+convertTime(timeLeft));
		//$("#dialog").dialog("open");
	}

	function unDisplay()
	{
		$("#dialog").slideUp();
		testerKnows=true;
	}

	function almostDoneAlert1()
	{
		if(isSelected("question 1") && isSelected("question 2"))
		{
			//alert("almost done");
			showAlert("keep going you can do it");
		}
		else
		{
			//alert("you skipped a question");
			showAlert("you skipped a question");
		}	
	}

	function almostDoneAlert2()
	{
		if(isSelected("question 1") && isSelected("question 2")&&isSelected("question 3") && isSelected("question 4") && isSelected("question 5") && isSelected("question 6"))
		{
			//alert("almost done");
			showAlert("keep going you can do it");
		}
		else
		{
			//alert("you skipped a question");
			showAlert("you skipped a question");
		}	
	}

	function almostDoneAlert3()
	{
		if(isSelected("question 1") && isSelected("question 2")&&isSelected("question 3") && isSelected("question 4") && isSelected("question 5") && isSelected("question 6") && isSelected("question 7")&&isSelected("question 8") && isSelected("question 9"))
		{
			//alert("almost done");
			showAlert("keep going you can do it");
		}
		else
		{
			//alert("you skipped a question");
			showAlert("you skipped a question");
		}	
	}

	function almostDoneAlert4()
	{
		if(isSelected("question 1") && isSelected("question 2")&&isSelected("question 3") && isSelected("question 4") && isSelected("question 5") && isSelected("question 6") && isSelected("question 7")&&isSelected("question 8") && isSelected("question 9") && isSelected("question 10") && isSelected("question 11"))
		{
			if(!(isSelected("question 12")))
			{
				//alert("Just one more");
				showAlert("Just one more!!");
			}
		}
		else
		{
			//alert("you skipped a question");
			showAlert("you skipped a question");
		}	
	}

	function getValueSelected(question)
	{
		var form=document.forms["form0"];
		var question1=form[question];
		for(var i=0; i<question1.length; i++)
		{
			if(question1[i].checked)
			{
				//alert(question1[i].value);
				return question1[i].value;
			}
		}
		//alert("null");
		return null;
	}

	function isSelected(question)
	{
		var form=document.forms["form0"];
		var question1=form[question];
		for(var i=0; i<question1.length; i++)
		{
			if(question1[i].checked)
			{
				//alert(question1[i].value);
				return true;
			}
		}
		//alert("null");
		return false;
	}

	function score1()
	{	
		clearInterval(timer);
		clearTimeout(quiz);
		//timer.text("Time left: 0");
		var answer=new Array();
		answer[0]="Juanita";
		answer[1]="Gwen";
		answer[2]="Julian";
		answer[3]="Sheridan";
		answer[4]="Marty, Jane, Little Ethan, Maria";
		answer[5]="Fancy's twin sister";
		answer[6]="She killed a man in self defense when he raped her";
		answer[7]="Gwen";
		answer[8]="Teresa";
		answer[9]="Ivy";
		answer[10]="Rebecca, Gwen";
		answer[11]="Ivy, Rebecca";
		var question=new Array();
		question[0]="question 1";
		question[1]="question 2";
		question[2]="question 3";
		question[3]="question 4";
		question[4]="question 5";
		question[5]="question 6";
		question[6]="question 7";
		question[7]="question 8";
		question[8]="question 9";
		question[9]="question 10";
		question[10]="question 11";
		question[11]="question 12";
		var score=0;
		var form=document.forms["forms0"];
		for(var i=0; i<question.length; i++)
		{
			//alert(getValueSelected(question[i])+"="+answer[i]+"?");
			if(getValueSelected(question[i])== answer[i])
			{
				//alert(getValueSelected(question[i])+"="+answer[i]+" so score is "+score);
				score+=(100/12);
			}
		}
		//alert("score is "+score.toFixed(0));
		if(score<30)
		{
			showResults1("Time's Up!!  How horrible, your score is "+score.toFixed(0)+"!!  Have you been living under a rock?? :(  Do you wish to take the quiz again?");
			
		} 
		else if((score<60) && (score>=30))
		{
			showResults1("Time's Up!!  Your score is "+score.toFixed(0)+".  You don't know Passions very well do you? :(  Do you wish to take the quiz again?");
		} 
		else if(score<80 && score>=60)
		{
			showResults1("Time's Up!!  Your score is "+score.toFixed(0)+".  You know Passions fairly well :)  Do you wish to take the quiz again?");
		} 
		else if(score<90 && score>=80)
		{
			showResults1("Time's Up!!  Your score is "+score.toFixed(0)+".  You know Passions very well :)  Do you wish to take the quiz again?");
		} 
		else if(score<100 && score>=90)
		{
			showResults1("Time's Up!!  Wow your score is "+score.toFixed(0)+"!!  You sure are a Passions expert :)  Do you wish to take the quiz again?");
		}
		$("#blackOut").slideDown();
		//document.body.style.position="fixed";
		reset();
	}

	function score()
	{
		if(isSelected("question 1") && isSelected("question 2")&&isSelected("question 3") && isSelected("question 4") && isSelected("question 5") && isSelected("question 6") && isSelected("question 7")&&isSelected("question 8") && isSelected("question 9") && isSelected("question 10") && isSelected("question 11") && isSelected("question 12"))
		{
			clearInterval(timer);
			clearTimeout(quiz);
			var answer=new Array();
			answer[0]="Juanita";
			answer[1]="Gwen";
			answer[2]="Julian";
			answer[3]="Sheridan";
			answer[4]="Marty, Jane, Little Ethan, Maria";
			answer[5]="Fancy's twin sister";
			answer[6]="She killed a man in self defense when he raped her";
			answer[7]="Gwen";
			answer[8]="Teresa";
			answer[9]="Ivy";
			answer[10]="Rebecca, Gwen";
			answer[11]="Ivy, Rebecca";
			var question=new Array();
			question[0]="question 1";
			question[1]="question 2";
			question[2]="question 3";
			question[3]="question 4";
			question[4]="question 5";
			question[5]="question 6";
			question[6]="question 7";
			question[7]="question 8";
			question[8]="question 9";
			question[9]="question 10";
			question[10]="question 11";
			question[11]="question 12";
			var score=0;
		//	var form=document.forms["forms0"];
			for(var i=0; i<question.length; i++)
			{
				//alert(getValueSelected(question[i])+"="+answer[i]+"?");
				if(getValueSelected(question[i])== answer[i])
				{
					//alert(getValueSelected(question[i])+"="+answer[i]);
					score+=(100/12);
				}
			}
			//alert("score is "+score.toFixed(0));
			if(score<30)
			{
				showResults("How horrible, your score is "+score.toFixed(0)+"!!  Have you been living under a rock?? :(  Do you wish to take the quiz again?","crowdlaughter");
			} 
			else if((score<60) && (score>=30))
			{
				showResults("Your score is "+score.toFixed(0)+".  You don't know Passions very well do you? :(  Do you wish to take the quiz again?","crowdboo");
			} 
			else if(score<80 && score>=60)
			{
				showResults("Your score is "+score.toFixed(0)+".  You know Passions fairly well :|  Do you wish to take the quiz again?","lightapplause");
			} 
			else if(score<90 && score>=80)
			{
				showResults("Your score is "+score.toFixed(0)+".  You know Passions very well :)  Do you wish to take the quiz again?","moderateapplause");
			} 
			else if(score<100 && score>=90)
			{
				showResults("Wow your score is "+score.toFixed(0)+"!!  You sure are a Passions expert :)  Do you wish to take the quiz again?","applause");
			} 
			$("#blackOut").slideDown();
			//document.body.style.position="fixed";
			reset();
		}
		else
		{
			showAlert("please answer all questions.  You didn't answer: "+getUnasweredQuestions());
		}
	}

	function getUnasweredQuestions()
	{
		var question=new Array();
			question[0]="question 1";
			question[1]="question 2";
			question[2]="question 3";
			question[3]="question 4";
			question[4]="question 5";
			question[5]="question 6";
			question[6]="question 7";
			question[7]="question 8";
			question[8]="question 9";
			question[9]="question 10";
			question[10]="question 11";
			question[11]="question 12";

			var unAnsweredQuestions="";

			for(var i=0; i<question.length; i++)
			{
				//alert(getValueSelected(question[i])+"="+answer[i]+"?");
				if(!isSelected(question[i]))
				{
					//alert(getValueSelected(question[i])+"="+answer[i]);
					unAnsweredQuestions+=question[i]+", ";
				}
			}
			return unAnsweredQuestions.substring(0,unAnsweredQuestions.length-2);
	}

	$("#submit").click(function(){
		score();
	});

});