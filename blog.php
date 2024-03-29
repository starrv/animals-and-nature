<?php

	require 'database.php';

	if(isset($_COOKIE['loggedInUser']))
	{
		if(empty($_POST['post']) && empty($_POST['reply']) && empty($_POST['signout']) && empty($_POST['delete']) && empty($_POST['markRead']) && empty($_POST['checkForNotifications']) && empty($_POST['checkForResponses']) && empty($_POST['checkForPosts']) && empty($_POST['checkForDeletes']) && empty($_POST['checkForUpdates']) && empty($_POST['edit']) && empty($_POST['postId']) && empty($_POST['getLoggedInUser']))
		{
			//set page for logged in user
			echo'
				<!DOCTYPE html>
				<html>
					<head>
						<title>
							Animals and Nature Message Board
						</title>
						<meta charset="utf-8">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<!-- icon -->
						<link rel="icon" href="images/leaf.jpg" type="image/jpg" sizes="40x40">
						<!-- stylesheets -->
						<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
						<link rel="preconnect" href="https://fonts.gstatic.com">
						<link href="https://fonts.googleapis.com/css2?family=Arimo&display=swap" rel="stylesheet">
						<link rel="stylesheet" type="text/css" href="css/style.css">
						<!-- script -->
						<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
						<script type="text/javascript" src="js/script.js"></script>
					</head>
					<body>
						';

			if(!isset($_COOKIE['timeZoneDiff']))
			{
				setTimeZone();
			}

			if(connect())
			{
				$fname="";
				$lname="";
				$pic=null;
				//$sql="select username, fname, lname from accounts where username='$_COOKIE[loggedInUser]'";
				$sql="select * from accounts where username=?";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if($stmt)
				{
					$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
					if($result)
					{
						$result=$stmt->execute();
						if($result)
						{
							$result=$stmt->get_result();
							$row = $result->fetch_assoc();
							if(!empty($row))
							{
								$fname=$row['fname'];
								$lname=$row['lname'];
								$pic=base64_encode($row['pic']);
							}
							else
							{
								//http_response_code(500);
								echo  "Error: No such user";
							}
						}
						else
						{
							 generateErrorStmt($stmt);
						}
					}
					else
					{
						 generateErrorStmt($stmt);
					}
				}
				else
				{
					 generateError();
				}
				disconnect();
			}
			else
			{
				generateError();
			}

			echo "<div class='pos-f-t'>
			 				<div class='collapse' id='navbarToggleExternalContent'>
			 					<div>

									<div class='d-sm-flex justify-content-end'>

										<h5 class='m-4'>
											<a href='contact.php'>
												Contact Us
											</a>
										</h5>

										<h5 class='m-4'>
											<a href='updateAccount.php'>
												Update Account
											</a>
										</h5>

										<div class='dropdown show m-4'>
											<button class='btn border border-secondary rounded dropdown-toggle' href='#' role='button' id='dropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
											 <span class='badge text-dark border border-secondary rounded' id='notifications-badge'></span> Notifications
											</button>

											<div class='dropdown-menu' id='notifications-dropdown-menu' aria-labelledby='dropdownMenuLink'>
											</div>
										</div>

										<form id='signOut' method='post' class='m-4'><input type='submit' name='signout' class='btn mx-auto rounded' value='sign out'></form>

									</div>

						</div>
					</div>";

				echo
					"
					<nav class='navbar navbar-light'>
					    <button class='navbar-toggler rounded bg-white  border border-secondary p-0 m-2' type='button' data-toggle='collapse' data-target='#navbarToggleExternalContent' aria-controls='navbarToggleExternalContent' aria-expanded='false' aria-label='Toggle navigation' id='profileButton'>";
					 if($pic!=null)
					 {
					    	echo "<img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='data:image/jpeg;base64,".$pic."'>";
					 }
					 else
					 {
						 echo "<img width='50' height='50' alt='profile picture' class='img-fluid rounded' src='images/person.jpg'>";
					 }
					 echo
							  		"	</button>
										 </nav>
									</div>";
			echo '
					<div class="container-fluid">
						<h1 class="m-4" id="hello-user">Welcome '.$fname.' '.$lname.'</h1>
						<form method="post" name="postForm" id="postForm" class="col-md-9 border border-secondary rounded p-2 m-2" enctype="multipart/form-data">
							<div class="form-group mt-2 mb-2">
								<textarea id="newPost" id="newPost" name="newPost" rows="3" class="form-control border border-secondary rounded">'; if(!empty($_POST['newPost'])){echo $_POST['newPost'];} echo '</textarea>
							</div>
							<div class="form-group mt-2 mb-2">
								<input type="file" id="mediaPost" name="mediaPost" class="form-control border border-secondary rounded text-dark bg-light" accept="image/png, image/jpeg, image/jpg, image/gif, video/mp4">
							</div>
							<div class="form-group mt-2 mb-2">
								<input type="submit" name="post" id="post" value="post" class="btn border border-secondary rounded">
							</div>
						</form>';

			printPosts();
			printNotifications();

			echo '	</div>


							<audio id="notification">
								<source src="audio/notification.wav" type="audio/wav">
							</audio>


							<!-- JS, Popper.js, and jQuery -->
							<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
							<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

						</body>
					</html>';
		}

		else
		{
			if(!empty($_POST['signout']))//signing out
			{
				signOut();
			}

			if(!empty($_POST['post']))
			{
				//if there is a new post save it
				savePost();
			}

			if(!empty($_POST['reply']))
			{
				//if there is a new response save it
				saveResponse();
			}

			if(!empty($_POST['delete']))
			{//if there is a new response save it
				deletePost();
			}

			if(!empty($_POST['edit']))
			{
				editPost();
			}

			if(!empty($_POST['markRead']))
			{
				markNotificationsAsRead();
			}

			if(!empty($_POST['checkForNotifications']))
			{
				checkNewNotifications();
			}

			if(!empty($_POST['checkForResponses']))
			{
				checkNewResponses();
			}

			if(!empty($_POST['checkForPosts']))
			{
				checkNewPosts();
			}

			if(!empty($_POST['checkForDeletes']))
			{
				checkNewDeletes();
			}

			if(!empty($_POST['checkForUpdates']))
			{
				checkNewUpdates();
			}
			
			if(!empty($_POST['getLoggedInUser']))
			{
				getLoggedInUser();
			}
		}

	}
	else
	{
		// user not logged in go back to signin page
		echo "<script type='text/javascript'>console.log('not signed in');</script>";
		load('signin.php');
	}
?>
