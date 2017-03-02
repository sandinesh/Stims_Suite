<!DOCTYPE html>
<html lang="en">
  
<head>
    <meta charset="utf-8">
    <title>San</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="css/font-awesome.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    </head>
<body>
<?php include("header.php");?>
<div class="main">
	
	<div class="main-inner">

	    <div class="container">
	
	      <div class="row">
	      	
	      	<div class="span12">      		
	      		
	      		<div class="widget ">
	      			
	      			<div class="widget-header">
	      				<i class="icon-user"></i>
	      				<h3>Subject</h3>
	  				</div> 
					<div class="widget-content">																			<div class="tabbable">
						<ul class="nav nav-tabs">
						  <li>
						    <a href="#formcontrols" data-toggle="tab"><i class="icon-tasks"></i> Subject 
						    list</a>
						  </li>
						  <li  class="active"><a href="#jscontrols" data-toggle="tab"><i class="icon-plus"></i> Add Subject</a></li>
						</ul>
						
						<br>
						
							<div class="tab-content">
								<div class="tab-pane" id="jscontrols">
								<form id="edit-profile" class="form-horizontal">
									<fieldset>
										<div class="control-group">											
											<label class="control-label" >Subject</label>
											<div class="controls">
												<input type="text" class="span6" id="Subject">
											</div> 			
										</div> 
										
										
										<div class="control-group">											
											<label class="control-label">Class</label>
											<div class="controls">
												<select id="text" name="text">
														<option value="First Choice">I</option>
														<option value="Second Choice">II</option>
														<option value="Third Choice">III</option>
														<option value="Fourth Choice">IV</option>
													</select>
											</div> 			
										</div> 
										
										
										<div class="control-group">											
											<label class="control-label">Class section</label>
											<div class="controls">
												<select id="text" name="text">
													<option value="First Choice">A</option>
													<option value="Second Choice">B</option>
													<option value="Third Choice">C</option>
													<option value="Fourth Choice">D</option>
												</select>
											</div> 			
										</div> 
										<div class="control-group">											
											<label class="control-label">Teacher</label>
											<div class="controls">
												<select id="text" name="text">
													<option value="First Choice">Asha</option>
													<option value="Second Choice">Basha</option>
													<option value="Third Choice">Casha</option>
													<option value="Fourth Choice">Dasha</option>
												</select>
											</div> 		
										</div> 		
								
								<div class="control-group">											
											<label class="control-label" >Edition</label>
											<div class="controls">
												<input type="text" class="span4" id="Edition">
											</div> 		
										</div> 		
								
								<div class="control-group">											
											<label class="control-label" >Author Name</label>
											<div class="controls">
												<input type="text" class="span4" id="Author Name">
											</div> 		
										</div> 
								<div class="control-group">											
											<label class="control-label" >Syllabus</label>
											<div class="controls">
												<input type="text" class="span4" id="Syllabus">
											<input type="file"/>
									
																			
										<br /><br />										                                                                                                               																					<div class="form-actions">
											<button type="submit" class="btn btn-primary">Save</button> 
											<button class="btn">Cancel</button>
										</div>
									</fieldset>
								</form>
								</div>
								<div class="tab-pane active" id="formcontrols">
									<form id="edit-profile2" class="form-vertical">
										<fieldset>
												
										</fieldset>
									</form>
								</div>
								
							</div>
						  
						  
						</div>																												
					</div> 
				</div> 
	      		
		    </div>      		      		      	
	      	
	      </div> 
	
	    </div> 
	    
	</div> 
    
</div>
    <script src="js/jquery-1.7.2.min.js"></script>
	
<script src="js/bootstrap.js"></script>
<script src="js/base.js"></script>


  </body>

</html>

