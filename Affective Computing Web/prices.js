const radioInputs = document.querySelectorAll('.radio-input');
const checkboxInputs = document.querySelectorAll('.checkbox-input');
const totalPriceElement = document.getElementById('total-price');

const calculateTotalPrice = () => {
  let total = 0;

  radioInputs.forEach(input => {
    if (input.checked) {
      total += parseInt(input.value);
    }
  });

  checkboxInputs.forEach(input => {
    if (input.checked) {
      total += parseInt(input.value);
    }
  });

  totalPriceElement.textContent = `Total Price: $${total}`;
};

radioInputs.forEach(input => {
  input.addEventListener('change', calculateTotalPrice);
});

checkboxInputs.forEach(input => {
  input.addEventListener('change', calculateTotalPrice);
});
