document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuIcon = menuToggle.querySelector('i');

    function setMenuOpen(open) {
        menuToggle.classList.toggle('active', open);
        mobileNav.classList.toggle('active', open);
        menuIcon.classList.toggle('fa-bars', !open);
        menuIcon.classList.toggle('fa-xmark', open);
    }

    menuToggle.addEventListener('click', function() {
        setMenuOpen(!menuToggle.classList.contains('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav')) {
            setMenuOpen(false);
        }
    });
});
