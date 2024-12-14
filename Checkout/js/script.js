document.addEventListener('DOMContentLoaded', function() {
    // Handle checkbox changes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotals);
    });

    // Handle quantity changes
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('change', updateTotals);
    });

    // Add More button functionality
    const addMoreBtn = document.querySelector('.add-more button');
    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', () => {
            window.location.href = '../index.html#menu';
        });
    }

    // Edit button functionality
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) {
        editBtn.addEventListener('click', enableEditing);
    }

    // Cancel button functionality
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel your order?')) {
                window.location.href = '../index.html';
            }
        });
    }

    // Confirm button functionality
    const confirmBtn = document.querySelector('.btn-confirm');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmOrder);
    }

    // Download receipt functionality
    const downloadBtn = document.querySelector('.download-receipt');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadReceipt);
    }
});

function updateTotals() {
    let totalOrders = 0;
    const rows = document.querySelectorAll('.orders-table tbody tr:not(.add-more)');
    
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            const priceText = row.querySelector('td:last-child').textContent;
            const price = parseFloat(priceText.replace('Rp ', '').replace('.', '').replace(',00', ''));
            totalOrders += price;
        }
    });

    // Update total orders
    document.querySelector('.total-row:nth-child(1) span:last-child').textContent = 
        `Rp ${totalOrders.toLocaleString('id-ID')},00`;

    // Calculate and update tax (18%)
    const tax = totalOrders * 0.18;
    document.querySelector('.total-row:nth-child(2) span:last-child').textContent = 
        `Rp ${tax.toLocaleString('id-ID')},00`;

    // Calculate and update discount (50%)
    const discount = totalOrders * 0.5;
    document.querySelector('.total-row:nth-child(3) span:last-child').textContent = 
        `Rp ${discount.toLocaleString('id-ID')},00`;

    // Update grand total
    const grandTotal = totalOrders + tax - discount;
    document.querySelector('.total-row.grand-total span:last-child').textContent = 
        `Rp ${grandTotal.toLocaleString('id-ID')},00`;
}

function enableEditing() {
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.removeAttribute('disabled');
    });
}

function confirmOrder() {
    const paymentMethod = document.querySelector('.payment-method select').value;
    const grandTotal = document.querySelector('.total-row.grand-total span:last-child').textContent;
    const balance = document.querySelector('.balance').textContent.split(': ')[1];

    const balanceAmount = parseFloat(balance.replace('.', '').replace(',00', ''));
    const totalAmount = parseFloat(grandTotal.replace('Rp ', '').replace('.', '').replace(',00', ''));

    if (balanceAmount < totalAmount) {
        alert('Insufficient balance. Please top up your account.');
        return;
    }

    alert('Order confirmed! Thank you for your purchase.');
    // Here you would typically make an API call to process the order
}

function downloadReceipt() {
    // Here you would typically generate a PDF receipt
    alert('Receipt downloaded successfully!');
}