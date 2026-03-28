"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: BarChart2 },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/products", label: "Products", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminSidebar({ active = '/admin' }) {
  return (
    <aside className="w-56 bg-ink-900 text-white min-h-screen shrink-0 flex flex-col">
      <div className="p-5 border-b border-ink-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded flex items-center justify-center text-xs font-bold">P</div>
          <span className="font-display font-bold">PrintCraft</span>
        </Link>
        <p className="text-xs text-ink-500 mt-1">Admin Panel</p>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active === href
                ? 'bg-brand-500 text-white'
                : 'text-ink-300 hover:bg-ink-800 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-ink-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-ink-400 hover:text-ink-200 text-xs rounded-lg hover:bg-ink-800 transition-colors"
        >
          ↗ View Store
        </Link>
      </div>
    </aside>
  )
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && session?.user?.role !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "admin") return;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [status, session]);

  if (status === "loading" || loading)
    return (
      <div className="flex min-h-screen bg-ink-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ink-400">
          Loading dashboard...
        </div>
      </div>
    );

  const { stats, recentOrders = [], revenueByDay = [] } = data || {};

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      sub: `${formatPrice(stats?.monthRevenue || 0)} this month`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      sub: `${stats?.monthOrders || 0} this month`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers || 0,
      sub: "registered accounts",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active Products",
      value: stats?.totalProducts || 0,
      sub: `${stats?.pendingOrders || 0} pending orders`,
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const chartData = revenueByDay.map((d) => ({
    date: new Date(d._id).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Revenue: parseFloat(d.revenue.toFixed(2)),
    Orders: d.orders,
  }));

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Dashboard
          </h1>
          <p className="text-ink-500 mt-1">
            Welcome back, {session?.user?.name?.split(" ")[0]} 👋
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-ink-500">{label}</p>
                <div
                  className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-ink-900 mb-1">{value}</p>
              <p className="text-xs text-ink-400">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="card p-6 xl:col-span-2">
            <h2 className="font-semibold text-ink-900 mb-5">
              Revenue — Last 7 Days
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeece6" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#7a6f5e" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#7a6f5e" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
                  <Area
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-ink-400 text-sm">
                No revenue data yet — orders will appear here
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-ink-400 text-sm text-center py-8">
                  No orders yet
                </p>
              ) : (
                recentOrders.map((order) => (
                  <Link
                    key={order._id}
                    href={`/admin/orders/${order._id}`}
                    className="flex items-center justify-between hover:bg-ink-50 p-2 rounded-lg -mx-2 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-ink-900 text-sm">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-ink-500">
                        {order.user?.name || "Guest"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-ink-900">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`badge text-xs ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
