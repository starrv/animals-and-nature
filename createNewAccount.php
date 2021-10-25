<!DOCTYPE html>
<html>
	<head>
		<title>
			Create New Account
		</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- icon -->
		<link rel="icon" href="images/leaf.jpg" type="image/jpg" sizes="40x40">
		<!-- stylesheets -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="css/style.css" >
		<!-- script -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
		<script src="./js/script.js"></script>
	</head>
	<body>
		<div class="container-fluid">
			<div class="row" id="title">
				<h1 class="display-1 text-center col-sm mx-auto mt-2 mb-2 p-2">
					Animals and Nature
				</h1>
			</div>
			<div class="row">
				<div class="col-sm-3 mx-auto">
					<img class="img-fluid text-center rounded-circle mx-auto d-block" src="images/leaf.jpg" width="75" height="75">
				</div>
			</div>
			<form method="post" enctype="multipart/form-data" class="col-md-6 border border-dark rounded p-4 m-4 mx-auto">
				<?php

				require 'database.php';
				if(!empty($_POST['resendCode']))
				{
					resendCode();
				}
				if(empty($_POST['username']) || empty($_POST['password']) || empty($_POST['agreement']) || empty($_POST['createAccount']) || empty($_POST['fname']) || empty($_POST['email']))//waiting for user input
				{
					echo "	<h5>
										Please enter a username, password, email, name, and agree to the terms of service to create a new account.
									</h5>";
				}
				else
				{
					//create user
					createUser();
				}
			?>
				<fieldset>
					<div class="form-group mt-2 mb-2">
						<label for="username">
							Username:*
				   		</label>
				   		<input type="text" name="username" id="username" class="form-control border border-secondary rounded" placeholder="username"  required autocomplete="on" value="<?php if(!empty($_POST['username'])){echo $_POST['username'];}?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="email">
							Email:*
				   		</label>
				   		<input type="email" name="email" id="email" class="form-control border border-secondary rounded" placeholder="email"  required autocomplete="on" value="<?php if(!empty($_POST['email'])){echo $_POST['email'];} ?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="password">
							Password:*
				   		</label>
				   		<input type="password" id="password" name="password" class="form-control border border-secondary rounded" autocomplete="off" required value="<?php if(!empty($_POST['password'])){echo htmlspecialchars($_POST['password']);} ?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="confirmPassword">
							Confirm Password:*
				   		</label>
				   		<input type="password" id="confirmPassword" name="confirmPassword" autocomplete="off" required class="form-control border border-secondary rounded" required value="<?php if(!empty($_POST['confirmPassword'])){echo htmlspecialchars($_POST['confirmPassword']);} ?>">
					</div>
					<label for="pic">
						Profile Picture:
				   	</label>
					<div class="form-group mt-2 mb-2">
				   		<input type="file" name="pic" id="pic" class="form-control border border-secondary rounded" accept="image/png, image/jpeg, image/jpg, image/gif">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="fname">
				   			First Name:*
				   		</label>
				   		<input type="text" name="fname" id="fname" class="form-control border border-secondary rounded" placeholder="first name" required autocomplete="on" value="<?php if(!empty($_POST['fname'])){echo $_POST['fname'];} ?>">
					</div>
					<div class="form-group mt-2 mb-2">
						<label for="lname">
							Last Name:
				   		</label>
				   		<input type="text" name="lname" id="lname" class="form-control border border-secondary rounded" placeholder="last name" autocomplete="on" value="<?php if(!empty($_POST['lname'])){echo $_POST['lname'];} ?>">
					</div>
				  <div class="form-check mt-2 mb-2">
				   		<input type="checkbox" name="agreement" id="agreement" class="form-check-input border border-secondary rounded mr-4" required>
				   		<label for="agreement" class="form-check-label" id="agreement-label">
				   			I agree to the
				   		<em id="termsOfServiceLink">terms of service</em></label>
			   	</div>
			   	<div class="form-group border rounded m-4 p-4 border border-secondary rounded" id="termsOfService">
				   		<p>
				   			You agree to use the message board <strong>AT YOUR OWN RISK</strong>.  This is not a website linked to any corporation or organization.   As with using any website on the internet, there are inherit risks involved and by using this message board you agree to not hold anyone liable to any harm or damages occurred.  You also agree to not post any inappropriate content on this site, post any compromising information, or engage in any inappropriate actions.  I do hope on the other hand that you would benefit from the use of this site.  I would appreciate any feedback from those who choose to utilize the message board so that everyone who makes use of it would continue to have a pleasant experience.
							</p>
							<p><strong>NOTE</strong>: I am currently using a free email service to send email from the application as this is merely a personal project that has just been launched that is not affiliated with any corporation or organization.  If the site grows in popularity I will consider upgrading to a better quality email service, but given the current situation I feel that the free email service I am using is the best choice for now.  There is a limit on how many emails can be sent within a time period so if you should come across any issues sending email waiting a few minutes and up to 24 hours should resolve the issue.  Thank you for your time and patience in advance.
				   		</p>
				   		<h5 id="hideTermsOfService" class="btn border rounded mt-2 mb-2">
								hide
					   	</h5>
				   	</div>
				   	<div class="form-group mt-2 mb-2">
				   		<input type="submit" name="createAccount" id="createAccount" class="btn" value="Create Account">
				   	</div>
				   	<div class="form-group mt-2 mb-2">
							<h5>
								  <a href="signin.php">
					   				sign in
									</a>
							</h5>
					</div>
					<div class="form-group mt-2 mb-2">
							<h5>
								<a href="resetPassword.php">
			   					Reset Password
								</a>
							</h5>
				   	</div>

				   	<div class="form-group mt-2 mb-2">
							<h5>
								<a href="deleteAccount.php">
			   					Delete Account
								</a>
							</h5>
				   	</div>

				</fieldset>
			</form>
		</div>
	</body>
</html>
