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
	      				<h3>Attendance Form</h3>
	  				</div> <!-- /widget-header -->
					
					<div class="widget-content">
						 <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Attendance</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Raja</td>
                    <td>12345</td>
                    <td><div class="radio">
                     <label><input type="radio" id='regular' name="optradio">P</label>
                 </div>
                 <div class="radio">
                     <label><input type="radio" id='regular' name="optradio">A</label>
                 </div>
                 <div class="radio">
                     <label><input type="radio" id='regular' name="optradio">L</label>
                 </div>
                 </td>

                    <td><input type="text" class="form" /></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Raja</td>
                    <td>12345</td>
                   <td><div class="radio">
                     <label><input type="radio" id='regular' name="optradio">P</label>
                 </div>
                 <div class="radio">
                     <label><input type="radio" id='regular' name="optradio">A</label>
                 </div>
                 <div class="radio">
                     <label><input type="radio" id='regular' name="optradio">L</label>
                 </div>

                 </td>
                    <td><input type="text" class="form-control" /></td>
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
