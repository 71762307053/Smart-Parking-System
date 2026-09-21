<?php
session_start();
require 'database.php';

$query = "SELECT * FROM parking_feedback ORDER BY created_at DESC";
$result = $conn->query($query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - View Feedback</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-container { max-width: 1200px; margin: 40px auto; padding: 20px; background: white; border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: var(--primary, #10b981); color: white; }
        tr:hover { background-color: #f1f1f1; }
        .action-btn { padding: 5px 10px; text-decoration: none; border-radius: 3px; color: white; }
        .btn-delete { background-color: #f44336; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .alert-success { background-color: #d4edda; color: #155724; }
    </style>
</head>
<body>
    <header>
        <div class="header-container">
            <h1>Smart Parking Admin</h1>
        </div>
    </header>
    <nav>
        <ul class="nav-links">
            <li><a href="index.php">Home</a></li>
            <li><a href="registration.php">Register</a></li>
            <li><a href="feedback.php">Feedback</a></li>
            <li><a href="view_users.php">Admin Users</a></li>
            <li><a href="view_feedback.php" class="active">Admin Feedback</a></li>
        </ul>
    </nav>
    <div class="admin-container">
        <h2>User Feedback</h2>
        <?php if(isset($_SESSION['msg'])): ?>
            <div class="alert alert-success"><?php echo $_SESSION['msg']; unset($_SESSION['msg']); ?></div>
        <?php endif; ?>
        
        <div style="overflow-x:auto;">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Vehicle No.</th>
                        <th>Rating</th>
                        <th>Comments</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo $row['id']; ?></td>
                        <td><?php echo htmlspecialchars($row['user_email']); ?></td>
                        <td><?php echo htmlspecialchars($row['vehicle_number']); ?></td>
                        <td><?php echo $row['rating']; ?>/5</td>
                        <td><?php echo htmlspecialchars($row['comments']); ?></td>
                        <td><?php echo date('Y-m-d H:i', strtotime($row['created_at'])); ?></td>
                        <td>
                            <a href="delete_feedback.php?id=<?php echo $row['id']; ?>" class="action-btn btn-delete" onclick="return confirm('Delete this feedback?');">Delete</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                    <?php if($result->num_rows == 0): ?>
                    <tr><td colspan="7" style="text-align:center;">No feedback found.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
