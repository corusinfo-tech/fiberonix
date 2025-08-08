import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCustomer } from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";

export default function EditCustomerModal({
  isOpen,
  onClose,
  customerData,
  setCustomerData,
  onUpdate,
}) {
  const [errors, setErrors] = useState({});
  if (!customerData) return null;

  const validateForm = () => {
    const newErrors = {};
    // Name
    if (!customerData.name?.trim()) newErrors.name = "Name is required";

    // Email
    if (!customerData.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email))
      newErrors.email = "Invalid email format";

    // Phone
    if (!customerData.phone?.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(customerData.phone))
      newErrors.phone = "Phone number must be 10 digits only";

    // Address
    if (!customerData.address?.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateCustomer(customerData.id, customerData);
      onUpdate(customerData);
      toast.success("Customer updated successfully");
      onClose();
      setErrors({});
    } catch (err) {
      console.error("Failed to update customer:", err.response?.data || err);
      if (err.response?.data) {
        const serverErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          serverErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(serverErrors);
      } else {
        toast.error("Failed to update Customer");
      }
    }
  };

  const handleClose = () => {
    setErrors({}); // clear errors on close
    onClose();
  };

  const errorClass = (field) => (errors[field] ? "border-red-500" : "");

  return (
    <Dialog open={isOpen}  onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={customerData.name}
              onChange={(e) =>
                setCustomerData({ ...customerData, name: e.target.value })
              }
              className={errorClass("name")}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={customerData.email}
              onChange={(e) =>
                setCustomerData({ ...customerData, email: e.target.value })
              }
              className={errorClass("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData({ ...customerData, phone: e.target.value })
              }
              className={errorClass("phone")}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Input
              value={customerData.address}
              onChange={(e) =>
                setCustomerData({ ...customerData, address: e.target.value })
              }
              className={errorClass("address")}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
