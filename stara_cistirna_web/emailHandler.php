<?php
   // data sent in header are in JSON format
   header('Content-Type: application/json');
   // takes the value from variables and Post the data
   $phone = $_POST['phone'];
   $email = $_POST['email'];
   $order = $_POST['order'];  
   $to = "jb.fxtrade@gmail.com";
   $subject = "Cistirna objednavka";
   // Email Template
   $emailText = "<b>Phone : </b>". $phone ."<br>";
   $emailText .= "<b>Email : </b>".$email."<br>";
   $emailText .= "<b>Message : </b>".$order."<br>";

   $header = "From:".$email." \r\n";
   $header .= "MIME-Version: 1.0\r\n";
   $header .= "Content-type: text/html\r\n";
   $retval = mail($to,$subject,$emailText,$header);
   // message Notification
   if( $retval == true ) {
      echo json_encode(array(
         'success'=> true,
         'message' => 'Objednávka odeslána.'
      ));
   }else {
      echo json_encode(array(
         'error'=> true,
         'message' => 'Chyba při zasílání objednávky.'
      ));
   }
?>