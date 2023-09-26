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
        
        const rect = rippleElement.getBoundingClientRect();
        function createRipple(event, touch) {
            const ripple = document.createElement("span");
            
            var x = 0;
            var y = 0;

            if (event.touches) {
                x = event.touches[0].pageX - rect.left;
                y = event.touches[0].pageY - rect.top;
            } else {
                x = event.clientX - rect.left;
                y = event.clientY - rect.top;
                
            }
            
            var size = Math.max(
              (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))),
              (Math.sqrt(Math.pow(rect.width - x, 2) + Math.pow(y, 2))),
              (Math.sqrt(Math.pow(rect.width - x, 2) + Math.pow(rect.height - y, 2))),
              (Math.sqrt(Math.pow(x, 2) + Math.pow(rect.height - y, 2)))
            ) * 2;

            ripple.style.position = 'absolute';
            ripple.style.pointerEvents = 'none';
            
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            ripple.style.width = '0px';
            ripple.style.height = '0px';

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

            let anim = ripple.animate(
                [
                    { width: size + 'px', height: size + 'px' },
                ],
                {
                    duration: 300,
                    easing: "ease",
                    fill: "forwards"
                });

            function removeRipple() {
                
                anim.finished.then(() => {
    let fadeOutAnimation = ripple.animate(
                    [
                        { opacity: '0' },
                    ],
                    {
                        duration: 150,
                        easing: "ease",
                        fill: "forwards"
                    });

                fadeOutAnimation.onfinish = function () {
                    ripple.remove();
                };
});
            }

            if (event.touches) {
                rippleElement.addEventListener("touchend", removeRipple);
                rippleElement.addEventListener("touchcancel", removeRipple);
            }else{
                rippleElement.addEventListener("mouseup", removeRipple);
                rippleElement.addEventListener("mouseleave", removeRipple);
            }
        }
    });
});
