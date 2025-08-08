import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, PencilLine, Search } from "lucide-react";
import { NetworkLayout } from "@/components/NetworkLayout";
import { fetchStaffs, createStaff } from "@/services/api";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StaffList() {
  const [allStaffs, setAllStaffs] = useState([]); // store complete dataset
  const [staffs, setStaffs] = useState([]); // paginated visible list
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  type FieldErrors = {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };

  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStaffs();
  }, []);

  useEffect(() => {
    // Filter + search
    let filtered = allStaffs.filter((staff) => {
      if (
        selectedRole !== "all" &&
        staff.role.toLowerCase() !== selectedRole.toLowerCase()
      ) {
        return false;
      }
      if (search.trim() !== "") {
        return staff.name.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    });

    // Calculate pages based on filtered data
    const newTotalPages = Math.ceil(filtered.length / pageSize) || 1;
    setTotalPages(newTotalPages);

    // Reset page if it exceeds total pages
    if (page > newTotalPages) {
      setPage(1);
      return; // prevent extra slice until page resets
    }

    // Paginate the filtered data
    const startIndex = (page - 1) * pageSize;
    setStaffs(filtered.slice(startIndex, startIndex + pageSize));
  }, [allStaffs, search, selectedRole, page, pageSize]);

  const loadStaffs = async () => {
    setLoading(true);
    try {
      const data = await fetchStaffs();
      setAllStaffs([...data].reverse()); // store all data newest first
    } catch (err) {
      console.error("Error fetching staffs:", err);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Force email to lowercase
    if (name === "email") {
      value = value.toLowerCase();
    }

    // Capitalize name words
    if (name === "name") {
      value = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being typed in
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const newStaff = await createStaff(formData);
      toast.success("Staff added successfully");
      setAllStaffs((prev) => [newStaff, ...prev]); // update full list
      setIsAddOpen(false);
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
      }
      toast.error(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NetworkLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage staff accounts
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="w-full sm:w-64">
            <Select
              value={selectedRole}
              onValueChange={(val) => {
                setSelectedRole(val);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="grid gap-4">
          {staffs.map(({ id, name, email, role }) => (
            <div
              key={id}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Avatar & Details */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-primary text-white rounded-full text-xl font-semibold">
                  {name
                    ? name
                        .trim()
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n.charAt(0).toUpperCase())
                        .join("\u200B")
                    : ""}
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    {name
                      ? name
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : ""}
                  </p>

                  <p className="text-sm text-gray-500">{email}</p>
                  <p className="text-xs text-gray-400 mt-1">Role: {role}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  className="p-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm"
                  title="Edit"
                >
                  <PencilLine className="w-5 h-5" />
                </button>
                <button
                  className="p-2 h-10 w-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm"
                  title="Delete"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center p-4 border-t mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              ≪
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              ≫
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Floating Add Button */}
        <Button
          onClick={() => setIsAddOpen(true)}
          className="fixed bottom-6 right-6 bg-[linear-gradient(135deg,hsl(217,91%,24%),hsl(217,91%,35%))] hover:opacity-90 text-white rounded-full w-14 h-14 shadow-lg z-50"
          title="Add Staff"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Add Staff Modal */}
        <Dialog
          open={isAddOpen}
          onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              // Reset form data and errors when modal closes
              setFormData({ name: "", email: "", password: "", role: "" });
              setErrors({});
            }
          }}
        >
          <DialogContent className="max-w-lg w-[95%]">
            <DialogHeader>
              <DialogTitle>Add New Staff</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddStaff}>
              {/* Name */}
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password[0]}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <Label>Role</Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 bg-white"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="engineer">Engineer</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Staff"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </NetworkLayout>
  );
}
