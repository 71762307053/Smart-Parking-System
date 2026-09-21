<?php
session_start();
require 'database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize inputs
    $name = trim(htmlspecialchars($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = trim(htmlspecialchars($_POST['phone'] ?? ''));
    $dob = trim(htmlspecialchars($_POST['dob'] ?? ''));
    $gender = trim(htmlspecialchars($_POST['gender'] ?? ''));
    $address = trim(htmlspecialchars($_POST['address'] ?? ''));
    $vehicle_number = trim(htmlspecialchars($_POST['vehicle_number'] ?? ''));
    $vehicle_type = trim(htmlspecialchars($_POST['vehicle_type'] ?? ''));
    $parking_preference = trim(htmlspecialchars($_POST['parking_preference'] ?? ''));

    // Validation
    if (empty($name) || empty($email) || empty($phone) || empty($dob) || empty($gender) || empty($address) || empty($vehicle_number) || empty($vehicle_type)) {
        $_SESSION['error'] = "All required fields must be filled.";
        header("Location: registration.php");
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Invalid email format.";
        header("Location: registration.php");
        exit();
    }

    // Check for duplicate email or vehicle number
    $stmt = $conn->prepare("SELECT id FROM parking_users WHERE email = ? OR vehicle_number = ?");
    $stmt->bind_param("ss", $email, $vehicle_number);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $_SESSION['error'] = "Email or Vehicle Number is already registered.";
        header("Location: registration.php");
        exit();
    }
    $stmt->close();

    // Handle Profile Picture
    $profile_pic = '';
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] == 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $filename = $_FILES['profile_pic']['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $filesize = $_FILES['profile_pic']['size'];

        if (!in_array($ext, $allowed)) {
            $_SESSION['error'] = "Invalid file type. Only JPG, PNG, WEBP allowed.";
            header("Location: registration.php");
            exit();
        }
        
        if ($filesize > 2097152) { // 2MB
            $_SESSION['error'] = "File size must be less than 2MB.";
            header("Location: registration.php");
            exit();
        }

        $new_filename = uniqid('profile_', true) . '.' . $ext;
        $upload_dir = 'uploads/';
        if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $upload_dir . $new_filename)) {
            $profile_pic = $new_filename;
        } else {
            $_SESSION['error'] = "Failed to upload image.";
            header("Location: registration.php");
            exit();
        }
    } else {
        $_SESSION['error'] = "Profile picture is required.";
        header("Location: registration.php");
        exit();
    }

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO parking_users (name, email, phone, dob, gender, address, vehicle_number, vehicle_type, parking_preference, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssss", $name, $email, $phone, $dob, $gender, $address, $vehicle_number, $vehicle_type, $parking_preference, $profile_pic);

    if ($stmt->execute()) {
        $_SESSION['success'] = "Registration successful! Welcome to Smart Parking.";
    } else {
        $_SESSION['error'] = "Registration failed: " . $conn->error;
    }
    
    $stmt->close();
    $conn->close();

    header("Location: registration.php");
    exit();
}
?>
