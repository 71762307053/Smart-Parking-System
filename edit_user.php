<?php
session_start();
require 'database.php';

if (!isset($_GET['id'])) {
    header("Location: view_users.php");
    exit();
}

$id = (int)$_GET['id'];
$stmt = $conn->prepare("SELECT * FROM parking_users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("Location: view_users.php");
    exit();
}

$user = $result->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit User</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .form-container { max-width: 600px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 10px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .btn-update { background-color: var(--primary, #10b981); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Edit Parking User</h2>
        <form action="update_user.php" method="POST">
            <input type="hidden" name="id" value="<?php echo $user['id']; ?>">
            
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" value="<?php echo htmlspecialchars($user['name']); ?>" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value="<?php echo htmlspecialchars($user['phone']); ?>" required>
            </div>
            <div class="form-group">
                <label>Vehicle Number</label>
                <input type="text" name="vehicle_number" value="<?php echo htmlspecialchars($user['vehicle_number']); ?>" required>
            </div>
            <div class="form-group">
                <label>Vehicle Type</label>
                <select name="vehicle_type" required>
                    <option value="Car" <?php if($user['vehicle_type'] == 'Car') echo 'selected'; ?>>Car</option>
                    <option value="Bike" <?php if($user['vehicle_type'] == 'Bike') echo 'selected'; ?>>Bike</option>
                    <option value="Scooter" <?php if($user['vehicle_type'] == 'Scooter') echo 'selected'; ?>>Scooter</option>
                    <option value="Other" <?php if($user['vehicle_type'] == 'Other') echo 'selected'; ?>>Other</option>
                </select>
            </div>
            
            <button type="submit" class="btn-update">Update User</button>
            <a href="view_users.php" style="display:block; text-align:center; margin-top:10px; color:#555;">Cancel</a>
        </form>
    </div>
</body>
</html>
