document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Deactivate all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Activate the clicked link
            this.classList.add('active');

            // Activate the corresponding content section
            const targetId = this.getAttribute('data-target');
            document.querySelector(targetId).classList.add('active');
        });
    });
});
