// MapTools.tsx
import { Button } from "@/components/ui/button";
import { MousePointer2, LineChart, PencilLine, Building2, MapPin, Router, Users, Trash2 } from "lucide-react";

export default function MapTools({
  drawMode,
  setDrawMode,
  setAddingSubOffice,
  setAddingJunction,
  setAddingDevice,
  setAddingCustomer,
  selected,
  handleDeleteSelected,
  handleEditRoute,
  editingRouteIdx,
  setEditingRouteIdx,
  setSelected,
  routes,
  mapRef
}: any) {
  return (
    <div className="absolute z-[1000] top-4 right-4 flex flex-col gap-2 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Draw Modes */}
      <Button
        className={`p-2 h-10 w-10 flex items-center justify-center ${drawMode === "disabled" ? "border-2 border-primary" : ""}`}
        variant="outline"
        title="Normal Mode"
        onClick={() => setDrawMode("disabled")}
      >
        <MousePointer2 className={`w-5 h-5 ${drawMode === "disabled" ? "text-primary" : ""}`} />
      </Button>
      <Button
        className={`p-2 h-10 w-10 flex items-center justify-center ${drawMode === "point" ? "border-2 border-primary" : ""}`}
        variant="outline"
        title="Draw Point-to-Point"
        onClick={() => setDrawMode("point")}
      >
        <LineChart className={`w-5 h-5 ${drawMode === "point" ? "text-primary" : ""}`} />
      </Button>
      <Button
        className={`p-2 h-10 w-10 flex items-center justify-center ${drawMode === "freehand" ? "border-2 border-primary" : ""}`}
        variant="outline"
        title="Free Draw"
        onClick={() => setDrawMode("freehand")}
      >
        <PencilLine className={`w-5 h-5 ${drawMode === "freehand" ? "text-primary" : ""}`} />
      </Button>

      {/* Add entities */}
      <Button
        className="p-2 h-10 w-10 flex items-center justify-center"
        variant="outline"
        title="Add Sub Office"
        onClick={() => { setAddingSubOffice(true); setSelected(null); }}
      >
        <Building2 className="w-5 h-5" />
      </Button>
      <Button
        className="p-2 h-10 w-10 flex items-center justify-center"
        variant="outline"
        title="Add Junction"
        onClick={() => { setAddingJunction(true); setSelected(null); }}
      >
        <MapPin className="w-5 h-5" />
      </Button>
      <Button
        className="p-2 h-10 w-10 flex items-center justify-center"
        variant="outline"
        title="Add Network Device"
        onClick={() => { setAddingDevice(true); setSelected(null); }}
      >
        <Router className="w-5 h-5" />
      </Button>
      <Button
        className="p-2 h-10 w-10 flex items-center justify-center"
        variant="outline"
        title="Add Customer"
        onClick={() => { setAddingCustomer(true); setSelected(null); }}
      >
        <Users className="w-5 h-5" />
      </Button>

      {/* Delete Selected */}
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

      {/* Edit Route */}
      {selected && selected.type === "route" && editingRouteIdx === null && (
        <Button
          className="p-2 h-10 w-10 flex items-center justify-center"
          variant="outline"
          title="Edit Route"
          onClick={handleEditRoute}
        >
          ✏️
        </Button>
      )}

      {/* Finish Editing */}
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
                layer.pm?.disable();
              }
            });
            setEditingRouteIdx(null);
            setSelected(null);
          }}
        >
          ✅
        </Button>
      )}
    </div>
  );
}
