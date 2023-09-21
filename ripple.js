function tclick(element, onclick) {
  element.addEventListener('touchstart', function (e) {
    onclick.call(this, e);
    e.stopPropagation();
  });

  element.addEventListener('mousedown', function (e) {
    onclick.call(this, e);
  });
}
document.addEventListener("DOMContentLoaded", function () {
    const allRippleElements = document.querySelectorAll(".ripple");

    allRippleElements.forEach(function (rippleElement) {
        rippleElement.style.overflow = 'hidden';
        rippleElement.style.position = 'relative';
        rippleElement.style.cursor = 'pointer';
        rippleElement.setAttribute('draggable', false);

tclick(rippleElement, (ev) => {
            createRipple(ev, true);
        });

        function createRipple(event, touch) {
            const ripple = document.createElement("span");
            const rect = rippleElement.getBoundingClientRect();
            var x = 0;
            var y = 0;

  if (event.touches) {
                x = event.touches[0].pageX - rect.left;
                y = event.touches[0].pageY - rect.top;
            } else {
                x = event.clientX - rect.left;
                y = event.clientY - rect.top;
            }

            let size = Math.sqrt(rippleElement.clientHeight * rippleElement.clientHeight + rippleElement.clientWidth * rippleElement.clientWidth) * 2;

            ripple.style.position = 'absolute';
            ripple.style.pointerEvents = 'none';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.width = size / 4 + 'px';
            ripple.style.height = size / 4 + 'px';

            ripple.style.opacity = rippleElement.getAttribute('data-ripple-opacity') || '0.1';
            ripple.style.backgroundColor = rippleElement.getAttribute('data-ripple-color') || '#000';

            if (rippleElement.hasAttribute('data-ripple-center')) {
                ripple.style.left = '50%';
                ripple.style.top = '50%';
            } else {
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
            }

            rippleElement.appendChild(ripple);

            ripple.animate(
                [
                    { width: size + 'px', height: size + 'px' },
                ],
                {
                    duration: 600,
                    easing: "cubic-bezier(0,0,0.2,1)",
                    fill: "forwards"
                });

            function removeRipple() {
                let fadeOutAnimation = ripple.animate(
                    [
                        { opacity: '0' },
                    ],
                    {
                        duration: 300,
                        easing: "cubic-bezier(0,.38,.47,1)",
                        fill: "forwards"
                    });

                fadeOutAnimation.onfinish = function () {
                    ripple.remove();
                };
            }

            rippleElement.addEventListener("mouseup", removeRipple);
            rippleElement.addEventListener("mouseleave", removeRipple);

            if (touch === true) {
                rippleElement.addEventListener("touchend", removeRipple);
                rippleElement.addEventListener("touchcancel", removeRipple);
            }
        }
    });
});
