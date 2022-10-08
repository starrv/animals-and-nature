<?php

	//report errors
	/*ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);*/

	require_once "debug-credentials.php";
	//require_once "production-credentials.php";

	$conn;

	function disconnect()
	{
		if(!empty($GLOBALS['conn']))
		{
			$GLOBALS['conn']->close();
		}
	}

	function useDB($dbname)
	{
		$sql="create database if not exists ".$dbname;
		$result=$GLOBALS['conn']->query($sql);
		if(!$result)
		{
			generateErrorMessage();
		}
		else
		{
			$sql="use ".$dbname;
			$result=$GLOBALS['conn']->query($sql);
			if(!$result)
			{
				generateErrorMessage();
			}
			//set timezone to UTC
			/*else
			{
				$sql="SET time_zone = '+00:00'";
				$result=$GLOBALS['conn']->query($sql);
				if(!$result)
				{
					generateErrorMessage();
				}
			}*/
		}
	}

	function createTableNotifications()
	{
		if(connect())
		{
			$createTable="create table if not exists notifications (notificationId BIGINT primary key auto_increment, username varchar(255) not null, notification mediumtext not null, responseId BIGINT default 0, isRead BOOL default 0, date datetime not null, FOREIGN KEY (responseId) REFERENCES posts(postId));";
			$GLOBALS['conn']->query($createTable);
			if ($GLOBALS['conn']->error)
			{
				generateErrorMessage();
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}


	function createTablePosts()
	{
		if(connect())
		{
			$createTable="create table if not exists posts (postId BIGINT primary key auto_increment, username varchar(255) not null, post mediumtext, media mediumblob, mediaType varchar(255), initPostId BIGINT default 0, isNew BOOL default 1, date datetime not null, userId BIGINT, FOREIGN KEY (userId) REFERENCES accounts(id));";
			$GLOBALS['conn']->query($createTable);
			if ($GLOBALS['conn']->error)
			{
				generateErrorMessage();
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function createTableAccounts()
	{
		if(connect())
		{
			$createTable="create table if not exists accounts (id BIGINT primary key auto_increment, username varchar(255) not null unique, email varchar(255) unique, password varchar(255) not null, pic mediumblob, fname varchar(255), lname varchar(255), isActivated bool default 0, activateCode varchar(255) default '', temporaryPassword varchar(255) default '', logInAttempts tinyint default 0);";
			// Create connection
			$GLOBALS['conn']->query($createTable);
			if ($GLOBALS['conn']->error)
			{
				generateErrorMessage();
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function setTimeZone()
	{
		echo "
			<script type='text/javascript'>
				var d1=new Date();
				var diff=d1.getTimezoneOffset();
				var expires=d1.getTime() + 2592000;
				document.cookie = 'timeZoneDiff='+diff+'; max-age='+expires+'; path=/';
				//reset timezone every hour
				window.setInterval(function()
				{
					var d1=new Date();
					var diff=d1.getTimezoneOffset();
					var expires=d1.getTime() + 2592000;
					document.cookie = 'timeZoneDiff='+diff+'; max-age='+expires+'; path=/';
				},3600000);
			</script>
		";
	}

	function logIn()
	{
		createTableAccounts();
		if(connect())
		{
			$username=$_POST['username'];
			$password=$_POST['password'];
			//$sql="select username, email, password, fname, isActivated from accounts where username = '$username' or email='$username'";
			$sql="select * from accounts where username = ? or email=?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateErrorMessage();
			}
			else
			{
				$result=$stmt->bind_param("ss", $username, $username);
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
						$result = $stmt->get_result();
						if ($result->num_rows > 0)
						{
							$row=$result->fetch_assoc();
							$maxAttempts=5;
							if($row['isActivated']==0)
							{
								echo "<h5 class='error mt-2 mb-2'>
												Please check your email and click the link provided to activate your account to log in
											</h5>";
								if($row['isActivated']==0)
								{
									echo 		"
															<input type='hidden' name='email' value='$row[email]'>
															<input type='hidden' name='fname' value='$row[fname]'>
															<input type='hidden' name='username' value='$row[username]'>
															<input type='hidden' name='code' value='$row[activateCode]'>
															<input type='submit' class='btn border border-dark rounded' name='resendCode' id='resendCode' value='resend code'>
													";
								}
							}
							else if($row['logInAttempts']>=$maxAttempts)
							{
								echo "<h5 class='error mt-2 mb-2'>
												You have made too many log in attempts, please reset your password
											</h5>";
							}
							else
							{
								if(password_verify($password,$row['password']))
								{
									$sql="Update accounts set logInAttempts=0 where username=? or email=?;";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param("ss",$username,$username);
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
												//cookie expires in 30 days
												$arr=array (
																'expires' => time() +2592000,
																'path' => '/',
																'domain' => DOMAIN_URL,
																'secure' => HTTP_SECURE_ATTRIB,
																'httponly' => HTTP_HTTP_ATTRIB,
																'samesite' => 'lax'
															);
												setcookie("loggedInUser", $row['username'], $arr);
												setTimeZone();
												load('blog.php');
											}
										}
									}
								}
								else
								{
									$logInAttempts=$row['logInAttempts'];
									$logInAttempts=$logInAttempts+1;
									$sql="update accounts set logInAttempts='$logInAttempts' where username=? or email=?";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param("ss", $username, $username);
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
												$logInAttemptsLeft=$maxAttempts-$logInAttempts;
												if($logInAttemptsLeft<=0)
												{
													echo "<h5 class='error mt-2 mb-2'>
																	You have made too many log in attempts.  Please reset your password.
																</h5";
												}
												else
												{
													if($logInAttemptsLeft==1)
													{
														echo "<h5 class='error mt-2 mb-2'>
																		Username/email and password combination not on file, you have $logInAttemptsLeft login attempt left
																	</h5";
													}
													else
													{
														echo "<h5 class='error mt-2 mb-2'>
																		Username/email and password combination not on file, you have $logInAttemptsLeft login attempts left
																	</h5";
													}
												}
											}
										}
									}
								}
							}
						}
						else
						{
							echo "<h5 class='error mt-2 mb-2'>
											Username/email not on file
										</h5>";
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function deleteAccount()
	{
		createTableAccounts();
		if(connect())
		{
			$user=$_POST['user'];
			$password=$_POST['password'];
			$sql="select * from accounts where username = ? or email= ?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateErrorMessage();
			}
			else
			{
				$result=$stmt->bind_param("ss", $user, $user);
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
						if ($result->num_rows > 0)
						{
							$row=$result->fetch_assoc();
							if($row['isActivated']!=0)
							{
								$username=$row['username'];
								$fname=$row['fname'];
								$email=$row['email'];
								if(password_verify($password,$row['password']))
								{

									//	$sql="delete from notifications where username = '$username'";
									$sql="delete from notifications where username = ?";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{

										$result=$stmt->bind_param("s", $username);
										if(!$result)
										{
											generateErrorMessageStmt($stmt);
										}
										else
										{
											$result=$stmt->execute();
											if (!$result)
											{
													generateErrorMessageStmt($stmt);
											}
											else
											{
												$sql="select postId from posts where username=?";
												$stmt=$GLOBALS['conn']->prepare($sql);
												if(!$stmt)
												{
													generateErrorMessage();
												}
												else
												{
													$result=$stmt->bind_param("s", $username);
													if(!$result)
													{
														generateErrorMessageStmt($stmt);
													}
													else
													{
														$result=$stmt->execute();
														if (!$result)
														{
															generateErrorMessageStmt($stmt);
														}
														else
														{
															$result=$stmt->get_result();
															while($row = $result->fetch_assoc())
															{
																$sql="Delete from notifications where responseId='$row[postId]';";
																$result2=$GLOBALS['conn']->query($sql);
																if(!$result2)
																{
																	generateErrorMessage();
																}
															}
															
															//$sql="delete from posts where username = '$username'";
															$sql="delete from posts where username = ?";
															$stmt=$GLOBALS['conn']->prepare($sql);
															if(!$stmt)
															{
																generateErrorMessage();
															}
															else
															{
																$result=$stmt->bind_param("s", $username);
																if(!$result)
																{
																	generateErrorMessageStmt($stmt);
																}
																else
																{
																	$result=$stmt->execute();
																	if (!$result)
																	{
																			generateErrorMessageStmt($stmt);
																	}
																	else
																	{

																		//$sql="Delete from accounts where username='$user' or email='$user'";
																		$sql="Delete from accounts where username=? or email=?";
																		$stmt=$GLOBALS['conn']->prepare($sql);
																		if(!$stmt)
																		{
																			generateErrorMessage();
																		}
																		else
																		{
																			$result=$stmt->bind_param("ss", $user, $user);
																			if(!$result)
																			{
																				generateErrorMessageStmt($stmt);
																			}
																			else
																			{
																				$result=$stmt->execute();
																				if (!$result)
																				{
																						generateErrorMessageStmt($stmt);
																				}
																				else
																				{
																					echo "
																					<h5 class='success mt-2 mb-2'>Account with username '".$username."' deleted</h5>";
																					$subject="Account with Animals and Nature Message Board deleted";
																					$body="<p>Dear $fname,</p><p>We are informing you that your account with Animals and Nature Message Board under username <strong>$username</strong> has been deleted.  You can create a new account with Animals and Nature Message Board at any time and we hope that you would consider rejoining us in the future.  Take care.</p>";
																					$altBody="Dear $fname, we are informing you that your account with Animals and Nature Message Board under username $username has been deleted.  You can create a new account with Animals and Nature Message Board at any time and we hope that you would consider rejoining us in the future.  Take care.";
																					if(sendEmail($fname, $email, $subject, $body, $altBody))
																					{
																						echo "<h5 class='mt-2 mb-2'>An email has been sent to your email account regarding the closing of your account</h5>";
																					}
																				}

																			}
																		}

																	}

																}
															}
														}
													}
												}
											}

										}
									}
								}
								else
								{
									echo "
												<h5 class='error mt-2 mb-2'>
													Username/email and password combination not on file
												</h5>";
								}
							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>
												Please check your email and click the link provided to activate your account to delete your account
											</h5>";
								echo 	"
													<input type='hidden' name='email' value='$row[email]'>
													<input type='hidden' name='fname' value='$row[fname]'>
													<input type='hidden' name='username' value='$row[username]'>
													<input type='hidden' name='code' value='$row[activateCode]'>
													<input type='submit' class='btn border border-dark rounded' name='resendCode' id='resendCode' value='resend code'>
											";
							}
						}
						else
						{
							echo "
									<h5 class='error mt-2 mb-2'>
										Username/email not on file
									</h5>";
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function updateAccount()
	{
		if(!empty($_POST['email']))
		{
			if(filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
			{
				if(doesEmailExist($_POST['email']))
				{
					echo "<h5 class='error mt-2 mb-2'>The email address submitted is already on file</h5>";
				}
				else
				{
					if(connect())
					{
						//$sql="Select email, fname from accounts where username='$_COOKIE[loggedInUser]'";
						$sql="Select email, fname from accounts where username=?";
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
									if($result->num_rows>0)
									{
										$row=$result->fetch_assoc();
										if($row['email']!=$_POST['email'])
										{
											$fname=$row['fname'];
											$username=$_COOKIE['loggedInUser'];
											$email=$_POST['email'];
											$code=rand();
											$subject="Update Email Request for Animals and Nature account";
											$body="<p>Dear $fname,</p><p>Please click the link to update your email.  <a href='".SITE_URL."/updateEmail.php?activateCode=".$code."&username=".$username."&email=".$email."'>Update email</a></p>";
											$altBody="Dear $fname, Please click the link to update your email ".SITE_URL."/updateEmail.php?activateCode='$code'&username='$username'&email='$email'";
											if(sendEmail($fname, $_POST['email'], $subject, $body, $altBody))
											{
												//$sql="Update accounts set email='$_POST[email]' where username='$_COOKIE[loggedInUser]';";
												$sql="Update accounts set activateCode=? where username=?;";
												$stmt=$GLOBALS['conn']->prepare($sql);
												if(!$stmt)
												{
													generateErrorMessage();
												}
												else
												{
													$result=$stmt->bind_param("ss",$code,$_COOKIE['loggedInUser']);
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
															echo "<h5 class='success mt-2 mb-2'>Please click on the link in the email account you provided to update your email address</h5>";
														}
													}
												}
											}
											else
											{
												echo "<h5 class='error mt-2 pt-2'>
															We tried to send an email to verify your updated email address but an error has occurred, please check the email you provided and try again
														</h5>";
											}
										}
										else
										{
											echo "<h5 class='error mt-2 mb-2'>The email address submitted is already on file</h5>";
										}
									}
									else
									{
										echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
									}
								}
								else
								{
									generateErrorMessageStmt($stmt);
								}
							}
							else
							{
								generateErrorMessageStmt($stmt);
							}
						}
						else
						{
							generateErrorMessage();
						}
						disconnect();
					}
					else
					{
						generateErrorMessage();
					}
				}
				
			}
			else
			{
				echo "<h5 class='error mt-2 mb-2'>You entered an invalid email address</h5>";
			}
		}

		if(!empty($_POST['newPassword']) || !empty($_POST['confirmNewPassword']) || !empty($_POST['currentPassword']))
		{
			if(connect())
			{
				if(!empty($_POST['currentPassword']))
				{
					if(empty($_POST['newPassword']) || empty($_POST['confirmNewPassword']))
					{
						echo "<h5 class='error mt-2 mb-2'>Please enter and confirm a new password to change the password</h5>";
					}
					else if(!isValidPassword($_POST['newPassword']))
					{
						echo "<h5 class='error mt-2 mb-2'>
										Passwords must be at least 8 characters
									</h5>";
					}
					else
					{
						if($_POST['confirmNewPassword']==$_POST['newPassword'])
						{
							//$sql="select password from accounts where username = '$_COOKIE[loggedInUser]'";
							$sql="select * from accounts where username = ?";
							$stmt=$GLOBALS['conn']->prepare($sql);
							if(!$stmt)
							{
								generateErrorMessage();
							}
							else
							{
								$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
								if($result)
								{
									$result=$stmt->execute();
									if($result)
									{
										$result=$stmt->get_result();
										if ($result->num_rows > 0)
										{
											$row=$result->fetch_assoc();
											$email=$row['email'];
											$fname=$row['fname'];
											if(password_verify($_POST['currentPassword'],$row['password']))
											{
												if($_POST['currentPassword']==$_POST['newPassword'])
												{
													echo "<h5 class='error mt-2 mb-2'>The password submitted is already on file</h5>";
												}
												else
												{
													$password=password_hash($_POST['newPassword'],PASSWORD_DEFAULT);
													//$sql="Update accounts set password='$password' where username='$_COOKIE[loggedInUser]';";$sql="Update accounts set password='$password' where username='$_COOKIE[loggedInUser]';";

													$sql="Update accounts set password=? where username=?;";
													$stmt=$GLOBALS['conn']->prepare($sql);
													if(!$stmt)
													{
														generateErrorMessage();
													}
													else
													{
														$result=$stmt->bind_param("ss",$password,$_COOKIE['loggedInUser']);
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
																echo "<h5 class='success mt-2 mb-2'>Password updated</h5>";
																			$username=$_COOKIE['loggedInUser'];
																			$subject="Account with Animals and Nature Message Board updated";
																			$body="<p>Dear $fname,</p><p>We are informing you that your password associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.</p>";
																			$altBody="Dear $fname, we are informing you that your password associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.";
																			sendEmail($fname, $email, $subject, $body, $altBody);
															}
														}
													}
												}
											}
											else
											{
												echo "<h5 class='error mt-2 mb-2'>You have not entered the password associated with your account</h5>";
											}
										}
										else
										{
											echo "<h5 class='error mt-2 mb-2'>The username provided is not on file</h5>";
										}
									}
									else
									{
										generateErrorMessageStmt($stmt);
									}
								}
								else
								{
									generateErrorMessageStmt($stmt);
								}
							}
						}
						else
						{
							echo "<h5 class='error mt-2 mb-2'>The passwords you entered do not match</h5>";
						}
					}
				}

				else if(!empty($_POST['confirmNewPassword']))
				{
					if(empty($_POST['newPassword']))
					{
						if(empty($_POST['newPassword']))
						{
							echo "<h5 class='error mt-2 mb-2'>Please enter and confirm a new password to change the password</h5>";
						}
					}
					else if(!isValidPassword($_POST['newPassword']))
					{
						echo "<h5 class='error mt-2 mb-2'>
										Passwords must be at least 8 characters
									</h5>";
					}
					else
					{
						if($_POST['confirmNewPassword']==$_POST['newPassword'])
						{
							if(empty($_POST['currentPassword']))
							{
								echo "<h5 class='error mt-2 mb-2'>Please provide current password</h5>";
							}
							else
							{
								//$sql="select password from accounts where username = '$_COOKIE[loggedInUser]'";
								$sql="select * from accounts where username = ?";
								$stmt=$GLOBALS['conn']->prepare($sql);
								if(!$stmt)
								{
									generateErrorMessage();
								}
								else
								{
									$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
									if($result)
									{
										$result=$stmt->execute();
										if($result)
										{
											$result=$stmt->get_result();
											if ($result->num_rows > 0)
											{
												$row=$result->fetch_assoc();
												$email=$row['email'];
												$fname=$row['fname'];
												if(password_verify($_POST['currentPassword'],$row['password']))
												{
													if($_POST['currentPassword']==$_POST['newPassword'])
													{
														echo "<h5 class='error mt-2 mb-2'>The password submitted is already on file</h5>";
													}
													else
													{
														$password=password_hash($_POST['newPassword'],PASSWORD_DEFAULT);
														//$sql="Update accounts set password='$password' where username='$_COOKIE[loggedInUser]';";
														$sql="Update accounts set password=? where username=?;";
														$stmt=$GLOBALS['conn']->prepare($sql);
														if(!$stmt)
														{
															generateErrorMessage();
														}
														else
														{
															$result=$stmt->bind_param("ss",$password,$_COOKIE['loggedInUser']);
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
																	echo "<h5 class='success mt-2 mb-2'>Password updated</h5>";
																				$username=$_COOKIE['loggedInUser'];
																				$subject="Account with Animals and Nature Message Board updated";
																				$body="<p>Dear $fname,</p><p>We are informing you that your password associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.</p>";
																				$altBody="Dear $fname, we are informing you that your password associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.";
																				sendEmail($fname, $email, $subject, $body, $altBody);
																}
															}
														}
													}
												}
												else
												{
													echo "<h5 class='error mt-2 mb-2'>You have not entered the password associated with your account</h5>";
												}
											}
											else
											{
												echo "<h5 class='error mt-2 mb-2'>The username provided is not on file</h5>";
											}
										}
										else
										{
											generateErrorMessageStmt($stmt);
										}
									}
									else
									{
										generateErrorMessageStmt($stmt);
									}
								}
							}
						}
						else
						{
							echo "<h5 class='error mt-2 mb-2'>The passwords you entered do not match</h5>";
						}
					}
				}

				else
				{
					if(empty($_POST['confirmNewPassword']))
					{
						if(empty($_POST['confirmNewPassword']))
						{
							echo "<h5 class='error mt-2 mb-2'>Please enter and confirm a new password to change the password</h5>";
						}
					}
					else if(!isValidPassword($_POST['newPassword']))
					{
						echo "<h5 class='error mt-2 mb-2'>
										Passwords must be at least 8 characters
									</h5>";
					}
					else
					{
						if($_POST['confirmNewPassword']==$_POST['newPassword'])
						{
							if(empty($_POST['currentPassword']))
							{
								echo "<h5 class='error mt-2 mb-2'>Please provide current password</h5>";
							}
							else
							{
								//$sql="select password from accounts where username = '$_COOKIE[loggedInUser]'";
								$sql="select * from accounts where username = ?";
								$stmt=$GLOBALS['conn']->prepare($sql);
								if(!$stmt)
								{
									generateErrorMessage();
								}
								else
								{
									$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
									if($result)
									{
										$result=$stmt->execute();
										if($result)
										{
											$result=$stmt->get_result();
											if ($result->num_rows > 0)
											{
												$row=$result->fetch_assoc();
												$email=$row['email'];
												$fname=$row['fname'];
												if(password_verify($_POST['currentPassword'],$row['password']))
												{
													if($_POST['currentPassword']==$_POST['newPassword'])
													{
														echo "<h5 class='error mt-2 mb-2'>The password submitted is already on file</h5>";
													}
													else
													{
														$password=password_hash($_POST['newPassword'],PASSWORD_DEFAULT);
														//$sql="Update accounts set password='$password' where username='$_COOKIE[loggedInUser]';";
														$sql="Update accounts set password=? where username=?;";
														$stmt=$GLOBALS['conn']->prepare($sql);
														if(!$stmt)
														{
															generateErrorMessage();
														}
														else
														{
															$result=$stmt->bind_param("ss",$password,$_COOKIE['loggedInUser']);
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
																	echo "<h5 class='success mt-2 mb-2'>Password updated</h5>";
																				$username=$_COOKIE['loggedInUser'];
																				$subject="Account with Animals and Nature Message Board updated";
																				$body="<p>Dear $fname,</p><p>We are informing you that your password associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.</p>";
																				$altBody="Dear $fname, we are informing you that your password associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.";
																				sendEmail($fname, $email, $subject, $body, $altBody);
																}
															}
														}
													}
												}
												else
												{
													echo "<h5 class='error mt-2 mb-2'>You have not entered the password associated with your account</h5>";
												}
											}
											else
											{
												echo "<h5 class='error mt-2 mb-2'>The username provided is not on file</h5>";
											}
										}
										else
										{
											generateErrorMessageStmt($stmt);
										}
									}
									else
									{
										generateErrorMessageStmt($stmt);
									}
								}
							}
						}
						else
						{
							echo "<h5 class='error mt-2 mb-2'>The passwords you entered do not match</h5>";
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
		}

		if(!empty($_FILES['pic']['tmp_name']))
		{
			if(connect())
			{
				$pic = file_get_contents($_FILES['pic']['tmp_name']);
				$sql="select * from accounts where username=?;";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if(!$stmt)
				{
					generateErrorMessage();
				}
				else
				{
					$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
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
								$row=$result->fetch_assoc();
								$email=$row['email'];
								$fname=$row['fname'];
								if($row['pic']==$pic)
								{
									echo "<h5 class='error mt-2 mb-2'>The profile picture submitted is already on file</h5>";
								}
								else
								{
									$sql="Update accounts set pic=? where username=?;";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$null=NULL;
										$result=$stmt->bind_param("bs",$null,$_COOKIE['loggedInUser']);
										if(!$result)
										{
											generateErrorMessageStmt($stmt);
										}
										else
										{
											$result=$stmt->send_long_data(0, $pic);
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
													echo "<h5 class='success mt-2 mb-2'>Profile picture updated</h5>";
																$username=$_COOKIE['loggedInUser'];
																$subject="Account with Animals and Nature Message Board updated";
																$body="<p>Dear $fname,</p><p>We are informing you that your profile picture associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.</p>";
																$altBody="Dear $fname, we are informing you that your profile picture associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.";
																sendEmail($fname, $email, $subject, $body, $altBody);
												}
											}
										}
									}
								}
							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
							}
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
		}

		if(!empty($_POST['fname']))
		{
			if(connect())
			{
				//$sql="Update accounts set fname='$_POST[fname]' where username='$_COOKIE[loggedInUser]';";
				$sql="select * from accounts where username=?";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if(!$stmt)
				{
					generateErrorMessage();
				}
				else
				{
					$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
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
								$row=$result->fetch_assoc();
								$email=$row['email'];
								$fname=$row['fname'];
								if($row['fname']==$_POST['fname'])
								{
									echo "<h5 class='error mt-2 mb-2'>First name submitted is already on file</h5>";
								}
								else
								{
									$sql="Update accounts set fname=? where username=?;";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param("ss",$_POST['fname'],$_COOKIE['loggedInUser']);
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
												echo "<h5 class='success mt-2 mb-2'>First name updated</h5>";
															$username=$_COOKIE['loggedInUser'];
															$subject="Account with Animals and Nature Message Board updated";
															$body="<p>Dear $fname,</p><p>We are informing you that your first name associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.</p>";
															$altBody="Dear $fname, we are informing you that your first name associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.";
															sendEmail($fname, $email, $subject, $body, $altBody);
											}
										}
									}
								}
							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
							}
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
		}

		if(!empty($_POST['lname']))
		{
			if(connect())
			{
				//$sql="Update accounts set lname='$_POST[lname]' where username='$_COOKIE[loggedInUser]';";
				$sql="select * from accounts where username=?";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if(!$stmt)
				{
					generateErrorMessage();
				}
				else
				{
					$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
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
								$row=$result->fetch_assoc();
								$email=$row['email'];
								$fname=$row['fname'];
								if($row['lname']==$_POST['lname'])
								{
									echo "<h5 class='error mt-2 mb-2'>Last name submitted is already on file</h5>";
								}
								else
								{
									$sql="Update accounts set lname=? where username=?;";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param("ss",$_POST['lname'],$_COOKIE['loggedInUser']);
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
												echo "<h5 class='success mt-2 mb-2'>Last name updated</h5>";
															$username=$_COOKIE['loggedInUser'];
															$subject="Account with Animals and Nature Message Board updated";
															$body="<p>Dear $fname,</p><p>We are informing you that your last name associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.</p>";
															$altBody="Dear $fname, we are informing you that your last name associated with your account with Animals and Nature Message Board under username <strong>$username</strong> has been updated.  If you did not make these changes please reset your password immediately.";
															sendEmail($fname, $email, $subject, $body, $altBody);
											}
										}
									}
								}
							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
							}
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
		}
	}

	function activateAccount()
	{
		createTableAccounts();
		if(connect())
		{
			$sql="select isActivated, activateCode from accounts where username=?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateErrorMessage();
			}
			else
			{
				$result=$stmt->bind_param("s",$_POST['username']);
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
							$row=$result->fetch_assoc();
							$code=$row['activateCode'];
							$isActivated=$row['isActivated'];
							if($isActivated!=0)
							{
								echo 	"	<h5 class='error mt-2 mb-2'>
												Account is already activated
											</h5>";
							}
							else if($isActivated==0)
							{
								if($code==$_POST['code'])
								{
									$sql="update accounts set isActivated=1, activateCode='' where username=?";
									$stmt = $GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param('s', $_POST['username']);
										if(!$result)
										{
											generateErrorMessageStmt($stmt);
										}
										else
										{
											$result=$stmt->execute();
											if($result)
											{
												echo "<h5 class='success mt-2 mb-2'>
														Account activated</h5>";
											}
											else
											{
												generateErrorMessageStmt($stmt);
											}
										}
									}
								}
								else
								{
									echo 	"	<h5 class='error mt-2 mb-2'>
													You have not entered the activation code that was sent to your email
												</h5>";
								}
							}
						}
						else
						{
							echo "<h5 class='error mt-2 mb-2'>Username is not on file</h5>";
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function createUser()
	{
		$username=$_POST['username'];
		$email=$_POST['email'];
		$password=$_POST['password'];
		$confirmPassword=$_POST['confirmPassword'];
		$pic=null;
		if(!empty($_FILES['pic']['tmp_name']))
		{
			$pic = file_get_contents($_FILES['pic']['tmp_name']);
		}
		$fname=$_POST['fname'];
		$lname=$_POST['lname'];
		$agreement=$_POST['agreement'];
		$createAccount=$_POST['createAccount'];
		if(!isValidPassword($password) || $password!==$confirmPassword || !filter_var($email, FILTER_VALIDATE_EMAIL) || !isValidUsername($username))
		{
			if(!isValidPassword($password))
			{
				echo "<h5 class='error mt-2 mb-2'>
								Passwords must be at least 8 characters
							</h5>";
			}
			if($password!==$confirmPassword)
			{
				echo "	<h5 class='error mt-2 mb-2'>
									The passwords you entered do not match
								</h5>";
			}
			if (!filter_var($email, FILTER_VALIDATE_EMAIL))
			{
			 echo "	<h5 class='error mt-2 mb-2'>
								You entered an invalid email address
							</h5>";
			}
			if(!isValidUsername($username))
			{
				echo "<h5 class='error mt-2 mb-2'>
								Usernames  must have at least one alphanumeric character and can only include the ., -, or _ characters
							</h5>";
			}
		}
		else
		{
			createTableAccounts();
			if(connect())
			{
				$sql="select username, email from accounts";
				$result=$GLOBALS['conn']->query($sql);
				if(!$result)
				{
					generateErrorMessage();
				}
				else
				{
					$keepGoing=true;
					//see if username and email provided is already taken
					while($row = $result->fetch_assoc())
					{
						if($row['username']==$username || $row['email']==$email)
						{
							if($row['username']==$username)
							{
								echo "<h5 class='error mt-2 mb-2'>The username \"$username\" is already on file</h5>";
							}
							if($row['email']==$email)
							{
								echo "<h5 class='error mt-2 mb-2'>The email address \"$email\" is already on file</h5>";
								//check if account is actived and include option to resend code
							}
							$keepGoing=false;
							break;
						}
					}
					if($keepGoing)
					{
						$code=rand();
						$password=password_hash($password,PASSWORD_DEFAULT);
						$sql="insert into accounts(username,email,password,pic,fname,lname,activateCode) VALUES (?,?,?,?,?,?,?)";
						$stmt = $GLOBALS['conn']->prepare($sql);
						if(!$stmt)
						{
							generateErrorMessage();
						}
						else
						{
							$null=NULL;
							$result=$stmt->bind_param('sssbsss',$username,$email,$password,$null,$fname,$lname,$code);
							if(!$result)
							{
								generateErrorMessageStmt($stmt);
							}
							else
							{
								$result=$stmt->send_long_data(3, $pic);
								if(!$result)
								{
									generateErrorMessageStmt($stmt);
								}
								else
								{
									$result=$stmt->execute();
									if($result)
									{
										$subject="Please Activate your Account";
										$body="<p>Welcome to Animals and Nature Message Board ".$fname.".  Please click the link provided to activate your account and enter the code provided in addition to your username <strong>".$username."</strong>. Code:<strong>".$code."</strong>.</p><p><a href='".SITE_URL."/activateAccount.php?activate=activate'>activate</a></p>";
										$altBody="Welcome to Animals and Nature Message Board ".$fname.".  Please click the link provided to activate your account and enter the code provided in addition to your username ".$username." ".SITE_URL."/activateAccount.php?activate=activate";
										if(sendEmail($fname, $email,$subject, $body, $altBody))
										{
											echo "<h5 class='success mt-2 mb-2'>Please check your email and click the link provided to activate your account</h5>";
										}
										else
										{
											echo "	<h5 class='error mt-2 mb-2'>
																We tried to send an email to verify your account but an error has occurred, please check the email address you provided and try again
															</h5>";
										}
									}
									else
									{
										generateErrorMessageStmt($stmt);
									}
									// else if($stmt->errno===1062)
									// {
									// 	$error_message=$stmt->error;
									// 	$error_message=explode("'",$error_message);
									// 	$key=$error_message[3];
									// 	$value=$error_message[1];
									// 	echo "<h5 class='error mt-2 mb-2'>".ucwords($key)." '".$value."' is already on file</h5>";
									// }
								}
							}
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
		}
	}

	function resetPassword()
	{
		$email=$_POST['email'];
		if(filter_var($email,FILTER_VALIDATE_EMAIL))
		{
			createTableAccounts();
			if(connect())
			{
				//$sql="select username, fname from accounts where email = '$_POST[email]'";
				$sql="select * from accounts where email = ?";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if(!$stmt)
				{
					generateErrorMessage();
				}
				else
				{
					$result=$stmt->bind_param("s",$email);
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
							if ($result->num_rows > 0)
							{
								$row=$result->fetch_assoc();
								if($row['isActivated']!=0)
								{
									$username=$row['username'];
									$fname=$row['fname'];
									$temporaryPassword=rand();
									$password=password_hash($temporaryPassword,PASSWORD_DEFAULT);
									//$sql="Update accounts set password='$password' where email='$_POST[email]';";
									$sql="Update accounts set temporaryPassword='$password' where email=?;";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param("s",$email);
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
												$subject="Password Change Request";
												$body = "<p>Hello $fname,</p><p>You requested a password change.  The temporary password is <strong>$temporaryPassword</strong>.  Please click on the link provided and enter the temporary password to reset your password.</p><p><a href='".SITE_URL."/changePassword.php?username=$username'>change password</a>";

												$altBody = "Hello $fname, you requested a password change.  The temporary password is $temporaryPassword.  Please click on the link provided and enter the temporary password to reset your password.  ".SITE_URL."/changePassword.php?username=$username";

												if(sendEmail($fname,$email,$subject,$body,$altBody))
												{
													echo "<h5 class='success mt-2 mb-2'>
															Please check your email
														</h5>";
												}
												else
												{
													echo "<h5 class='error mt-2 mb-2'>
															We tried to send an email to your account in order for you to change your password but an error occurred
														</h5>";
												}
											}
										}
									}
								}
								else
								{
									echo "<h5 class='error mt-2 mb-2'>
													Please check your email and click the link provided to activate your account to reset your password
												</h5>";
									echo 	"
														<input type='hidden' name='email' value='$row[email]'>
														<input type='hidden' name='fname' value='$row[fname]'>
														<input type='hidden' name='username' value='$row[username]'>
														<input type='hidden' name='code' value='$row[activateCode]'>
														<input type='submit' class='btn border border-dark rounded' name='resendCode' id='resendCode' value='resend code'>
												";
								}
							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>
												The email address you entered is not on file
											</h5>";
							}
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
		}
		else
		{
			echo "	<h5 class='error mt-2 mb-2'>
								You entered an invalid email address
							</h5>";
		}
	}

	function changePassword()
	{
			createTableAccounts();
			if(connect())
			{
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
							if ($result->num_rows > 0)
							{
								if($_POST['password']==$_POST['confirmPassword'])
								{
									$row=$result->fetch_assoc();
									if(isValidPassword($_POST['password']))
									{
										if(password_verify($_POST['temporaryPassword'],$row['temporaryPassword']))
										{
											$password=password_hash($_POST['password'],PASSWORD_DEFAULT);
											//$sql="Update accounts set password='$password' where username='$_GET[username]';";
											$sql="Update accounts set password=?, temporaryPassword='', logInAttempts=0  where username=?;";
											$stmt=$GLOBALS['conn']->prepare($sql);
											if(!$stmt)
											{
												generateErrorMessage();
											}
											else
											{
												$result=$stmt->bind_param("ss",$password,$_GET['username']);
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
														echo "<h5 class='success mt-2 mb-2'>Password updated</h5>";
													}
												}
											}
										}
										else
										{
											echo "<h5 class='error mt-2 mb-2'>You did not enter the temporary password that was sent to your email.  If you have already reset your password using the temporary code sent to your email, you will have to make another request to reset your password.</h5>";

										}
									}
									else
									{
										echo "<h5 class='error mt-2 mb-2'>Passwords must be at least 8 characters</h5>";
									}
								}
								else
								{
									echo "<h5 class='error mt-2 mb-2'>The passwords you entered do not match</h5>";
								}

							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>User is not on file</h5>";
							}
						}
					}
				}
				disconnect();
			}
			else
			{
				generateErrorMessage();
			}
	}

	function isValidUsername($text)
	{
		$pattern='/^\w+[\.\-\w]*$/';
		if(preg_match($pattern , $text)===1)
		{
			return true;
		}
		return false;
	}

	function isValidPassword($text)
	{
		if(strlen($text)>=8)
		{
			return true;
		}
		return false;
	}

	function sendReport()
	{
		$subject=$_POST['subject'];
		if(connect())
		{
			$sql="Select email from accounts where username=?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateErrorMessage();
			}
			else
			{
				$result=$stmt->bind_param("s",$_POST['loggedInUser']);
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
							$row=$result->fetch_assoc();
							$fname="Animals and Nature Message Board";
							$email=$_SERVER['webmaster_email'];
							$body="<p>".$_POST['message']."</p><p>Sincerely,</p><p><strong>User</strong>: ".$_POST['loggedInUser']."</p><p><strong>Email</strong>: ".$row['email']."</p>";
							$altBody=$_POST['message']."Sincerely, User ".$_POST['loggedInUser']." Email:".$row['email'];
							if(sendEmail($fname,$email,$subject,$body,$altBody))
							{
								echo "	<h5 class='success mt-2 mb-2'>
													Message sent
												</h5>";
							}
							else
							{
								echo "	<h5 class='error mt-2 mb-2'>
													An error has occurred
												</h5>";
							}
						}
						else
						{
							echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function generateErrorMessage()
	{
		echo "<script type='text/javascript'>
						if($(document).find('.error').length<=0)
						{
							$(document).find('form').first().prepend(\"<h5 class='error mt-2 mb-2'>An error has occurred</h5>\");
						}
						else
						{
							console.log('an error has occurred');
						}
					</script>
		";
		//echo "<script type='text/javascript'>console.log('An error has occurred: ".$GLOBALS['conn']->error."');</script>";
	}

	function generateErrorMessageStmt($stmt)
	{
		echo "<script type='text/javascript'>
						if($(document).find('.error').length<=0)
						{
							$(document).find('form').first().prepend(\"<h5 class='error mt-2 mb-2'>An error has occurred</h5>\");
						}
						else
						{
							console.log('an error has occurred');
						}
					</script>
		";
		//echo "<script type='text/javascript'>console.log('An error has occurred: ".$stmt->error."');</script>";
	}

	function load($url)
	{
		echo "<script>window.open('$url','_parent');</script>";
	}

	function generateError()
	{
		http_response_code(500);
		echo "An error has occurred";
		//echo "<script type='text/javascript'>console.log('An error has occurred: ".$GLOBALS['conn']->error."');</script>";
	}

	function generateErrorStmt($stmt)
	{
		http_response_code(500);
		echo "An error has occurred";
		//echo "<script type='text/javascript'>console.log('An error has occurred: ".$stmt->error."');</script>";
	}

	function savePost()
	{
		if(connect())
		{
			$date=date("YYYY-MM-DD HH-MM-SS");
			$loggedUser=$_COOKIE['loggedInUser'];
			$mediaType="";
			if(!empty($_POST['newPost']))
			{
				$newPost=$_POST['newPost'];
			}
			else
			{
				$newPost="";
			}
			$media=null;
			if(!empty($_FILES['media']['tmp_name']))
			{
				$fileName=$_FILES['media']['name'];
				$fileExtension=explode(".", $fileName);
				$fileExtension=$fileExtension[1];
				$mediaType=$fileExtension;
				$media = file_get_contents($_FILES['media']['tmp_name']);
			}
			//$sql="select id from accounts where username='$loggedUser'";
			$sql="select id from accounts where username=?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateError();
			}
			else
			{
				$result=$stmt->bind_param("s",$loggedUser);
				if(!$result)
				{
					generateErrorStmt($stmt);
				}
				else
				{
					$result=$stmt->execute();
					if(!$result)
					{
						generateErrorStmt($stmt);
					}
					else
					{
						$result=$stmt->get_result();
						$row = $result->fetch_array(MYSQLI_ASSOC);
						if(!empty($row))
						{
							$userId=$row['id'];
							//$sql = "INSERT INTO posts (username,post,media,mediaType,date) VALUES ('$loggedUser','$newPost','$media',now());";
							$sql="INSERT INTO posts (username,post,media,mediaType,date, userId) VALUES (?,?,?,?,now(),'$userId');";
							$stmt=$GLOBALS['conn']->prepare($sql);
							if(!$stmt)
							{
								generateError();
							}
							else
							{
								//	load('blog.php');//reload with saved info displayed
								$null=NULL;
								$result=$stmt->bind_param("ssbs",$loggedUser,$newPost,$null,$mediaType);
								if(!$result)
								{
									generateErrorStmt($stmt);
								}
								else
								{
									$result=$stmt->send_long_data(2, $media);
									if(!$result)
									{
										generateErrorStmt($stmt);
									}
									else
									{
										$result=$stmt->execute();
										if(!$result)
										{
											generateErrorStmt($stmt);
										}
										else
										{
											$last_post_id=$stmt->insert_id;
											$result=$GLOBALS['conn']->query("select * from posts where postId='$last_post_id' order by date desc");
											if($result)
											{
												$row = $result->fetch_array(MYSQLI_ASSOC);
												if(!empty($row))
												{
													$sql="select pic from accounts where username='$row[username]'";
													$result2=$GLOBALS['conn']->query($sql);
													if(!$result2)
													{
														generateError();
													}
													else
													{
														if($result2->num_rows>0)
														{
															$row2=$result2->fetch_assoc();
															if($row2['pic']!=null)
															{
																$postId=$row['postId'];
																$username=$row['username'];
																$post=$row['post'];
																$date=$row['date'];
																$media=base64_encode($row['media']);
																$mediaType=$row['mediaType'];
																$profilePic=base64_encode($row2['pic']);
																$arr = array('postId' => $postId, 'post' => $post, 'username' => $username, 'media' => $media, 'mediaType' => $mediaType,'profilePic' => $profilePic, 'dateTime' => $date);
																echo json_encode($arr);
															}
															else
															{
																$postId=$row['postId'];
																$username=$row['username'];
																$post=$row['post'];
																$date=$row['date'];
																$media=base64_encode($row['media']);
																$mediaType=$row['mediaType'];
																$arr = array('postId' => $postId,'post' => $post, 'username' => $username, 'media' => $media, 'mediaType' => $mediaType, 'profilePic' => "", 'dateTime' => $date);
																echo json_encode($arr);
															}
														}
														else
														{
															echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
														}
													}
												}
												else
												{
													echo  "An error has occurred";
												}
											}
											else
											{
												generateError();
											}
										}
									}
								}
							}
						}
						else
						{
							echo "User does not exist";
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateError();
		}
	}

	function saveResponse()
	{
		if(connect())
		{
			$date=date("YYYY-MM-DD HH-MM-SS");
			$loggedUser=$_COOKIE['loggedInUser'];
			$initPostId=$_POST['initPostId'];
			$newResponse=$_POST['newResponse'];
			$newResponse="@".$_POST['initUser']." ".$newResponse;
			$media=null;
			$mediaType="";
			if(!empty($_FILES['media']['tmp_name']))
			{
				$fileName=$_FILES['media']['name'];
				$fileExtension=explode(".", $fileName);
				$fileExtension=$fileExtension[1];
				$mediaType=$fileExtension;
				$media = file_get_contents($_FILES['media']['tmp_name']);
			}
			//$sql="select id from accounts where username='$loggedUser'";
			$sql="select id from accounts where username=?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateError();
			}
			else
			{
				$result=$stmt->bind_param("s",$loggedUser);
				if(!$result)
				{
					generateErrorStmt($stmt);
				}
				else
				{
					$result=$stmt->execute();
					if(!$result)
					{
						generateErrorStmt($stmt);
					}
					else
					{
						$result=$stmt->get_result();
						$row = $result->fetch_array(MYSQLI_ASSOC);
						if(!empty($row))
						{
							$userId=$row['id'];
							//$sql="INSERT INTO  posts (username,post,image,initPostId, date) VALUES ('$loggedUser','$newResponse', '$image', '$initPostId', now());";
							$sql="INSERT INTO  posts (username,post,media,mediaType,initPostId, date, userId) VALUES (?,?, ?, ?, ?,now(),'$userId');";
							$stmt=$GLOBALS['conn']->prepare($sql);
							if(!$stmt)
							{
								generateError();
							}
							else
							{
								//	load('blog.php');//reload with saved info displayed
								$null=NULL;
								$result=$stmt->bind_param("ssbsi",$loggedUser,$newResponse,$null,$mediaType,$initPostId);
								if(!$result)
								{
									generateErrorStmt($stmt);
								}
								else
								{
									$result=$stmt->send_long_data(2, $media);
									if(!$result)
									{
										generateErrorStmt($stmt);
									}
									else
									{
										$result=$stmt->execute();
										if(!$result)
										{
											generateErrorStmt($stmt);
										}
										else
										{
											$last_response_id=$stmt->insert_id;
											$notification=$loggedUser." replied: ".$newResponse;
											// add a notification for every other user in the conversation pertaining to the post
											//$sql="select distinct username from posts where (initPostId='$initPostId' or postId='$initPostId') and username!='$loggedUser' and postId!='$last_response_id';";
											$sql="select distinct username from posts where (initPostId=? or postId=?) and username!=? and postId!='$last_response_id';";
											$stmt=$GLOBALS['conn']->prepare($sql);
											if(!$stmt)
											{
												generateError();
											}
											else
											{
												$result=$stmt->bind_param("iis",$initPostId,$initPostId,$loggedUser);
												if(!$result)
												{
													generateErrorStmt($stmt);
												}
												else
												{
													$result=$stmt->execute();
													if(!$result)
													{
														generateErrorStmt($stmt);
													}
													else
													{
														$result=$stmt->get_result();
														while($row = $result->fetch_assoc())
														{
															//$sql="INSERT INTO notifications (username,notification, responseId, date) VALUES ('$row[username]','$notification', '$last_response_id', now());";
															$sql="INSERT INTO notifications (username,notification, responseId, date) VALUES ('$row[username]',?, '$last_response_id', now());";
															$stmt2=$GLOBALS['conn']->prepare($sql);
															if(!$stmt2)
															{
																generateError();
															}
															else
															{
																$result2=$stmt2->bind_param("s",$notification);
																if(!$result2)
																{
																	//http_response_code(500);
																	echo  $stmt2->error;
																}
																else
																{
																	$result2=$stmt2->execute();
																	if(!$result2)
																	{
																		//http_response_code(500);
																		echo  $stmt2->error;
																	}
																}
															}
														}

														//update notifications in the UI
														$result=$GLOBALS['conn']->query("select * from posts where postId='$last_response_id' order by date desc");
														if($result)
														{
															$row = $result->fetch_array(MYSQLI_ASSOC);
															if(!empty($row))
															{

																$sql="select pic from accounts where username='$row[username]'";
																$result2=$GLOBALS['conn']->query($sql);
																if(!$result2)
																{
																	generateError();
																}
																else
																{
																	if($result2->num_rows>0)
																	{
																		$row2=$result2->fetch_assoc();
																		if($row2['pic']!=null)
																		{
																			$responseId=$row['postId'];
																			$username=$row['username'];
																			$response=$row['post'];
																			$media=base64_encode($row['media']);
																			$mediaType=$row['mediaType'];
																			$initPostId=$row['initPostId'];
																			$profilePic=base64_encode($row2['pic']);
																			$date=$row['date'];
																			$arr = array('responseId' => $responseId, 'response' => $response, 'media' => $media, 'mediaType' => $mediaType,'initPostId' => $initPostId, 'username' => $username, 'profilePic' => $profilePic, 'dateTime' => $date);
																			echo json_encode($arr);
																		}
																		else
																		{
																			$responseId=$row['postId'];
																			$username=$row['username'];
																			$response=$row['post'];
																			$media=base64_encode($row['media']);
																			$mediaType=$row['mediaType'];
																			$initPostId=$row['initPostId'];
																			$date=$row['date'];
																			$arr = array('responseId' => $responseId, 'response' => $response, 'media' => $media, 'mediaType' => $mediaType,'initPostId' => $initPostId, 'username' => $username, 'profilePic' => "", 'dateTime' => $date);
																			echo json_encode($arr);
																		}
																	}
																	else
																	{
																		echo "<h5 class='error mt-2 mb-2'>An error has occurred</h5>";
																	}
																}

															}
															else
															{
																//http_response_code(500);
																echo "An error has occurred";
															}
														}
														else
														{
															generateError();
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateError();
		}
	}

	function deletePost()
	{
		if(connect())
		{
			//$sql="Select postId from posts where postId='$_POST[postId]' or initPostId='$_POST[postId]';";
			$sql="Select postId from posts where postId=? or initPostId=?;";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateError();
			}
			else
			{
				$result=$stmt->bind_param("ii",$_POST['postId'],$_POST['postId']);
				if(!$result)
				{
					generateErrorStmt($stmt);
				}
				else
				{
					$result=$stmt->execute();
					if(!$result)
					{
						generateErrorStmt($stmt);
					}
					else
					{
						$result=$stmt->get_result();
						while($row = $result->fetch_assoc())
						{
							$sql="Delete from notifications where responseId='$row[postId]';";
							$result2=$GLOBALS['conn']->query($sql);
							if(!$result2)
							{
								generateError();
							}
						}
						//$sql="Delete from posts where postId='$_POST[postId]' or initPostId='$_POST[postId]';";
						$sql="Delete from posts where postId=? or initPostId=?;";
						$stmt=$GLOBALS['conn']->prepare($sql);
						if(!$stmt)
						{
							generateError();
						}
						else
						{
							$result=$stmt->bind_param("ii",$_POST['postId'],$_POST['postId']);
							if(!$result)
							{
								generateErrorStmt($stmt);
							}
							else
							{
								$result=$stmt->execute();
								if(!$result)
								{
									generateErrorStmt($stmt);
								}
								else
								{
									$arr = array('message' => 'post deleted');
									echo json_encode($arr);
								}
							}
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateError();
		}
	}

	function editPost()
	{
		if(connect())
		{
			if(!empty($_FILES['media']['tmp_name']))
			{
				$fileName=$_FILES['media']['name'];
				$fileExtension=explode(".", $fileName);
				$fileExtension=$fileExtension[1];
				$mediaType=$fileExtension;
				$media=file_get_contents($_FILES['media']['tmp_name']);
				//$sql="Update posts set post='$_POST[post]', image='$image' where postId='$_POST[postId]';";
				$sql="Update posts set post=?, media=?, mediaType=? where postId=?;";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if(!$stmt)
				{
					generateError();
				}
				else
				{
					$null=NULL;
					$result=$stmt->bind_param("sbsi",$_POST['newEdit'],$null,$mediaType,$_POST['postId']);
					if(!$result)
					{
						generateErrorStmt($stmt);
					}
					else
					{
						$result=$stmt->send_long_data(1, $media);
						if(!$result)
						{
							generateErrorStmt($stmt);
						}
						else
						{
							$result=$stmt->execute();
							if(!$result)
							{
								generateErrorStmt($stmt);
							}
							else
							{
								//$sql="select post,image from posts where postId=".$_POST['postId'];
								$sql="select post,media,mediaType from posts where postId=?";
								$stmt=$GLOBALS['conn']->prepare($sql);
								if(!$stmt)
								{
									generateError();
								}
								else
								{
									$result=$stmt->bind_param("i",$_POST['postId']);
									if(!$result)
									{
										generateErrorStmt($stmt);
									}
									else
									{
										$result=$stmt->execute();
										if(!$result)
										{
											generateErrorStmt($stmt);
										}
										else
										{
											$result=$stmt->get_result();
											$row = $result->fetch_array(MYSQLI_ASSOC);
											if(!empty($row))
											{
												$arr = array('message' => 'post edited', 'post' => $row['post'], 'media' => base64_encode($row['media']), 'mediaType' => $row['mediaType']);
												echo json_encode($arr);
											}
											else
											{
												//http_response_code(500);
												echo  "An error has occurred";
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else
			{
				//$sql="Update posts set post='$_POST[post]' where postId='$_POST[postId]';";
				$sql="Update posts set post=? where postId=?;";
				$stmt=$GLOBALS['conn']->prepare($sql);
				if(!$stmt)
				{
					generateError();
				}
				else
				{
					$result=$stmt->bind_param("si",$_POST['newEdit'],$_POST['postId']);
					if(!$result)
					{
						generateErrorStmt($stmt);
					}
					else
					{
						$result=$stmt->execute();
						if(!$result)
						{
							generateErrorStmt($stmt);
						}
						else
						{
							//$sql="select post,image from posts where postId=".$_POST['postId'];
							$sql="select post,media,mediaType from posts where postId=?";
							$stmt=$GLOBALS['conn']->prepare($sql);
							if(!$stmt)
							{
								generateError();
							}
							else
							{
								$result=$stmt->bind_param("i",$_POST['postId']);
								if(!$result)
								{
									generateErrorStmt($stmt);
								}
								else
								{
									$result=$stmt->execute();
									if(!$result)
									{
										generateErrorStmt($stmt);
									}
									else
									{
										$result=$stmt->get_result();
										$row = $result->fetch_array(MYSQLI_ASSOC);
										if(!empty($row))
										{
											$arr = array('message' => 'post edited', 'post' => $row['post'], 'media' => base64_encode($row['media']), 'mediaType' => $row['mediaType']);
											echo json_encode($arr);
										}
										else
										{
											//http_response_code(500);
											echo  "An error has occurred";
										}
									}
								}
							}
						}
					}
				}
			}
			disconnect();
		}
		else
		{
			generateError();
		}
	}

	function signOut()
	{
		$arr=array (
						'expires' => time() -3600,
						'path' => '/',
						'domain' => DOMAIN_URL,
						'secure' => HTTP_SECURE_ATTRIB,
						'httponly' => HTTP_HTTP_ATTRIB,
						'samesite' => 'lax'
					);
		setcookie('loggedInUser','',$arr);
		setcookie('timeZoneDiff','',time() -3600,'/');
		load('signin.php');//redirect to sign in page
	}

	function printPosts()
	{
		createTablePosts();
		if(connect())
		{
			$numOfPosts=0;
			$sql="select * from posts;";
			$result=$GLOBALS['conn']->query($sql);
			if($result)
			{
				$numOfPosts=$result->num_rows;
			}
			//get posts
			$sql="select * from posts where initPostId=0 order by date desc;";
			$posts=$GLOBALS['conn']->query($sql);
			if ($posts)
			{
				if($numOfPosts==1)
				{
					echo "	<div class='row m-2' id='num_posts'>
										<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>".$numOfPosts."</span> post</h4>
									</div>";
				}
				else
				{
					echo "	<div class='row m-2' id='num_posts'>
										<h4 class='col-sm-3 m-2 p-2'><span id='num_posts_value'>".$numOfPosts."</span> posts</h4>
									</div>";
				}
				// output data of each row
				while($row = $posts->fetch_assoc())
				{
					if(!empty($row['post']) || !empty($row['media']))
					{
						$date=new DateTime($row['date']);
						//	echo $date->format('M d, Y h:i:s A');
						$timeStamp=$date->getTimestamp();
						$timeStamp=$timeStamp-$_COOKIE['timeZoneDiff']*60;
						$date=$date->setTimestamp($timeStamp);
						//		echo $date->format('M d, Y h:i:s A');
						echo  "
						<div id='".$row['postId']."' class='row post p-4'><div class='post-style border border-secondary rounded col-md-6 mx-auto mt-4 mb-4 p-2'><h5 class='w-75 m-2 header-post'>";

						$sql="select pic from accounts where username='$row[username]'";
						$result2=$GLOBALS['conn']->query($sql);
						if(!$result2)
						{
							generateErrorMessage();
						}
						else
						{
							if($result2->num_rows>0)
							{
								$row2=$result2->fetch_assoc();
								if($row2['pic']!=null)
								{
									$pic=base64_encode($row2['pic']);
									echo "<img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='data:image/jpeg;base64,".$pic."'>";
								}
								else
								{
									echo "<img width='50' height='50' alt='profile picture' class='border border-secondary rounded m-2 img-fluid' src='./images/person.jpg'>";
								}
							}
							else
							{
								echo "An error has occurred";
							}
						}

						echo $row['username']." @ ".$date->format('M d, Y h:i:s A')." UTC</h5>";
						if($row['media']!=null)
						{
							if($row['mediaType']=="mp4")
							{
								echo "<video class='w-75 border border-secondary rounded mediaPost embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/".$row['mediaType'].";base64,".base64_encode( $row['media'] )."' type='video/".$row['mediaType']."'>Sorry, your browser doesn't support embedded videos</video>";
							}
							else
							{
								echo "<img class='w-75 border border-secondary rounded mediaPost img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/".$row['mediaType'].";base64,".base64_encode( $row['media'] )."'>";
							}
						}
						if($row['post']!="")
						{
							echo"<p class='w-75 mt-2 mb-2 p-2 border border-secondary rounded post-content-post mx-auto'>".$row['post']."</p>
							";
						}

						$user=$row['username'];
						$postId=$row['postId'];
						$isNew=$row['isNew'];
						echo "<form method='post' name='responseForm' class='replyFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'>
								<input type='hidden' name='initPostId' class='initPostId' value='$postId'>
								<input type='hidden' name='initUser' class='initUser' value='$user'>
								<div class='form-group mt-2 mb-2'>
									<textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea>
								</div>
								<div class='form-group mt-2 mb-2'>
									<input type='file' name='media' class='form-control mediaResponse border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'>
								</div>
								<div class='row text-center mx-auto mt-2 mb-2'>
									<div class='col-sm m-2'>
										<input type='submit' name='reply' value='reply' class=
								'reply btn border border-secondary rounded'>
									</div>

									<div class='col-sm m-2'>
										<input type='submit' value='cancel' class=
								'cancel btn border border-secondary rounded'>
									</div>

								</div>
							</form>";
						if($_COOKIE['loggedInUser']==$row['username'])
						{
							echo "<form method='post' name='editForm' class='editFormPost col-sm-9 mx-auto border border-secondary rounded p-2 m-4 w-75' enctype='multipart/form-data'>
												<input type='hidden' name='editPostId' class='editPostId' value='$row[postId]'>
												<div class='form-group mt-2 mb-2'>
													<textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>".$row['post']."</textarea>
												</div>
												<div class='form-group mt-2 mb-2'>
													<input type='file' name='media' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'>
												</div>
												<div class='row text-center mx-auto mt-2 mb-2'>
													<div class='col-sm m-2'>
														<input type='submit' name='edit' value='edit' class=
												'edit btn border border-secondary rounded'>
													</div>
													<div class='col-sm m-2'>
														<input type='submit' value='cancel' class=
												'cancel btn border border-secondary rounded'>
													</div>
												</div>
											</form>
										";

								echo 	"	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'>
													<p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p>
													<p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center btn edit_option_post'>edit</p>
													<p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right btn delete_option_post'>delete</p>
													<p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>scroll up</p>
												</div>
										";
						}
						else
						{
							echo "	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'>
												<p class='col-sm options rounded border-right mx-auto p-2 m-2 text-center btn reply_option_post'>reply</p>
												<p class='col-sm options rounded scrollUpPost mx-auto p-2 m-2 border-right text-center btn'>
												scroll up</p>
											</div>
							";
						}

						//get responses to each post
						$responses=$GLOBALS['conn']->query("select * from posts where initPostId='$row[postId]' order by date desc");
						if($responses)
						{
							if($responses->num_rows==1)
							{
								echo "<div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>".$responses->num_rows."</span> reply</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div>";
							}
							else
							{
								echo "<div class='row num_responses m-4'><h4 class='col-sm-11 mt-2 mb-2'><span class='num_responses_value'>".$responses->num_rows."</span> replies</h4><div class='col-sm mr-auto'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-expand' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z'/></svg></div></div>";
							}
							while($row=$responses->fetch_assoc())
							{
								if(!empty($row['post']) || !empty($row['media']))
								{
									$date=new DateTime($row['date']);
									$timeStamp=$date->getTimestamp();
									$timeStamp=$timeStamp-$_COOKIE['timeZoneDiff']*60;
									$date=$date->setTimestamp($timeStamp);
									echo "<div id='".$row['postId']."' class='response row'><div class='response-style col-md-9 border border-secondary rounded mx-auto mt-4 mb-4 p-2 w-75'><h5 class='w-75 m-2 header-response'>";

									$sql="select pic from accounts where username='$row[username]'";
									$result2=$GLOBALS['conn']->query($sql);
									if(!$result2)
									{
										generateErrorMessage();
									}
									else
									{
										if($result2->num_rows>0)
										{
											$row2=$result2->fetch_assoc();
											if($row2['pic']!=null)
											{
												$pic=base64_encode($row2['pic']);
												echo "<img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='data:image/jpeg;base64,".$pic."'>";
											}
											else
											{
												echo "<img width='50' height='50' alt='profile picture' class='img-fluid rounded m-2 border border-secondary' src='./images/person.jpg'>";
											}
										}
										else
										{
											echo "An error has occurred";
										}
									}

									echo $row['username']." @ ".$date->format('M d, Y h:i:s A')." UTC</h5>";
									if($row['media']!=null)
									{
										if($row['mediaType']=="mp4")
										{
											echo "<video class='w-75 border border-secondary rounded mediaPost2 embed-responsive mx-auto mt-2 mb-2 d-block' controls><source class='embed-responsive-item' src='data:video/".$row['mediaType'].";base64,".base64_encode( $row['media'] )."' type='video/".$row['mediaType']."'>Sorry, your browser doesn't support embedded videos</video>";
										}
										else
										{
											echo "<img class='w-75 border border-secondary rounded mediaPost2 img-fluid mx-auto mt-2 mb-2 d-block' alt='media post' src='data:image/".$row['mediaType'].";base64,".base64_encode( $row['media'] )."'>";
										}
									}
									if($row['post']!="")
									{
										echo "<p class='mt-2 mb-2 mx-auto p-2 col-sm-9 w-75 border border-secondary rounded post-content-response'>".$row['post']."</p>";
									}

									echo "<form method='post' name='responseForm' class='replyFormResponse mx-auto col-sm-9 w-75 border border-secondary rounded p-2' enctype='multipart/form-data'>
										<input type='hidden' name='initPostId' class='initPostId' value='$row[initPostId]'>
										<input type='hidden' name='initUser' class='initUser' value='$row[username]'>
										<div class='form-group mt-2 mb-2'>
											<textarea name='newResponse' class='form-control newResponse border border-secondary rounded'></textarea>
										</div>
										<div class='form-group mt-2 mb-2'>
											<input type='file' name='media' class='form-control border border-secondary rounded mediaResponse'  value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'>
										</div>
										<div class='row text-center mx-auto mt-2 mb-2'>
											<div class='col-sm m-2'>
												<input type='submit' name='reply' value='reply' class=
											'reply btn border rounded'>
											</div>
											<div class='col-sm m-2'>
												<input type='submit' value='cancel' class=
										'cancel btn border rounded'>
											</div>
										</div></form>";

									if($_COOKIE['loggedInUser']==$row['username'])
									{
										echo "<form method='post' name='editForm' class='editFormResponse col-sm-9 w-75 border border-secondary mx-auto rounded p-2' enctype='multipart/form-data'>
														<input type='hidden' name='editPostId' class='editPostId' value='$row[postId]'>
														<div class='form-group mt-2 mb-2'>
															<textarea name='newEdit' class='form-control newEdit border border-secondary rounded'>".$row['post']."</textarea>
														</div>
														<div class='form-group mt-2 mb-2'>
															<input type='file' name='mediaUpload' class='form-control mediaEdit border border-secondary rounded' value='upload media' accept='image/png, image/jpeg, image/jpg, image/gif, video/mp4'>
														</div>
														<div class='row text-center mx-auto mt-2 mb-2'>
															<div class='col-sm m-2'>
																<input type='submit' name='edit' value='edit' class=
														'edit btn border rounded'>
															</div>
															<div class='col-sm m-2'>
																<input type='submit' value='cancel' class=
														'cancel btn border rounded'>
															</div>
														</div>
													</form>
										";

										echo "	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'>
															<p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p>
															<p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center edit_option_response'>edit</p>
															<p class='col-sm options mx-auto rounded p-2 m-2 text-center border-right delete_option_response'>delete</p>
															<p class='col-sm options scrollUpResponse rounded mx-auto p-2 m-2 border-right text-center'>scroll up</p>
														</div>";
									}
									else
									{
										echo "	<div class='row w-75 ml-2 mb-4 mt-4 mx-auto'>
															<p class='col-sm options border-right rounded mx-auto p-2 m-2 text-center reply_option_response'>reply</p>
															<p class='col-sm options scrollUpResponse rounded p-2 m-2 border-right text-center'>
																scroll up
															</p>
														</div>
										";
									}
									echo "</div></div>";
								}
								if($row['isNew']!=0)
								{
									$sql="UPDATE posts SET isNew = 0 WHERE postId='$row[postId]'";
									$result=$GLOBALS['conn']->query($sql);
									if (!$result)
									{
										generateErrorMessage();
									}
								}

							}
						}
						else
						{
							generateErrorMessage();
						}
						echo "</div></div>";
						if($isNew!=0)
						{
							$sql="UPDATE posts SET isNew = 0 WHERE postId='$postId'";
							$result=$GLOBALS['conn']->query($sql);
							if (!$result)
							{
								generateErrorMessage();
							}
						}

					}
				}
			}
			else
			{
				generateErrorMessage();
			}
			disconnect();
		}
		else
		{
			generateErrorMessage();
		}
	}

	function printNotifications()
	{
		createTableNotifications();
		if(connect())
		{
			//$sql="select * from notifications where username='$_COOKIE[loggedInUser]' order by date desc;";
			$sql="select * from notifications where username=? order by date desc;";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if($stmt)
			{
				$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
				if($result)
				{
					$result=$stmt->execute();
					if($result)
					{
						$numOfUnReadNotififcations=0;
						$result=$stmt->get_result();
						while($row = $result->fetch_assoc())
						{
							$notification=$row['notification'];
							$innerHTML='<a class="btn dropdown-item" href="#'.$row['responseId'].'" id="'.$row['responseId'].'-link">'.$notification.'</a>';
							echo "<script type='text/javascript'>
									$('#notifications-dropdown-menu').append('$innerHTML');
									$('#$row[responseId]-link').addClass('$row[isRead]');
								</script>";
							//if unread
							if($row['isRead']==0)
							{
								$numOfUnReadNotififcations++;
							}
						}
						if($numOfUnReadNotififcations>0)
						{
							echo "<script type='text/javascript'>
									$('#notifications-badge').html('$numOfUnReadNotififcations');
								</script>";
						}
					}
					else
					{
						generateErrorMessageStmt($stmt);
					}
				}
				else
				{
					generateErrorMessageStmt($stmt);
				}

			}
			else
			{
				generateErrorMessage();
			}
			disconnect();
		}
		else
		{
				generateErrorMessage();
		}
	}

	function checkNewNotifications()
	{
		if(connect())
		{
			//$sql="select * from notifications where username='$_COOKIE[loggedInUser]' and isRead=0 order by date desc;";
			$sql="select * from notifications where username=? and isRead=0 order by date desc;";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if($stmt)
			{
				$result=$stmt->bind_param("s",$_COOKIE['loggedInUser']);
				if($result)
				{
					$result=$stmt->execute();
					if($result)
					{
						$arr=array();
						$obj=array();
						$result=$stmt->get_result();
						while($row = $result->fetch_assoc())
						{
								$obj=array("responseId" => $row['responseId'], "notification" => $row['notification'], "isRead" => $row['isRead']);
								array_push($arr,$obj);
								$obj=array();
						}
						echo json_encode(array("newNotifications" => $arr));
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
	}

	function checkNewDeletes()
	{
		if(connect())
		{
			//$sql="select * from posts where postId='$_POST[postId]' order by date desc;";
			$sql="select * from posts where postId=? order by date desc;";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if($stmt)
			{
				$result=$stmt->bind_param("i",$_POST['postId']);
				if($result)
				{
					$result=$stmt->execute();
					if($result)
					{
						$result=$stmt->get_result();
						if($result->num_rows<=0)
						{
							echo json_encode(array("deletePost" => "delete","postId" => $_POST['postId']));
						}
						else
						{
							echo json_encode(array("deletePost" => "do not delete"));
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
	}

	function checkNewUpdates()
	{
		if(connect())
		{
			//$sql="select * from posts where postId='$_POST[postId]' order by date desc;";
			$sql="select * from posts where postId=? order by date desc;";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if($stmt)
			{
				$result=$stmt->bind_param("i",$_POST['postId']);
				if($result)
				{
					$result=$stmt->execute();
					if($result)
					{
						$result=$stmt->get_result();
						if($result->num_rows>0)
						{
							$row=$result->fetch_assoc();
							$media=base64_encode($row['media']);
							if($row['post']!=$_POST['postContent'] || $media!=$_POST['media'])
							{
								if(!empty($row['post']) || !empty($media))
								{
									echo json_encode(array("postId" => $row['postId'], "updatePost" => $row['post'], "media" =>  $media, "mediaType" => $row['mediaType']));
								}
								else
								{
									echo json_encode(array("updatePost" => "do not update"));
								}
							}
							else
							{
								echo json_encode(array("updatePost" => "do not update"));
							}
						}
						else
						{
							echo json_encode(array("updatePost" => "do not update"));
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
	}

	function checkNewPosts()
	{
		if(connect())
		{
			$sql="select * from posts where isNew!=0 and initPostId=0 order by date desc;";
			$result=$GLOBALS['conn']->query($sql);
			if($result)
			{
				$arr=array();
				$obj=array();
				while($row = $result->fetch_assoc())
				{
					if(!empty($row['post']) || !empty($row['media']))
					{
						$sql="select pic from accounts where id='$row[userId]'";
						$result2=$GLOBALS['conn']->query($sql);
						if(!$result2)
						{
							generateError();
						}
						else
						{
							if($result2->num_rows>0)
							{
								$row2=$result2->fetch_assoc();
								$obj=array("postId" => $row['postId'], "post" => $row['post'], "media" => base64_encode($row['media']), "username" => $row['username'], "initPostId" => $row['initPostId'], "profilePic" => base64_encode($row2['pic']), "dateTime" => $row['date']);
								array_push($arr,$obj);
								$obj=array();
							}
							else
							{
								generateError();
							}
						}
					}
				}
				echo json_encode(array("newPosts" => $arr));
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
	}

	function checkNewResponses()
	{
		if(connect())
		{
			$sql="select * from posts where isNew!=0 and initPostId!=0 order by date desc;";
			$result=$GLOBALS['conn']->query($sql);
			if($result)
			{
				$arr=array();
				$obj=array();
				while($row = $result->fetch_assoc())
				{
					if(!empty($row['post']) || !empty($row['media']))
					{
						$sql="select pic from accounts where id='$row[userId]'";
						$result2=$GLOBALS['conn']->query($sql);
						if(!$result2)
						{
							generateError();
						}
						else
						{
							if($result2->num_rows>0)
							{
								$row2=$result2->fetch_assoc();
								$obj=array("responseId" => $row['postId'], "response" => $row['post'], "media" => base64_encode($row['media']), "username" => $row['username'], "initPostId" => $row['initPostId'], "profilePic" => base64_encode($row2['pic']), "dateTime" => $row['date']);
								array_push($arr,$obj);
								$obj=array();
							}
							else
							{
								generateError();
							}
						}
					}
				}
				echo json_encode(array("newResponses" => $arr));
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
	}

	function markNotificationsAsRead()
	{
		if(connect())
		{
			$sql="update notifications set isRead = 1;";
			$result=$GLOBALS['conn']->query($sql);
			if($result)
			{
				echo "Notifications marked as read";
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
	}

	function getLoggedInUser()
	{
		$obj=array("loggedInUser" => $_COOKIE['loggedInUser']);
		echo json_encode($obj);
	}

	function updateEmail()
	{
		if(!empty($_GET['username']) && !empty($_GET['email']) && !empty($_GET['activateCode']))
		{
			if(connect())
			{
				$sql="select activateCode from accounts where username =?";
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
							$row=$result->fetch_assoc();
							if(!empty($row))
							{
								if($row['activateCode']!='' && $_GET['activateCode']==$row['activateCode'])
								{
									//update email
									$sql="Update accounts set activateCode='', email=? where username=?;";
									$stmt=$GLOBALS['conn']->prepare($sql);
									if(!$stmt)
									{
										generateErrorMessage();
									}
									else
									{
										$result=$stmt->bind_param("ss",$_GET['email'],$_GET['username']);
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
												echo "<h5 class='success mt-2 mb-2'>Email updated</h5>";
											}
										}
									}
								}
								else
								{
									echo "<h5 class='error mt-2 mb-2'>Invalid code</h5>";
								}
							}
							else
							{
								echo "<h5 class='error mt-2 mb-2'>Username not on file</h5>";
							}
						}
					}
				}
				disconnect();
			}
			else
			{
					generateErrorMessage();
			}
		}
		else
		{
			load("signin.php");
		}
	}

	function resendCode()
	{
		$subject="Please Activate your Account";
		$body="<p>Welcome to Animals and Nature Message Board ".$_POST['fname'].".  Please click the link provided to activate your account and enter the code provided in addition to your username <strong>".$_POST['username']."</strong>. Code:<strong>".$_POST['code']."</strong>.</p><p><a href='".SITE_URL."/activateAccount.php?activate=activate'>activate</a></p>";
		$altBody="Welcome to Animals and Nature Message Board ".$_POST['fname'].".  Please click the link provided to activate your account and enter the code provided in addition to your username ".$_POST['username']."  ".SITE_URL."/activateAccount.php?activate=activate";
		if(sendEmail($_POST['fname'], $_POST['email'],$subject, $body, $altBody))
		{
			echo "<h5 class='success mt-2 mb-2'>Please check your email and click the link provided to activate your account</h5>";
		}
		else
		{
			echo "	<h5 class='error mt-2 mb-2'>
								We tried to send an email to verify your account but an error has occurred, please check the email address you provided and try again
							</h5>";
		}
	}

	function doesEmailExist($email)
	{
		if(connect())
		{
			$sql="select email from accounts where email =?";
			$stmt=$GLOBALS['conn']->prepare($sql);
			if(!$stmt)
			{
				generateErrorMessage();
			}
			else
			{
				$result=$stmt->bind_param("s",$email);
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
							return true;
						}
						return false;
					}
				}
			}
		}
		else
		{
			generateErrorMessage();
		}
		
	}
?>
