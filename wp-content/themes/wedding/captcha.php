<?php 
  session_start();
  $code = rand(1000, 9999);
  $_SESSION["captcha"] = $code;
  $imageSize = imagecreatetruecolor(200, 40);
  $background = imagecolorallocate($imageSize, 216, 216, 216);
  $color = imagecolorallocate($imageSize, 0, 0, 0);
  imagefill($imageSize, 0, 0, $background);
  imagestring($imageSize, 15, 80, 12, $code, $color);
  header("Cache-Control: no-cache, must-revalidate");
  header('Content-type: image/png');
  imagepng($imageSize);
  imagedestroy($imageSize);
?>
