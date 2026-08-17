document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Switcher (Light/Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const setTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <span>Dark Mode</span>
            `;
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                <span>Light Mode</span>
            `;
        }
    };

    themeToggle.addEventListener('click', () => {
        const willBeDark = !body.classList.contains('dark-mode');
        localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
        setTheme(willBeDark);
    });

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme === 'dark');

    // 2. Dynamic Real-Time Clock
    const updateTime = () => {
        const now = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        document.getElementById('live-clock').innerText = now.toLocaleDateString('en-US', options);
    };
    setInterval(updateTime, 1000);
    updateTime();

    // 3. Interactive Parking Slot Booking Grid
    const slots = document.querySelectorAll('.parking-slot');
    const activeSlotsCount = document.getElementById('active-slots-val');
    const totalUsersVal = document.getElementById('total-users-val');
    const revenueVal = document.getElementById('revenue-val');
    const txVal = document.getElementById('tx-val');

    // Base state data
    let state = {
        totalUsers: 1420,
        activeSlots: Array.from(slots).filter(s => s.classList.contains('available')).length,
        revenue: 12.4,
        transactions: 4210
    };

    const updateStatsDisplay = () => {
        activeSlotsCount.innerText = state.activeSlots;
        totalUsersVal.innerText = state.totalUsers;
        revenueVal.innerText = `$${state.revenue.toFixed(1)}k`;
        txVal.innerText = state.transactions;
    };

    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            const isAvailable = slot.classList.contains('available');
            
            if (isAvailable) {
                slot.classList.remove('available');
                slot.classList.add('occupied');
                slot.querySelector('.slot-status').innerText = 'Occupied';
                state.activeSlots--;
                state.transactions++;
                state.revenue += 0.2;
                addNotification(`Slot ${slot.dataset.slot} booked successfully!`, 'success');
            } else {
                slot.classList.remove('occupied');
                slot.classList.add('available');
                slot.querySelector('.slot-status').innerText = 'Available';
                state.activeSlots++;
                addNotification(`Slot ${slot.dataset.slot} is now vacant.`, 'warning');
            }
            updateStatsDisplay();
            updateChart();
        });
    });

    // 4. Notifications Panel Toggle & Dispatcher
    const notifyBtn = document.getElementById('notify-btn');
    const notifyPanel = document.getElementById('notify-panel');
    const closeNotify = document.getElementById('close-notify');
    const notifyList = document.getElementById('notification-list');
    const notifyBadge = document.querySelector('.badge');

    let unreadCount = 2;

    notifyBtn.addEventListener('click', () => {
        notifyPanel.classList.toggle('active');
        unreadCount = 0;
        notifyBadge.style.display = 'none';
    });

    closeNotify.addEventListener('click', () => {
        notifyPanel.classList.remove('active');
    });

    const addNotification = (text, type = 'success') => {
        const item = document.createElement('div');
        item.className = `notification-item ${type}`;
        
        let svgIcon = '';
        if (type === 'success') {
            svgIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'warning') {
            svgIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else {
            svgIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        item.innerHTML = `
            <div class="notify-icon-badge">
                ${svgIcon}
            </div>
            <div class="notify-details">
                <span class="notify-time">${new Date().toLocaleTimeString()}</span>
                <p>${text}</p>
            </div>
        `;

        // Click to open details functionality
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            alert(`Notification Details:\n\n${text}\n\nTimestamp: ${new Date().toLocaleTimeString()}`);
        });

        notifyList.insertBefore(item, notifyList.firstChild);
        
        unreadCount++;
        notifyBadge.innerText = unreadCount;
        notifyBadge.style.display = 'inline-block';
        
        // Remove oldest if there are too many
        if (notifyList.children.length > 5) {
            notifyList.removeChild(notifyList.lastChild);
        }
    };

    // 5. Dynamic SVG Analytics Chart
    const svgPath = document.getElementById('chart-path');
    let chartData = [30, 45, 35, 60, 50, 70, 85]; // Initial occupancy rate percentage

    const updateChart = () => {
        const width = 500;
        const height = 150;
        const padding = 10;
        
        // Add random slight variation or base on slot count
        const currentPercentage = Math.round(( (slots.length - state.activeSlots) / slots.length ) * 100);
        chartData.push(currentPercentage);
        if (chartData.length > 8) chartData.shift();

        const step = (width - padding * 2) / (chartData.length - 1);
        let pathString = `M ${padding} ${height - (chartData[0] / 100) * (height - padding * 2)}`;

        for (let i = 1; i < chartData.length; i++) {
            const x = padding + i * step;
            const y = height - (chartData[i] / 100) * (height - padding * 2);
            pathString += ` L ${x} ${y}`;
        }

        svgPath.setAttribute('d', pathString);
    };
    updateChart();

    // 6. Carousel Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    let activeSlide = 0;

    const changeSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        activeSlide = index;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeSlide(index));
    });

    setInterval(() => {
        const next = (activeSlide + 1) % slides.length;
        changeSlide(next);
    }, 6000);

    // 7. Scroll to Top
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 8. Form Validation
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let valid = true;

        const name = document.getElementById('name');
        const email = document.getElementById('email');

        if (name.value.trim().length < 3) {
            setError(name, 'Name must be at least 3 characters');
            valid = false;
        } else {
            clearError(name);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            setError(email, 'Please enter a valid email');
            valid = false;
        } else {
            clearError(email);
        }

        if (valid) {
            addNotification(`Successfully registered user: ${name.value}`, 'info');
            alert('Registration completed successfully!');
            form.reset();
        }
    });

    const setError = (input, msg) => {
        const group = input.closest('.form-group');
        group.classList.add('error');
        let errorSpan = group.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            group.appendChild(errorSpan);
        }
        errorSpan.innerText = msg;
    };

    const clearError = (input) => {
        const group = input.closest('.form-group');
        group.classList.remove('error');
        const errorSpan = group.querySelector('.error-message');
        if (errorSpan) errorSpan.remove();
    };

    // Active Navigation Highlight
    const menuLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let currentSec = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            if (scrollY >= top) {
                currentSec = sec.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSec}`) {
                link.classList.add('active');
            }
        });
    });

    // 9. Interactive Service Modals ("Click Button Going Inside")
    const modal = document.getElementById('service-modal');
    const modalContent = document.getElementById('modal-body-content');
    const closeModal = document.getElementById('close-modal');
    const serviceButtons = document.querySelectorAll('.service-action-btn');

    const serviceSimulations = {
        vip: {
            title: "Premium VIP Spaces Portal",
            desc: "Secure high-priority, extra-wide bays closest to the building entry points.",
            html: `
                <div class="modal-sim-box">
                    <h3>VIP Parking Gateway</h3>
                    <p>Enter your details below to bypass standard queue validation and claim a VIP bay.</p>
                    <div class="modal-sim-interactive">
                        <div class="modal-input-group">
                            <label>License Plate</label>
                            <input type="text" id="vip-plate" placeholder="e.g. TX-99-VIP" style="text-transform: uppercase;">
                        </div>
                        <div class="modal-input-group">
                            <label>Lobby Access Preference</label>
                            <select id="vip-lobby">
                                <option value="North Entrance">North Tower Lobby</option>
                                <option value="South Entrance">South Tower Lobby</option>
                                <option value="Executive Suites">Executive Lift Portal</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" id="submit-vip-booking" style="width: 100%;">Confirm Priority Space</button>
                    </div>
                </div>
            `,
            init: () => {
                document.getElementById('submit-vip-booking').addEventListener('click', () => {
                    const plate = document.getElementById('vip-plate').value.trim();
                    const lobby = document.getElementById('vip-lobby').value;
                    if (!plate) {
                        alert("Please enter your vehicle license plate.");
                        return;
                    }
                    addNotification(`VIP Space Reserved for vehicle [${plate.toUpperCase()}] near ${lobby}.`, 'success');
                    alert(`VIP Space Confirmed!\nVehicle: ${plate.toUpperCase()}\nAccess Point: ${lobby}`);
                    modal.classList.remove('active');
                });
            }
        },
        ev: {
            title: "EV Supercharger Controller",
            desc: "Manage high-voltage charging units directly from your mobile console.",
            html: `
                <div class="modal-sim-box">
                    <h3>Supercharged EV System</h3>
                    <p>Connect your vehicle's charge port to initiate fast charging in Zone E.</p>
                    <div class="modal-sim-interactive">
                        <div class="modal-input-group">
                            <label>Select Station Port</label>
                            <select id="ev-port">
                                <option value="Port E-01 (150kW)">Port E-01 (150kW Ultra Fast)</option>
                                <option value="Port E-02 (150kW)">Port E-02 (150kW Ultra Fast)</option>
                                <option value="Port E-03 (50kW)">Port E-03 (50kW Standard Fast)</option>
                            </select>
                        </div>
                        <div class="modal-input-group">
                            <label>Target Charge Level (%)</label>
                            <input type="range" id="ev-target" min="50" max="100" value="80" style="accent-color: var(--primary);">
                            <span style="text-align: center; font-weight: 700; margin-top: 5px;" id="range-val">80%</span>
                        </div>
                        <button class="btn btn-primary" id="initiate-ev-charge" style="width: 100%;">Initiate Charge Hook</button>
                    </div>
                </div>
            `,
            init: () => {
                const range = document.getElementById('ev-target');
                const rangeVal = document.getElementById('range-val');
                range.addEventListener('input', () => {
                    rangeVal.innerText = `${range.value}%`;
                });

                document.getElementById('initiate-ev-charge').addEventListener('click', () => {
                    const port = document.getElementById('ev-port').value;
                    addNotification(`EV Fast Charge Hook initiated on ${port} up to ${range.value}%.`, 'info');
                    alert(`Charging session successfully queued on ${port}!\nTarget limit set to ${range.value}%.`);
                    modal.classList.remove('active');
                });
            }
        },
        fleet: {
            title: "Corporate Fleet Booking Portal",
            desc: "Allocate batches of slots dynamically under corporate accounts.",
            html: `
                <div class="modal-sim-box">
                    <h3>Corporate Allocation System</h3>
                    <p>Input corporate identification keys to reserve block slots for company events.</p>
                    <div class="modal-sim-interactive">
                        <div class="modal-input-group">
                            <label>Corporate Account Code</label>
                            <input type="text" id="corp-code" placeholder="e.g. CORP-ALPHATECH-2026">
                        </div>
                        <div class="modal-input-group">
                            <label>Required Slot Batch Size</label>
                            <input type="number" id="corp-batch" min="2" max="15" value="5">
                        </div>
                        <button class="btn btn-primary" id="confirm-corp-booking" style="width: 100%;">Reserve Batch Blocks</button>
                    </div>
                </div>
            `,
            init: () => {
                document.getElementById('confirm-corp-booking').addEventListener('click', () => {
                    const code = document.getElementById('corp-code').value.trim();
                    const batch = document.getElementById('corp-batch').value;
                    if (!code) {
                        alert("A valid corporate identification code is required.");
                        return;
                    }
                    addNotification(`Corporate Account [${code.toUpperCase()}] reserved ${batch} slots in Zone D.`, 'success');
                    alert(`Corporate block allocation successful!\nReserved ${batch} spaces in Zone D under ${code.toUpperCase()}.`);
                    modal.classList.remove('active');
                });
            }
        },
        valet: {
            title: "Valet Dispatch Console",
            desc: "Initiate smart autonomous fetching for parked vehicles.",
            html: `
                <div class="modal-sim-box">
                    <h3>Autonomous Valet Fetch</h3>
                    <p>Request vehicle dispatching to your chosen pick-up lobby.</p>
                    <div class="modal-sim-interactive">
                        <div class="modal-input-group">
                            <label>Your Vehicle Registration ID</label>
                            <input type="text" id="valet-reg" placeholder="e.g. KA-03-MR-1234">
                        </div>
                        <div class="modal-input-group">
                            <label>Pickup Destination Lobby</label>
                            <select id="valet-lobby">
                                <option value="Main Central Port">Main Central Lobby</option>
                                <option value="VIP South Gate">VIP South Gate Lobby</option>
                                <option value="Skybridge Entrance">3rd Floor Skybridge Port</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" id="request-valet-fetch" style="width: 100%;">Dispatch Valet Team</button>
                    </div>
                </div>
            `,
            init: () => {
                document.getElementById('request-valet-fetch').addEventListener('click', () => {
                    const reg = document.getElementById('valet-reg').value.trim();
                    const lobby = document.getElementById('valet-lobby').value;
                    if (!reg) {
                        alert("Please specify your vehicle registration number.");
                        return;
                    }
                    addNotification(`Valet dispatch request submitted for vehicle [${reg.toUpperCase()}].`, 'warning');
                    alert(`Valet Dispatch Requested!\nVehicle ${reg.toUpperCase()} will be delivered to the ${lobby} shortly.`);
                    modal.classList.remove('active');
                });
            }
        }
    };

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            const serviceKey = card.dataset.service;
            const sim = serviceSimulations[serviceKey];
            
            if (sim) {
                modalContent.innerHTML = sim.html;
                modal.classList.add('active');
                sim.init();
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on overlay backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // ==========================================
    // ASSIGNMENT 4: Drag and Drop Implementation
    // ==========================================
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.dataTransfer.effectAllowed = 'move';
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // allow dropping
            e.dataTransfer.dropEffect = 'move';
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const id = e.dataTransfer.getData('text/plain');
            const draggableElement = document.getElementById(id);
            
            if (draggableElement) {
                // Clear existing content in the zone
                zone.innerHTML = '';
                zone.appendChild(draggableElement);
                
                // Remove any previous filled classes
                zone.classList.remove('filled', 'filled-vip', 'filled-std', 'filled-ev');
                zone.classList.add('filled');
                
                // Add specific styling based on permit type
                if (id === 'permit-vip') {
                    zone.classList.add('filled-vip');
                } else if (id === 'permit-std') {
                    zone.classList.add('filled-std');
                } else if (id === 'permit-ev') {
                    zone.classList.add('filled-ev');
                }
                
                const slotName = zone.getAttribute('data-slot');
                addNotification(`Successfully assigned ${draggableElement.innerText.trim()} to Slot ${slotName}!`, 'success');
            }
        });
    });

    // ==========================================
    // ASSIGNMENT 4: Web Storage Implementation (Enhanced)
    // ==========================================
    const btnSave = document.getElementById('btn-save');
    const btnRetrieve = document.getElementById('btn-retrieve');
    const btnUpdate = document.getElementById('btn-update');
    const btnClear = document.getElementById('btn-clear');
    
    const inpDriver = document.getElementById('driver-name');
    const inpVehicle = document.getElementById('vehicle-number');
    const inpZone = document.getElementById('preferred-zone');
    const inpSlot = document.getElementById('current-slot');
    const inpSession = document.getElementById('session-id');
    
    const displayCard = document.getElementById('data-display-card');
    
    const saveToStorage = (isUpdate = false) => {
        // Local Storage
        if(inpDriver.value) localStorage.setItem('driverName', inpDriver.value);
        if(inpVehicle.value) localStorage.setItem('vehicleNum', inpVehicle.value);
        if(inpZone.value) localStorage.setItem('prefZone', inpZone.value);
        
        // Session Storage
        if(inpSlot.value) sessionStorage.setItem('currSlot', inpSlot.value);
        if(inpSession.value) sessionStorage.setItem('sessionID', inpSession.value);
        
        if (isUpdate) {
            addNotification("User data updated in Web Storage.", "info");
        } else {
            addNotification("User data saved successfully!", "success");
            // Clear inputs after save
            inpDriver.value = ''; inpVehicle.value = ''; inpSlot.value = ''; inpSession.value = '';
        }
    };

    btnSave.addEventListener('click', () => saveToStorage(false));
    btnUpdate.addEventListener('click', () => saveToStorage(true));

    btnRetrieve.addEventListener('click', () => {
        document.getElementById('display-driver').innerText = localStorage.getItem('driverName') || 'N/A';
        document.getElementById('display-vehicle').innerText = localStorage.getItem('vehicleNum') || 'N/A';
        document.getElementById('display-zone').innerText = localStorage.getItem('prefZone') || 'N/A';
        
        document.getElementById('display-slot').innerText = sessionStorage.getItem('currSlot') || 'N/A';
        document.getElementById('display-session').innerText = sessionStorage.getItem('sessionID') || 'N/A';
        
        displayCard.style.display = 'block';
    });

    btnClear.addEventListener('click', () => {
        if(confirm("Are you sure you want to clear all stored data?")) {
            localStorage.clear();
            sessionStorage.clear();
            
            displayCard.style.display = 'none';
            addNotification("All Web Storage data cleared.", "warning");
        }
    });

    // ==========================================
    // ADVANCED FEATURES: Fee Calculator & QR Code
    // ==========================================
    const vehicleTypeSelect = document.getElementById('vehicle-type');
    const parkingDurationInput = document.getElementById('parking-duration');
    const durationValText = document.getElementById('duration-val');
    const calculatedFeeText = document.getElementById('calculated-fee');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const qrContainer = document.getElementById('qrcode-container');

    const rates = {
        car: 5,
        ev: 3,
        bike: 2
    };

    const updateFee = () => {
        const type = vehicleTypeSelect.value;
        const hours = parseInt(parkingDurationInput.value);
        durationValText.innerText = hours;
        
        let total = rates[type] * hours;
        
        // Optional: Discount for long stays (e.g. over 8 hours gets 10% off)
        if (hours >= 8) {
            total = total * 0.9;
        }

        calculatedFeeText.innerText = `$${total.toFixed(2)}`;
    };

    vehicleTypeSelect.addEventListener('change', updateFee);
    parkingDurationInput.addEventListener('input', updateFee);
    updateFee(); // Initialize on load

    generateQrBtn.addEventListener('click', () => {
        // Clear previous QR code if it exists
        qrContainer.innerHTML = '';
        
        const type = vehicleTypeSelect.value.toUpperCase();
        const hours = parkingDurationInput.value;
        const total = calculatedFeeText.innerText;
        const ticketID = 'TK-' + Math.floor(Math.random() * 90000 + 10000);
        
        // Data payload to encode in the QR code
        const qrData = `SmartParking Pass\nID: ${ticketID}\nVehicle: ${type}\nDuration: ${hours} hrs\nTotal: ${total}`;
        
        // Generate new QR code
        new QRCode(qrContainer, {
            text: qrData,
            width: 150,
            height: 150,
            colorDark : "#0f172a",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        
        // Display it
        qrContainer.style.display = 'block';
        addNotification(`QR Ticket ${ticketID} generated successfully!`, 'success');
    });

    // Automated Image Slider Logic (Assignment 4 Addition)
    const sliderTrack = document.getElementById('slider-track');
    let slideIndex = 0;
    let autoSlideInterval;

    if (sliderTrack) {
        const slideCount = document.querySelectorAll('.gallery-slide').length;
        
        function goToSlide(index) {
            slideIndex = index;
            if (slideIndex >= slideCount) slideIndex = 0;
            if (slideIndex < 0) slideIndex = slideCount - 1;
            sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
        }

        function autoSlide() {
            goToSlide(slideIndex + 1);
        }
        
        autoSlideInterval = setInterval(autoSlide, 3000);

        // Manual Navigation Logic
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(autoSlideInterval); // Stop auto when clicked manually
                goToSlide(slideIndex - 1);
                autoSlideInterval = setInterval(autoSlide, 3000); // Restart auto
            });
            nextBtn.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                goToSlide(slideIndex + 1);
                autoSlideInterval = setInterval(autoSlide, 3000);
            });
        }
    }

    // Logout Functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to log out of the Smart Parking System?")) {
                alert("You have been successfully logged out.");
                // Simulate logout by resetting the page
                window.scrollTo(0, 0);
                location.reload();
            }
        });
    }
    // Dynamic Javascript Typing Effect
    const typingTextElement = document.getElementById('dynamic-typing-text');
    if (typingTextElement) {
        const typingWords = ["Smart Parking for Smart Cities", "Efficiently Navigating Urban Spaces", "Secure & Real-Time Tracking"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = typingWords[wordIndex];
            if (isDeleting) {
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % typingWords.length;
                typeSpeed = 500; // Pause before next word
            }
            setTimeout(typeEffect, typeSpeed);
        }
        typeEffect();
    }

    // Dynamic Stats Rotation Logic
    const statsCards = document.querySelectorAll('.stat-card');
    const dUserVal = document.getElementById('total-users-val');
    const dRevenueVal = document.getElementById('revenue-val');
    const dTxVal = document.getElementById('tx-val');

    if (dUserVal && dRevenueVal && dTxVal && statsCards.length > 0) {
        setInterval(() => {
            // Randomly update numbers to simulate live dynamic rotation
            let users = parseInt(dUserVal.textContent.replace(/,/g, ''));
            let tx = parseInt(dTxVal.textContent.replace(/,/g, ''));
            
            users += Math.floor(Math.random() * 3);
            tx += Math.floor(Math.random() * 5);
            
            dUserVal.textContent = users.toString();
            dTxVal.textContent = tx.toString();
            dRevenueVal.textContent = '$' + (12.4 + (Math.random() * 0.1)).toFixed(2) + 'k';

            // Add rotation flip animation class to a random card
            const randomCard = statsCards[Math.floor(Math.random() * statsCards.length)];
            randomCard.classList.remove('stat-rotate');
            void randomCard.offsetWidth; // Trigger reflow
            randomCard.classList.add('stat-rotate');

        }, 4000); // Rotate every 4 seconds
    }
    // ==========================================
    // MODULES 1-7: JAVASCRIPT EVENT HANDLING ASSIGNMENT
    // ==========================================

    // --- Module 1 & 5: Slot Catalog & Filter Bar ---
    const searchSlot = document.getElementById('search-slot');
    const filterZone = document.getElementById('filter-zone');
    const filterVehicle = document.getElementById('filter-vehicle');
    const filterStatus = document.getElementById('filter-status');
    const catalogSlots = document.querySelectorAll('.catalog-slot');

    function filterSlots() {
        const query = searchSlot.value.toLowerCase();
        const zone = filterZone.value;
        const vehicle = filterVehicle.value;
        const status = filterStatus.value;

        catalogSlots.forEach(slot => {
            const slotId = slot.getAttribute('data-id').toLowerCase();
            const slotZone = slot.getAttribute('data-zone');
            const slotVehicle = slot.getAttribute('data-vehicle');
            const slotStatus = slot.getAttribute('data-status');

            const matchQuery = slotId.includes(query);
            const matchZone = (zone === 'all' || slotZone === zone);
            const matchVehicle = (vehicle === 'all' || slotVehicle === vehicle);
            const matchStatus = (status === 'all' || slotStatus === status);

            if (matchQuery && matchZone && matchVehicle && matchStatus) {
                slot.style.display = 'block';
            } else {
                slot.style.display = 'none';
            }
        });
    }

    // Module 5 Events: input, change, keydown
    if(searchSlot) {
        searchSlot.addEventListener('input', filterSlots);
        searchSlot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterSlots();
            }
        });
        filterZone.addEventListener('change', filterSlots);
        filterVehicle.addEventListener('change', filterSlots);
        filterStatus.addEventListener('change', filterSlots);
    }

    // Module 1 Events: mouseover, mouseout, click
    catalogSlots.forEach(slot => {
        // Mouseover/Mouseout - Preview overlay
        slot.addEventListener('mouseover', () => {
            slot.classList.add('show-preview');
        });
        slot.addEventListener('mouseout', () => {
            slot.classList.remove('show-preview');
        });

        // Click - Favorite Toggle
        const favIcon = slot.querySelector('.fav-icon');
        if (favIcon) {
            favIcon.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent triggering park
                if (favIcon.classList.contains('fa-regular')) {
                    favIcon.classList.remove('fa-regular');
                    favIcon.classList.add('fa-solid', 'filled');
                } else {
                    favIcon.classList.add('fa-regular');
                    favIcon.classList.remove('fa-solid', 'filled');
                }
            });
        }

        // Click - Park Vehicle
        const parkBtn = slot.querySelector('.park-btn');
        if (parkBtn) {
            parkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (slot.classList.contains('available')) {
                    slot.classList.remove('available');
                    slot.classList.add('occupied');
                    slot.setAttribute('data-status', 'Occupied');
                    slot.querySelector('.slot-status').textContent = 'Occupied';
                    parkBtn.textContent = 'Parked';
                    parkBtn.disabled = true;
                    
                    if (typeof addNotification === 'function') {
                        addNotification(`Slot ${slot.getAttribute('data-id')} is now booked and occupied.`, 'success');
                    } else {
                        alert(`Slot ${slot.getAttribute('data-id')} is now booked and occupied.`);
                    }

                    // Update vacant slots if element exists
                    const activeSlotsCount = document.getElementById('active-slots-val');
                    if (activeSlotsCount) {
                        let currentVacant = parseInt(activeSlotsCount.innerText);
                        if (!isNaN(currentVacant) && currentVacant > 0) {
                            activeSlotsCount.innerText = currentVacant - 1;
                        }
                    }
                }
            });
        }
    });

    // --- Module 2: Session Timer ---
    const sessionCard = document.getElementById('active-session-card');
    const btnToggleSession = document.getElementById('btn-toggle-session');
    const sessDuration = document.getElementById('sess-duration');
    const sessFee = document.getElementById('sess-fee');
    const reminderSlider = document.getElementById('reminder-slider');
    const reminderVal = document.getElementById('reminder-val');
    const sessProgressBar = document.getElementById('sess-progress-bar');
    const sessProgressBg = document.getElementById('sess-progress-bg');
    
    let sessionInterval = null;
    let secondsElapsed = 0;
    
    if (sessionCard && btnToggleSession) {
        sessionCard.style.display = 'block'; // Show it for demo
        
        // Input Event for Range Slider
        reminderSlider.addEventListener('input', (e) => {
            reminderVal.textContent = e.target.value;
        });

        // Click Event for Timer Start/Pause
        btnToggleSession.addEventListener('click', () => {
            if (sessionInterval) {
                // Pause
                clearInterval(sessionInterval);
                sessionInterval = null;
                btnToggleSession.textContent = 'Resume Session';
            } else {
                // Start
                btnToggleSession.textContent = 'Pause Session';
                sessionInterval = setInterval(() => {
                    secondsElapsed++;
                    
                    // Format time
                    const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
                    const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
                    const secs = String(secondsElapsed % 60).padStart(2, '0');
                    sessDuration.textContent = `${hrs}:${mins}:${secs}`;
                    
                    // Update fee ($0.05 per second for demo speed)
                    sessFee.textContent = (secondsElapsed * 0.05).toFixed(2);
                    
                    // Update progress (simulating 1 hour max for visual)
                    const progressPct = Math.min((secondsElapsed / 60) * 100, 100);
                    sessProgressBar.style.width = progressPct + '%';

                    // Notification Logic
                    const reminderSecs = parseInt(reminderSlider.value);
                    if (secondsElapsed > 0 && secondsElapsed % reminderSecs === 0) {
                        if (typeof addNotification === 'function') {
                            addNotification(`Parking session has reached ${secondsElapsed} seconds!`, 'warning');
                        }
                        sessDuration.style.color = 'var(--danger)';
                        setTimeout(() => sessDuration.style.color = 'var(--text-primary)', 2000);
                    }
                }, 1000);
            }
        });

        // Click Event on Progress Bar
        if (sessProgressBg) {
            sessProgressBg.addEventListener('click', (e) => {
                // Calculate percentage clicked
                const rect = sessProgressBg.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                
                // Set seconds elapsed based on percentage (assuming 60s max for demo)
                secondsElapsed = Math.floor((percentage / 100) * 60);
                
                // Update visuals immediately
                sessProgressBar.style.width = percentage + '%';
                const hrs = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
                const mins = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
                const secs = String(secondsElapsed % 60).padStart(2, '0');
                sessDuration.textContent = `${hrs}:${mins}:${secs}`;
                sessFee.textContent = (secondsElapsed * 0.05).toFixed(2);
                if (typeof addNotification === 'function') {
                    addNotification(`Session manually adjusted to ${secondsElapsed}s`, 'info');
                }
            });
        }
    }

    // --- Module 3: Registration Form (blur, input, preventDefault) ---
    const regForm = document.getElementById('registration-form');
    const regPassword = document.getElementById('reg-password');
    const confirmPassword = document.getElementById('confirm-password');
    const errCpwd = document.getElementById('err-cpwd');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const btnCancelReg = document.getElementById('btn-cancel-reg');

    if (regForm) {
        // Submit event with preventDefault
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (regPassword.value !== confirmPassword.value) {
                alert("Passwords do not match. Please fix errors before submitting.");
                return;
            }
            alert("Booking Registration Successful!");
            regForm.reset();
            errCpwd.style.display = 'none';
        });
        
        // Cancel btn click
        if(btnCancelReg) {
            btnCancelReg.addEventListener('click', () => {
                if(confirm('Cancel registration?')) regForm.reset();
            });
        }

        // Blur event for validation (Phone)
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value.length > 0 && phoneInput.value.length < 10) {
                phoneInput.style.borderColor = 'var(--danger)';
                if (typeof addNotification === 'function') {
                    addNotification('Invalid Phone Number. Must be at least 10 digits.', 'warning');
                }
            } else {
                phoneInput.style.borderColor = 'var(--border-color)';
            }
        });

        // Blur event for validation (Email)
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput.value.length > 0 && !emailRegex.test(emailInput.value)) {
                    emailInput.style.borderColor = 'var(--danger)';
                    if (typeof addNotification === 'function') {
                        addNotification('Invalid Email Format.', 'warning');
                    }
                } else {
                    emailInput.style.borderColor = 'var(--border-color)';
                }
            });
        }

        // Input event for live password matching
        confirmPassword.addEventListener('input', () => {
            if (confirmPassword.value === '') {
                errCpwd.style.display = 'none';
            } else if (confirmPassword.value !== regPassword.value) {
                errCpwd.textContent = 'Passwords do not match!';
                errCpwd.style.display = 'block';
                errCpwd.style.color = 'var(--danger)';
            } else {
                errCpwd.textContent = 'Passwords match!';
                errCpwd.style.display = 'block';
                errCpwd.style.color = '#10b981'; // Green
            }
        });
    }

    // --- Module 4: Parking Preference (change, setInterval timer) ---
    const quizRadios = document.querySelectorAll('.quiz-question input[type="radio"]');
    const btnConfirmPref = document.getElementById('btn-confirm-pref');
    const quizResult = document.getElementById('quiz-result');
    const recSlot = document.getElementById('rec-slot');
    const resTimerDisplay = document.getElementById('reservation-timer');
    const btnStartRes = document.getElementById('btn-start-res');

    let prefData = { duration: '', vehicle: '' };

    if (quizRadios.length > 0) {
        // Change Event for Radios
        quizRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if(e.target.name === 'q1') prefData.duration = e.target.value;
                if(e.target.name === 'q2') prefData.vehicle = e.target.value;
            });
        });

        btnConfirmPref.addEventListener('click', () => {
            if (!prefData.duration || !prefData.vehicle) {
                alert("Please answer all questions.");
                return;
            }
            // Simple logic
            if (prefData.vehicle === 'EV') recSlot.textContent = "Zone B - EV Station";
            else if (prefData.duration === 'Full Day') recSlot.textContent = "Premium Covered";
            else recSlot.textContent = "Zone A - Standard";
            
            quizResult.style.display = 'block';
        });

        let resInterval;
        btnStartRes.addEventListener('click', () => {
            btnStartRes.disabled = true;
            let timeLeft = 60;
            resTimerDisplay.textContent = timeLeft + "s";
            
            resInterval = setInterval(() => {
                timeLeft--;
                resTimerDisplay.textContent = timeLeft + "s";
                if (timeLeft <= 0) {
                    clearInterval(resInterval);
                    alert("Reservation time expired!");
                    quizResult.style.display = 'none';
                    btnStartRes.disabled = false;
                }
            }, 1000);
        });
    }

    // --- Module 6: Feedback (Event Delegation, dblclick) ---
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackInput = document.getElementById('feedback-input');
    const commentsContainer = document.getElementById('comments-container');

    if (feedbackForm && commentsContainer) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = feedbackInput.value.trim();
            if (!text) return;
            
            // Create comment card dynamically
            const card = document.createElement('div');
            card.className = 'comment-card';
            card.style.cssText = 'padding: 1rem; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--primary);">You</strong>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Just now</span>
                </div>
                <p class="comment-text" style="margin-bottom: 0.8rem; line-height: 1.4; cursor: pointer;" title="Double click to edit">${text}</p>
                <button class="reply-btn btn" style="font-size: 0.8rem; padding: 0.3rem 0.8rem; background: transparent; border: 1px solid var(--text-secondary); color: var(--text-secondary);">Reply</button>
            `;
            commentsContainer.prepend(card);
            feedbackForm.reset();
        });

        // Event Delegation for dynamically created elements
        commentsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('reply-btn')) {
                const parentCard = e.target.closest('.comment-card');
                
                // Avoid multiple reply boxes
                if(parentCard.querySelector('.reply-input-container')) return;

                const replyBox = document.createElement('div');
                replyBox.className = 'reply-input-container';
                replyBox.innerHTML = `
                    <textarea placeholder="Write a reply..."></textarea>
                    <button class="btn btn-primary submit-reply-btn" style="padding: 0.3rem 1rem; font-size: 0.85rem;">Post Reply</button>
                `;
                parentCard.appendChild(replyBox);
            }
            
            if (e.target.classList.contains('submit-reply-btn')) {
                const replyContainer = e.target.closest('.reply-input-container');
                const text = replyContainer.querySelector('textarea').value;
                if(text) {
                    replyContainer.innerHTML = `<p style="margin-top:0.5rem; font-size:0.9rem; color:var(--text-secondary);"><strong>Reply:</strong> ${text}</p>`;
                }
            }
        });

        // Dblclick to Edit Comment
        commentsContainer.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('comment-text')) {
                const currentText = e.target.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.style.cssText = 'width: 100%; padding: 0.5rem; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--primary); margin-bottom: 0.8rem;';
                
                e.target.replaceWith(input);
                input.focus();
                
                input.addEventListener('blur', () => {
                    const newP = document.createElement('p');
                    newP.className = 'comment-text';
                    newP.style.cssText = 'margin-bottom: 0.8rem; line-height: 1.4; cursor: pointer;';
                    newP.title = "Double click to edit";
                    newP.textContent = input.value;
                    input.replaceWith(newP);
                });
                input.addEventListener('keydown', (evt) => {
                    if (evt.key === 'Enter') input.blur();
                });
            }
        });
    }

    // --- Module 7: Dashboard Tracker ---
    const trackerHeader = document.getElementById('tracker-header');
    const trackerDetails = document.getElementById('tracker-details');
    const trackerChevron = document.getElementById('tracker-chevron');
    const trackerProgressBg = document.getElementById('tracker-progress-bg');
    const trackerTooltip = document.getElementById('tracker-tooltip');
    const trackerCompleteCheck = document.getElementById('tracker-complete-check');
    const trackerProgressFill = document.getElementById('tracker-progress-fill');

    if (trackerHeader) {
        // Click to expand
        trackerHeader.addEventListener('click', () => {
            if (trackerDetails.style.display === 'none') {
                trackerDetails.style.display = 'block';
                trackerChevron.style.transform = 'rotate(180deg)';
                // Set entry time to now on first open
                if(document.getElementById('tracker-entry').textContent === '--:--:--') {
                    document.getElementById('tracker-entry').textContent = new Date().toLocaleTimeString();
                }
            } else {
                trackerDetails.style.display = 'none';
                trackerChevron.style.transform = 'rotate(0deg)';
            }
        });

        // Mouseover for Tooltip
        trackerProgressBg.addEventListener('mouseover', () => {
            trackerTooltip.style.display = 'block';
        });
        trackerProgressBg.addEventListener('mouseout', () => {
            trackerTooltip.style.display = 'none';
        });

        // Change checkbox
        trackerCompleteCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                trackerProgressFill.style.width = '100%';
                trackerTooltip.textContent = '100% Complete';
                document.getElementById('tracker-slot').textContent += ' (Complete)';
            } else {
                trackerProgressFill.style.width = '45%';
                trackerTooltip.textContent = '45% Complete';
                document.getElementById('tracker-slot').textContent = 'A-1';
            }
        });
    }
});
