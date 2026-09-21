<?php
session_start();
require 'database.php';

// Fetch users
$query = "SELECT * FROM parking_users ORDER BY created_at DESC";
$result = $conn->query($query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - View Users</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-container { max-width: 1200px; margin: 40px auto; padding: 20px; background: white; border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: var(--primary, #10b981); color: white; }
        tr:hover { background-color: #f1f1f1; }
        .thumbnail { width: 50px; height: 50px; object-fit: cover; border-radius: 5px; }
        .action-btn { padding: 5px 10px; text-decoration: none; border-radius: 3px; color: white; margin-right: 5px; }
        .btn-edit { background-color: #2196F3; }
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
            <li><a href="view_users.php" class="active">Admin Users</a></li>
            <li><a href="view_feedback.php">Admin Feedback</a></li>
        </ul>
    </nav>
    <div class="admin-container">
        <h2>Registered Parking Users</h2>
        <?php if(isset($_SESSION['msg'])): ?>
            <div class="alert alert-success"><?php echo $_SESSION['msg']; unset($_SESSION['msg']); ?></div>
        <?php endif; ?>
        
        <div style="overflow-x:auto;">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Vehicle No.</th>
                        <th>Type</th>
                        <th>Pref.</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo $row['id']; ?></td>
                        <td>
                            <?php if($row['profile_pic']): ?>
                                <img src="uploads/<?php echo htmlspecialchars($row['profile_pic']); ?>" class="thumbnail" alt="Profile">
                            <?php else: ?>
                                N/A
                            <?php endif; ?>
                        </td>
                        <td><?php echo htmlspecialchars($row['name']); ?></td>
                        <td><?php echo htmlspecialchars($row['email']); ?></td>
                        <td><?php echo htmlspecialchars($row['phone']); ?></td>
                        <td><?php echo htmlspecialchars($row['vehicle_number']); ?></td>
                        <td><?php echo htmlspecialchars($row['vehicle_type']); ?></td>
                        <td><?php echo htmlspecialchars($row['parking_preference']); ?></td>
                        <td><?php echo date('Y-m-d', strtotime($row['created_at'])); ?></td>
                        <td>
                            <a href="edit_user.php?id=<?php echo $row['id']; ?>" class="action-btn btn-edit">Edit</a>
                            <a href="delete_user.php?id=<?php echo $row['id']; ?>" class="action-btn btn-delete" onclick="return confirm('Are you sure you want to delete this user?');">Delete</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                    <?php if($result->num_rows == 0): ?>
                    <tr><td colspan="10" style="text-align:center;">No users found.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
