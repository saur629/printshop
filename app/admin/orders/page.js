"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from "@/lib/utils";
import { Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = [
  "all",
  "pending",
  "confirmed",
  "in-production",
  "quality-check",
  "shipped",
  "delivered",
  "cancelled",
];

import { AdminSidebar } from "@/app/admin/page";

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin")
      router.push("/");
  }, [status, session]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filterStatus !== "all") params.set("status", filterStatus);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchOrders();
  }, [status, filterStatus]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("Status updated");
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin/orders" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Orders
          </h1>
          <span className="badge bg-brand-100 text-brand-700">
            {orders.length} total
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="input pl-9 w-64"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filterStatus === s ? "bg-brand-500 text-white" : "bg-white text-ink-600 hover:bg-ink-100 border border-ink-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">
                    Order
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">
                    Items
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-ink-600">
                    Total
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-ink-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-ink-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-ink-100 hover:bg-ink-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-ink-700">
                        <p>{order.user?.name || "Guest"}</p>
                        <p className="text-xs text-ink-400">
                          {order.user?.email || order.guestEmail}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-ink-600">
                        {order.items?.length} items
                      </td>
                      <td className="px-5 py-4 text-ink-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`badge ${ORDER_STATUS_COLORS[order.status]}`}
                        >
                          {order.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          disabled={updating === order._id}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="text-xs border border-ink-200 rounded-lg px-2 py-1.5 bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          {STATUSES.filter((s) => s !== "all").map((s) => (
                            <option key={s} value={s}>
                              {s.replace("-", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
