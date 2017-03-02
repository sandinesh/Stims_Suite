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

<?php include("parents.php");?>

<div class="main">
	
	<div class="main-inner">

	    <div class="container">
	
	      <div class="row">
	      	
	      	<div class="span12">      		
	      		
	      		<div class="widget ">
	      			
	      			<div class="widget-header">
	      				<i class="icon-user"></i>
	      				<h3>Student marks</h3>
	  				</div> 
					
					<div class="widget-content">
					 <div>
							<form action="#">Choose Exam:
		                    <input list="plan" type="text">
 								<datalist id="plan">
								    <option value="I mid term"></option>
								    <option value="II mid term"></option>
								    <option value="III mid term"></option>
								</datalist>
								From<input type="date" name="bdaymonth">
                                To<input type="date" name="bdaymonth">
                         <button type="button">View</button>
								<button type="button">GO</button>
											 </form>

							</form>
					</div>
	                       <div class="table-responsive">
					        <table class="table table-bordered">
					            <thead>
					                <tr>
					                    <th>Subject code</th>
					                    <th>Subject</th>
					                    <th>Date</th>
					                    <th>Session</th>					           
					                </tr>
					            </thead>
					            <tbody>
					                <tr>
					                    <td>001</td>
					                    <td>Tamil</td>
					                    <td>1/2/2017</td>
					                    <td>11.30 - 12.30</td>					               
					               </tr>
					                <tr>
					                    <td>002</td>
					                    <td>English</td>
					                    <td>2/2/2017</td>
					                   <td>03.30 - 4.30</td>
					                   </tr>
					                   <tr>
					                    <td>002</td>
					                    <td>English</td>
					                    <td>2/2/2017</td>
					                   <td>03.30 - 4.30</td>
					                   </tr>					                    	
					                    </tbody>			                   				                 					           
					        </table>					       
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
