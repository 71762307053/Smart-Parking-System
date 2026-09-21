<?php
session_start();
require 'database.php';

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    // First, delete the profile picture if it exists
    $stmt = $conn->prepare("SELECT profile_pic FROM parking_users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $pic = $row['profile_pic'];
        if ($pic && file_exists("uploads/" . $pic)) {
            unlink("uploads/" . $pic);
        }
    }
    $stmt->close();
    
    // Delete record
    $stmt2 = $conn->prepare("DELETE FROM parking_users WHERE id = ?");
    $stmt2->bind_param("i", $id);
    if ($stmt2->execute()) {
        $_SESSION['msg'] = "User deleted successfully.";
    } else {
        $_SESSION['msg'] = "Error deleting user.";
    }
    $stmt2->close();
}

header("Location: view_users.php");
exit();
?>
