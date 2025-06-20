async function fetchOrders() {
    const res = await fetch("http://localhost:3000/orders");
    const orders = await res.json();

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input class="form-control" value="${order.name}" id="name-${order._id}"></td>
            <td><input class="form-control" value="${order.phone}" id="phone-${order._id}"></td>
            <td><textarea class="form-control" id="address-${order._id}">${order.address}</textarea></td>
            <td><ul>${order.cartData.map(item => `<li>${item.name} (${item.quantity})</li>`).join('')}</ul></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="updateOrder('${order._id}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order._id}')">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function updateOrder(id) {
    const name = document.getElementById(`name-${id}`).value;
    const phone = document.getElementById(`phone-${id}`).value;
    const address = document.getElementById(`address-${id}`).value;

    const res = await fetch(`http://localhost:3000/orders/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, address }),
    });

    if (res.ok) {
        alert("✅ Order updated!");
        fetchOrders();
    } else {
        alert("❌ Failed to update.");
    }
}

async function deleteOrder(id) {
    if (confirm("Are you sure you want to delete this order?")) {
        const res = await fetch(`http://localhost:3000/orders/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert("🗑️ Order deleted.");
            fetchOrders();
        } else {
            alert("❌ Deletion failed.");
        }
    }
}

window.onload = fetchOrders;
