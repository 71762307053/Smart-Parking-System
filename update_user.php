<?php
session_start();
require 'database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = (int)$_POST['id'];
    $name = trim(htmlspecialchars($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = trim(htmlspecialchars($_POST['phone'] ?? ''));
    $vehicle_number = trim(htmlspecialchars($_POST['vehicle_number'] ?? ''));
    $vehicle_type = trim(htmlspecialchars($_POST['vehicle_type'] ?? ''));

    // Update DB
    $stmt = $conn->prepare("UPDATE parking_users SET name=?, email=?, phone=?, vehicle_number=?, vehicle_type=? WHERE id=?");
    $stmt->bind_param("sssssi", $name, $email, $phone, $vehicle_number, $vehicle_type, $id);
    
    if ($stmt->execute()) {
        $_SESSION['msg'] = "User updated successfully.";
    } else {
        $_SESSION['msg'] = "Error updating user.";
    }
    
    $stmt->close();
    $conn->close();
    
    header("Location: view_users.php");
    exit();
}
?>
