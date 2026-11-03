
/* ========================================
   1. AUTOMATIC COPYRIGHT YEAR
======================================== */

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ========================================
   2. PROJECT PRESENTATION CAROUSEL
======================================== */

document.querySelectorAll("[data-carousel]").forEach((carousel) => {

    // Find the slides belonging to this carousel

    const slides = Array.from(
        carousel.querySelectorAll(".carousel-slide")
    );

    // Find the carousel controls

    const previousButton = carousel.querySelector(
        "[data-carousel-prev]"
    );

    const nextButton = carousel.querySelector(
        "[data-carousel-next]"
    );

    const toggleButton = carousel.querySelector(
        "[data-carousel-toggle]"
    );

    const dotsContainer = carousel.querySelector(
        "[data-carousel-dots]"
    );

    const counter = carousel.querySelector(
        "[data-carousel-counter]"
    );

    const progressBar = carousel.querySelector(
        "[data-carousel-progress]"
    );


    // Stop if there are no slides

    if (slides.length === 0) {
        return;
    }


    /* ========================================
       3. CAROUSEL SETTINGS
    ======================================== */

    const slideDuration = 4999;

    let currentSlide = 0;

    let isPlaying = true;

    let elapsedTime = 0;

    let lastUpdate = Date.now();


    /* ========================================
       4. GENERATE PAGINATION DOTS
    ======================================== */

    const dots = [];

    if (dotsContainer) {

        slides.forEach((slide, index) => {

            const dot = document.createElement("button");

            dot.type = "button";

            dot.className = "carousel-dot";

            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            dot.addEventListener("click", () => {

                showSlide(index);

                resetTimer();

            });

            dotsContainer.appendChild(dot);

            dots.push(dot);

        });

    }


    /* ========================================
       5. DISPLAY A SLIDE
    ======================================== */

    function showSlide(index) {

        // Wrap around when reaching either end

        currentSlide =
            (index + slides.length) % slides.length;


        // Update the visible slide

        slides.forEach((slide, slideIndex) => {

            const isActive = slideIndex === currentSlide;

            slide.classList.toggle(
                "is-active",
                isActive
            );

        });


        // Update pagination dots

        dots.forEach((dot, dotIndex) => {

            const isActive = dotIndex === currentSlide;

            dot.classList.toggle(
                "is-active",
                isActive
            );

            if (isActive) {

                dot.setAttribute(
                    "aria-current",
                    "true"
                );

            } else {

                dot.removeAttribute(
                    "aria-current"
                );

            }

        });


        // Update slide counter

        if (counter) {

            const current = String(
                currentSlide + 1
            ).padStart(2, "0");

            const total = String(
                slides.length
            ).padStart(2, "0");

            counter.textContent =
                `${current} / ${total}`;

        }


        // Reset progress animation

        updateProgress(0);

    }


    /* ========================================
       6. PREVIOUS AND NEXT
    ======================================== */

    if (previousButton) {

        previousButton.addEventListener("click", () => {

            showSlide(currentSlide - 1);

            resetTimer();

        });

    }


    if (nextButton) {

        nextButton.addEventListener("click", () => {

            showSlide(currentSlide + 1);

            resetTimer();

        });

    }


    /* ========================================
       7. PROGRESS BAR
    ======================================== */

    function updateProgress(progress) {

        if (!progressBar) {
            return;
        }

        progressBar.style.width =
            `${Math.min(progress, 100)}%`;

    }


    /* ========================================
       8. RESET THE TIMER
    ======================================== */

    function resetTimer() {

        elapsedTime = 0;

        lastUpdate = Date.now();

        updateProgress(0);

    }


    /* ========================================
       9. PAUSE AND RESUME
    ======================================== */

    function updateToggleButton() {

        if (!toggleButton) {
            return;
        }

        if (isPlaying) {

            toggleButton.textContent = "Pause";

            toggleButton.setAttribute(
                "aria-label",
                "Pause presentation"
            );

        } else {

            toggleButton.textContent = "Play";

            toggleButton.setAttribute(
                "aria-label",
                "Resume presentation"
            );

        }

    }


    if (toggleButton) {

        toggleButton.addEventListener("click", () => {

            isPlaying = !isPlaying;

            lastUpdate = Date.now();

            updateToggleButton();

        });

    }


    /* ========================================
       10. AUTOMATIC SLIDE ADVANCEMENT
    ======================================== */

    function updateCarousel() {

        const now = Date.now();

        const delta = now - lastUpdate;

        lastUpdate = now;


        // Do not advance while paused

        if (!isPlaying) {
            return;
        }

        // Stop autoplay when final slide is reached
        if (currentSlide === slides.length - 1) {
            isPlaying = false;
            updateToggleButton();
            updateProgress(100);

            return;
        }


        // Accumulate elapsed time

        elapsedTime += delta;


        // Calculate progress percentage

        const progress =
            (elapsedTime / slideDuration) * 100;

        updateProgress(progress);


        // Move to the next slide when time expires

        if (elapsedTime >= slideDuration) {

            showSlide(currentSlide + 1);

            elapsedTime = 0;

        }

    }


    /* ========================================
       11. INITIALIZE CAROUSEL
    ======================================== */

    showSlide(0);

    updateToggleButton();


    // Start the timer

    setInterval(updateCarousel, 50);

});
