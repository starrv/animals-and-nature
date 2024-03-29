const fadeSpeed=500;
const scrollAmount=20;
const scrollFrequency=1;
const readFrequency=10000;

const site_url="blog.php";

$(document).ready(function()
{

	$("#termsOfServiceLink").click(function()
	{
		seeTermsOfService();
	});

	$("#hideTermsOfService").click(function()
	{
		hideTermsOfService();
	});

	$(".reply").click(function()
	{
		$("#responseForm").fadeIn();
	});

	$(".num_responses_value").parent().parent().click(function()
	{
		var responses=$(this).parent().parent().find(".response");
		responses.fadeToggle(fadeSpeed);
	});

	$(".num_responses_value").parent().parent().mouseover(function()
	{
		if($(this).find(".num_responses_value").html()!="0")
		{
			$(this).css("cursor","pointer");
		}
	});

	$(".editFormPost").submit(function(event)
	{
			event.preventDefault();
			editPost($(this).parent().parent());
	});

	$(".editFormResponse").submit(function(event)
	{
			event.preventDefault();
			editResponse($(this).parent());
	});

	$("#postForm").submit(function(event)
	{
		event.preventDefault();
	  savePost();
	});

	$(".replyFormPost").submit(function(event)
	{
		event.preventDefault();
	 	saveResponse($(this),$(this).parent().parent());
	});

	$(".replyFormResponse").submit(function(event)
	{
		event.preventDefault();
	 	saveResponse2($(this),$(this).parent().parent().parent().parent());
	});

	$('.scrollUpResponse').click(function()
	{
		//	$(window).scrollTop($(this).parent().parent().parent().parent().position().top);
		var targetElement=$(this).parent().parent().parent().parent();

		var scrollToTop=window.setInterval(function()
		{
			var scrollUp=setTimeout(function()
			{
				$(window).scrollTop($(window).scrollTop()-scrollAmount);
			},scrollFrequency);
			if($(window).scrollTop()<=targetElement.position().top)
			{
				clearInterval(scrollToTop);
				clearTimeout(scrollUp);
			}
		},scrollFrequency);
	});

	$('.scrollUpPost').click(function()
	{
		//$(window).scrollTop($(this).parent().parent().parent().prev().position().top);
		var targetElement=$(this).parent().parent().parent().parent().prev();

		var scrollUp=window.setInterval(function()
		{
			setTimeout(function()
			{
				$(window).scrollTop($(window).scrollTop()-scrollAmount);
			},scrollFrequency);
			if($(window).scrollTop()<=targetElement.position().top)
			{
				clearInterval(scrollUp);
			}
		},scrollFrequency);
	});

	$( ".reply_option_post" ).click(function()
	{
		//shows the reply option and hides the edit and delete options for a post
		$(this).parent().parent().find(".replyFormPost").fadeIn(fadeSpeed);
		$(this).parent().parent().find(".editFormPost").fadeOut(fadeSpeed);
		$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
	});

	$( ".reply_option_response" ).click(function()
	{
		$(this).parent().parent().find(".replyFormResponse").fadeIn(fadeSpeed);
		$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
		$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
	});

	$( ".edit_option_post" ).click(function()
	 {
			$(this).parent().parent().find(".editFormPost").fadeIn(fadeSpeed);
			$(this).parent().parent().find(".replyFormPost").fadeOut(fadeSpeed);
			$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
	});

	$( ".edit_option_response" ).click(function()
	{
			$(this).parent().parent().find(".editFormResponse").fadeIn(fadeSpeed);
			$(this).parent().parent().find(".replyFormResponse").fadeOut(fadeSpeed);
			$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
	});

	$(".delete_option_post").click(function()
	{
			var dialog=$(this).parent().parent().find(".deletePostDialog");
			if(dialog.length>0)
			{
				dialog.remove();
			}
			$(this).parent().before("<div class='alert alert-danger col-sm-9 w-75 mx-auto border border-danger rounded m-4 deletePostDialog' role='alert'> <form method='post' name='deleteForm' class='deleteFormPost border-0 rounded'><div class='row'><div class='col-sm text-center mx-auto'>Are you sure you want to delete?</div></div> <div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='delete' class='delete btn btn-danger' value='delete'></div> <div class='col-sm m-2'><input type='submit' value='cancel' class='btn cancelDeletePost'></div></div> </form> </div>");
			$(this).parent().parent().find(".editFormPost").fadeOut(fadeSpeed);
			$(this).parent().parent().find(".replyFormPost").fadeOut(fadeSpeed);
			// $(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
			// $(this).parent().parent().find(".responseFormResponse").fadeOut(fadeSpeed);
			$(".deleteFormPost").submit(function(event)
			{
				event.preventDefault();
				deletePost($(this).parent().parent().parent());
			});

			$(".cancelDeletePost").click(function(event)
			{
				event.preventDefault();
				var dialog=$(this).parent().parent().parent().parent().parent().find(".deletePostDialog");
				dialog.fadeOut(fadeSpeed, function(){
					$(this).remove();
				});
			});
	});

	$(".delete_option_response").click(function()
	{
		var dialog=$(this).parent().parent().find(".deletePostDialog");
		if(dialog.length>0)
		{
			dialog.remove();
		}
		$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
		$(this).parent().parent().find(".replyFormResponse").fadeOut(fadeSpeed);
		$(this).parent().before("<div class='alert alert-danger col-sm-9 w-75 border rounded border-danger p-4 m-4 mx-auto deletePostDialog' role='alert'> <form method='post' name='deleteForm' class='deleteFormResponse border-0'><div class='row'><div class='col-sm text-center'>Are you sure you want to delete?</div></div> <div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='delete' class='delete btn btn-danger' value='delete'></div> <div class='col-sm m-2'><input type='submit' value='cancel' class='btn cancelDeletePost'></div></div> </form> </div>");
		$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
		$(this).parent().parent().find(".responseFormResponse").fadeOut(fadeSpeed);
		$(".deleteFormResponse").submit(function(event)
		{
			event.preventDefault();
			deleteResponse($(this).parent().parent().parent(), $(this).parent().parent().parent().parent().parent());
		});

		$(".cancelDeletePost").click(function(event)
		{
			event.preventDefault();
			var dialog=$(this).parent().parent().parent().parent().parent().find(".deletePostDialog");
			dialog.fadeOut(fadeSpeed, function(){
				dialog.remove();
			});
		});
	});

	$(".cancel").click(function(event)
	{
		// hides the option
		event.preventDefault();
		var dialog=$(this).parent().parent().parent();
		dialog.fadeOut(fadeSpeed);
		$(".alert").fadeOut(fadeSpeed);
	});

	$("#notifications-dropdown-menu .dropdown-item").click(function()
	{
		var id=$(this).prop("href").split("#")[1];
		var response=$("#"+id);
		var post=response.parent().parent();
		post.fadeIn();
		post.find(".response").fadeIn();
	});

	$("#notifications-dropdown-menu").parent().on('shown.bs.dropdown', function ()
	{
		$('#notifications-badge').html('');
		//	var numOfReadNotifications=$(this).find(".dropdown-item.0");

		// send an ajax request to mark all the notifications as read
		var obj = {"markRead":"read"};
		$.ajax(
		{
		  method: "POST",
		  url: site_url,
		  data: obj
		})
		.done(function( data ){})
		.fail(function( error)
		{
				console.error(error);
		});
	});

	if($('#notifications-badge').html()!="")
	{
		notify();
	}

	obj={"getLoggedInUser":"get"};
	$.ajax(
	{
		method: "POST",
		url: site_url,
		data: obj
	})
	.done(function(data)
	{
		try
		{
			var data = JSON.parse(data);
			var loggedInUser=data.loggedInUser;
			if(loggedInUser!=="")
			{
				checkUpdates(loggedInUser);
			}
		}
		catch(error)
		{
			console.error(error);
		}
	})
	.fail(function(error)
	{
		console.error(error);
	});

});

function checkUpdates(loggedInUser)
{
	checkForPosts(loggedInUser);
	checkForResponses(loggedInUser);
	checkForNotifications();
	checkForDeletesPosts();
	checkForDeletesResponses();
	checkForUpdates();
}

function getCookie(name)
{
	var cookie=document.cookie;
	var cookie=cookie.split("; ");
	var curCookie="";
	var cookieName="";
	var cookieValue="";
	for(var i=0; i<cookie.length; i++)
	{
		curCookie=cookie[i];
		curCookie=curCookie.split("=");
		cookieName=curCookie[0];
		cookieValue=curCookie[1];
		if(cookieName==name)
		{
			return cookieValue;
		}
	}
	return "";
}

function checkForDeletesPosts()
{
	var check=setInterval(function()
	{
		var posts=$(".post");
		for(var i=0; i<posts.length; i++)
		{
			obj={"checkForDeletes":"check","postId":posts[i].id};
			$.ajax({
				method: "POST",
				url: site_url,
				data: obj
			})
			.done(function(data)
			{
				try
				{
					var data = JSON.parse(data);
					if(data.deletePost=="delete")
					{
						$("#"+data.postId).fadeOut(fadeSpeed,function()
						{
						  	$(this).remove();
								var numOfPosts=$(".post").length+$(".response").length;
						    if(numOfPosts==1)
						    {
						    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
						    }
						    else
						    {
						    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
						    }
						});
					}
				}
				catch(error)
				{
					console.error(error);
				}
			})
			.fail(function(error)
			{
				console.error(error);
			});
		}
	},readFrequency);
}

function checkForDeletesResponses()
{
	var check=setInterval(function()
	{
		var responses=$(".response");
		for(var i=0; i<responses.length; i++)
		{
			obj={"checkForDeletes":"check","postId":responses[i].id};
			$.ajax({
				method: "POST",
				url: site_url,
				data: obj
			})
			.done(function(data)
			{
				try
				{
					var data = JSON.parse(data);
					if(data.deletePost=="delete")
					{
						$("#"+data.postId).fadeOut(fadeSpeed,function()
						{
							var post=$(this).parent();
							$(this).remove();
							var numOfPosts=$(".post").length+$(".response").length;
							if(numOfPosts==1)
							{
								$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
							}
							else
							{
								$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
							}
							var numOfResponses=post.find(".response").length;
							if(numOfResponses==1)
							{
								post.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> reply</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
							}
							else
							{
								post.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
							}

							// post.find(".num_responses_value").parent().parent().mouseover(function()
							// {
							// 	if($(this).find(".num_responses_value").html()!="0")
							// 	{
							// 		$(this).css("cursor","pointer");
							// 	}
							// });
							//
							// post.find(".num_responses_value").parent().parent().click(function()
							// {
							// 	var responses=$(this).parent().parent().find(".response");
							// 	responses.fadeToggle(fadeSpeed);
							// });

						});
					}

				}
				catch(error)
				{
					console.error(error);
				}
			})
			.fail(function(error)
			{
				console.error(error);
			});
		}
	},readFrequency);
}

function checkForUpdates()
{
	var check=setInterval(function()
	{
		var posts=$(".post");
		var postId=-1;
		var postContent="";
		var mediaPost="";
		for(var i=0; i<posts.length; i++)
		{
			postId=posts[i].id;
			if($("#"+postId).find(".post-content-post").length>0)
			{
				postContent=$("#"+postId).find(".post-content-post").html();	
			}
			else
			{
				postContent="";
			}
			if($("#"+postId).find(".mediaPost").length>0)
			{
				//if its a video
				if($("#"+postId).find(".mediaPost")[0].tagName=="video" || $("#"+postId).find(".mediaPost")[0].tagName=="VIDEO")
				{
					mediaPost=$("#"+postId).find(".mediaPost source").attr("src").split(",")[1];
				}
				else
				{
					
					mediaPost=$("#"+postId).find(".mediaPost").attr("src").split(",")[1];
				}
			}
			else
			{
				mediaPost="";
			}
			obj={"checkForUpdates":"check", "postId":postId, "postContent":postContent, "media":mediaPost};
			$.ajax({
				method: "POST",
				url: site_url,
				data: obj
			})
			.done(function(data)
			{
				try
				{
					var data = JSON.parse(data);
					if(data.updatePost!="do not update")
					{
						if(data.updatePost!="")
						{
							if($("#"+data.postId).find(".post-content-post").length>0)
							{
								$("#"+data.postId).find(".post-content-post").html(data.updatePost);
							}
							else
							{
								if($("#"+data.postId).find(".mediaPost").length>0)
								{
									$("#"+data.postId).find(".mediaPost").after("<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-post'>"+data.updatePost+"</p>");
								}
								else
								{
									$("#"+data.postId).find(".header-post").after("<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-post'>"+data.updatePost+"</p>");
								}
							}
						}
						else
						{
							if($("#"+data.postId).find(".post-content-post").length>0)
							{
								$("#"+data.postId).find(".post-content-post").remove();
							}
						}

						if(data.media!="")
						{
							if($("#"+data.postId).find(".mediaPost").length>0)
							{
								//if video
								if(data.mediaType=="mp4")
								{
									$.when($("#"+data.postId).find(".mediaPost").remove()).then($("#"+data.postId).find(".header-post").after("<video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+ data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>"));
								}
								else
								{
									$.when($("#"+data.postId).find(".mediaPost").remove()).then($("#"+data.postId).find(".header-post").after("<img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+data.mediaType+";base64,"+data.media+"'>"));
								}
							}
							else
							{
								//if video
								if(data.mediaType=="mp4")
								{
									$("#"+data.postId).find(".header-post").after("<video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+ data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>");
								}
								else
								{
									$("#"+data.postId).find(".header-post").after("<img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+data.mediaType+";base64,"+data.media+"'>");
								}
							}
						}
						else
						{
							if($("#"+data.postId).find(".mediaPost").length>0)
							{
								$("#"+data.postId).find(".mediaPost").remove();
							}
						}
					}
				}
				catch(error)
				{
					console.error(error);
				}
			})
			.fail(function(error)
			{
				console.error(error);
			});
		}

		var responses=$(".response");
		var responseId=-1;
		var postContent="";
		var media="";
		for(var i=0; i<responses.length; i++)
		{
			responseId=responses[i].id;
			if($("#"+responseId).find(".post-content-response").length>0)
			{
				postContent=$("#"+responseId).find(".post-content-response").html();
			}
			else
			{
				postContent="";
			}
			if($("#"+responseId).find(".mediaPost2").length>0)
			{
				//if video
				if($("#"+responseId).find(".mediaPost2")[0].tagName=="video" || $("#"+responseId).find(".mediaPost2")[0].tagName=="VIDEO")
				{
					media=$("#"+responseId).find(".mediaPost2 source").attr("src").split(",")[1];
				}
				else
				{
					media=$("#"+responseId).find(".mediaPost2").attr("src").split(",")[1];
				}
			}
			else
			{
				media="";
			}
			obj={"checkForUpdates":"check","postId":responseId,"postContent":postContent,"media":media};
			$.ajax(
			{
				method: "POST",
				url: site_url,
				data: obj
			})
			.done(function(data)
			{
				try
				{
					var data = JSON.parse(data);
					if(data.updatePost!="do not update")
					{
						if(data.updatePost!="")
						{
							if($("#"+data.postId).find(".post-content-response").length>0)
							{
								$("#"+data.postId).find(".post-content-response").html(data.updatePost);
							}
							else
							{
								if($("#"+data.postId).find(".mediaPost2").length>0)
								{
									$("#"+data.postId).find(".mediaPost2").after("<p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-response mx-auto'>"+data.updatePost+"</p>");
								}
								else
								{
									$("#"+data.postId).find(".header-response").after("<p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-response mx-auto'>"+data.updatePost+"</p>");
								}
							}
						}
						else
						{
							if($("#"+data.postId).find(".post-content-response").length>0)
							{
								$("#"+data.postId).find(".post-content-response").remove();
							}
						}
						if(data.media!="")
						{
							if($("#"+data.postId).find(".mediaPost2").length>0)
							{
								//if video
								if(data.mediaType=="mp4")
								{
									$.when($("#"+data.postId).find(".mediaPost2").remove()).then($("#"+data.postId).find(".header-response").after("<video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>"));
								}
								else
								{
									$.when($("#"+data.postId).find(".mediaPost2").remove()).then($("#"+data.postId).find(".header-response").after("<img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+data.mediaType+";base64,"+data.media+"'>"));
								}
							}
							else
							{
								if(data.mediaType=="mp4")
								{
									$("#"+data.postId).find(".header-response").after("<video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>");
								}
								else
								{
									$("#"+data.postId).find(".header-response").after("<img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+data.mediaType+";base64,"+data.media+"'>");
								}
							}
						}
						else
						{
							if($("#"+data.postId).find(".mediaPost2").length>0)
							{
								$("#"+data.postId).find(".mediaPost2").remove();
							}
						}
					}
				}
				catch (error)
				{
					console.error(error);
				}
			})
			.fail(function(error)
			{
				console.error(error);
			});
		}
	},readFrequency);
}

function checkForPosts(loggedInUser)
{
	var checkPosts=setInterval(function()
	{
		var obj={"checkForPosts":"check"};
		$.ajax({
			method: "POST",
			url: site_url,
			data: obj
		})
		.done(function( data )
		{
			try
			{

				var data = JSON.parse(data);
				var newPosts=data.newPosts;

				var postId="";
				var username="";
				var post="";
				var media="";
				var mediaType="";
				var profilePic="";
				var dateTime="";

				// need to change date parameter to tuple format
				var dateTimeArray="";
				var datePortion="";
				var datePortionArray="";
				var year="";
				var month="";
				var date="";
				var timePortion="";
				var timePortionArray="";
				var hours="";
				var minutes="";
				var seconds="";
				var date="";
				var dateNow="";
				var timeZoneDifference=-1;

				for(var i=0; i<newPosts.length; i++)
				{
					postId=newPosts[i].postId;
					if($(document).find("#"+postId).length>0)
					{
						continue;
					}
					username=newPosts[i].username;
					if(loggedInUser==username)
					{
						continue;
					}
					post=newPosts[i].post;
					media=newPosts[i].media;
					mediaType=newPosts[i].mediaType;
					profilePic=newPosts[i].profilePic;
					dateTime=newPosts[i].dateTime;
					// need to change date parameter to tuple format
					dateTimeArray=dateTime.split(" ");
					datePortion=dateTimeArray[0];
					datePortionArray=datePortion.split("-");
					year=datePortionArray[0];
					month=datePortionArray[1];
					date=datePortionArray[2];
					timePortion=dateTimeArray[1];
					timePortionArray=timePortion.split(":");
					hours=timePortionArray[0];
					minutes=timePortionArray[1];
					seconds=timePortionArray[2];
					date=new Date(year,month-1,date,hours,minutes,seconds);
					dateNow=new Date();
					timeZoneDifference=dateNow.getTimezoneOffset()/60;
					date.setHours(date.getHours()-timeZoneDifference);
					date=formatMonth(date.getMonth())+" "+addLeadingZeros(date.getDate())+", "+date.getFullYear()+" "+addLeadingZeros(formatHours(date.getHours()))+":"+addLeadingZeros(date.getMinutes())+":"+addLeadingZeros(date.getSeconds())+" "+formatAM_PM(date.getHours());
					var lastPost=$(".post").first();
					if(lastPost.length>0)
					{
						if(media!="")
						{
							if(profilePic!="")
							{
								if(post!="")
								{
									if(mediaType=="mp4")
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=="mp4")
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}

							}
							else
							{
								if(post!="")
								{
									if(mediaType=="mp4")
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=="mp4")
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}

							}
						}
						else
						{
							if(profilePic!="")
							{
								if(post!="")
								{
									lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}
								else
								{
									lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}

							}
							else
							{
								if(post!="")
								{
									lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class=w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}
								else
								{
									lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}

							}
						}
					}
					else
					{
						if(media!="")
						{
							if(profilePic!="")
							{
								if(post!="")
								{
									if(mediaType=="mp4")
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=="mp4")
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}

							}
							else
							{
								if(post!="")
								{
									if(mediaType=="mp4")
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=="mp4")
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
									else
									{
										$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
									}
								}

							}
						}
						else
						{
							if(profilePic!="")
							{
								if(post!="")
								{
									$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}
								else
								{
									$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}

							}
							else
							{
								if(post!="")
								{
									$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}
								else
								{
									$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
								}

							}
						}
					}
					var numOfPosts=$(".post").length+$(".response").length;
					if(numOfPosts==1)
					{
						$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
					}
					else
					{
						$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
					}
					var firstPost=$(".post").first();
					firstPost.find(".num_responses_value").parent().parent().click(function()
					{
						var responses=$(this).parent().parent().find(".response");
						responses.fadeToggle(fadeSpeed);
					});

					firstPost.find(".num_responses_value").parent().parent().mouseover(function()
					{
						if($(this).find(".num_responses_value").html()!="0")
						{
							$(this).css("cursor","pointer");
						}
					});

					firstPost.find(".replyFormPost").submit(function(event)
					{
						event.preventDefault();
						saveResponse($(this),$(this).parent().parent());
					});

					firstPost.find('.scrollUpPost').click(function()
					{
						//$(window).scrollTop($(this).parent().parent().parent().prev().position().top);
						var targetElement=$(this).parent().parent().parent().prev();
						var scrollUp=window.setInterval(function(){
							setTimeout(function(){
								$(window).scrollTop($(window).scrollTop()-scrollAmount);
							},scrollFrequency);
							if($(window).scrollTop()<=targetElement.position().top)
							{
								clearInterval(scrollUp);
							}
						},scrollFrequency);
					});

					firstPost.find(".deleteFormPost").submit(function(event){
						event.preventDefault();
						deletePost($(this).parent().parent().parent());
					});

					firstPost.find(".cancelDeletePost").click(function(event){
						event.preventDefault();
						var deleteFormParent=$(this).parent().parent().parent().parent();
						deleteFormParent.remove();
					});

					firstPost.find( ".reply_option_post" ).click(function() {
							$(this).parent().parent().find(".replyFormPost").fadeIn(fadeSpeed);
							$(this).parent().parent().find(".editFormPost").fadeOut(fadeSpeed);
							$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
					});

					firstPost.find(".cancel").click(function(event)
					{
						event.preventDefault();
						var dialog=$(this).parent().parent().parent();
						dialog.fadeOut(fadeSpeed);
						$(this).find(".alert").fadeOut(fadeSpeed);
					});
				}

			}
			catch(error)
			{
				console.error(error);
			}
		})
		.fail(function( error)
		{
			console.error(error);
		});
	},readFrequency);
}

function checkForResponses(loggedInUser)
{
	var checkResponses=setInterval(function()
	{
		var obj={"checkForResponses":"check"};
		$.ajax({
			method: "POST",
			url: site_url,
			data: obj
		})
		.done(function( data )
		{
			try
			{
				var data = JSON.parse(data);
				var newResponses=data.newResponses;

				var responseId=-1;
				var username="";
				var initPostId="";
				var response="";
				var media="";
				var mediaType="";
				var date="";
				var profilePic="";
				var dateTime="";

				// need to change date parameter to tuple format
				var dateTimeArray="";
				var datePortion="";
				var datePortionArray="";
				var year="";
				var month="";
				var date="";
				var timePortion="";
				var timePortionArray="";
				var hours="";
				var minutes="";
				var seconds="";
				var date="";
				var dateNow="";
				var timeZoneDifference="";

				var thePost="";
				var lastResponse="";

				var numOfPosts=-1;

				var firstResponse="";
				var lastResponse="";

				for(var i=0; i<newResponses.length; i++)
				{
					responseId=newResponses[i].responseId;
					if($(document).find("#"+responseId).length>0)
					{
						continue;
					}
					username=newResponses[i].username;
					if(loggedInUser==username)
					{
						continue;
					}
					initPostId=newResponses[i].initPostId;
					response=newResponses[i].response;
					media=newResponses[i].media;
					mediaType=newResponses[i].mediaType;
					profilePic=newResponses[i].profilePic;
					dateTime=newResponses[i].dateTime;

					// need to change date parameter to tuple format
					dateTimeArray=dateTime.split(" ");
					datePortion=dateTimeArray[0];
					datePortionArray=datePortion.split("-");
					year=datePortionArray[0];
					month=datePortionArray[1];
					date=datePortionArray[2];
					timePortion=dateTimeArray[1];
					timePortionArray=timePortion.split(":");
					hours=timePortionArray[0];
					minutes=timePortionArray[1];
					seconds=timePortionArray[2];
					date=new Date(year,month-1,date,hours,minutes,seconds);
					dateNow=new Date();
					timeZoneDifference=dateNow.getTimezoneOffset()/60;
					date.setHours(date.getHours()-timeZoneDifference);
					date=formatMonth(date.getMonth())+" "+addLeadingZeros(date.getDate())+", "+date.getFullYear()+" "+addLeadingZeros(formatHours(date.getHours()))+":"+addLeadingZeros(date.getMinutes())+":"+addLeadingZeros(date.getSeconds())+" "+formatAM_PM(date.getHours());

					thePost=$("#"+initPostId);
					lastResponse=thePost.find(".response").first();
					//if there are responses for the post
					if(lastResponse.length>0)
					{
						if(media!="")
						{
							if(profilePic!="")
							{
								if(response!="")
								{
									if(mediaType=='mp4')
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=='mp4')
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}	
								}
							}
							else
							{
								if(response!="")
								{
									if(mediaType=='mp4')
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}	
								}
								else
								{
									if(mediaType=='mp4')
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
								}

							}
						}
						else
						{
							if(profilePic!="")
							{
								if(response!="")
								{
									lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
								}
								else
								{
									lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
								}

							}
							else
							{
								if(response!="")
								{
									lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
								}
								else
								{
									lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
								}

							}
						}
					}
					//if there are no responses for the post
					else
					{
						if(media!="")
						{
							if(profilePic!="")
							{
								if(response!="")
								{
									if(mediaType=='mp4')
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=='mp4')
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
									}	
								}

							}
							else
							{
								if(response!="")
								{
									if(mediaType=='mp4')
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
									}
								}
								else
								{
									if(mediaType=='mp4')
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
									}
									else
									{
										thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' class='form-control mediaResponse border border-secondary rounded' name='mediaUpload' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
									}
								}

							}
						}
						else
						{
							if(profilePic!="")
							{
								if(response!="")
								{
									thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
								}
								else
								{
									thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
								}

							}
							else
							{
								if(response!="")
								{
									thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
								}
								else
								{
									thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
								}

							}
						}
					}

					numOfPosts=$(".post").length+$(".response").length;
					if(numOfPosts==1)
					{
						$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
					}
					else
					{
						$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
					}
					var numOfResponses=thePost.find(".response").length;
					if(numOfResponses==1)
					{
						thePost.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> reply</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
					}
					else
					{
						thePost.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> replys</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
					}

					// thePost.find(".num_responses_value").parent().parent().mouseover(function()
					// {
					// 	if($(this).find(".num_responses_value").html()!="0")
					// 	{
					// 		$(this).css("cursor","pointer");
					// 	}
					// });
					//
					// thePost.find(".num_responses_value").parent().parent().click(function()
					// {
					// 	var responses=$(this).parent().parent().find(".response");
					// 	responses.fadeToggle(fadeSpeed);
					// });

					firstResponse=thePost.find(".response").first();
					lastResponse=thePost.find(".response").last();

					// if responses are shown, display new response
					if(lastResponse.css("display")!="none")
					{
						firstResponse.fadeIn(fadeSpeed);
					}

					firstResponse.find(".replyFormResponse").submit(function(event)
					{
						event.preventDefault();
						saveResponse2($(this),$(this).parent().parent().parent().parent());
					});

					firstResponse.find('.scrollUpResponse').click(function()
					{
						var targetElement=$(this).parent().parent().parent().parent().parent();

						var scrollToTop=window.setInterval(function(){
							var scrollUp=setTimeout(function(){
								$(window).scrollTop($(window).scrollTop()-scrollAmount);
							},scrollFrequency);
							if($(window).scrollTop()<=targetElement.position().top)
							{
								clearInterval(scrollToTop);
								clearTimeout(scrollUp);
							}
						},scrollFrequency);
					});

					firstResponse.find( ".reply_option_response" ).click(function()
					{
						$(this).parent().parent().find(".replyFormResponse").fadeIn(fadeSpeed);
						$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
						$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
					});

					firstResponse.find(".cancel").click(function(event)
					{
							event.preventDefault();
							var dialog=$(this).parent().parent().parent();
							dialog.fadeOut(fadeSpeed);
							$(this).find(".alert").fadeOut(fadeSpeed);
					});
				}
			}
			catch(error)
			{
				console.error(error);
			}

		 })
		.fail(function( error)
		{
			console.error(error);
		});
	},readFrequency);
}

function checkForNotifications()
{
	var checkNotifications=setInterval(function()
	{
		var obj={"checkForNotifications":"check"};
		$.ajax({
			method: "POST",
			url: site_url,
			data: obj
		})
		.done(function( data )
		{
			try
			{
				var data = JSON.parse(data);
				var newNotifications=data.newNotifications;
				var obj=[];
				var responseId=-1;
				var notification="";
				var isRead=0;

				for(var i=0; i<newNotifications.length; i++)
				{
					obj=newNotifications[i];
					responseId=obj['responseId'];
					notification=obj['notification'];
					isRead=obj['isRead'];

					if($(document).find("#"+responseId+"-link").length==0)
					{
						$("#notifications-dropdown-menu").prepend("<a href='#"+responseId+"' class='dropdown-item' id='"+responseId+"-link'>"+notification+"</a>");
						$("#"+responseId+"-link").addClass(isRead);
						$("#"+responseId+"-link").click(function()
						{
							var response=$("#"+responseId);
							var post=response.parent().parent();
							post.fadeIn();
							post.find(".response").fadeIn();
						});
						notify();
					}
				}
				if(newNotifications.length>0)
				{
					$('#notifications-badge').html(newNotifications.length);
				}
			}
			catch(error)
			{
				console.error(error);
			}
		})
		.fail(function( data)
		{
			console.error(data);
		});
	},readFrequency);
}

function notify()
{
	var audio=document.getElementById("notification");
	if(audio!=null)
	{
		audio.volume=0.2;
		audio.play();
	}
}

function seeTermsOfService()
{
	$("#termsOfService").fadeIn(fadeSpeed);
}

function hideTermsOfService()
{
	$("#termsOfService").fadeOut(fadeSpeed);
}

function savePost()
{
	if($("#newPost").val()=="" && document.getElementById("mediaPost").files[0]==undefined)
	{
		//	alert("Please enter text to make a post");
		if($(document).find("#makeTextPostAlert").length<=0)
		{
			$(".pos-f-t").after("<div class='alert alert-warning alert-dismissible fade show col-md-6 m-2 p-2' id='makeTextPostAlert' role='alert'>Please enter text or add a photo/video to make a post<button type='button' class='close m-2 rounded' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
		}
	}
	else
	{
		var obj=new FormData();
		obj.append("newPost", $("#newPost").val());
		obj.append("post","post");
		obj.append("media", document.getElementById("mediaPost").files[0]);
		$.ajax(
		{
		  method: "POST",
		  url: site_url,
		  data: obj,
		  contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false
		})
  	.done(function( data )
  	{
  		try
  		{
	  		var data = JSON.parse(data);
	  		var postId=data.postId;
		  	var username=data.username;
		  	var post=data.post;
		  	var media=data.media;
		  	var mediaType=data.mediaType;
		  	var profilePic=data.profilePic;
		  	var dateTime=data.dateTime;
			// need to change date parameter to tuple format
			var dateTimeArray=dateTime.split(" ");
			var datePortion=dateTimeArray[0];
			var datePortionArray=datePortion.split("-");
			var year=datePortionArray[0];
			var month=datePortionArray[1];
			var date=datePortionArray[2];
			var timePortion=dateTimeArray[1];
			var timePortionArray=timePortion.split(":");
			var hours=timePortionArray[0];
			var minutes=timePortionArray[1];
			var seconds=timePortionArray[2];
			var date=new Date(year,month-1,date,hours,minutes,seconds);
		  	var dateNow=new Date();
		  	var timeZoneDifference=dateNow.getTimezoneOffset()/60;
		  	date.setHours(date.getHours()-timeZoneDifference);
		  	date=formatMonth(date.getMonth())+" "+addLeadingZeros(date.getDate())+", "+date.getFullYear()+" "+addLeadingZeros(formatHours(date.getHours()))+":"+addLeadingZeros(date.getMinutes())+":"+addLeadingZeros(date.getSeconds())+" "+formatAM_PM(date.getHours());
			var lastPost=$(".post").first();
		    if(lastPost.length>0)
		    {
		    	if(media!="")
		    	{
		    		if(profilePic!="")
		    		{
						if(post!="")
						{
							if(mediaType=="mp4")
							{

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img  width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p  class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img  width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><p  class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}	
						}
						else
						{
							if(mediaType=="mp4")
							{  

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img  width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img  width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}

		    		}
		    		else
		    		{
						if(post!="")
						{
							if(mediaType=="mp4")
							{  

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='editForm' class='editFormPost col-md-9 mx-auto border border-secondary rounded p-2 m-4'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='editForm' class='editFormPost col-md-9 mx-auto border border-secondary rounded p-2 m-4'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}
						else
						{
							if(mediaType=="mp4")
							{

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormPost col-md-9 mx-auto border border-secondary rounded p-2 m-4'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><form method='post' name='editForm' class='editFormPost col-md-9 mx-auto border border-secondary rounded p-2 m-4'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>  <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}

		    		}
		    	}
		    	else
		    	{
		    		if(profilePic!="")
		    		{
						if(post!="")
						{
							lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>   <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}
						else
						{
							lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2 mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>   <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}

		    		}
		    		else
		    		{
						if(post!="")
						{
							lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p>  <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>   <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}
						else
						{
							lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form>   <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}

		    		}
		    	}
		    }
		    else
		    {
		    	if(media!="")
		    	{
		    		if(profilePic!="")
		    		{
						if(post!="")
						{
							if(mediaType=="mp4")
							{

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video> <p  class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><p  class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}
						else
						{
							if(mediaType=="mp4")
							{

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}

		    		}
		    		else
		    		{
						if(post!="")
						{
							if(mediaType=="mp4")
							{

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}
						else
						{
							if(mediaType=="mp4")
							{

								lastPost.before("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+ media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
							else
							{
								$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+mediaType+";base64,"+media+"'><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
							}
						}

		    		}
		    	}
		    	else
		    	{
		    		if(profilePic!="")
		    		{
						if(post!="")
						{
							$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}
						else
						{
							$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}

		    		}
		    		else
		    		{
						if(post!="")
						{
							$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class=w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>"+post+"</p> <form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}
						else
						{
							$("#num_posts").after("<div id='"+postId+"' class='row post p-4'><div class='post-style border rounded border-secondary col-md-9 mx-auto mt-4 mb-4 p-2'><h5 class=w-75 m-2 header-post'><img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='editPostId' class='editPostId' value="+postId+"><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+post+"</textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'><input type='hidden' name='initPostId' class='initPostId' value="+postId+"><input type='hidden' name='initUser' class='initUser' value="+username+"><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div>	<div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p> <p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p> <p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p> <p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p> </div> <div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>0</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div> </div></div>");
						}

		    		}
		    	}
		    }
			var firstPost=$(".post").first();
		    var numOfPosts=$(".post").length+$(".response").length;
		    if(numOfPosts==1)
		    {
		    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
		    }
		    else
		    {
		    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
		    }

		   	firstPost.find(".num_responses_value").parent().parent().click(function()
			{
				var responses=$(this).parent().parent().find(".response");
				responses.fadeToggle(fadeSpeed);
			});

			 firstPost.find(".num_responses_value").parent().parent().mouseover(function()
			 {
				if($(this).find(".num_responses_value").html()!="0")
				{
					$(this).css("cursor","pointer");
				}
			});

			firstPost.find(".editFormPost").submit(function(event)
			{
					event.preventDefault();
					editPost($(this).parent().parent());
			});

	    firstPost.find(".replyFormPost").submit(function(event)
			{
				event.preventDefault();
		  	saveResponse($(this),$(this).parent().parent());
			});

			firstPost.find('.scrollUpPost').click(function(){
				//$(window).scrollTop($(this).parent().parent().parent().prev().position().top);
				var targetElement=$(this).parent().parent().parent();

				var scrollUp=window.setInterval(function(){
					setTimeout(function(){
						$(window).scrollTop($(window).scrollTop()-scrollAmount);
					},scrollFrequency);
					if($(window).scrollTop()<=targetElement.position().top)
					{
						clearInterval(scrollUp);
					}
				},scrollFrequency);
			});

			firstPost.find(".deleteFormPost").submit(function(event)
			{
				event.preventDefault();
				deletePost($(this).parent().parent().parent());
			});

			firstPost.find(".cancelDeletePost").click(function(event)
			{
				event.preventDefault();
				var deleteFormParent=$(this).parent().parent().parent().parent();
				deleteFormParent.remove();
			});

			firstPost.find( ".reply_option_post" ).click(function()
			{
				$(this).parent().parent().find(".replyFormPost").fadeIn(fadeSpeed);
				$(this).parent().parent().find(".editFormPost").fadeOut(fadeSpeed);
				$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
			});

			firstPost.find( ".edit_option_post" ).click(function()
			 {
				$(this).parent().parent().find(".editFormPost").fadeIn(fadeSpeed);
				$(this).parent().parent().find(".replyFormPost").fadeOut(fadeSpeed);
				$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
			});

			firstPost.find(".delete_option_post").click(function()
			{
				var dialog=$(this).parent().parent().find(".deletePostDialog");
				if(dialog.length>0)
				{
					dialog.remove();
				}
				$(this).parent().parent().find(".editFormPost").fadeOut(fadeSpeed);
				$(this).parent().parent().find(".replyFormPost").fadeOut(fadeSpeed);
				$(this).parent().before("<div class='alert alert-danger col-sm-9 w-75 mx-auto border border-danger rounded m-4 deletePostDialog' role='alert'> <form method='post' name='deleteForm' class='deleteFormPost border rounded mx-auto'><div class='row'><div class='col-sm text-center mx-auto'>Are you sure you want to delete?</div></div> <div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='delete' class='delete btn btn-danger text-center' value='delete'></div> <div class='col-sm m-2'><input type='submit' value='cancel' class='btn cancelDeletePost text-center'></div></form> </div>");
				firstPost.find(".deleteFormPost").submit(function(event)
				{
					event.preventDefault();
					deletePost($(this).parent().parent().parent());
				});

				firstPost.find(".cancelDeletePost").click(function(event)
				{
					event.preventDefault();
					var dialog=$(this).parent().parent().parent().parent().parent().find(".deletePostDialog");
					dialog.fadeOut(fadeSpeed, function(){
						$(this).remove();
					});
				});
			});

			firstPost.find(".cancel").click(function(event){
				event.preventDefault();
				var dialog=$(this).parent().parent().parent();
				dialog.fadeOut(fadeSpeed);
				$(this).find(".alert").fadeOut(fadeSpeed);
			});
		}
	  	catch(error)
	  	{
	  		console.error(error.message);
	  		alert("An error has occurred");
	  	}
		})
		.fail(function(error)
		{
			alert("An error has occured.  Please try again.");
			console.error(error.message);
		});
	}

}

function saveResponse(responseForm, thePost)
{

	if(responseForm.find(".newResponse").val()=="" && (responseForm.find(".mediaResponse"))[0].files[0]==undefined)
	{
		//	alert("Please enter text to send a reply");
		if($(document).find(".makeTextResponseAlert").length<=0)
		{
			responseForm.before("<div class='alert alert-warning alert-dismissible fade show col-sm-9 mx-auto w-75 p-2 makeTextResponseAlert' role='alert'>Please enter text or add a photo/video to send a reply<button type='button' class='close m-2 rounded' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
		}
	}
	else
	{
		var obj=new FormData((responseForm)[0]);
		obj.append("initPostId", responseForm.find(".initPostId").val());
		obj.append("initUser", responseForm.find(".initUser").val());
		obj.append("newResponse", responseForm.find(".newResponse").val());
		obj.append("reply","reply");
		obj.append("media", (responseForm.find(".mediaResponse"))[0].files[0]);
		$.ajax(
		{
		  method: "POST",
		  url: site_url,
		  data: obj,
		  contentType: false,       // The content type used when sending data to the server.
      cache: false,             // To unable request pages to be cached
      processData:false
		})
	  .done(function( data )
		{
	  	try
	  	{
	  		var data = JSON.parse(data);
	  		var responseId=data.responseId;
		  	var username=data.username;
		  	var initPostId=data.initPostId;
		  	var response=data.response;
		  	var media=data.media;
		  	var mediaType=data.mediaType;
		  	var profilePic=data.profilePic;
			var dateTime=data.dateTime;

			// need to change date parameter to tuple format
			var dateTimeArray=dateTime.split(" ");
			var datePortion=dateTimeArray[0];
			var datePortionArray=datePortion.split("-");
			var year=datePortionArray[0];
			var month=datePortionArray[1];
			var date=datePortionArray[2];
			var timePortion=dateTimeArray[1];
			var timePortionArray=timePortion.split(":");
			var hours=timePortionArray[0];
			var minutes=timePortionArray[1];
			var seconds=timePortionArray[2];
			var date=new Date(year,month-1,date,hours,minutes,seconds);
			var dateNow=new Date();
			var timeZoneDifference=dateNow.getTimezoneOffset()/60;
			date.setHours(date.getHours()-timeZoneDifference);
			date=formatMonth(date.getMonth())+" "+addLeadingZeros(date.getDate())+", "+date.getFullYear()+" "+addLeadingZeros(formatHours(date.getHours()))+":"+addLeadingZeros(date.getMinutes())+":"+addLeadingZeros(date.getSeconds())+" "+formatAM_PM(date.getHours());
		 	var lastResponse=thePost.find(".response").first();
			 	//var lastResponse=responseForm.parent().parent();
			  //if there are responses for the post
			if(lastResponse.length>0)
			{
		    	if(media!="")
		    	{
		    		if(profilePic!="")
		    		{
						if(response!="")
						{
							if(mediaType=="mp4")
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
						}
						else
						{

							if(mediaType=="mp4")
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}

						}

		    		}
		    		else
		    		{
						if(response!="")
						{

							if(mediaType=="mp4")
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options rounded mx-auto p-2 m-2 text-center border-right delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options rounded mx-auto p-2 m-2 text-center border-right delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
						}
						else
						{

							if(mediaType=="mp4")
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options rounded mx-auto p-2 m-2 text-center border-right delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options rounded mx-auto p-2 m-2 text-center border-right delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
							}
						}

		    		}
		    	}
		    	else
		    	{
		    		if(profilePic!="")
		    		{
						if(response!="")
						{
							lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p>	<form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options rounded mx-auto p-2 m-2 text-center border-right delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
						}
						else
						{
							lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options rounded mx-auto p-2 m-2 text-center border-right delete_option_response'>delete</p><p class='col-sm options rounded scrollUpResponse mx-auto p-2 m-2 border-right text-center'>scroll up</p></div> </div></div>");
						}

		    		}
		    		else
		    		{
						if(response!="")
						{
							lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p>	<form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
						}
						else
						{
							lastResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
						}

		    		}

		    	}
			}
		    //if there are no responses for the post
		    else
		    {
		    	if(media!="")
		    	{
		    		if(profilePic!="")
		    		{
						if(response!="")
						{
							if(mediaType=="mp4")
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
						}
						else
						{
							if(mediaType=="mp4")
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
						}

		    		}
		    		else
		    		{
						if(response!="")
						{
							if(mediaType=="mp4")
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}

						}
						else
						{
							if(mediaType=="mp4")
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
						}

		    		}

		    	}
		    	else
		    	{
		    		if(profilePic!="")
		    		{
						if(response!="")
						{
							thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form>	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
						}
						else
						{
							thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form>	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
						}

		    		}
		    		else
		    		{
						if(response!="")
						{
							thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form>	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
						}
						else
						{
							thePost.find(".num_responses").after("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'>	</div></div></form>	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
						}

		    		}
		    	}
		    }

			var numOfPosts=$(".post").length+$(".response").length;
		    if(numOfPosts==1)
		    {
		    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
		    }
		    else
		    {
		    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
		    }
		    var numOfResponses=thePost.find(".response").length;
		    if(numOfResponses==1)
		    {
		    	thePost.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> reply</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
		    }
		    else
		    {
		    	thePost.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> replys</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
		    }

				// thePost.find(".num_responses_value").parent().parent().mouseover(function()
				// {
				// 	if($(this).find(".num_responses_value").html()!="0")
				// 	{
				// 		$(this).css("cursor","pointer");
				// 	}
				// });
				//
				// thePost.find(".num_responses_value").parent().parent().click(function()
				// {
				// 	var responses=$(this).parent().parent().find(".response");
				// 	responses.fadeToggle(fadeSpeed);
				// });

	  	 	var firstResponse=thePost.find(".response").first();
	  	 	var lastResponse=thePost.find(".response").last();
				// if responses are shown, display new response
	  	 	if(lastResponse.css("display")!="none")
	  	 	{
					firstResponse.fadeIn(fadeSpeed);
	  	 	}

			firstResponse.find(".editFormResponse").submit(function(event)
			{
					event.preventDefault();
					editResponse($(this).parent());
			});

  	 	firstResponse.find(".replyFormResponse").submit(function(event)
			{
				event.preventDefault();
		  	saveResponse2($(this),$(this).parent().parent().parent().parent());
			});

			firstResponse.find('.scrollUpResponse').click(function()
			{
				var targetElement=$(this).parent().parent();

				var scrollToTop=window.setInterval(function(){
					var scrollUp=setTimeout(function(){
						$(window).scrollTop($(window).scrollTop()-scrollAmount);
					},scrollFrequency);
					if($(window).scrollTop()<=targetElement.position().top)
					{
						clearInterval(scrollToTop);
						clearTimeout(scrollUp);
					}
				},scrollFrequency);
			});

			firstResponse.find( ".reply_option_response" ).click(function()
			{
				$(this).parent().parent().find(".replyFormResponse").fadeIn(fadeSpeed);
				$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
				$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
			});

			firstResponse.find( ".edit_option_response" ).click(function()
			{
					$(this).parent().parent().find(".editFormResponse").fadeIn(fadeSpeed);
					$(this).parent().parent().find(".replyFormResponse").fadeOut(fadeSpeed);
					$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
			});

			firstResponse.find(".delete_option_response").click(function()
			{
				var dialog=$(this).parent().parent().find(".deletePostDialog");
				if(dialog.length>0)
				{
					dialog.remove();
				}
				$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
				$(this).parent().parent().find(".replyFormResponse").fadeOut(fadeSpeed);
				$(this).parent().before("<div class='alert alert-danger border border-danger col-sm-9 w-75 mx-auto mb-4 mt-4 p-4 deletePostDialog' role='alert'> <form method='post' name='deleteForm' class='deleteFormResponse border-0 rounded mx-auto'><div class='row'><div class='col-sm text-center mx-auto'>Are you sure you want to delete?</div></div> <div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='delete' class='delete btn btn-danger' value='delete'></div> <div class='col-sm m-2'><input type='submit' value='cancel' class='btn cancelDeletePost'></div></div> </form> </div>");
				$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
				$(this).parent().parent().find(".responseFormResponse").fadeOut(fadeSpeed);

				firstResponse.find(".cancelDeletePost").click(function(event)
				{
						event.preventDefault();
						var dialog=$(this).parent().parent().parent().parent().parent().find(".deletePostDialog");
						dialog.fadeOut(fadeSpeed, function()
						{
							dialog.remove();
						});
					});

					firstResponse.find(".deleteFormResponse").submit(function(event)
					{
						event.preventDefault();
						deleteResponse($(this).parent().parent().parent(), $(this).parent().parent().parent().parent().parent());
					});
				});

				firstResponse.find(".cancel").click(function(event)
				{
					event.preventDefault();
					var dialog=$(this).parent().parent().parent();
					dialog.fadeOut(fadeSpeed);
					$(this).find(".alert").fadeOut(fadeSpeed);
				});
	  	}
	  	catch(error)
	  	{
	  		console.error(error);
	  		alert("An error has occurred");
	  	}
	  })
	  .fail(function(error)
	  {
	  	alert("An error has occured.  Please try again.");
		console.error(error);
	  });
	}
}

function saveResponse2(responseForm, thePost)
{

	if(responseForm.find(".newResponse").val()=="" && (responseForm.find(".mediaResponse"))[0].files[0]==undefined)
	{
		//	alert("Please enter text to send a reply");
		if($(document).find(".makeTextResponseAlert").length<=0)
		{
			responseForm.before("<div class='alert alert-warning alert-dismissible fade show col-sm-9 mx-auto p-2 w-75 makeTextResponseAlert' role='alert'>Please enter text or add a photo to send a reply<button type='button' class='close m-2 rounded' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
		}
	}
	else
	{
		var obj=new FormData((responseForm)[0]);
		obj.append("initPostId", responseForm.find(".initPostId").val());
		obj.append("initUser", responseForm.find(".initUser").val());
		obj.append("newResponse", responseForm.find(".newResponse").val());
		obj.append("reply","reply");
		obj.append("media", (responseForm.find(".mediaResponse"))[0].files[0]);
		$.ajax({
		  method: "POST",
		  url: site_url,
		  data: obj,
		  contentType: false,       // The content type used when sending data to the server.
          cache: false,             // To unable request pages to be cached
          processData:false
		})
		  .done(function( data )
			{
		  	try
		  	{
		  		var data = JSON.parse(data);
		  		var responseId=data.responseId;
			  	var username=data.username;
			  	var initPostId=data.initPostId;
			  	var response=data.response;
			  	var media=data.media;
			  	var mediaType=data.mediaType;
			  	var profilePic=data.profilePic;
				var dateTime=data.dateTime;

				// need to change date parameter to tuple format
				var dateTimeArray=dateTime.split(" ");
				var datePortion=dateTimeArray[0];
				var datePortionArray=datePortion.split("-");
				var year=datePortionArray[0];
				var month=datePortionArray[1];
				var date=datePortionArray[2];
				var timePortion=dateTimeArray[1];
				var timePortionArray=timePortion.split(":");
				var hours=timePortionArray[0];
				var minutes=timePortionArray[1];
				var seconds=timePortionArray[2];
				var date=new Date(year,month-1,date,hours,minutes,seconds);
				var dateNow=new Date();
				var timeZoneDifference=dateNow.getTimezoneOffset()/60;
				date.setHours(date.getHours()-timeZoneDifference);
				date=formatMonth(date.getMonth())+" "+addLeadingZeros(date.getDate())+", "+date.getFullYear()+" "+addLeadingZeros(formatHours(date.getHours()))+":"+addLeadingZeros(date.getMinutes())+":"+addLeadingZeros(date.getSeconds())+" "+formatAM_PM(date.getHours());
			 	//var lastResponse=thePost.find(".response").first();
			 	var curResponse=responseForm.parent().parent();

		    	if(media!="")
		    	{
		    		if(profilePic!="")
		    		{
						if(response!="")
						{
							if(mediaType=="mp4")
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}

						}
						else
						{
							if(mediaType=="mp4")
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
						}

		    		}
		    		else
		    		{
						if(response!="")
						{
							if(mediaType=="mp4")
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p> <form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
						}
						else
						{
							if(mediaType=="mp4")
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+mediaType+";base64,"+media+"' type='video/"+mediaType+"'>Sorry, your browser doesn't support embedded videos</video><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+media+"'><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
						}
		    		}
		    	}
		    	else
		    	{
		    		if(profilePic!="")
		    		{
							if(response!="")
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p>	<form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,"+profilePic+"'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}

		    		}
		    		else
		    		{
							if(response!="")
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+response+"</p>	<form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}
							else
							{
								curResponse.before("<div id='"+responseId+"' class='row response'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'><img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>"+username+" @ "+date+" UTC</h5><form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2'><input type='hidden' name='editPostId' class='editPostId' value='"+responseId+"'><div class='form-group'><textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>"+response+"</textarea></div><div class='form-group'><input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='edit' value='edit' class='edit btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2'><input type='hidden' name='initPostId' class='initPostId' value='"+initPostId+"'><input type='hidden' name='initUser' class='initUser' value='"+username+"'><div class='form-group'><textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea></div><div class='form-group'><input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'></div><div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='reply' value='reply' class='reply btn border border-secondary rounded'></div><div class='col-sm m-2'><input type='submit' value='cancel' class='cancel btn border border-secondary rounded'></div></div></form> <div class='row w-75 ml-2 mb-4 mt-4 mx-auto'><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p><p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p><p class='col-sm options mx-auto p-2 m-2 text-center border-right rounded delete_option_response'>delete</p><p class='col-sm options scrollUpResponse mx-auto p-2 m-2 border-right rounded text-center'>scroll up</p></div> </div></div>");
							}

		    		}

		    	}

				var numOfPosts=$(".post").length+$(".response").length;
			    if(numOfPosts==1)
			    {
			    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
			    }
			    else
			    {
			    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
			    }
			    var numOfResponses=thePost.find(".response").length;
			    if(numOfResponses==1)
			    {
			    	thePost.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> reply</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
			    }
			    else
			    {
			    	thePost.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> replys</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
			    }
		  	 	var newResponse=curResponse.prev();
		  	 	var lastResponse=thePost.find(".response").last();

					// if responses are shown, display new response
		  	 	if(lastResponse.css("display")!="none")
		  	 	{
						newResponse.fadeIn(fadeSpeed);
		  	 	}

					newResponse.find(".editFormResponse").submit(function(event){
							event.preventDefault();
							editResponse($(this).parent());
					});

		  	 	newResponse.find(".replyFormResponse").submit(function(event){
						event.preventDefault();
				  	saveResponse2($(this),$(this).parent().parent().parent().parent());
					});

				// newResponse.find(".num_responses_value").parent().parent().mouseover(function()
				// {
				// 	if($(this).find(".num_responses_value").html()!="0"){
				// 		$(this).css("cursor","pointer");
				// 	}
				// });

				newResponse.find('.scrollUpResponse').click(function(){
				//	$(window).scrollTop($(this).parent().parent().position().top);
					var targetElement=$(this).parent().parent();

					var scrollToTop=window.setInterval(function(){
						var scrollUp=setTimeout(function(){
							$(window).scrollTop($(window).scrollTop()-scrollAmount);
						},scrollFrequency);
						if($(window).scrollTop()<=targetElement.position().top)
						{
							clearInterval(scrollToTop);
							clearTimeout(scrollUp);
						}
					},scrollFrequency);
				});

				newResponse.find( ".reply_option_response" ).click(function()
				{
					$(this).parent().parent().find(".replyFormResponse").fadeIn(fadeSpeed);
					$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
					$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
				});

				newResponse.find( ".edit_option_response" ).click(function()
				{
						$(this).parent().parent().find(".editFormResponse").fadeIn(fadeSpeed);
						$(this).parent().parent().find(".replyFormResponse").fadeOut(fadeSpeed);
						$(this).parent().parent().find(".deletePostDialog").fadeOut(fadeSpeed);
				});

				newResponse.find(".delete_option_response").click(function()
				{
					var dialog=$(this).parent().parent().find(".deletePostDialog");
					if(dialog.length>0)
					{
						dialog.remove();
					}
					$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
					$(this).parent().parent().find(".replyFormResponse").fadeOut(fadeSpeed);
					$(this).parent().before("<div class='alert alert-danger border col-sm-9 w-75 mx-auto mb-4 mt-4 p-4 border-danger deletePostDialog' role='alert'> <form method='post' name='deleteForm' class='deleteFormResponse border-0 rounded mx-auto'><div class='row'><div class='col-sm text-center mx-auto'>Are you sure you want to delete?</div></div> <div class='row text-center mx-auto mt-2 mb-2'><div class='col-sm m-2'><input type='submit' name='delete' class='delete btn btn-danger' value='delete'></div> <div class='col-sm m-2'><input type='submit' value='cancel' class='btn cancelDeletePost'></div></div> </form> </div>");
					$(this).parent().parent().find(".editFormResponse").fadeOut(fadeSpeed);
					$(this).parent().parent().find(".responseFormResponse").fadeOut(fadeSpeed);

					newResponse.find(".cancelDeletePost").click(function(event){
							event.preventDefault();
							var dialog=$(this).parent().parent().parent().parent().parent().find(".deletePostDialog");
							dialog.fadeOut(fadeSpeed, function(){
								dialog.remove();
							});
						});

						newResponse.find(".deleteFormResponse").submit(function(event){
							event.preventDefault();
							deleteResponse($(this).parent().parent().parent(), $(this).parent().parent().parent().parent().parent());
						});
					});

					newResponse.find(".cancel").click(function(event){
						event.preventDefault();
						var dialog=$(this).parent().parent().parent();
						dialog.fadeOut(fadeSpeed);
						$(this).find(".alert").fadeOut(fadeSpeed);
					});
		  	}
		  	catch(error)
		  	{
		  		console.error(error);
		  		alert("An error has occurred");
		  	}
		  })
		  .fail(function(error)
			{
		  	alert("An error has occured.  Please try again.");
				console.error(error);
		  });
	}

}

function deletePost(post)
{
	var postId=post.find(".replyFormPost .initPostId").val();
	var obj={ "delete": "delete", "postId": postId};
	$.ajax(
	{
	  method: "POST",
	  url: site_url,
	  data: obj
	})
  .done(function( data )
	{
		try
		{
			var data = JSON.parse(data);
			post.fadeOut(fadeSpeed,function()
			{
		  	$(this).remove();
				var numOfPosts=$(".post").length+$(".response").length;
		    if(numOfPosts==1)
		    {
		    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
		    }
		    else
		    {
		    	$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
		    }
			});
		}
		catch(error)
		{
			console.error(error);
		}
  })
  .fail(function(error)
	{
  	alert("An error has occured.  Please try again.");
		console.error(error);
	});
}

function deleteResponse(response, post)
{
	var obj={ "delete": "delete", "postId": response.find(".editFormResponse .editPostId").val()};
	$.ajax(
	{
	  method: "POST",
	  url: site_url,
	  data: obj
	})
	.done(function( data )
	{
		try
		{
			var data = JSON.parse(data);
			response.fadeOut(fadeSpeed,function()
			{
		  	$(this).remove();
				var numOfPosts=$(".post").length+$(".response").length;
				if(numOfPosts==1)
				{
					$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> post</h4>");
				}
				else
				{
					$("#num_posts").html("<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>"+numOfPosts+"</span> posts</h4>");
				}
				var numOfResponses=post.find(".response").length;
		    if(numOfResponses==1)
		    {
		    	post.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> reply</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
		    }
		    else
		    {
		    	post.find(".num_responses").html("<h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>"+numOfResponses+"</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div>");
		    }

				// post.find(".num_responses_value").parent().parent().mouseover(function()
				// {
				// 	if($(this).find(".num_responses_value").html()!="0")
				// 	{
				// 		$(this).css("cursor","pointer");
				// 	}
				// });
				//
				// post.find(".num_responses_value").parent().parent().click(function()
				// {
				// 	var responses=$(this).parent().parent().find(".response");
				// 	responses.fadeToggle(fadeSpeed);
				// });

			});
		}
		catch (error)
		{
			console.error(error);
		}
	})
	.fail(function(error)
	{
	  	alert("An error has occured.  Please try again.");
			console.error(error);
	});
}

function editPost(post)
{
	if(post.find(".newEdit").first().val()=="" && (post.find(".mediaEdit"))[0].files[0]==undefined)
	{
		if($(document).find("#makeTextEditPostAlert").length<=0)
		{
			post.find(".editFormPost").before("<div class='alert alert-warning alert-dismissible fade show mx-auto col-md-9 w-75' id='makeTextEditPostAlert' role='alert'>Please enter text or add a photo to edit a post<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
		}
	}
	else
	{
		var obj=new FormData();
		obj.append("newEdit",post.find(".newEdit").val())
		obj.append("edit","edit");
		obj.append("postId", post.find(".editPostId").val());
		obj.append("media", (post.find(".mediaEdit"))[0].files[0]);
		$.ajax({
		  method: "POST",
		  url: site_url,
		  data: obj,
		  contentType: false,       // The content type used when sending data to the server.
	    cache: false,             // To unable request pages to be cached
	    processData:false
		})
		.done(function( data )
		{
			try
			{
				var data = JSON.parse(data);
				if(data.post!="")
				{
					if(post.find(".post-content-post").length>0)
					{
						post.find(".post-content-post").html(data.post);
					}
					else
					{
						if(post.find(".mediaPost").length>0)
						{
							$(post).find(".mediaPost").after("<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-post'>"+data.post+"</p>");
						}
						else
						{
							$(post).find(".header-post").after("<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-post'>"+data.post+"</p>");
						}
					}
				}
				else
				{
					if(post.find(".post-content-post").length>0)
					{
						post.find(".post-content-post").remove();
					}
				}

				if(data.media!="")
				{
					if(data.mediaType=="mp4")
					{
						if(post.find(".mediaPost").length>0)
						{
							$.when(post.find(".mediaPost").remove()).then(post.find(".header-post").after("<video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+ data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>"));
						}
						else
						{
							post.find(".header-post").after("<video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+ data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>");
						}
					}
					else
					{
						if(post.find(".mediaPost").length>0)
						{
							$.when(post.find(".mediaPost").remove()).then(post.find(".header-post").after("<img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+data.mediaType+";base64,"+data.media+"'>"));
						}
						else
						{
							post.find(".header-post").after("<img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/"+data.mediaType+";base64,"+data.media+"'>");
						}
					}
				}
				else
				{
					if(post.find(".mediaPost").length>0)
					{
						post.find(".mediaPost").remove();
					}
				}
			}
			catch (error)
			{
					console.error(error);
			}
		})
	  	.fail(function(error)
	  	{
	  		alert("An error has occured.  Please try again.");
			console.error(error);
		});
	}
}

function editResponse(response)
{
	if(response.find(".newEdit").first().val()=="" && (response.find(".mediaEdit"))[0].files[0]==undefined)
	{
		if($(document).find("#makeTextEditResponseAlert").length<=0)
		{
			response.find(".editFormResponse").before("<div class='alert alert-warning alert-dismissible fade show mx-auto col-md-9 w-75' id='makeTextEditResponseAlert' role='alert'>Please enter text or add a photo to edit a post<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
		}
	}
	else
	{
		var obj=new FormData();
		obj.append("edit","edit");
		obj.append("newEdit",response.find(".newEdit").val());
		obj.append("media", (response.find(".mediaEdit"))[0].files[0]);
		obj.append("postId",response.find(".editPostId").val());
		$.ajax(
		{
		  method: "POST",
		  url: site_url,
		  data: obj,
		  contentType: false,       // The content type used when sending data to the server
	    cache: false,             // To unable request pages to be cached
	    processData:false
		})
		.done(function( data )
		{
			try
			{
				var data = JSON.parse(data);
				if(data.post!="")
				{
					if(response.find(".post-content-response").length>0)
					{
						response.find(".post-content-response").html(data.post);
					}
					else
					{
						if(response.find(".mediaPost2").length>0)
						{
							$(response).find(".mediaPost2").after("<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+data.post+"</p>");
						}
						else
						{
							$(response).find(".header-response").after("<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>"+data.post+"</p>");
						}
					}
				}
				else
				{
					if(response.find(".post-content-response").length>0)
					{
						response.find(".post-content-response").remove();
					}
				}

				if(data.media!="")
				{
					if(data.mediaType=="mp4")
					{
						if(response.find(".mediaPost2").length>0)
						{
							$.when(response.find(".mediaPost2").remove()).then(response.find(".header-response").after("<video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>"));
						}
						else
						{
							response.find(".header-response").after("<video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/"+data.mediaType+";base64,"+data.media+"' type='video/"+data.mediaType+"'>Sorry, your browser doesn't support embedded videos</video>");
						}
					}
					else
					{
						if(response.find(".mediaPost2").length>0)
						{
							$.when(response.find(".mediaPost2").remove()).then(response.find(".header-response").after("<img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+data.media+"'>"));
						}
						else
						{
							response.find(".header-response").after("<img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/jpeg;base64,"+data.media+"'>");
						}
					}
				}
				else
				{
					if(response.find(".mediaPost2").length>0)
					{
						response.find(".mediaPost2").remove();
					}
				}
			}
			catch (error)
			{
				console.error(error);
			}
		 })
		.fail(function(error)
		{
		  	alert("An error has occured.  Please try again.");
			  console.error(error);
		});
	}

}

function formatHours(hours)
{
	if(hours==0)
	{
		return "12";
	}
	if(hours>12)
	{
		return parseInt(hours,10)-12;
	}
	else
	{
		return hours;
	}
}

function formatAM_PM(hours)
{
	if(hours<12)
	{
		return "A.M.";
	}
	else
	{
		return "P.M.";
	}
}

function addLeadingZeros(num)
{
	if(parseInt(num,10)<10 && parseInt(num,10)>-10)
	{
		return "0"+num;
	}
	else
	{
		return num;
	}
}

function formatMonth(month)
{
	switch(month){
		case 0:
			return "Jan";
		case 1:
			return "Feb";
		case 2:
			return "Mar";
		case 3:
			return "Apr";
		case 4:
			return "May";
		case 5:
			return "Jun";
		case 6:
			return "Jul";
		case 7:
			return "Aug";
		case 8:
			return "Sep";
		case 9:
			return "Oct";
		case 10:
			return "Nov";
		case 11:
			return "Dec";
		default:
			return "";
	}
}

function isEqual(texta, textb)
{
	return texta==textb;
}
