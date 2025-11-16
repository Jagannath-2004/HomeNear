(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

    document.addEventListener("DOMContentLoaded", () => {
        const filters = document.getElementById("filters");
        const leftBtn = document.getElementById("left-btn");
        const rightBtn = document.getElementById("right-btn");

        const scrollAmount = 300;

        function updateArrows() {
            const maxScroll = filters.scrollWidth - filters.clientWidth;

            // Hide left button at far left
            if (filters.scrollLeft <= 0) {
                leftBtn.style.display = "none";
            } else {
                leftBtn.style.display = "block";
            }

            // Hide right button at far right OR if items fully fit on screen
            if (filters.scrollLeft >= maxScroll || maxScroll <= 0) {
                rightBtn.style.display = "none";
            } else {
                rightBtn.style.display = "block";
            }
        }

        // Call at beginning
        updateArrows();

        // When user scrolls manually
        filters.addEventListener("scroll", updateArrows);

        // When clicking right arrow
        rightBtn.addEventListener("click", () => {
            filters.scrollLeft += scrollAmount;
            setTimeout(updateArrows, 150);
        });

        // When clicking left arrow
        leftBtn.addEventListener("click", () => {
            filters.scrollLeft -= scrollAmount;
            setTimeout(updateArrows, 150);
        });

        // Recalculate on window resize
        window.addEventListener("resize", updateArrows);

        //------------------------------------------------------
        const taxSwitch = document.getElementById("switchCheckDefault");
        const prices = document.querySelectorAll(".priceInfo");

        taxSwitch.addEventListener("change", () => {
            prices.forEach(priceTag => {

                // original price from data attribute
                let basePrice = Number(priceTag.dataset.base);

                // calculate price with 18% GST
                let taxedPrice = Math.round(basePrice * 1.18);

                if (taxSwitch.checked) {
                    // show price including 18% GST
                    priceTag.innerText = taxedPrice.toLocaleString("en-IN");
                } else {
                    // show the original price
                    priceTag.innerText = basePrice.toLocaleString("en-IN");
                }
            });
        });
    });
})()