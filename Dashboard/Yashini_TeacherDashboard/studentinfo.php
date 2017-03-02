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
  <style>
  .img-circle{     
    width: 10%;
 
    border-radius: 24px;
  }

  .Table th{
  	    width: 100px;
  }
  </style>

<body>

<?php include("parents.php");?>

<div class="main">
	
	<div class="main-inner">

	    <div class="container">
	
	      <div class="row">
	      	
	      	<div class="span12">      		
	      		
	      		<div class="widget ">
	      			
	      			<div class="widget-header">
	      				<i class="icon-user"></i>
	      				<h3>Students info</h3>
	  				</div> <!-- /widget-header -->
					
					<div class="widget-content">
					 <div>
							<form action="#">
							 
							 class:<input list="hosting-plan" type="text">
 								<datalist id="hosting-plan">
								    <option value="I"></option>
								    <option value="II"></option>
								    <option value="III"></option>
								</datalist>
								Section:<input list="hosting" type="text">
 								<datalist id="hosting">
								    <option value="A"></option>
								    <option value="B"></option>
								    <option value="C"></option>
								</datalist>
								<button type="button">GO</button>
 
							 </form>

							</form>
					</div>


						 <div class="table-responsive">
					        <table class="table table-bordered">
					            <thead>
					                <tr>
					                    <th>Profile</th>
					                    <th>Name</th>
					                    <th>Roll No</th>
					                    <th>E-mail</th>
					                    <th>Class</th>
					                    <th>Section</th>
					                </tr>
					            </thead>
					            <tbody>
					                <tr>
					                    <td><img class="img-circle" src="images/1..jpg"></td>
					                    <td>Raja</td>
					                    <td>12345</td>
					                      <td>raja@gmail.com</td>
					                        <td>III</td>
					                          <td>C</td>
					               
					                </tr>
					                <tr>
					                    <td><img class="img-circle" src="images/2.jpg"></td>
					                    <td>Raja</td>
					                    <td>12345</td>
					                      <td>raja@gmail.com</td>
					                        <td>III</td>
					                          <td>C</td>
					                          </tr>
					                

					            </tbody>
					        </table>
					        <button type="button" class="btn">Save</button>	
					        </div>
					        </div>
						
					
								
								
											
								
							
						
						
						
						
					</div> <!-- /widget-content -->
						
				</div> <!-- /widget -->
	      		
		    </div> <!-- /span8 -->
	      	
	      	
	      	
	      	
	      </div> <!-- /row -->
	
	    </div> <!-- /container -->
	    
	</div> <!-- /main-inner -->
    
</div> <!-- /main -->
    
    
    
 

    
    
<?php include("footer.php");?>
    


<script src="js/jquery-1.7.2.min.js"></script>
	
<script src="js/bootstrap.js"></script>
<script src="js/base.js"></script>


  </body>

</html>
