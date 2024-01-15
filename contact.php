<!DOCTYPE html>
<html>
	<head>
		<title>
			Contact Us
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
					Contact Us
				</h1>
			</div>
			<div class="row">
				<div class="col-sm-3 mx-auto">
					<img class="img-fluid text-center rounded-circle mx-auto d-block" src="images/leaf.jpg" width="75" height="75">
				</div>
			</div>
			<form method="post" enctype="multipart/form-data" class="col-sm-6 border border-dark rounded p-4 m-4 mx-auto w-50">
				<?php
					require 'database.php';
					$MAX_MSG_SIZE=1000;
					$MAX_SUBJECT_SIZE=25;
					$MAX_FILE_SIZE=100000;
					if(isset($_COOKIE['loggedInUser']))
					{
						if(!(empty($_POST['subject']) || empty($_POST['message'])))
						{
							if(strlen($_POST['subject'])<=$MAX_SUBJECT_SIZE && strlen($_POST['message'])<=$MAX_MSG_SIZE){
								if(empty($_FILES['media']) ){
									sendReport();
								}
								else{
									if($_FILES['media']['size']<=$MAX_FILE_SIZE){
										sendReport();
									}
									else{
										$size_kb=$MAX_FILE_SIZE/1000;
										echo "<p class='error'>File upload cannot be larger than ".$size_kb."KB</p>";
									}
								}
							}
							else if(strlen($_POST['subject'])>$MAX_SUBJECT_SIZE){
								echo "<p class='error'>Subject cannot be larger than ".$MAX_SUBJECT_SIZE." characters</p>";
							}
							else if(strlen($_POST['message'])>$MAX_MSG_SIZE){
								echo "<p class='error'>Message cannot be larger than ".$MAX_MSG_SIZE." characters</p>";
							}
						}
					}
					else
					{
						load("signin.php");
					}
				?>

				<fieldset>
					<input type="hidden" name="loggedInUser" value="<?php echo $_COOKIE['loggedInUser'] ?>">
					<div class="form-group mt-2 mb-2">
						<label for="subject">
				   		Subject:*
			   		</label>
			   		<input type="text" name="subject" id="subject" class="form-control border border-secondary rounded" placeholder="subject" autocomplete="true"  required value="<?php if(!empty($_POST['subject'])){ echo $_POST['subject'];} ?>">
					</div>

					<div class="form-group mt-2 mb-2">
						<label for="message">
				   		Message:*
				   	</label>
						<textarea id="message" name="message" class="form-control border border-secondary rounded" autocomplete="true" required><?php if(!empty($_POST['message'])){ echo $_POST['message'];}else{ echo "";} ?></textarea>
					</div>

					<div class="form-group mt-2 mb-2">
						<label for="media">
				   		Image:*
				   	</label>
						<input type="file" id="media" name="media" accept="image/png, image/jpeg, image/jpg, image/gif" class="form-control border border-secondary rounded">
					</div>

					<div class="form-group mt-2 mb-2">
				   		<input type="submit" name="sendReport" id="sendReport" class="btn" value="send report">
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
