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

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { X } from "lucide-react";
import {
  Plus,
  Search,
  MoreVertical,
  Cpu,
  Router,
  Activity,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";

import {
  fetchJunctions,
  fetchOffices,
  fetchDevices,
  fetchCustomers,
  fetchRoutesByOffice,
  fetchSub,
} from "@/services/api";
import { deleteSub } from "@/services/api";
import { updateSub } from "@/services/api";
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
    color: black; /* Blue for sub-offices */
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

export default function SubOffice() {
  const [sub, setSub] = useState([]);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [relatedJunctions, setRelatedJunctions] = useState([]);
  const [relatedSub, setRelatedSub] = useState([]);
  const [relatedDevices, setRelatedDevices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openViewModal = (sub) => {
    setViewData(sub);
    setIsViewOpen(true);
  };

  // Derived data
  const [filteredSub, setFilteredSub] = useState([]);

  const openEditModal = (sub) => {
    setEditData({ ...sub }); // Pre-fill data
    setIsEditOpen(true);
  };

  const openMapModal = async (selectedSub) => {
    setMapData(selectedSub);
    setIsMapOpen(true);

    // Find office details
    const office = offices.find((o) => o.id === selectedSub.office);
    setOfficeLocation(
      office
        ? {
            id: office.id,
            name: office.name,
            latitude: office.latitude,
            longitude: office.longitude,
          }
        : null
    );

    // Other subs in same office
    const officeSub = sub.filter(
      (s) => s.office === selectedSub.office && s.id !== selectedSub.id
    );
    setRelatedSub(officeSub);

    // Fetch devices
    try {
      const devicesData = await fetchDevices();
      const filteredDevices = (
        Array.isArray(devicesData) ? devicesData : devicesData.results || []
      ).filter((d) => d.office === selectedSub.office);
      setRelatedDevices(filteredDevices);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setRelatedDevices([]);
    }

    // Fetch customers
    try {
      const customersData = await fetchCustomers(selectedSub.office);
      setCustomers(customersData || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]);
    }

    // Fetch junctions for this sub-office
    try {
      const allJunctions = await fetchJunctions();
      const filteredJunctions = Array.isArray(allJunctions)
        ? allJunctions.filter((j) => j.office === selectedSub.office)
        : allJunctions.results?.filter(
            (j) => j.office === selectedSub.office
          ) || [];
      setRelatedJunctions(filteredJunctions);
    } catch (error) {
      console.error("Failed to fetch junctions:", error);
      setRelatedJunctions([]);
    }

    // Fetch routes
    try {
      const routesData = await fetchRoutesByOffice(selectedSub.office);
      setRoutes(routesData || []);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setRoutes([]);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const [subRes, officeRes] = await Promise.all([
          fetchSub(),
          fetchOffices(),
        ]);
        console.log("sub API response:", subRes);
        console.log("Office API response:", officeRes);

        // Handle array or object with results
        setSub(Array.isArray(subRes) ? subRes : subRes.results || []);
        setOffices(
          Array.isArray(officeRes) ? officeRes : officeRes.results || []
        );
      } catch (error) {
        console.error("Error fetching data:", error.response || error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Filter when office changes
  useEffect(() => {
    let filtered = sub;

    // Filter by office
    if (selectedOffice !== "all") {
      filtered = filtered.filter((d) => d.office === parseInt(selectedOffice));
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(term) ||
          s.address?.toLowerCase().includes(term)
      );
    }

    setFilteredSub(filtered);
    setPage(1); // Reset to first page on filter change
  }, [selectedOffice, searchTerm, sub]);

  // Slice for current page
  const paginatedSub = filteredSub.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredSub.length / pageSize);

  //   const getJunctionIcon = (type: string) => {
  //     switch (type) {
  //       case "Splitter":
  //         return Cpu;
  //       case "Router":
  //       case "Media Converter":
  //         return Router;
  //       default:
  //         return Activity;
  //     }
  //   };

  const getOfficeName = (officeId: number) => {
    const office = offices.find((o) => o.id === officeId);
    return office ? office.name : "Unknown Office";
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this suboffice?")) return;
    try {
      await deleteSub(id);
      setSub((prev) => prev.filter((d) => d.id !== id));
      toast.success("SubOffice deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete suboffice");
    }
  };

  if (loading) {
    return (
      <NetworkLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading suboffices...</p>
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
              Sub Offices Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Monitor and manage all network Sub Offices
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Sub Office
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
              placeholder="Search Sub Offices..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Sub Offices Table */}
        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-background shadow-sm">
                  <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left"> Name</th>
                    <th className="px-4 py-3 text-left">Address</th>

                    <th className="px-4 py-3 text-left">OLT</th>
                    <th className="px-4 py-3 text-left">Created</th>

                    <th className="px-4 py-3 w-[50px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSub.map((sub, idx) => (
                    <tr
                      key={sub.id}
                      className={`transition-colors hover:bg-muted/40 ${
                        idx % 2 === 0 ? "bg-muted/20" : "bg-background"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {sub.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">{sub.address}</td>
                      <td className="px-4 py-3">{getOfficeName(sub.office)}</td>
                      <td className="px-4 py-3">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openViewModal(sub)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditModal(sub)}
                            >
                              Edit Sub Office
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openMapModal(sub)}>
                              Show on Map
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(sub.id)}
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
              {paginatedSub.map((sub) => (
                <Card key={sub.id} className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sub.name}</CardTitle>
                      <CardDescription>
                        {sub.address} • {getOfficeName(sub.office)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(sub)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(sub)}>
                          Edit Sub Office
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openMapModal(sub)}>
                          Show on Map
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(sub.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>

                  <CardContent className="space-y-1 text-sm">
                    <p className="break-all whitespace-normal">
                      <strong>ID:</strong> {sub.id}
                    </p>
                    <p className="break-all whitespace-normal">
                      <strong>Created:</strong>{" "}
                      {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
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
            <DialogTitle>Edit Sub Office</DialogTitle>
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
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await updateSub(editData.id, editData);
                  setSub((prev) =>
                    prev.map((d) => (d.id === editData.id ? editData : d))
                  );
                  toast.success("Sub Office updated successfully");
                  setIsEditOpen(false);
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update Sub Office");
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
            <DialogTitle>Sub Office Details</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Name:</strong>
                <p>{viewData.name || "N/A"}</p>
              </div>
              <div>
                <strong>Address:</strong>
                <p>{viewData.address || "N/A"}</p>
              </div>
              <div>
                <strong>OLT:</strong>
                <p>{getOfficeName(viewData.office) || "N/A"}</p>
              </div>
              <div>
                <strong>ID:</strong>
                <p>{viewData.id}</p>
              </div>
              <div>
                <strong>Created At:</strong>
                <p>
                  {viewData.created_at
                    ? new Date(viewData.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              {/* Add description field if needed in the future */}
              {/* <div className="sm:col-span-2">
          <strong>Description:</strong>
          <p>{viewData.description || "N/A"}</p>
        </div> */}
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
                mapData.latitude ?? officeLocation?.latitude ?? 0,
                mapData.longitude ?? officeLocation?.longitude ?? 0,
              ]}
              zoom={14}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Selected Sub-office (highlighted) */}
              {mapData.latitude && mapData.logitude && (
                <Marker
                  position={[mapData.latitude, mapData.logitude]}
                  icon={subOfficeIcon}
                >
                  <Popup>
                    <b>{mapData.name} (Selected)</b>
                    <br />
                    {mapData.address || "No address"}
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

              {/* Other Sub-offices */}
              {relatedSub.map(
                (s) =>
                  s.latitude &&
                  s.logitude && (
                    <Marker
                      key={s.id}
                      position={[s.latitude, s.logitude]}
                      icon={subOfficeIcon}
                    >
                      <Popup>
                        <b>{s.name}</b>
                        <br />
                        {s.address || "No address"}
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

              {/* Customers */}
              {customers.map(
                (cust) =>
                  cust.latitude &&
                  cust.longitude && (
                    <Marker
                      key={cust.id}
                      position={[cust.latitude, cust.longitude]}
                      icon={customerIcon}
                    >
                      <Popup>
                        <b>{cust.name}</b>
                        <br />
                        {cust.address || "No address"}
                      </Popup>
                    </Marker>
                  )
              )}

              {/* Junctions Markers */}
              {relatedJunctions.map(
                (junction) =>
                  junction.latitude &&
                  junction.longitude && (
                    <Marker
                      key={junction.id}
                      position={[junction.latitude, junction.longitude]}
                      icon={junctionIcon}
                    >
                      <Popup>
                        <b>{junction.name}</b> <br />
                        {junction.description || "No description"}
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
