import gsap from 'gsap';

/**
 * Animate a result item when compression is complete
 * @param {string} id - The unique ID of the result item
 */
export const animateResultItem = (id) => {
    setTimeout(() => {
        const element = document.getElementById(`result-${id}`);
        if (element) {
            // Flash effect on the entire card
            gsap.fromTo(element,
                { backgroundColor: "#e8f5e9", scale: 1.02 },
                { backgroundColor: "#fff", scale: 1, duration: 0.5, ease: "power2.out" }
            );

            // Confetti-like bounce for the success badge
            const badge = element.querySelector('.success-badge');
            if (badge) {
                gsap.fromTo(badge,
                    { scale: 0, rotation: -20 },
                    { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
                );
            }
        }
    }, 100);
};

/**
 * Animate the upload zone with an elastic bounce effect
 */
export const animateUploadZone = () => {
    gsap.fromTo('.upload-zone',
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
    );
};
