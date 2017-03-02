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
	  				</div> <!-- /widget-header -->
					
					<div class="widget-content">
					 <div>
							<form action="#">
							  Exam:<input list="plan" type="text">
 								<datalist id="plan">
								    <option value="I mid term"></option>
								    <option value="II mid term"></option>
								    <option value="III mid term"></option>
								</datalist>
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
					                    <th>S.No</th>
					                    <th>Name</th>
					                    <th>Roll No</th>
					                    <th>Tamil</th>
					                    <th>English</th>
					                    <th>Maths</th>
					                    <th>Science</th>
					                    <th>Social Science</th>
					                     <th>Action</th>

					                </tr>
					            </thead>
					            <tbody>
					                <tr>
					                    <td>1</td>
					                    <td>Raja</td>
					                    <td>12345</td>
					                    <td>98</td>
					                    <td>89</td>
					                    <td>90</td>
					                    <td>95</td>
					                    <td>84</td>
					                    <td><i class="icon-edit"></i>
					                   <i class="icon-save"></i>
					                    </td>
					                </tr>
					                <tr>
					                    <td>1</td>
					                    <td>Raja</td>
					                    <td>12345</td>
					                    <td>98</td>
					                    <td>89</td>
					                    <td>90</td>
					                    <td>95</td>
					                    <td>84</td>
					                     <td><i class="icon-edit"></i>
					                    <i class="icon-save"></i>
					                    </td>
					                  
					            </tbody>
					        </table>
					         Show<input list="plan" type="text">
 								<datalist id="plan">
								    <option value="10"></option>
								    <option value="9"></option>
								    <option value="8"></option>
								</datalist>
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
