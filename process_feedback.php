<?php
session_start();
require 'database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize inputs
    $user_email = filter_var(trim($_POST['user_email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $vehicle_number = trim(htmlspecialchars($_POST['vehicle_number'] ?? ''));
    $rating = (int)($_POST['rating'] ?? 5);
    $comments = trim(htmlspecialchars($_POST['comments'] ?? ''));

    // Validation
    if (empty($user_email) || empty($vehicle_number) || empty($comments)) {
        $_SESSION['error'] = "All fields are required.";
        header("Location: feedback.php");
        exit();
    }

    if (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Invalid email format.";
        header("Location: feedback.php");
        exit();
    }

    if ($rating < 1 || $rating > 5) {
        $rating = 5;
    }

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO parking_feedback (user_email, vehicle_number, rating, comments) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $user_email, $vehicle_number, $rating, $comments);

    if ($stmt->execute()) {
        $_SESSION['success'] = "Thank you for your feedback!";
    } else {
        $_SESSION['error'] = "Failed to submit feedback: " . $conn->error;
    }
    
    $stmt->close();
    $conn->close();

    header("Location: feedback.php");
    exit();
}
?>
