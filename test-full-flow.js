
async function testFullFlow() {
    console.log("--- Starting Full Flow Test ---");

    // 1. Create a Client first (needed for loyalty points verification)
    console.log("Creating Test Client...");
    const clientRes = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Test Client Flow",
            phone: "999000111",
            email: "testflow@example.com",
            docType: "DNI",
            docNumber: "12345678"
        })
    });

    // We might get an error if client exists, so let's try to search or just proceed. 
    // The previous booking tests created clients implicitly sometimes.
    // Let's create a booking using this client info directly.

    // 2. Create Appointment
    console.log("Creating Appointment...");
    const bookRes = await fetch('http://localhost:3000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Test Client Flow",
            phone: "999000111",
            docNumber: "12345678",
            date: "2025-12-30",
            time: "15:00",
            service: "1", // Assuming ID 1 exists (Corte y Estilo $40)
            serviceName: "Corte y Estilo"
        })
    });
    const bookData = await bookRes.json();
    console.log("Booking Result:", bookData);
    const bookingId = bookData.bookingId;

    if (!bookingId) {
        console.error("Failed to create booking. Aborting.");
        return;
    }

    // 3. Check Initial Status
    console.log("Checking Initial Status...");
    let apptRes = await fetch(`http://localhost:3000/api/appointments?search=${bookingId}`);
    let apptData = await apptRes.json();
    let myAppt = apptData.data.find(a => a.id === bookingId);
    console.log("Initial Status:", myAppt?.status); // Should be Pendiente

    // 4. Update to Confirmada
    console.log("Updating to Confirmada...");
    await fetch(`http://localhost:3000/api/appointments/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmada' }) // Minimal body relying on backend to keep other fields
    });

    // 5. Verify Confirmada
    apptRes = await fetch(`http://localhost:3000/api/appointments?search=${bookingId}`);
    apptData = await apptRes.json();
    myAppt = apptData.data.find(a => a.id === bookingId);
    console.log("Status after Confirmada:", myAppt?.status);

    // 6. Update to Completada (Attended)
    console.log("Updating to Completada...");
    await fetch(`http://localhost:3000/api/appointments/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completada' })
    });

    // 7. Verify Completada
    apptRes = await fetch(`http://localhost:3000/api/appointments?search=${bookingId}`);
    apptData = await apptRes.json();
    myAppt = apptData.data.find(a => a.id === bookingId);
    console.log("Status after Completada:", myAppt?.status);

    // 8. Clean up
    console.log("Cleaning up...");
    await fetch(`http://localhost:3000/api/appointments/${bookingId}`, { method: 'DELETE' });
    console.log("Done.");
}

testFullFlow();
