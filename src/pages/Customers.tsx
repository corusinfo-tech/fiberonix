import { useEffect, useState } from "react";
import { NetworkLayout } from "@/components/NetworkLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, MoreVertical, Users } from "lucide-react";
import { fetchAllCustomers, fetchOffices } from "@/services/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  fetchJunctions,
  fetchDevices,
  fetchCustomers,
  fetchSub,
  fetchRoutesByOffice,
} from "@/services/api";
import { deleteCustomer } from "@/services/api";
import { updateCustomer } from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue (for webpack/Next.js)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Default icon (just in case)
const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom icons
const customerIcon = L.divIcon({
  html: `<span class="material-icons" style="
    font-size: 32px;
    color: black;
    padding: 4px;
  ">person_pin_circle</span>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const junctionIcon = L.icon({
  iconUrl: "/icons/junction.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const subOfficeIcon = L.divIcon({
  html: `<span class="material-icons" style="
    font-size: 30px;
    color: black;
    padding: 4px;
  ">apartment</span>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const getDeviceIcon = (type) => {
  let iconName = "device_unknown";

  switch (type?.toLowerCase()) {
    case "splitter":
      iconName = "call_split";
      break;
    case "coupler":
      iconName = "merge_type";
      break;
    case "olt":
      iconName = "sync";
      break;
    case "ont":
      iconName = "dashboard_customize";
      break;
  }

  return L.divIcon({
    html: `<span class="material-icons" style="
      font-size: 28px;
      color: black;
      
      
      padding: 4px;
      
    ">${iconName}</span>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const oltIcon = L.icon({
  iconUrl: "/icons/olt.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!editData.name?.trim()) newErrors.name = "Name is required";
    if (!editData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!editData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(editData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!editData.address?.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [relatedCustomers, setRelatedCustomers] = useState([]);
  const [relatedDevices, setRelatedDevices] = useState([]);
  const [junctions, setJunctions] = useState([]);
  const [subOffices, setSubOffices] = useState([]);

  const [routes, setRoutes] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const openEditModal = (customer) => {
    setEditData({ ...customer }); // Pre-fill data
    setIsEditOpen(true);
  };

  const openViewModal = (customer) => {
    setViewData(customer);
    setIsViewOpen(true);
  };

  const openMapModal = async (customer) => {
    setMapData(customer);
    setIsMapOpen(true);

    // Find office details
    const office = offices.find((o) => o.id === customer.office);
    if (office) {
      setOfficeLocation({
        id: office.id,
        name: office.name,
        latitude: office.latitude,
        longitude: office.longitude,
      });
    } else {
      setOfficeLocation(null);
    }

    // Get other customers in the same office
    const officeCustomers = customers.filter(
      (c) => c.office === customer.office && c.id !== customer.id
    );
    setRelatedCustomers(officeCustomers);

    // Fetch devices
    try {
      const devicesData = await fetchDevices();
      const filteredDevices = (
        Array.isArray(devicesData) ? devicesData : devicesData.results || []
      ).filter((d) => d.office === customer.office);
      setRelatedDevices(filteredDevices);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setRelatedDevices([]);
    }

    // Fetch junctions
    try {
      const junctionsData = await fetchJunctions();
      const filteredJunctions = Array.isArray(junctionsData)
        ? junctionsData.filter((j) => j.office === customer.office)
        : junctionsData.results?.filter((j) => j.office === customer.office) ||
          [];
      setJunctions(filteredJunctions);
    } catch (error) {
      console.error("Failed to fetch junctions:", error);
      setJunctions([]);
    }

    // Fetch routes
    try {
      const routesData = await fetchRoutesByOffice(customer.office);
      setRoutes(routesData || []);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setRoutes([]);
    }

    // **Fetch sub-offices**
    try {
      const subRes = await fetchSub();
      const filteredSub = (
        Array.isArray(subRes) ? subRes : subRes.results || []
      ).filter((s) => s.office === customer.office);
      setSubOffices(filteredSub);
    } catch (error) {
      console.error("Failed to fetch sub-offices:", error);
      setSubOffices([]);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const [customerRes, officeRes] = await Promise.all([
          fetchAllCustomers(),
          fetchOffices(),
        ]);
        setCustomers(customerRes || []);
        setOffices(officeRes || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = customers;

    if (selectedOffice !== "all") {
      filtered = filtered.filter((c) => c.office === parseInt(selectedOffice));
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.phone?.toLowerCase().includes(term) ||
          c.address?.toLowerCase().includes(term)
      );
    }

    setFilteredCustomers(filtered);
    setPage(1);
  }, [selectedOffice, searchTerm, customers]);

  // Pagination
  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const getOfficeName = (officeId) => {
    const office = offices.find((o) => o.id === officeId);
    return office ? office.name : "Unknown Office";
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer");
    }
  };

  if (loading) {
    return (
      <NetworkLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading customers...</p>
        </div>
      </NetworkLayout>
    );
  }

  return (
    <NetworkLayout>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Customer Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage customer accounts
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="w-full sm:w-64">
            <Select
              onValueChange={(val) => setSelectedOffice(val)}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All OLT's</SelectItem>
                {offices.map((office) => (
                  <SelectItem key={office.id} value={office.id.toString()}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Customers Table (Desktop) */}
        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardContent className="p-0">
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-background shadow-sm">
                  <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">OLT</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((c, idx) => (
                    <tr
                      key={c.id}
                      className={`transition-colors hover:bg-muted/40 ${
                        idx % 2 === 0 ? "bg-muted/20" : "bg-background"
                      }`}
                    >
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {c.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{c.email}</td>
                      <td className="px-4 py-3">{c.phone}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">
                        <Popover>
                          <PopoverTrigger className=" cursor-pointer hover:underline">
                            {c.address?.length > 20
                              ? `${c.address.slice(0, 20)}...`
                              : c.address}
                          </PopoverTrigger>
                          <PopoverContent className="max-w-sm text-sm">
                            <p className="break-words">
                              {c.address || "No Address Available"}
                            </p>
                          </PopoverContent>
                        </Popover>
                      </td>

                      <td className="px-4 py-3">{getOfficeName(c.office)}</td>
                      <td className="px-4 py-3">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewModal(c)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(c)}>
                              Edit Customer
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => openMapModal(c)}>
                              Show on Map
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(c.id)} // FIXED
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4 p-4">
              {paginatedCustomers.map((c) => (
                <Card key={c.id} className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{c.name}</CardTitle>
                        <CardDescription>
                          {getOfficeName(c.office)}
                        </CardDescription>
                      </div>
                    </div>
                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(c)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(c)}>
                          Edit Customer
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => openMapModal(c)}>
                          Show on Map
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(c.id)} // FIXED
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>

                  <CardContent className="space-y-1 text-sm">
                    <p className="break-all whitespace-normal">
                      <strong>Email:</strong> {c.email}
                    </p>
                    <p className="break-all whitespace-normal">
                      <strong>Phone:</strong> {c.phone}
                    </p>
                    <p className="break-all whitespace-normal">
                      <strong>Address:</strong> {c.address || "N/A"}
                    </p>
                    <p className="break-words whitespace-normal">
                      <strong>Created:</strong>{" "}
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center p-4 border-t">
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
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!validate()) return; // stop if validation fails
                try {
                  await updateCustomer(editData.id, editData);
                  setCustomers((prev) =>
                    prev.map((c) => (c.id === editData.id ? editData : c))
                  );
                  toast.success("Customer updated successfully");
                  setIsEditOpen(false);
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update customer");
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Name:</strong>
                <p>{viewData.name}</p>
              </div>
              <div>
                <strong>Email:</strong>
                <p>{viewData.email}</p>
              </div>
              <div>
                <strong>Phone:</strong>
                <p>{viewData.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <strong>Address:</strong>
                <p className="break-words">{viewData.address || "N/A"}</p>
              </div>
              <div>
                <strong>OLT:</strong>
                <p>{getOfficeName(viewData.office)}</p>
              </div>
              <div>
                <strong>Created At:</strong>
                <p>{new Date(viewData.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent
          className="max-w-4xl w-[95%] h-[80vh] p-0 relative rounded-xl overflow-hidden flex flex-col"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "fixed",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMapOpen(false)}
            className="absolute top-3 right-3 z-[1000] bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {mapData && (
            <MapContainer
              center={[
                mapData?.latitude ?? officeLocation?.latitude ?? 0,
                mapData?.longitude ?? officeLocation?.longitude ?? 0,
              ]}
              zoom={14}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Selected Customer (highlighted) */}
              {mapData.latitude && mapData.longitude && (
                <Marker
                  position={[mapData.latitude, mapData.longitude]}
                  icon={customerIcon}
                >
                  <Popup>
                    <b>{mapData.name}</b>
                    <br />
                    {mapData.description || "No description"}
                  </Popup>
                </Marker>
              )}

              {/* Office Marker */}
              {officeLocation?.latitude && officeLocation?.longitude && (
                <Marker
                  position={[officeLocation.latitude, officeLocation.longitude]}
                  icon={oltIcon}
                >
                  <Popup>
                    <b>OLT: {officeLocation.name}</b>
                  </Popup>
                </Marker>
              )}

              {/* Other Customers */}
              {relatedCustomers.map(
                (customer) =>
                  customer.latitude &&
                  customer.longitude && (
                    <Marker
                      key={customer.id}
                      position={[customer.latitude, customer.longitude]}
                      icon={customerIcon}
                    >
                      <Popup>
                        <b>{customer.name}</b>
                        <br />
                        {customer.description || "No description"}
                      </Popup>
                    </Marker>
                  )
              )}

              {/* Devices in the office */}
              {relatedDevices.map(
                (dev) =>
                  dev.latitude &&
                  dev.logitutde && (
                    <Marker
                      key={dev.id}
                      position={[dev.latitude, dev.logitutde]}
                      icon={getDeviceIcon(dev.device_type)}
                    >
                      <Popup>
                        <b>
                          {dev.device_type} - {dev.model_name}
                        </b>
                        <br />
                        {dev.description || "No description"}
                      </Popup>
                    </Marker>
                  )
              )}

              {/* Junctions */}
              {junctions.map(
                (jun) =>
                  jun.latitude &&
                  jun.longitude && (
                    <Marker
                      key={jun.id}
                      position={[jun.latitude, jun.longitude]}
                      icon={junctionIcon}
                    >
                      <Popup>
                        <b>{jun.name}</b>
                        <br />
                        {jun.address || "No address"}
                      </Popup>
                    </Marker>
                  )
              )}

              {/* Sub-Offices */}
              {subOffices.map(
                (sub) =>
                  sub.latitude &&
                  sub.logitude && (
                    <Marker
                      key={sub.id}
                      position={[sub.latitude, sub.logitude]}
                      icon={subOfficeIcon}
                    >
                      <Popup>
                        <b>{sub.name}</b>
                        <br />
                        {sub.address || "No address"}
                      </Popup>
                    </Marker>
                  )
              )}

              {/* Routes */}
              {routes.map((route) => {
                const validPoints = route.path.filter(
                  (p) => p.latitude && p.longitude
                );
                return (
                  validPoints.length > 1 && (
                    <Polyline
                      key={route.id}
                      positions={validPoints.map((p) => [
                        p.latitude,
                        p.longitude,
                      ])}
                      pathOptions={{ color: "black", weight: 4 }}
                    />
                  )
                );
              })}
            </MapContainer>
          )}
        </DialogContent>
      </Dialog>
    </NetworkLayout>
  );
}
