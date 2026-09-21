<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit Feedback - Smart Parking System</title>
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
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;
        }
        .form-group input.error, .form-group textarea.error { border-color: red; }
        .error-msg { color: red; font-size: 12px; display: none; margin-top: 5px; }
        .btn-submit {
            background-color: var(--primary, #10b981); color: white; padding: 10px 20px;
            border: none; border-radius: 5px; cursor: pointer; font-size: 16px; width: 100%;
        }
        .btn-submit:hover { opacity: 0.9; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 5px; }
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
            <li><a href="registration.php">Register Vehicle</a></li>
            <li><a href="feedback.php" class="active">Feedback</a></li>
            <li><a href="view_users.php">Admin Users</a></li>
            <li><a href="view_feedback.php">Admin Feedback</a></li>
        </ul>
    </nav>

    <div class="form-container">
        <h2 style="text-align: center; margin-bottom: 20px; color: var(--primary, #10b981);">Parking Experience Feedback</h2>
        
        <?php if(isset($_SESSION['success'])): ?>
            <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
        <?php endif; ?>
        <?php if(isset($_SESSION['error'])): ?>
            <div class="alert alert-danger"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
        <?php endif; ?>

        <form id="feedbackForm" action="process_feedback.php" method="POST">
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="user_email" id="fb_email" required>
                <div class="error-msg" id="err_fb_email">Valid email is required.</div>
            </div>
            <div class="form-group">
                <label>Vehicle Number</label>
                <input type="text" name="vehicle_number" id="fb_vehicle" required>
                <div class="error-msg" id="err_fb_vehicle">Vehicle number is required.</div>
            </div>
            <div class="form-group">
                <label>Parking Experience Rating</label>
                <select name="rating" id="fb_rating" required>
                    <option value="5">5 — Excellent</option>
                    <option value="4">4 — Very Good</option>
                    <option value="3">3 — Good</option>
                    <option value="2">2 — Average</option>
                    <option value="1">1 — Poor</option>
                </select>
            </div>
            <div class="form-group">
                <label>Feedback/Comments</label>
                <textarea name="comments" id="fb_comments" rows="4" required></textarea>
                <div class="error-msg" id="err_fb_comments">Comments cannot be empty.</div>
            </div>
            
            <button type="submit" class="btn-submit" id="btn_feedback">Submit Feedback</button>
        </form>
    </div>

    <script src="script.js"></script>
</body>
</html>
