<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Vehicle - Smart Parking System</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .form-container {
            max-width: 600px;
            margin: 40px auto;
            background: var(--bg-card, #fff);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }
        .form-group input.error, .form-group select.error, .form-group textarea.error {
            border-color: red;
        }
        .error-msg {
            color: red;
            font-size: 12px;
            display: none;
            margin-top: 5px;
        }
        .btn-register {
            background-color: var(--primary, #10b981);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        .btn-register:hover {
            opacity: 0.9;
        }
        .btn-reset {
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 10px;
        }
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .alert-success { background-color: #d4edda; color: #155724; }
        .alert-danger { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <header>
        <div class="header-container">
            <h1>Smart Parking System</h1>
        </div>
    </header>
    
    <nav>
        <ul class="nav-links">
            <li><a href="index.php">Home</a></li>
            <li><a href="registration.php" class="active">Register Vehicle</a></li>
            <li><a href="feedback.php">Feedback</a></li>
            <li><a href="view_users.php">Admin Users</a></li>
            <li><a href="view_feedback.php">Admin Feedback</a></li>
        </ul>
    </nav>

    <div class="form-container">
        <h2 style="text-align: center; margin-bottom: 20px; color: var(--primary, #10b981);">Parking User Registration</h2>
        
        <?php if(isset($_SESSION['success'])): ?>
            <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
        <?php endif; ?>
        <?php if(isset($_SESSION['error'])): ?>
            <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
        <?php endif; ?>

        <form id="registrationForm" action="process_registration.php" method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" id="reg_name" required>
                <div class="error-msg" id="err_name">Name is required.</div>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" id="reg_email" required>
                <div class="error-msg" id="err_email">Valid email is required.</div>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" id="reg_phone" required pattern="\d{10}">
                <div class="error-msg" id="err_phone">10-digit phone number is required.</div>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" id="reg_dob" required>
                <div class="error-msg" id="err_dob">Date of birth is required.</div>
            </div>
            <div class="form-group">
                <label>Gender</label>
                <div>
                    <input type="radio" name="gender" value="Male" required style="width: auto;"> Male
                    <input type="radio" name="gender" value="Female" required style="width: auto;"> Female
                    <input type="radio" name="gender" value="Other" required style="width: auto;"> Other
                </div>
                <div class="error-msg" id="err_gender">Gender is required.</div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <textarea name="address" id="reg_address" rows="3" required></textarea>
                <div class="error-msg" id="err_address">Address is required.</div>
            </div>
            <div class="form-group">
                <label>Vehicle Number</label>
                <input type="text" name="vehicle_number" id="reg_vehicle_number" required>
                <div class="error-msg" id="err_vehicle_number">Vehicle number is required.</div>
            </div>
            <div class="form-group">
                <label>Vehicle Type</label>
                <select name="vehicle_type" id="reg_vehicle_type" required>
                    <option value="">Select Type</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Other">Other</option>
                </select>
                <div class="error-msg" id="err_vehicle_type">Vehicle type is required.</div>
            </div>
            <div class="form-group">
                <label>Parking Preference</label>
                <select name="parking_preference" id="reg_parking_preference">
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Covered">Covered</option>
                    <option value="EV Charging">EV Charging</option>
                </select>
            </div>
            <div class="form-group">
                <label>Profile Picture</label>
                <input type="file" name="profile_pic" id="reg_profile_pic" accept="image/png, image/jpeg, image/jpg, image/webp" required>
                <div class="error-msg" id="err_profile_pic">Profile picture is required (JPG/PNG/WEBP).</div>
            </div>
            
            <button type="submit" class="btn-register" id="btn_register">Register</button>
            <button type="reset" class="btn-reset">Reset</button>
        </form>
    </div>

    <script src="script.js"></script>
</body>
</html>
