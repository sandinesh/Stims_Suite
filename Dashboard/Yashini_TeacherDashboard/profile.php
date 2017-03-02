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
                <h3>Register Form</h3>
            </div> <!-- /widget-header -->
          
          <div class="widget-content"> 
          <fieldset>


<label for="Class">Name</label><input type="text" name="Class" size="20">
<label for="txtclasssection">DOB</label><input type="text" name="txtclasssection" size="20">
<label for="txtTeacher">Qualification</label><input type="text" name="txtTeacher" size="20">
<label for="txtEdition">Occupation</label><input type="text" name="txtEdition" size="20">
<label for="txtAuthor">E-mail</label><input type="text" name="txtAuthor" size="20">
<label for="txtAuthor">Mobile Number</label><input type="text" name="txtAuthor" size="20">
<label for="txtAuthor">Password</label><input type="text" name="txtAuthor" size="20">
<label for="txtAuthor">Address</label><input type="text" name="txtAuthor" size="20">
<label for="txtAuthor">City</label><input list="plan" type="text">
                <datalist id="plan">
                    <option value="Ooty"></option>
                    <option value="Hosur"></option>
                    <option value="Chennai"></option>
                </datalist>
<label for="txtAuthor">State</label><input list="plan" type="text">
                <datalist id="plan">
                    <option value="Tamil Nadu"></option>
                    <option value="Kerala"></option>
                    <option value="Karnataka"></option>
                </datalist>
<label for="txtAuthor">Country</label><input list="plan" type="text">
                <datalist id="plan">
                    <option value="India"></option>
                    <option value="Australia"></option>
                    <option value="Astria"></option>
                </datalist>
                <label for="Class">Current Password</label><input type="text" name="Class" size="20">
                <label for="Class">New Password</label><input type="text" name="Class" size="20">
                <label for="Class">Confirm Password</label><input type="text" name="Class" size="20">
                </fieldset>
            
                
        
      </div> <!-- .actions -->
      
      
      
    </form>
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