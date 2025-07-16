"use client";

import { NetworkLayout } from "@/components/NetworkLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Map,
  MapPin,
  Router,
  Users,
  Zap,
  Share2,
  Building2,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { useState, useEffect } from "react";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";


// ✅ Sub Office icon (emoji-based, no need for images)
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


// 🔹 Geoman Drawing Controls
function GeomanControls({ mode }: { mode: "disabled" | "point" | "freehand" }) {
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
  }, [map, mode]);

  return null;
}

// 🔹 Sub Office Map Click Handler
function SubOfficeClickHandler({ onMapClick }: { onMapClick: (latlng: LatLngExpression) => void }) {
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
  const [drawMode, setDrawMode] = useState<"disabled" | "point" | "freehand">("disabled");

  const [addingSubOffice, setAddingSubOffice] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<LatLngExpression | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [subOffices, setSubOffices] = useState<{ name: string; address: string; position: LatLngExpression }[]>([]);

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
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            <Button className="bg-gradient-primary" variant="default">
              <Share2 className="w-4 h-4 mr-2" />
              Add Route
            </Button>
            <Button variant="outline" onClick={() => setAddingSubOffice(true)}>
              <Building2 className="w-4 h-4 mr-2" />
              Add Sub Office
            </Button>
            <Button variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Add Junction
            </Button>
            <Button variant="outline">
              <Router className="w-4 h-4 mr-2" />
              Add Network Device
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
            <div className="flex items-center gap-2 ml-2">
              <span className="font-medium text-sm">Draw Route:</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={drawMode}
                onChange={e => setDrawMode(e.target.value as any)}
              >
                <option value="disabled">Disabled</option>
                <option value="point">Point to Point</option>
                <option value="freehand">Free Hand</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Interactive Network Topology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[250px] sm:h-[400px] md:h-[600px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-border/50">
              {/* @ts-ignore */}
              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              >
                <GeomanControls mode={drawMode} />
                {/* @ts-ignore */}
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                  <Popup>
                    Example Device<br /> Fiber Node
                  </Popup>
                </Marker>

                {subOffices.map((office, idx) => (
                  <Marker key={idx} position={office.position} icon={subOfficeIcon}>
                    <Popup>
                      <strong>{office.name}</strong><br />
                      {office.address}
                    </Popup>
                  </Marker>
                ))}

                {addingSubOffice && (
                  <SubOfficeClickHandler
                    onMapClick={(latlng) => setClickedPosition([latlng.lat, latlng.lng])}
                  />
                )}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        {clickedPosition && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Sub Office</h2>
              <div className="space-y-2 mb-4">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Lat: {clickedPosition[0].toFixed(5)}, Lng: {clickedPosition[1].toFixed(5)}
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
                    setSubOffices([...subOffices, {
                      name: formData.name,
                      address: formData.address,
                      position: clickedPosition,
                    }]);
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
                  <span className="text-xs sm:text-sm text-muted-foreground">Active Routers</span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Switches</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Splitters</span>
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
                  <span className="text-xs sm:text-sm text-muted-foreground">Zone A</span>
                  <span className="text-success font-medium text-xs sm:text-base">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Zone B</span>
                  <span className="text-success font-medium text-xs sm:text-base">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Zone C</span>
                  <span className="text-warning font-medium text-xs sm:text-base">Maintenance</span>
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
                  <span className="text-xs sm:text-sm text-muted-foreground">Overall Health</span>
                  <span className="text-success font-medium text-xs sm:text-base">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Avg Latency</span>
                  <span className="font-medium text-xs sm:text-base">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Uptime</span>
                  <span className="text-success font-medium text-xs sm:text-base">99.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NetworkLayout>
  );
}
