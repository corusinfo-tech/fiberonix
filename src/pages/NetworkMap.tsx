"use client";

import { NetworkLayout } from "@/components/NetworkLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Map,
  MapPin,
  Router,
  Users,
  Zap,
  Share2,
  Building2,
  Trash2,
  MousePointer2,
  PencilLine,
  LineChart,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { useState, useEffect, useRef } from "react";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";


import React from "react";

const subOfficeIcon = new L.DivIcon({
  className: "custom-suboffice-icon",
  html: ReactDOMServer.renderToString(
    <div style={{ color: "#3b82f6", fontSize: "24px" }}>
      <Building2 />
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const junctionIcon = new L.DivIcon({
  className: "custom-junction-icon",
  html: ReactDOMServer.renderToString(
    <div style={{ color: "#f59e42", fontSize: "24px" }}>
      <MapPin />
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const deviceIcon = new L.DivIcon({
  className: "custom-device-icon",
  html: ReactDOMServer.renderToString(
    <div style={{ color: "#16a34a", fontSize: "24px" }}>
      <Router />
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customerIcon = new L.DivIcon({
  className: "custom-customer-icon",
  html: ReactDOMServer.renderToString(
    <div style={{ color: "#0ea5e9", fontSize: "24px" }}>
      <Users />
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function GeomanControls({
  mode,
  onRouteDraw,
}: {
  mode: "disabled" | "point" | "freehand";
  onRouteDraw?: (latlngs: LatLngExpression[]) => void;
}) {
  const map = useMap();
  useEffect(() => {
    map.pm?.removeControls();
    map.pm?.addControls({
      position: "topleft",
      drawMarker: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      drawPolygon: false,
      drawPolyline: mode === "point" || mode === "freehand",
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    });

    if (mode === "point") {
      map.pm.disableDraw();
      map.pm.enableDraw("Line", {
        templineStyle: { color: "blue" },
        hintlineStyle: { color: "blue", dashArray: [5, 5] },
        allowSelfIntersection: false,
        finishOn: "dblclick",
      });
    } else if (mode === "freehand") {
      map.pm.disableDraw();
      map.pm.enableDraw("Line", {
        templineStyle: { color: "red" },
        hintlineStyle: { color: "red", dashArray: [5, 5] },
        allowSelfIntersection: false,
        finishOn: "mouseup",
        freehand: true,
      });
    } else {
      map.pm.disableDraw();
    }

    // Listen for route creation
    if (onRouteDraw) {
      const handleCreate = (e: any) => {
        if (e.layer && e.layer instanceof L.Polyline) {
          const latlngs = e.layer
            .getLatLngs()
            .map((latlng: any) => [latlng.lat, latlng.lng]);
          onRouteDraw(latlngs);
          map.removeLayer(e.layer); // Remove the temp drawn layer
        }
      };
      map.on("pm:create", handleCreate);
      return () => {
        map.off("pm:create", handleCreate);
      };
    }
  }, [map, mode, onRouteDraw]);

  return null;
}

//  Sub Office Map Click Handler
function SubOfficeClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: LatLngExpression) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng);
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);
  return null;
}

function JunctionClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: LatLngExpression) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng);
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);
  return null;
}

function DeviceClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: LatLngExpression) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng);
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);
  return null;
}

function CustomerClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: LatLngExpression) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng);
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);
  return null;
}

export default function NetworkMap() {
  const center: LatLngExpression = [51.505, -0.09];
  const [drawMode, setDrawMode] = useState<"disabled" | "point" | "freehand">(
    "disabled"
  );

  const [addingSubOffice, setAddingSubOffice] = useState(false);
  const [clickedPosition, setClickedPosition] =
    useState<LatLngExpression | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [subOffices, setSubOffices] = useState<
    { name: string; address: string; position: LatLngExpression }[]
  >([]);

  const [addingJunction, setAddingJunction] = useState(false);
  const [clickedJunctionPosition, setClickedJunctionPosition] =
    useState<LatLngExpression | null>(null);
  const [junctionFormData, setJunctionFormData] = useState({
    name: "",
    postcode: "",
  });
  const [junctions, setJunctions] = useState<
    { name: string; postcode: string; position: LatLngExpression }[]
  >([]);

  const [addingDevice, setAddingDevice] = useState(false);
  const [clickedDevicePosition, setClickedDevicePosition] =
    useState<LatLngExpression | null>(null);
  const [deviceFormData, setDeviceFormData] = useState({
    type: "",
    ratio: "",
    description: "",
    maxSpeed: "",
    colourCode: "",
    insertionLoss: "",
    returnLoss: "",
    supportProtocol: "",
    portCount: "",
  });
  const [devices, setDevices] = useState<any[]>([]);

  const [addingCustomer, setAddingCustomer] = useState(false);
  const [clickedCustomerPosition, setClickedCustomerPosition] =
    useState<LatLngExpression | null>(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [customers, setCustomers] = useState<any[]>([]);

  const [pendingRoute, setPendingRoute] = useState<LatLngExpression[] | null>(
    null
  );
  const [routeName, setRouteName] = useState("");
  const [routes, setRoutes] = useState<
    { name: string; latlngs: LatLngExpression[] }[]
  >([]);

  // Selection state for delete button
  const [selected, setSelected] = useState<null | {
    type: string;
    index: number;
  }>(null);

  // For editing a route
  const mapRef = useRef<any>(null);
  const [editingRouteIdx, setEditingRouteIdx] = useState<number | null>(null);

  // Handler to enable edit mode for a route
  const handleEditRoute = () => {
    if (selected && selected.type === "route") {
      setEditingRouteIdx(selected.index);
      // Enable edit mode for the selected route after render
      setTimeout(() => {
        const map = mapRef.current;
        if (!map) return;
        // Find the polyline layer for this route
        map.eachLayer((layer: any) => {
          if (layer instanceof L.Polyline) {
            // Compare latlngs
            const latlngs = layer.getLatLngs();
            const routeLatlngs = routes[selected.index].latlngs;
            if (
              latlngs.length === routeLatlngs.length &&
              latlngs.every(
                (pt: any, i: number) =>
                  Math.abs(pt.lat - routeLatlngs[i][0]) < 1e-8 &&
                  Math.abs(pt.lng - routeLatlngs[i][1]) < 1e-8
              )
            ) {
              // Mark this layer as editable (custom property, not a prop)
              (layer as any).pmIgnore = false;
              layer.pm.enable({ allowSelfIntersection: false });
              layer.on("pm:edit", (e: any) => {
                // Update route in state
                const newLatLngs = e.layer
                  .getLatLngs()
                  .map((pt: any) => [pt.lat, pt.lng]);
                setRoutes((rts) =>
                  rts.map((r, idx) =>
                    idx === selected.index ? { ...r, latlngs: newLatLngs } : r
                  )
                );
              });
              layer.on("pm:editend", () => {
                layer.pm.disable();
                setEditingRouteIdx(null);
              });
            }
          }
        });
      }, 100);
    }
  };

  // Delete handler
  const handleDeleteSelected = () => {
    if (!selected) return;
    if (selected.type === "subOffice")
      setSubOffices(subOffices.filter((_, i) => i !== selected.index));
    if (selected.type === "junction")
      setJunctions(junctions.filter((_, i) => i !== selected.index));
    if (selected.type === "device")
      setDevices(devices.filter((_, i) => i !== selected.index));
    if (selected.type === "customer")
      setCustomers(customers.filter((_, i) => i !== selected.index));
    if (selected.type === "route")
      setRoutes(routes.filter((_, i) => i !== selected.index));
    setSelected(null);
  };

  return (
    <NetworkLayout>
      <div className="space-y-6 px-2 sm:px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Network Map
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Interactive optical fiber network visualization
            </p>
          </div>
        </div>

        {/* Map Container */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          {/* Hide CardHeader and heading on small screens */}
          <CardHeader className="hidden sm:block">
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Interactive Network Topology
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="relative w-full h-[calc(100vh-2rem)] sm:h-[400px] md:h-[600px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-border/50 overflow-visible">
              {/* Floating Map Controls */}
              {/* Right-side controls */}
              <div className="absolute z-[1000] top-4 right-4 flex flex-col gap-2 max-h-[calc(100vh-2rem)] overflow-y-auto">
                {/* Draw tool icons */}
                <Button
                  className={`p-2 h-10 w-10 flex items-center justify-center ${
                    drawMode === "disabled" ? "border-2 border-primary" : ""
                  }`}
                  variant="outline"
                  title="Normal Mode"
                  onClick={() => setDrawMode("disabled")}
                >
                  <MousePointer2
                    className={`w-5 h-5 ${
                      drawMode === "disabled" ? "text-primary" : ""
                    }`}
                  />
                </Button>
                <Button
                  className={`p-2 h-10 w-10 flex items-center justify-center ${
                    drawMode === "point" ? "border-2 border-primary" : ""
                  }`}
                  variant="outline"
                  title="Draw Point-to-Point"
                  onClick={() => setDrawMode("point")}
                >
                  <LineChart
                    className={`w-5 h-5 ${
                      drawMode === "point" ? "text-primary" : ""
                    }`}
                  />
                </Button>
                <Button
                  className={`p-2 h-10 w-10 flex items-center justify-center ${
                    drawMode === "freehand" ? "border-2 border-primary" : ""
                  }`}
                  variant="outline"
                  title="Free Draw"
                  onClick={() => setDrawMode("freehand")}
                >
                  <PencilLine
                    className={`w-5 h-5 ${
                      drawMode === "freehand" ? "text-primary" : ""
                    }`}
                  />
                </Button>
                {/* Action icons (Add Sub Office, Add Junction, etc.) follow below, as before */}
                <Button
                  className="p-2 h-10 w-10 flex items-center justify-center"
                  variant="outline"
                  title="Add Sub Office"
                  onClick={() => {
                    setAddingSubOffice(true);
                    setSelected(null);
                  }}
                >
                  <Building2 className="w-5 h-5" />
                </Button>
                <Button
                  className="p-2 h-10 w-10 flex items-center justify-center"
                  variant="outline"
                  title="Add Junction"
                  onClick={() => {
                    setAddingJunction(true);
                    setSelected(null);
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </Button>
                <Button
                  className="p-2 h-10 w-10 flex items-center justify-center"
                  variant="outline"
                  title="Add Network Device"
                  onClick={() => {
                    setAddingDevice(true);
                    setSelected(null);
                  }}
                >
                  <Router className="w-5 h-5" />
                </Button>
                <Button
                  className="p-2 h-10 w-10 flex items-center justify-center"
                  variant="outline"
                  title="Add Customer"
                  onClick={() => {
                    setAddingCustomer(true);
                    setSelected(null);
                  }}
                >
                  <Users className="w-5 h-5" />
                </Button>
                {selected && (
                  <Button
                    className="p-2 h-10 w-10 flex items-center justify-center"
                    variant="destructive"
                    title="Delete Selected"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
                {/* Edit Route button in right controls */}
                {selected &&
                  selected.type === "route" &&
                  editingRouteIdx === null && (
                    <Button
                      className="p-2 h-10 w-10 flex items-center justify-center"
                      variant="outline"
                      title="Edit Route"
                      onClick={handleEditRoute}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z"
                        />
                      </svg>
                    </Button>
                  )}
                {/* Finish Editing button in right controls */}
                {editingRouteIdx !== null && (
                  <Button
                    className="p-2 h-10 w-10 flex items-center justify-center"
                    variant="outline"
                    title="Finish Editing"
                    onClick={() => {
                      const map = mapRef.current;
                      if (!map) return;
                      map.eachLayer((layer: any) => {
                        if (layer instanceof L.Polyline) {
                          const latlngs = layer.getLatLngs();
                          const routeLatlngs = routes[editingRouteIdx].latlngs;
                          if (
                            latlngs.length === routeLatlngs.length &&
                            latlngs.every(
                              (pt: any, i: number) =>
                                Math.abs(pt.lat - routeLatlngs[i][0]) < 1e-8 &&
                                Math.abs(pt.lng - routeLatlngs[i][1]) < 1e-8
                            )
                          ) {
                            layer.pm.disable();
                          }
                        }
                      });
                      setEditingRouteIdx(null);
                      setSelected(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </Button>
                )}
              </div>
              {/* @ts-ignore */}
              <MapContainer
                whenReady={({ target }: { target: L.Map }) => {
                  mapRef.current = target;
                }}
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.5rem",
                }}
              >
                <GeomanControls
                  mode={drawMode}
                  onRouteDraw={(latlngs) => setPendingRoute(latlngs)}
                />
                {/* @ts-ignore */}
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                  <Popup>
                    Example Device
                    <br /> Fiber Node
                  </Popup>
                </Marker>

                {subOffices.map((office, idx) => (
                  // @ts-ignore
                  <Marker
                    key={"suboffice-" + idx}
                    position={office.position}
                    icon={subOfficeIcon as L.Icon}
                    eventHandlers={{
                      click: () =>
                        setSelected({ type: "subOffice", index: idx }),
                      popupclose: () =>
                        setSelected((selected) =>
                          selected &&
                          selected.type === "subOffice" &&
                          selected.index === idx
                            ? null
                            : selected
                        ),
                    }}
                  >
                    <Popup>
                      <strong>{office.name}</strong>
                      <br />
                      {office.address}
                    </Popup>
                  </Marker>
                ))}
                {junctions.map((junction, idx) => (
                  // @ts-ignore
                  <Marker
                    key={"junction-" + idx}
                    position={junction.position}
                    icon={junctionIcon as L.Icon}
                    eventHandlers={{
                      click: () =>
                        setSelected({ type: "junction", index: idx }),
                      popupclose: () =>
                        setSelected((selected) =>
                          selected &&
                          selected.type === "junction" &&
                          selected.index === idx
                            ? null
                            : selected
                        ),
                    }}
                  >
                    <Popup>
                      <strong>{junction.name}</strong>
                      <br />
                      Postcode: {junction.postcode}
                    </Popup>
                  </Marker>
                ))}
                {devices.map((device, idx) => (
                  // @ts-ignore
                  <Marker
                    key={"device-" + idx}
                    position={device.position}
                    icon={deviceIcon as L.Icon}
                    eventHandlers={{
                      click: () => setSelected({ type: "device", index: idx }),
                      popupclose: () =>
                        setSelected((selected) =>
                          selected &&
                          selected.type === "device" &&
                          selected.index === idx
                            ? null
                            : selected
                        ),
                    }}
                  >
                    <Popup>
                      <strong>{device.type}</strong>
                      <br />
                      Ratio: {device.ratio}
                      <br />
                      Desc: {device.description}
                      <br />
                      Max Speed: {device.maxSpeed}
                      <br />
                      Colour: {device.colourCode}
                      <br />
                      Insertion Loss: {device.insertionLoss}
                      <br />
                      Return Loss: {device.returnLoss}
                      <br />
                      Protocol: {device.supportProtocol}
                      <br />
                      Ports: {device.portCount}
                      <br />
                      Lat: {device.position[0].toFixed(5)}, Lng:{" "}
                      {device.position[1].toFixed(5)}
                    </Popup>
                  </Marker>
                ))}
                {customers.map((customer, idx) => (
                  // @ts-ignore
                  <Marker
                    key={"customer-" + idx}
                    position={customer.position}
                    icon={customerIcon as L.Icon}
                    eventHandlers={{
                      click: () =>
                        setSelected({ type: "customer", index: idx }),
                      popupclose: () =>
                        setSelected((selected) =>
                          selected &&
                          selected.type === "customer" &&
                          selected.index === idx
                            ? null
                            : selected
                        ),
                    }}
                  >
                    <Popup>
                      <strong>{customer.name}</strong>
                      <br />
                      {customer.email}
                      <br />
                      {customer.address}
                      <br />
                      {customer.phone}
                      <br />
                      Lat: {customer.position[0].toFixed(5)}, Lng:{" "}
                      {customer.position[1].toFixed(5)}
                    </Popup>
                  </Marker>
                ))}
                {routes.map((route, idx) => {
                  const isSelected =
                    selected &&
                    selected.type === "route" &&
                    selected.index === idx;
                  return (
                    <React.Fragment key={idx}>
                      {/* Hitbox polyline for easier selection */}
                      <Polyline
                        key={"route-hitbox-" + idx}
                        positions={route.latlngs}
                        pathOptions={{
                          color: "transparent",
                          weight: 18,
                          opacity: 0,
                        }}
                        eventHandlers={{
                          click: () =>
                            setSelected({ type: "route", index: idx }),
                          mouseover: (e) => {
                            e.target._path.style.cursor = "pointer";
                          },
                          mouseout: (e) => {
                            e.target._path.style.cursor = "";
                          },
                          popupclose: () =>
                            setSelected((selected) =>
                              selected &&
                              selected.type === "route" &&
                              selected.index === idx
                                ? null
                                : selected
                            ),
                        }}
                      >
                        {isSelected && (
                          <Popup>
                            <strong>{route.name}</strong>
                          </Popup>
                        )}
                      </Polyline>
                      {/* Visible route polyline */}
                      <Polyline
                        key={"route-" + idx}
                        positions={route.latlngs}
                        pathOptions={{
                          color:
                            editingRouteIdx === idx
                              ? "#f59e42"
                              : isSelected
                              ? "#2563eb"
                              : "#3b82f6",
                          weight: 4,
                        }}
                      />
                    </React.Fragment>
                  );
                })}

                {addingSubOffice && (
                  <SubOfficeClickHandler
                    onMapClick={(latlng) =>
                      setClickedPosition([latlng.lat, latlng.lng])
                    }
                  />
                )}
                {addingJunction && (
                  <JunctionClickHandler
                    onMapClick={(latlng) =>
                      setClickedJunctionPosition([latlng.lat, latlng.lng])
                    }
                  />
                )}
                {addingDevice && (
                  <DeviceClickHandler
                    onMapClick={(latlng) =>
                      setClickedDevicePosition([latlng.lat, latlng.lng])
                    }
                  />
                )}
                {addingCustomer && (
                  <CustomerClickHandler
                    onMapClick={(latlng) =>
                      setClickedCustomerPosition([latlng.lat, latlng.lng])
                    }
                  />
                )}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Modal for Sub Office */}
        {clickedPosition && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Sub Office</h2>
              <div className="space-y-2 mb-4">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Lat: {clickedPosition[0].toFixed(5)}, Lng:{" "}
                  {clickedPosition[1].toFixed(5)}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setClickedPosition(null);
                    setFormData({ name: "", address: "" });
                    setAddingSubOffice(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={() => {
                    setSubOffices([
                      ...subOffices,
                      {
                        name: formData.name,
                        address: formData.address,
                        position: clickedPosition,
                      },
                    ]);
                    setClickedPosition(null);
                    setFormData({ name: "", address: "" });
                    setAddingSubOffice(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Junction */}
        {clickedJunctionPosition && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Junction</h2>
              <div className="space-y-2 mb-4">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                  value={junctionFormData.name}
                  onChange={(e) =>
                    setJunctionFormData({
                      ...junctionFormData,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Postcode"
                  value={junctionFormData.postcode}
                  onChange={(e) =>
                    setJunctionFormData({
                      ...junctionFormData,
                      postcode: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Lat: {clickedJunctionPosition[0].toFixed(5)}, Lng:{" "}
                  {clickedJunctionPosition[1].toFixed(5)}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setClickedJunctionPosition(null);
                    setJunctionFormData({ name: "", postcode: "" });
                    setAddingJunction(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={() => {
                    setJunctions([
                      ...junctions,
                      {
                        name: junctionFormData.name,
                        postcode: junctionFormData.postcode,
                        position: clickedJunctionPosition,
                      },
                    ]);
                    setClickedJunctionPosition(null);
                    setJunctionFormData({ name: "", postcode: "" });
                    setAddingJunction(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Network Device */}
        {clickedDevicePosition && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Network Device</h2>
              <div className="space-y-2 mb-4">
                <select
                  className="w-full border rounded px-3 py-2"
                  value={deviceFormData.type}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">Select Device Type</option>
                  <option value="Splitter">Splitter</option>
                  <option value="Coupler">Coupler</option>
                  <option value="OLT">OLT</option>
                  <option value="ONT">ONT</option>
                  <option value="ODF">ODF</option>
                  <option value="Patch Panel">Patch Panel</option>
                  <option value="Mux/Demux">Mux/Demux</option>
                  <option value="Amplifier">Amplifier</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={deviceFormData.ratio}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      ratio: e.target.value,
                    })
                  }
                >
                  <option value="">Select Ratio</option>
                  <option value="N/A">N/A</option>
                  <option value="1:2">1:2</option>
                  <option value="1:4">1:4</option>
                  <option value="1:8">1:8</option>
                  <option value="1:16">1:16</option>
                  <option value="1:32">1:32</option>
                  <option value="1:64">1:64</option>
                </select>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Description"
                  value={deviceFormData.description}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Max Speed"
                  value={deviceFormData.maxSpeed}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      maxSpeed: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Colour Code"
                  value={deviceFormData.colourCode}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      colourCode: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Insertion Loss"
                  value={deviceFormData.insertionLoss}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      insertionLoss: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Return Loss"
                  value={deviceFormData.returnLoss}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      returnLoss: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Support Protocol"
                  value={deviceFormData.supportProtocol}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      supportProtocol: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Port Count"
                  type="number"
                  value={deviceFormData.portCount}
                  onChange={(e) =>
                    setDeviceFormData({
                      ...deviceFormData,
                      portCount: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Lat: {clickedDevicePosition[0].toFixed(5)}, Lng:{" "}
                  {clickedDevicePosition[1].toFixed(5)}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setClickedDevicePosition(null);
                    setDeviceFormData({
                      type: "",
                      ratio: "",
                      description: "",
                      maxSpeed: "",
                      colourCode: "",
                      insertionLoss: "",
                      returnLoss: "",
                      supportProtocol: "",
                      portCount: "",
                    });
                    setAddingDevice(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={() => {
                    setDevices([
                      ...devices,
                      {
                        ...deviceFormData,
                        position: clickedDevicePosition,
                      },
                    ]);
                    setClickedDevicePosition(null);
                    setDeviceFormData({
                      type: "",
                      ratio: "",
                      description: "",
                      maxSpeed: "",
                      colourCode: "",
                      insertionLoss: "",
                      returnLoss: "",
                      supportProtocol: "",
                      portCount: "",
                    });
                    setAddingDevice(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Route Naming */}
        {pendingRoute && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Name the Route</h2>
              <div className="space-y-2 mb-4">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Route Name"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Points: {pendingRoute.length}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPendingRoute(null);
                    setRouteName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={() => {
                    setRoutes([
                      ...routes,
                      { name: routeName, latlngs: pendingRoute },
                    ]);
                    setPendingRoute(null);
                    setRouteName("");
                    setDrawMode("disabled");
                  }}
                  disabled={!routeName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Customer */}
        {clickedCustomerPosition && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Customer</h2>
              <div className="space-y-2 mb-4">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                  value={customerFormData.name}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email"
                  value={customerFormData.email}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      email: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Address"
                  value={customerFormData.address}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      address: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Phone Number"
                  value={customerFormData.phone}
                  onChange={(e) =>
                    setCustomerFormData({
                      ...customerFormData,
                      phone: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Lat: {clickedCustomerPosition[0].toFixed(5)}, Lng:{" "}
                  {clickedCustomerPosition[1].toFixed(5)}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setClickedCustomerPosition(null);
                    setCustomerFormData({
                      name: "",
                      email: "",
                      address: "",
                      phone: "",
                    });
                    setAddingCustomer(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={() => {
                    setCustomers([
                      ...customers,
                      {
                        ...customerFormData,
                        position: clickedCustomerPosition,
                      },
                    ]);
                    setClickedCustomerPosition(null);
                    setCustomerFormData({
                      name: "",
                      email: "",
                      address: "",
                      phone: "",
                    });
                    setAddingCustomer(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Router className="w-5 h-5" />
                Network Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Active Routers
                  </span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Switches
                  </span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Splitters
                  </span>
                  <span className="font-medium">120</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Coverage Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Zone A
                  </span>
                  <span className="text-success font-medium text-xs sm:text-base">
                    Online
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Zone B
                  </span>
                  <span className="text-success font-medium text-xs sm:text-base">
                    Online
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Zone C
                  </span>
                  <span className="text-warning font-medium text-xs sm:text-base">
                    Maintenance
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Overall Health
                  </span>
                  <span className="text-success font-medium text-xs sm:text-base">
                    Excellent
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Avg Latency
                  </span>
                  <span className="font-medium text-xs sm:text-base">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Uptime
                  </span>
                  <span className="text-success font-medium text-xs sm:text-base">
                    99.8%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NetworkLayout>
  );
}
