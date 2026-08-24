document.addEventListener('DOMContentLoaded', () => {

    // 1. Course Catalog Page
    let enrollCount = 0;
    const enrollCountDisplay = document.getElementById('enroll-count');
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        const enrollBtn = card.querySelector('.enroll-btn');
        const wishlistIcon = card.querySelector('.wishlist-icon');
        const preview = card.querySelector('.preview-overlay');

        enrollBtn.addEventListener('click', () => {
            enrollCount++;
            enrollCountDisplay.textContent = enrollCount;
        });

        card.addEventListener('mouseover', () => {
            preview.style.display = 'flex';
        });

        card.addEventListener('mouseout', () => {
            preview.style.display = 'none';
        });

        wishlistIcon.addEventListener('click', () => {
            wishlistIcon.textContent = wishlistIcon.textContent === '☆' ? '★' : '☆';
        });
    });

    // 2. Video Lecture Player
    const video = document.getElementById('lecture-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');

    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            video.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        video.volume = e.target.value;
    });

    video.addEventListener('timeupdate', () => {
        if(video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = percent + '%';
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / progressContainer.offsetWidth;
        video.currentTime = pos * video.duration;
    });

    // 3. Course Enrollment / Registration Form
    const regForm = document.getElementById('reg-form');
    const emailInput = document.getElementById('reg-email');
    const passInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm');

    regForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Event Handling requirement
        if (passInput.value !== confirmInput.value) {
            alert('Passwords do not match');
            return;
        }
        document.getElementById('reg-confirmation').textContent = 'Registration successful!';
        regForm.reset();
    });

    emailInput.addEventListener('blur', () => {
        const err = document.getElementById('email-error');
        if (!emailInput.value.includes('@') && emailInput.value !== '') {
            err.textContent = 'Invalid email format';
        } else {
            err.textContent = '';
        }
    });

    passInput.addEventListener('blur', () => {
        const err = document.getElementById('password-error');
        if (passInput.value.length > 0 && passInput.value.length < 6) {
            err.textContent = 'Password must be at least 6 characters';
        } else {
            err.textContent = '';
        }
    });

    confirmInput.addEventListener('input', () => {
        const err = document.getElementById('confirm-error');
        if (confirmInput.value !== passInput.value && confirmInput.value !== '') {
            err.textContent = 'Passwords do not match';
        } else {
            err.textContent = '';
        }
    });

    // 4. Quiz / Assessment Module
    const quizForm = document.getElementById('quiz-form');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const timerDisplay = document.getElementById('timer-display');
    const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
    
    let timerInterval;
    let timeLeft = 30;
    let answers = {};

    radioInputs.forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[e.target.name] = e.target.value;
        });
    });

    startQuizBtn.addEventListener('click', () => {
        startQuizBtn.disabled = true;
        submitQuizBtn.disabled = false;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                quizForm.dispatchEvent(new Event('submit', { cancelable: true })); // Programmatically submit
            }
        }, 1000);
    });

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearInterval(timerInterval);
        submitQuizBtn.disabled = true;
        radioInputs.forEach(r => r.disabled = true);
        
        let score = 0;
        if (answers['q1'] === 'stop') score++;
        if (answers['q2'] === 'pedestrian') score++;
        
        document.getElementById('quiz-score').textContent = `Your score: ${score}/2`;
    });

    // 5. Course Search & Filter Bar
    const searchBox = document.getElementById('search-box');
    const catFilter = document.getElementById('category-filter');
    const diffFilter = document.getElementById('difficulty-filter');
    
    function filterCourses() {
        const searchTerm = searchBox.value.toLowerCase();
        const cat = catFilter.value;
        const diff = diffFilter.value;
        
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const cardCat = card.dataset.category;
            const cardDiff = card.dataset.difficulty;
            
            const matchSearch = title.includes(searchTerm);
            const matchCat = (cat === 'all' || cat === cardCat);
            const matchDiff = (diff === 'all' || diff === cardDiff);
            
            if (matchSearch && matchCat && matchDiff) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchBox.addEventListener('input', filterCourses);
    catFilter.addEventListener('change', filterCourses);
    diffFilter.addEventListener('change', filterCourses);
    
    searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            filterCourses();
        }
    });

    // 6. Discussion / Comment Section
    const commentForm = document.getElementById('comment-form');
    const newCommentInput = document.getElementById('new-comment');
    const commentsContainer = document.getElementById('comments-container');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newCommentInput.value;
        if (!text) return;
        
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <p>${text}</p>
            <button class="reply-link">Reply</button>
            <div class="replies"></div>
        `;
        commentsContainer.appendChild(commentDiv);
        newCommentInput.value = '';
    });

    // Event delegation for replies and edits
    commentsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('reply-link')) {
            const replyBox = document.createElement('div');
            replyBox.className = 'reply-input-box';
            replyBox.innerHTML = `
                <input type="text" class="reply-text" placeholder="Type reply...">
                <button class="submit-reply">Post</button>
            `;
            e.target.parentElement.appendChild(replyBox);
            e.target.style.display = 'none';
        } else if (e.target.classList.contains('submit-reply')) {
            const replyText = e.target.previousElementSibling.value;
            if (replyText) {
                const repliesDiv = e.target.parentElement.parentElement.querySelector('.replies');
                const newReply = document.createElement('p');
                newReply.textContent = '> ' + replyText;
                repliesDiv.appendChild(newReply);
            }
            const replyLink = e.target.parentElement.parentElement.querySelector('.reply-link');
            replyLink.style.display = 'inline-block';
            e.target.parentElement.remove();
        }
    });

    commentsContainer.addEventListener('dblclick', (e) => {
        if (e.target.tagName === 'P') {
            const currentText = e.target.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            e.target.replaceWith(input);
            input.focus();
            
            input.addEventListener('blur', () => {
                const p = document.createElement('p');
                p.textContent = input.value;
                input.replaceWith(p);
            });
            input.addEventListener('keydown', (evt) => {
                if(evt.key === 'Enter') {
                    input.blur();
                }
            });
        }
    });

    // 7. Student Dashboard / Progress Tracker
    const dashCourse = document.getElementById('dash-course-1');
    const dashProgressBar = dashCourse.querySelector('.dash-progress-bar');
    const dashProgressContainer = dashCourse.querySelector('.dash-progress-container');
    const lectureList = dashCourse.querySelector('.lecture-list');
    const checkboxes = dashCourse.querySelectorAll('.lecture-checkbox');

    dashCourse.querySelector('h3').addEventListener('click', () => {
        lectureList.style.display = lectureList.style.display === 'none' ? 'block' : 'none';
    });

    dashProgressContainer.addEventListener('mouseover', (e) => {
        const percent = dashProgressBar.style.width;
        dashProgressContainer.title = percent;
    });

    function updateProgress() {
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(c => c.checked).length;
        const percent = (checked / total) * 100;
        dashProgressBar.style.width = percent + '%';
        dashProgressContainer.title = percent + '%';
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateProgress);
    });

});
