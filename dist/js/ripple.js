/*!
 * Ripple js v1.0.0 (https://humamsamra.github.io/ripple/)
 * Copyright 2022-2023 The Ripple js Author (WuToDo)
 * Licensed under MIT (https://github.com/HumamSamra/Ripple/blob/main/LICENSE)
 */

// What element will be applied on
const selector = ".ripple";

function tclick(element, onclick) {
    var touchable = true;
    element.addEventListener('touchstart', function(e) {
        touchable = false;
        onclick.call(this, e);
    });

    element.addEventListener('mousedown', function(e) {
        if (touchable) {
            onclick.call(this, e);
        }
        touchable = true;
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const allRippleElements = document.querySelectorAll(selector);

    allRippleElements.forEach(function(rippleElement) {
        rippleElement.style.cssText += `
           position: relative;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
          user-select:none;
        `;
        rippleElement.setAttribute('draggable', false);

        tclick(rippleElement, (ev) => {
            createRipple(ev);
        });

        function createRipple(event, ) {
            var centered = false;
            if (rippleElement.hasAttribute('rpl-center')) {
                centered = true;
            }
            const ripple = document.createElement("span");
            const rect = rippleElement.getBoundingClientRect();

            var x = 0,
                y = 0;

            if (event.touches) {
                x = event.touches[0].clientX - rect.left;
                y = event.touches[0].clientY - rect.top;
            } else {
                x = event.clientX - rect.left;
                y = event.clientY - rect.top;

            }
            var size;

            if (!centered) {
                size = Math.max(
                    (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))),
                    (Math.sqrt(Math.pow(rect.width - x, 2) + Math.pow(y, 2))),
                    (Math.sqrt(Math.pow(rect.width - x, 2) + Math.pow(rect.height - y, 2))),
                    (Math.sqrt(Math.pow(x, 2) + Math.pow(rect.height - y, 2)))
                ) * 2;
            } else {
                size = Math.sqrt(rippleElement.clientHeight *
                    rippleElement.clientHeight + rippleElement.clientWidth *
                    rippleElement.clientWidth);
            }

            ripple.style.position = 'absolute';
            ripple.style.pointerEvents = 'none';

            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';

            ripple.style.width = `0px`;
            ripple.style.height = `0px`;

            ripple.style.opacity = rippleElement.getAttribute('rpl-opacity') || '0.3';
            ripple.style.backgroundColor = rippleElement.getAttribute('rpl-color') || '#000';

            if (centered) {
                ripple.style.left = '50%';
                ripple.style.top = '50%';
            } else {
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
            }
            var container = document.createElement('span');
            container.style.cssText += `
              border-radius: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    pointer-events: none;
          `;
            container.appendChild(ripple);
            rippleElement.appendChild(container);

            let anim = ripple.animate(
                [{
                    width: size + 'px',
                    height: size + 'px'
                }, ], {
                    duration: 225,
                    easing: "cubic-bezier(0,.58,.32,.99)",
                    fill: "forwards"
                });
            function removeRipple() {
                anim.finished.then(() => {
                    let fadeOutAnimation = container.animate(
                        [{
                            opacity: '0'
                        }, ], {
                            duration: 300,
                            easing: "ease",
                            fill: "forwards"
                        });

                    fadeOutAnimation.onfinish = function() {
                        container.remove();
                    };
                });
            }
            if (event.touches) {
                rippleElement.addEventListener("touchend", removeRipple);
                rippleElement.addEventListener("touchcancel", removeRipple);
            } else {
                rippleElement.addEventListener("mouseup", removeRipple);
                rippleElement.addEventListener("mouseleave", removeRipple);
            }
        }
    });
});
