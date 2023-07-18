<?php
$target_dir = "./img/";
$allowed_user_agents = ['vwaiolet', 'User-Agent2', 'User-Agent3']; // Modify this list according to your needs

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST["submit"])) {
        $randomStr = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', mt_rand(1,6))),1,6);
        $timestamp = date("YmdHis");
        $imageFileType = strtolower(pathinfo(basename($_FILES["fileToUpload"]["name"]),PATHINFO_EXTENSION));
        $target_file = $target_dir . $timestamp . "_" . $randomStr . "." . $imageFileType;
    
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            $mime = $check['mime'];
            if($mime != 'image/jpeg' && $mime != 'image/png'){
                echo 'Only JPG & PNG files are allowed.';
            }
            else{
                if ($imageFileType != 'jpg' && $imageFileType != 'jpeg' && $imageFileType != 'png') {
                    echo 'Sorry, only JPG, JPEG & PNG files are allowed.';
                }
                else {
                    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
    
                        // Prepare new post data
                        $post = [
                            'url'         => 'https://api.eureka.uiharu.dev/img/'.$timestamp."_".$randomStr.'.'.$imageFileType,
                            'verify_code' => $randomStr
                        ];

                        // Create a stream context
                        $context = stream_context_create([
                            'http' => [
                                'method' => 'POST',
                                'header' => 'Content-type: application/json',
                                'content' => json_encode($post)
                            ]
                        ]);

                        // Send the request
                        $response = @file_get_contents('http://61.81.98.195:5000/predict', false, $context);

                        if ($response === false) {
                            // Handle error
                            $error = error_get_last();
                            echo "Error: " . $error['message'];
                        } else {
                            // Process response
                            echo $response;
                        }
    
                    } else {
                        echo "Sorry, there was an error uploading your file.";
                    }
                }
            }
        } else {
            echo "File is not an image.";
        }
    }
}

elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_agent = $_GET['useragent'];

    if (!in_array($user_agent, $allowed_user_agents)) {
        echo "Access denied: Invalid User-Agent";
        exit;
    }

    if (isset($_GET['filename']) && isset($_GET['verify_code'])) {
        $filename = $_GET['filename'];
        $verify_code = $_GET['verify_code'];

        if (file_exists($target_dir . $filename)) {
            if (strpos($filename, $verify_code) !== false) {
                if(unlink($target_dir . $filename)) {
                    echo "The file ". $filename . " has been deleted.";
                } else {
                    echo "Sorry, there was an error deleting your file.";
                }
            } else {
                echo "Sorry, verification code does not match.";
            }
        } else {
            echo "Sorry, file does not exist.";
        }
    }
}
?>
