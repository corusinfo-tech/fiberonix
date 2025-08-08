import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { createCustomers } from "@/services/api";
import { useState } from "react";

export default function CustomerFormDialog({
  open,
  onOpenChange,
  mapData,
  setCustomers,
  setAllCustomers,
  resetCustomerForm,
  newCustomer,
  setNewCustomer,
}) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newCustomer.name?.trim()) newErrors.name = "Name is required";
    if (!newCustomer.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email))
      newErrors.email = "Invalid email format";
    if (!newCustomer.phone?.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(newCustomer.phone))
      newErrors.phone = "Phone number must be 10 digits only";
    if (!newCustomer.address?.trim()) newErrors.address = "Address is required";
    if (isNaN(newCustomer.latitude) || isNaN(newCustomer.longitude))
      newErrors.location = "Click on the map to select location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: newCustomer.name.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone.trim(),
        address: newCustomer.address.trim(),
        latitude: parseFloat(newCustomer.latitude),
        longitude: parseFloat(newCustomer.longitude),
        office: mapData.id,
        staff: 1, // Replace with logged-in user ID if available
      };

      console.log("Submitting Customer Payload:", payload);

      const created = await createCustomers(payload);
      toast.success("Customer added successfully");

      if (created.office === mapData.id) {
        setCustomers((prev) => [...prev, created]);
      }
      setAllCustomers((prev) => [...prev, created]);

      onOpenChange(false);
      resetCustomerForm();
      setErrors({});
    } catch (err) {
      console.error("Failed to add customer:", err.response?.data || err);
      toast.error("Failed to add customer");
    }
  };

  const errorClass = (field) => (errors[field] ? "border-red-500" : "");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          resetCustomerForm();
          setErrors({});
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className={errorClass("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              className={errorClass("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className={errorClass("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Input
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
              className={errorClass("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <Label>Latitude</Label>
            <Input
              value={newCustomer.latitude}
              readOnly
              className={`bg-gray-100 cursor-not-allowed ${errorClass(
                "location"
              )}`}
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              value={newCustomer.longitude}
              readOnly
              className={`bg-gray-100 cursor-not-allowed ${errorClass(
                "location"
              )}`}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
