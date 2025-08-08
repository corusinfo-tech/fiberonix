import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateJunction } from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";

export default function EditJunctionModal({
  isOpen,
  onClose,
  junctionData,
  setJunctionData,
  onUpdate,
}) {
  const [errors, setErrors] = useState({});

  if (!junctionData) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!junctionData.name?.trim()) newErrors.name = "Junction name is required";
    if (!junctionData.post_code?.trim()) newErrors.post_code = "Post code is required";
    if (!junctionData.junction_type?.trim())
      newErrors.junction_type = "Junction type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateJunction(junctionData.id, junctionData);
      onUpdate(junctionData); // update state in parent
      toast.success("Junction updated successfully");
      onClose();
      setErrors({});
    } catch (err) {
      if (err.response?.data) {
        const serverErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          serverErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(serverErrors);
      } else {
        toast.error("Failed to update Junction");
      }
    }
  };

  const handleClose = () => {
    setErrors({}); // clear errors on close
    onClose();
  };

  const errorClass = (field) => (errors[field] ? "border-red-500" : "");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Junction</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={junctionData.name}
              onChange={(e) =>
                setJunctionData({ ...junctionData, name: e.target.value })
              }
              className={errorClass("name")}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Junction Type */}
          <div>
            <Label>Junction Type</Label>
            <Input
              value={junctionData.junction_type}
              onChange={(e) =>
                setJunctionData({ ...junctionData, junction_type: e.target.value })
              }
              className={errorClass("junction_type")}
            />
            {errors.junction_type && (
              <p className="text-sm text-red-500">{errors.junction_type}</p>
            )}
          </div>

          {/* Post Code */}
          <div>
            <Label>Post Code</Label>
            <Input
              value={junctionData.post_code}
              onChange={(e) =>
                setJunctionData({ ...junctionData, post_code: e.target.value })
              }
              className={errorClass("post_code")}
            />
            {errors.post_code && (
              <p className="text-sm text-red-500">{errors.post_code}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              value={junctionData.description}
              onChange={(e) =>
                setJunctionData({ ...junctionData, description: e.target.value })
              }
            />
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
