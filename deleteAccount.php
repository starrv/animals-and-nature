<!DOCTYPE html>
<html>
	<head>
		<title>
			Delete Account
		</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- icon -->
		<link rel="icon" href="images/leaf.jpg" type="image/jpg" sizes="40x40">
		<!-- stylesheets -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="css/style.css" />
		<!-- scripts -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
	</head>
	<body>
		<div class="container-fluid">
			<div class="row" id="title">
				<h1 class="display-1 text-center col-sm mx-auto p-2 mt-2 mb-2">
					Animals and Nature
				</h1>
			</div>
			<div class="row">
				<div class="col-sm-3 mx-auto">
					<img class="img-fluid text-center rounded-circle mx-auto d-block" src="images/leaf.jpg" width="75" height="75">
				</div>
			</div>
			<form method="post" class="col-sm-6 border border-dark rounded p-4 m-4 mx-auto">
				<?php
					require 'database.php';
					if(!empty($_POST['resendCode']))
					{
						resendCode();
					}
					if(empty($_POST['user']) || empty($_POST['password']) || empty($_POST['deleteAccount']))
					{
						//waiting for user input
						echo "	<h5>
											Please enter your username/email and password to delete your account
										</h5>";
					}
					else
					{
						//try to delete account
						deleteAccount();
					}
				?>
				<fieldset>

					<div class="form-group mt-2 mb-2">
						<label for="user">
					   		Username/Email:*
					  </label>
					  <input type="text" id="user" name="user" class="form-control border border-secondary rounded" required autocomplete value="<?php if(!empty($_POST['user'])){echo $_POST['user'];}?>">
				   </div>

				   <div class="form-group mt-2 mb-2">
				   	<label for="password">
				   		Password:*
				   	</label>
					 	<input type="password" name="password" id="password" class="form-control border border-secondary rounded" required autocomplete value="<?php if(!empty($_POST['password'])){echo htmlspecialchars($_POST['password']);} ?>">
					</div>

					<div class="form-group mt-2 mb-2">
				   	<input type="submit" id="deleteAccount" name="deleteAccount" value="Delete Account" class="btn">
				  </div>

			   	<div class="form-group mt-2 mb-2">
						<h5>
							<a href="signin.php">
		   					Sign in
							</a>
						</h5>
			   	</div>


			   	<div class="form-group mt-2 mb-2">
						<h5>
							<a href="createNewAccount.php">
		   					Create New Account
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

				</fieldset>
			</form>
		</div>
	</body>
</html>
