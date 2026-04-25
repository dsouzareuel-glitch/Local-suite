"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const INITIAL_SERVICES = [
  { id: "1", name: "Haircut", price: 200, duration_min: 30, description: "Classic mens haircut + styling", is_active: true },
  { id: "2", name: "Beard Trim", price: 80, duration_min: 15, description: "Trim + shape + oil", is_active: true },
  { id: "3", name: "Facial (Cleanup)", price: 500, duration_min: 45, description: "Deep cleanse + moisturize", is_active: true },
  { id: "4", name: "Facial (Glow)", price: 800, duration_min: 60, description: "Premium glow treatment", is_active: true },
  { id: "5", name: "Hair Colour", price: 800, duration_min: 90, description: "Global colour + setting", is_active: false },
];

type Service = typeof INITIAL_SERVICES[0];

export default function ServicesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [editing, setEditing] = useState<Service | null>(null);
  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: "", duration_min: "", description: "" });

  const toggle = (id: string) => {
    setServices((s) => s.map((sv) => sv.id === id ? { ...sv, is_active: !sv.is_active } : sv));
    toast.success("Updated!");
  };

  const deleteService = (id: string) => {
    setServices((s) => s.filter((sv) => sv.id !== id));
    toast.success("Service deleted");
  };

  const saveEdit = () => {
    if (!editing) return;
    setServices((s) => s.map((sv) => sv.id === editing.id ? editing : sv));
    setEditing(null);
    toast.success("Service updated!");
  };

  const addService = () => {
    if (!newService.name || !newService.price) return toast.error("Name aur price daalo!");
    setServices((s) => [...s, {
      id: Date.now().toString(),
      name: newService.name,
      price: Number(newService.price),
      duration_min: Number(newService.duration_min) || 30,
      description: newService.description,
      is_active: true,
    }]);
    setNewService({ name: "", price: "", duration_min: "", description: "" });
    setAdding(false);
    toast.success("Service added!");
  };

  const activeServices = services.filter((s) => s.is_active);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-gray-400">{activeServices.length} active — bot yahi prices share karta hai</p>
        </div>
        <button id="add-service" onClick={() => setAdding(true)} className="btn-primary py-2 px-4 text-sm">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card border border-green-500/20 animate-slide-in space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-green-400">New Service</h2>
            <button onClick={() => setAdding(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Service Name *</label>
              <input id="new-service-name" className="input-field py-2 text-sm" placeholder="e.g. Haircut" value={newService.name} onChange={(e) => setNewService((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Price (₹) *</label>
              <input id="new-service-price" className="input-field py-2 text-sm" placeholder="200" type="number" value={newService.price} onChange={(e) => setNewService((s) => ({ ...s, price: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Duration (min)</label>
              <input id="new-service-duration" className="input-field py-2 text-sm" placeholder="30" type="number" value={newService.duration_min} onChange={(e) => setNewService((s) => ({ ...s, duration_min: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <input className="input-field py-2 text-sm" placeholder="Brief description..." value={newService.description} onChange={(e) => setNewService((s) => ({ ...s, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addService} className="btn-primary py-2 px-4 text-sm"><Save className="w-4 h-4" />Save Service</button>
            <button onClick={() => setAdding(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="card border border-white/5">
        <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Bot Preview — What customers see:</div>
        <div className="wa-bubble-out self-start text-sm" style={{ whiteSpace: "pre-line", display: "inline-block", maxWidth: "100%" }}>
          {`✨ *Glam Studios Price List:*\n\n${activeServices.map((s) => `• *${s.name}* — ₹${s.price} (${s.duration_min} min)`).join("\n")}\n\n📅 Booking ke liye reply karein: *BOOK*`}
        </div>
      </div>

      {/* Services list */}
      <div className="space-y-2">
        {services.map((service) => (
          <div key={service.id} className={`card glass-hover flex items-center gap-4 transition-opacity ${!service.is_active ? "opacity-50" : ""}`}>
            {editing?.id === service.id ? (
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input className="input-field py-1.5 text-sm col-span-2" value={editing.name} onChange={(e) => setEditing((s) => s ? { ...s, name: e.target.value } : s)} />
                <input className="input-field py-1.5 text-sm" type="number" value={editing.price} onChange={(e) => setEditing((s) => s ? { ...s, price: Number(e.target.value) } : s)} />
                <input className="input-field py-1.5 text-sm" type="number" value={editing.duration_min} onChange={(e) => setEditing((s) => s ? { ...s, duration_min: Number(e.target.value) } : s)} />
                <div className="col-span-2 flex gap-2">
                  <button onClick={saveEdit} className="btn-primary py-1.5 px-3 text-xs"><Save className="w-3 h-3" />Save</button>
                  <button onClick={() => setEditing(null)} className="btn-secondary py-1.5 px-3 text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-sm">{service.name}</div>
                    {!service.is_active && <span className="text-xs text-gray-500 bg-white/5 rounded px-2 py-0.5">Off</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{service.description}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-green-400">₹{service.price}</div>
                  <div className="text-xs text-gray-500">{service.duration_min} min</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toggle(service.id)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    {service.is_active
                      ? <ToggleRight className="w-5 h-5 text-green-400" />
                      : <ToggleLeft className="w-5 h-5 text-gray-500" />}
                  </button>
                  <button onClick={() => setEditing(service)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteService(service.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
