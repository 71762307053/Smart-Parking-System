<?php
session_start();
require 'database.php';

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    $stmt = $conn->prepare("DELETE FROM parking_feedback WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        $_SESSION['msg'] = "Feedback deleted successfully.";
    } else {
        $_SESSION['msg'] = "Error deleting feedback.";
    }
    $stmt->close();
}

header("Location: view_feedback.php");
exit();
?>
