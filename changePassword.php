<!DOCTYPE html>
<html>
	<head>
		<title>
			Change Password
		</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- icons -->
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
				<h1 class="display-1 text-center col-sm mx-auto mt-2 mb-2 p-2">
					Welcome to Animals and Nature Message Board
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

					if(empty($_GET['username']))
					{
						load("resetPassword.php");
					}
					else
					{
						createTableAccounts();
						connect();
						useDB("animals_and_nature");

						//$sql="select password from accounts where username = '$_GET[username]'";
						$sql="select temporaryPassword from accounts where username = ?";
						$stmt=$GLOBALS['conn']->prepare($sql);
						if(!$stmt)
						{
							generateErrorMessage();
						}
						else
						{
							$result=$stmt->bind_param("s",$_GET['username']);
							if(!$result)
							{
								generateErrorMessageStmt($stmt);
							}
							else
							{
								$result=$stmt->execute();
								if(!$result)
								{
									generateErrorMessageStmt($stmt);
								}
								else
								{
									$result=$stmt->get_result();
									if($result->num_rows>0)
									{
										if(empty($_POST['password']) || empty($_POST['confirmPassword']) || empty($_POST['changePassword']) || empty($_POST['temporaryPassword']))
										{
											//waiting for user input
											echo "	<h5 class='mt-2 mb-2'>
																Please enter the temporary password that was sent to your email and enter and confirm a new password to reset your password.
															</h5>";
										}
										else
										{
											changePassword();
										}
									}
									else
									{
										echo "<h5 class='mt-2 mb-2 error'>User is not on file</h5>";
									}
								}
							}
						}
					}
				?>
				<div class="form-group mt-2 mb-2">
					<label for="temporaryPassword">
			   			Temporary Password:*
			   		</label>
			   		<input type="text" id="temporaryPassword" name="temporaryPassword" class="form-control border border-secondary rounded" required value="<?php if(!empty($_POST['temporaryPassword'])){echo htmlspecialchars($_POST['temporaryPassword']);}?>">
				</div>
				<div class="form-group mt-2 mb-2">
					<label for="password">
			   			Password:*
			   		</label>
			   		<input type="password" id="password" name="password" class="form-control border border-secondary rounded" required value="<?php if(!empty($_POST['password'])){echo htmlspecialchars($_POST['password']);}?>">
				</div>
				<div class="form-group mt-2 mb-2">
					<label for="confirmPassword">
			   			Confirm Password:*
			   		</label>
			   		<input type="password" id="confirmPassword" name="confirmPassword"  required class="form-control border border-secondary rounded" value="<?php if(!empty($_POST['confirmPassword'])){echo htmlspecialchars($_POST['confirmPassword']);}?>">
				</div>
				<div class="form-group mt-2 mb-2">
			   		<input type="submit" id="changePassword" name="changePassword" value="changePassword" class="btn btn-primary">
			   	</div>
			   	<div class="form-group mt-2 mb-2">
						<h5>
							<a href="signin.php">
				   			sign in
							</a>
						</h5>
				</div>
			</form>
		</div>
	</body>
</html>
