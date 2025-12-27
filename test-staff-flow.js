
async function testStaffFlow() {
    console.log("--- Starting Staff Flow Test ---");

    // 1. Create Staff
    console.log("Creating Test Staff...");
    const createRes = await fetch('http://localhost:3000/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Test Staff User",
            role: "Stylist",
            email: "test_staff@example.com",
            phone: "123456789",
            bio: "Expert in haircuts",
            specialties: ["Corte", "Peinado"],
            schedule: {
                weeklySchedule: {
                    Lun: { active: true, start: "09:00", end: "18:00", breaks: [] }
                }
            }
        })
    });
    const createData = await createRes.json();
    console.log("Create Result:", createData);

    if (!createData.id) {
        console.error("Failed to create staff. Aborting.");
        return;
    }
    const staffId = createData.id;

    // 2. Fetch All Staff to verify existence
    console.log("Fetching Staff list...");
    const listRes = await fetch('http://localhost:3000/api/staff');
    const listData = await listRes.json();
    const myStaff = listData.find(s => s.id === staffId);
    console.log("Found Staff:", myStaff ? "Yes" : "No");

    if (!myStaff) {
        console.error("Staff not found in list.");
        return;
    }

    // 3. Update Staff (Deactivate)
    console.log("Updating Staff (Deactivate)...");
    const updateRes = await fetch(`http://localhost:3000/api/staff/${staffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...myStaff,
            active: false,
            // Ensure we handle specialties correctly (array vs string check in backend)
            specialties: myStaff.specialties
        })
    });
    console.log("Update status:", updateRes.status);

    // Verify update
    const listRes2 = await fetch('http://localhost:3000/api/staff');
    const listData2 = await listRes2.json();
    const updatedStaff = listData2.find(s => s.id === staffId);
    console.log("Is Active after update?:", updatedStaff.active);

    // 4. Delete Staff
    console.log("Deleting Staff...");
    const delRes = await fetch(`http://localhost:3000/api/staff/${staffId}`, {
        method: 'DELETE'
    });
    console.log("Delete status:", delRes.status);

    // Verify delete
    const listRes3 = await fetch('http://localhost:3000/api/staff');
    const listData3 = await listRes3.json();
    const deletedStaff = listData3.find(s => s.id === staffId);
    console.log("Exists after delete?:", deletedStaff ? "Yes" : "No");
}

testStaffFlow();
