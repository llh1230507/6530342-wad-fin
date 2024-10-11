"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm(); // Handles form input and reset
  const [customers, setCustomers] = useState([]); // Stores customer list
  const [editMode, setEditMode] = useState(false); // Handles edit state
  const [currentCustomerId, setCurrentCustomerId] = useState(null); // Tracks current customer ID being edited

  // Fetch customers from the API
  async function fetchCustomers() {
    try {
      const data = await fetch(`${APIBASE}/customer`);
      const customerData = await data.json();
      const formattedData = customerData.map((customer) => ({
        ...customer,
        id: customer._id, // Assign _id to id for consistency
      }));
      setCustomers(formattedData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  // Create a new customer or update an existing one
  const createCustomerOrUpdate = async (data) => {
    if (editMode) {
      // Update existing customer
      const response = await fetch(`${APIBASE}/customer/${currentCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert(`Failed to update customer: ${response.status}`);
        return;
      }

      alert("Customer updated successfully");
      reset(); // Reset form after update
      setEditMode(false);
      setCurrentCustomerId(null); // Clear current customer being edited
      fetchCustomers(); // Refresh customer list
    } else {
      // Create new customer
      const response = await fetch(`${APIBASE}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert(`Failed to add customer: ${response.status}`);
        return;
      }

      alert("Customer added successfully");
      reset(); // Reset form after creation
      fetchCustomers(); // Refresh customer list
    }
  };

  // Start editing a customer
  const startEdit = (customer) => () => {
    setEditMode(true); // Enable edit mode
    setCurrentCustomerId(customer._id); // Set current customer ID to be edited
    reset(customer); // Populate form with selected customer data
  };

  // Delete a customer by ID
  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return; // Confirm deletion

    const response = await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
      return;
    }

    alert("Customer deleted successfully");
    fetchCustomers(); // Refresh customer list
  };

  // Fetch customer data on initial load
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        {/* Customer form */}
        <div className="border m-4 bg-slate-300 p-4 w-64">
          <h2 className="text-xl">{editMode ? "Edit Customer" : "Create Customer"}</h2>
          <form onSubmit={handleSubmit(createCustomerOrUpdate)}>
            <div>
              <label>Name</label>
              <input {...register("name")} className="border" required />
            </div>
            <div>
              <label>Interests</label>
              <input {...register("Interests")} className="border" required />
            </div>
            <div>
              <label>Member Number</label>
              <input {...register("MemberNumber")} className="border" required />
            </div>
            <div>
              <label>Date of Birth</label>
              <input type="date" {...register("DateofBirth")} className="border" required />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">
              {editMode ? "Update Customer" : "Add Customer"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  reset(); // Reset form
                  setEditMode(false); // Exit edit mode
                }}
                className="bg-gray-400 text-white p-2 ml-2"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Customer list */}
        <div className="border m-4 bg-slate-300 flex-1">
          <h1 className="text-2xl">Customers ({customers.length})</h1>
          <ul className="list-disc ml-8">
            {customers.map((customer) => (
              <li key={customer._id}>
                
                
                <button
                  className="border border-black p-1/2"
                  onClick={startEdit(customer)}
                >
                  📝
                </button>{" "}
                <button
                  className="border border-black p-1/2"
                  onClick={deleteById(customer._id)}
                >
                  ❌
                </button>{" "}
                <Link href={`/customer/${customer._id}`} className="font-bold">
                  {customer.name}
                </Link>{" "}
                  {customer.MemberNumber} - {customer.Interests} - {new Date(customer.DateofBirth).toLocaleDateString()}
                
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
