<?php

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	require_once "vendor/autoload.php";

	function connect()
	{
		$server = $_SERVER['db_server'];
		$username = $_SERVER['username'];
		$password = $_SERVER['password'];
		$db = $_SERVER['db_name'];

		$GLOBALS['conn'] = new mysqli($server, $username, $password, $db);

		//check connection
		if($GLOBALS['conn']->connect_error)
		{
		  $GLOBALS['conn']=false;
		  generateErrorMessage();
		  return false;
		}
		return true;
	}

  	function sendEmail($name, $email,$subject, $body, $altBody)
	{
		try
		{
		  $mail = new PHPMailer(true);
		  $mail->CharSet = 'UTF-8';
		  $mail->Encoding = 'base64';

		  //Set PHPMailer to use SMTP.
		  $mail->isSMTP();

		  //Set SMTP host name
		  $mail->Host = $_SERVER['smtp_server'];

		  //Set this to true if SMTP host requires authentication to send email
		  $mail->SMTPAuth = true;

		  //Provide username and password
		  $mail->Username = $_SERVER['smtp_username'];
		  $mail->Password = $_SERVER['smtp_password'];

		  //If SMTP requires TLS encryption then set it
		  $mail->SMTPSecure = "tls";

		  //Set TCP port to connect to
		  $mail->Port = 587;

		  $mail->From = $_SERVER['no_reply_email'];
		  $mail->FromName = "Animals and Nature Message Board";

		  $mail->addAddress($email, $name);
		  $mail->isHTML(true);
		  $mail->Subject = $subject;


		  $mail->Body = $body;
		  $mail->AltBody = $altBody;
		  $mail->send();

		  return true;
		}
		catch (Exception $e)
		{
		  echo $mail->ErrorInfo;
		  return false;
		}
	}

?>