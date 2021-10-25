<!DOCTYPE html>
<html>
	<head>
		<title>
			Update Account
		</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- icon -->
		<link rel="icon" href="images/leaf.jpg" type="image/jpg" sizes="40x40">
		<!-- stylesheets -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="css/style.css" >
		<!-- scripts -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
		<script type="text/javascript" src="js/message-script.js"></script>
	</head>
	<body>
		<div class="container-fluid">

			<div class="row" id="title">
				<h1 class="display-1 text-center col-sm mx-auto p-2 mt-2 mb-2">
					Update Account
				</h1>
			</div>
			<div class="row">
				<div class="col-sm-3 mx-auto">
					<img class="img-fluid text-center rounded-circle mx-auto d-block" src="images/leaf.jpg" width="75" height="75">
				</div>
			</div>
			<form method="post" enctype="multipart/form-data" class="col-sm-6 border border-dark rounded p-4 m-4 mx-auto">

				<?php
					require 'database.php';
					if(isset($_COOKIE['loggedInUser']))
					{
						updateAccount();
					}
					else
					{
						load("signin.php");
					}
				?>

				<fieldset>
					<div class="form-group mt-2 mb-2">
						<label for="email">
				   			Email:
				   		</label>
				   		<input type="email" name="email" id="email" class="form-control border border-secondary rounded" autocomplete="true" value="<?php if(!empty($_POST['email'])){echo $_POST['email'];} ?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="currentPassword">
				   			Current Password:
				   		</label>
				   		<input type="password" id="currentPassword" name="currentPassword" class="form-control border border-secondary rounded" autocomplete="true" value="<?php if(!empty($_POST['currentPassword'])){echo htmlspecialchars($_POST['currentPassword']);}?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="newPassword">
				   			New Password:
				   		</label>
				   		<input type="password" id="newPassword" name="newPassword" class="form-control border border-secondary rounded" autocomplete="true" value="<?php if(!empty($_POST['newPassword'])){echo htmlspecialchars($_POST['newPassword']);}?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="confirmNewPassword">
				   			Confirm New Password:
				   		</label>
				   		<input type="password" id="confirmNewPassword" name="confirmNewPassword" class="form-control border border-secondary rounded" autocomplete="true" value="<?php if(!empty($_POST['confirmNewPassword'])){echo htmlspecialchars($_POST['confirmNewPassword']);}?>">
					</div>
					<label for="pic">
						Profile Picture:
				   	</label>
					<div class="form-group mt-2 mb-2">
				   		<input type="file" name="pic" id="pic" class="form-control border border-secondary rounded" accept="image/png, image/jpeg, image/jpg, image/gif">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="fname">
				   			First Name:
				   		</label>
				   		<input type="text" name="fname" id="fname" class="form-control border border-secondary rounded" placeholder="first name" autocomplete="true" value="<?php if(!empty($_POST['fname'])){echo $_POST['fname'];} ?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="lname">
				   			Last Name:
				   		</label>
				   		<input type="text" name="lname" id="lname" class="form-control border border-secondary rounded" placeholder="last name"  autocomplete="true" value="<?php if(!empty($_POST['lname'])){echo $_POST['lname'];} ?>">
					</div>

				   	<div class="form-group mt-2 mb-2">
				   		<input type="submit" name="updateAccount" id="updateAccount" class="btn" value="Update Account">
				   	</div>

				   	<div class="form-group mt-2 mb-2">
							 <h5>
					   		<a href="blog.php">
									Animals and Nature Message Board
								</a>
							</h5>
						</div>

				</fieldset>
			</form>

		</div>
	</body>
</html>
