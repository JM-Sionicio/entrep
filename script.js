// Get HTML elements
const form = document.getElementById("reservationForm");
const printType = document.getElementById("printType");
const pages = document.getElementById("pages");
const copies = document.getElementById("copies");
const totalPrice = document.getElementById("totalPrice");
const reservationList = document.getElementById("reservationList");

// Load saved reservations from the browser
let reservations = [];

try {
    reservations = JSON.parse(
        localStorage.getItem("printingReservations")
    ) || [];
} catch (error) {
    reservations = [];
}

// Calculate the printing cost
function calculateTotal() {
    const pricePerPage = Number(printType.value) || 2;
    const numberOfPages = Number(pages.value) || 0;
    const numberOfCopies = Number(copies.value) || 0;

    const total = pricePerPage * numberOfPages * numberOfCopies;

    totalPrice.textContent = total.toFixed(2);
}

// Update the price when the printing details change
printType.addEventListener("change", calculateTotal);
pages.addEventListener("input", calculateTotal);
copies.addEventListener("input", calculateTotal);

// Save reservations in the browser
function saveReservations() {
    localStorage.setItem(
        "printingReservations",
        JSON.stringify(reservations)
    );
}

// Display all reservations
function displayReservations() {
    reservationList.innerHTML = "";

    if (reservations.length === 0) {
        reservationList.innerHTML = "<p>No reservations yet.</p>";
        return;
    }

    reservations.forEach(function (reservation, index) {
        const item = document.createElement("div");
        item.className = "reservation-item";

        const heading = document.createElement("h3");
        heading.textContent = "Reservation #" + (index + 1);

        const details = document.createElement("div");

        const information = [
            "Student Name: " + reservation.studentName,
            "Student ID: " + (reservation.studentId || "Not provided"),
            "Document: " + reservation.documentName,
            "Printing Type: " + reservation.printType,
            "Paper Size: " + reservation.paperSize,
            "Pages: " + reservation.pages,
            "Copies: " + reservation.copies,
            "Pickup Date: " + reservation.pickupDate,
            "Pickup Time: " + reservation.pickupTime,
            "Estimated Total: ₱" + reservation.total,
            "Instructions: " + (reservation.notes || "None")
        ];

        information.forEach(function (text) {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            details.appendChild(paragraph);
        });

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Reservation";
        cancelButton.className = "cancel-button";

        cancelButton.addEventListener("click", function () {
            cancelReservation(index);
        });

        item.appendChild(heading);
        item.appendChild(details);
        item.appendChild(cancelButton);

        reservationList.appendChild(item);
    });
}

// Create a new reservation
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const studentName = document
        .getElementById("studentName").value.trim();

    const studentId = document
        .getElementById("studentId").value.trim();

    const documentName = document
        .getElementById("documentName").value.trim();

    const paperSize = document
        .getElementById("paperSize").value;

    const pickupDate = document
        .getElementById("pickupDate").value;

    const pickupTime = document
        .getElementById("pickupTime").value;

    const notes = document
        .getElementById("notes").value.trim();

    const numberOfPages = Number(pages.value);
    const numberOfCopies = Number(copies.value);
    const pricePerPage = Number(printType.value);

    // Validate the form
    if (
        !studentName ||
        !documentName ||
        !pickupDate ||
        !pickupTime ||
        !Number.isInteger(numberOfPages) ||
        !Number.isInteger(numberOfCopies) ||
        numberOfPages < 1 ||
        numberOfCopies < 1 ||
        numberOfPages > 1000 ||
        numberOfCopies > 100
    ) {
        alert("Please enter valid printing and reservation details.");
        return;
    }

    // Prevent past pickup dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(pickupDate + "T00:00:00");

    if (selectedDate < today) {
        alert("Please select today or a future pickup date.");
        return;
    }

    // Calculate the total price
    const total = (
        pricePerPage * numberOfPages * numberOfCopies
    ).toFixed(2);

    // Create the reservation
    const reservation = {
        studentName: studentName,
        studentId: studentId,
        documentName: documentName,
        printType: pricePerPage === 2
            ? "Black and White"
            : "Colored",
        paperSize: paperSize,
        pages: numberOfPages,
        copies: numberOfCopies,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        notes: notes,
        total: total
    };

    // Add and save the reservation
    reservations.push(reservation);
    saveReservations();
    displayReservations();

    alert("Your printing reservation has been saved successfully!");

    // Reset the form
    form.reset();
    calculateTotal();
});

// Cancel a reservation
function cancelReservation(index) {
    const confirmed = confirm(
        "Are you sure you want to cancel this reservation?"
    );

    if (confirmed) {
        reservations.splice(index, 1);

        saveReservations();
        displayReservations();

        alert("Reservation cancelled successfully.");
    }
}

// Set the minimum pickup date to today
function setMinimumDate() {
    const dateInput = document.getElementById("pickupDate");
    const now = new Date();

    const localDate = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInput.min = localDate;
}

// Initialize the website
setMinimumDate();
calculateTotal();
displayReservations();
