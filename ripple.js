  document.addEventListener("DOMContentLoaded", function() {
        const all = document.querySelectorAll(".ripple");
        
        all.forEach(function (ev) {
            ev.style.overflow = 'hidden';
            ev.style.position = 'relative';

            ev.addEventListener("mousedown", function (e) {
                const ripple = document.createElement("span");
                ripple.className = "rippler";

                const rect = ev.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ripple.style.position = 'absolute';

                ripple.style.borderRadius = '50%';
                ripple.style.width = '20px';

                ripple.style.height = '20px';
                ripple.style.transform = 'translate(-50%, -50%)';

                ripple.style.opacity = ev.getAttribute('ripple-opacity') ?? '0.3';
                ripple.style.background = ev.getAttribute('ripple-color') ?? 'black';

                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                ev.appendChild(ripple);

                let size = (ev.clientHeight > ev.clientWidth) ? ev.clientHeight : ev.clientWidth;

                ripple.animate(
                    [
                        { width: size * 3 + 'px', height: size * 3 + 'px' },
                    ],
                    {
                        duration: 400,
                        easing: "ease-in-out",
                        fill: "forwards"
                    });

                ev.addEventListener("mouseup", ev => {
                    let anim = ripple.animate(
                        [
                            { opacity: '0' },
                        ],
                        {
                            duration: 600,
                            easing: "ease",
                            fill: "forwards"
                        });
                    anim.onfinish = setTimeout(() => {
                        ripple.remove();
                    }, 500);
                });

                ev.addEventListener("mouseleave", function () {
                    let anim = ripple.animate(
                        [
                            { opacity: '0' },
                        ],
                        {
                            duration: 600,
                            easing: "ease",
                            fill: "forwards"
                        });
                        anim.onfinish = setTimeout(() => {
                            ripple.remove();
                        }, 500);
                });
            });
        });
  });
