import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Download, Home, ListOrdered } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useOrders } from "../context/OrderContext";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const OrderSuccess = () => {
  const { orders, loading, fetchOrders } = useOrders();
  const [latestOrder, setLatestOrder] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (orders.length > 0) {
      setLatestOrder(orders[0]);
    }
  }, [orders]);

  const generateInvoice = () => {
    if (!latestOrder) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    const primaryColor = [40, 53, 147];
    const secondaryColor = [233, 236, 239];
    const textColor = [33, 37, 41];
    const lightTextColor = [108, 117, 125];

    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("Merbiz", margin, 20);

    doc.setFontSize(16);
    doc.setTextColor(...textColor);
    doc.text("INVOICE", pageWidth - margin, 20, { align: "right" });

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, 25, pageWidth - margin, 25);

    doc.setFontSize(10);
    doc.setTextColor(...lightTextColor);
    doc.setFont("helvetica", "normal");
    doc.text("Kakkodi", margin, 35);
    doc.text("New Bazar, 673611", margin, 40);
    doc.text("Phone: (123) 456-7890", margin, 45);
    doc.text("Email: Merbiz@gmail.com", margin, 50);

    doc.setTextColor(...textColor);
    doc.text(
      `Invoice : ${latestOrder._id ?? latestOrder.id ?? "N/A"}`,
      pageWidth - margin,
      35,
      {
        align: "right",
      }
    );
    doc.text(
      `Date: ${latestOrder.createdAt ?? latestOrder.date ?? "N/A"}`,
      pageWidth - margin,
      40,
      {
        align: "right",
      }
    );
    doc.text(
      `Status: ${latestOrder.paymentStatus ?? "N/A"}`,
      pageWidth - margin,
      45,
      {
        align: "right",
      }
    );

    const addr = latestOrder.shippingAddress || {};
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", margin, 65);
    doc.setFont("helvetica", "normal");
    doc.text(addr.name || "Customer", margin, 70);
    doc.text(addr.street || "", margin, 75);
    doc.text(addr.apartment || "", margin, 75);

    doc.text(
      `${addr.city || ""}, ${addr.state || ""} ${addr.zip || ""}`,
      margin,
      80
    );
    doc.text(addr.country || "", margin, 85);

    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT METHOD:", margin, 95);
    doc.setFont("helvetica", "normal");
    doc.text(latestOrder.paymentMethod || "N/A", margin, 100);

    autoTable(doc, {
      startY: 110,
      head: [
        [
          {
            content: "Product",
            styles: {
              fillColor: primaryColor,
              textColor: 255,
              fontStyle: "bold",
            },
          },
          {
            content: "Price",
            styles: {
              fillColor: primaryColor,
              textColor: 255,
              fontStyle: "bold",
              halign: "right",
            },
          },
          {
            content: "Qty",
            styles: {
              fillColor: primaryColor,
              textColor: 255,
              fontStyle: "bold",
              halign: "right",
            },
          },
          {
            content: "Total",
            styles: {
              fillColor: primaryColor,
              textColor: 255,
              fontStyle: "bold",
              halign: "right",
            },
          },
        ],
      ],
      body: (latestOrder.items || []).map((item) => [
        { content: item.name || "Unnamed", styles: { fontStyle: "bold" } },
        {
          content: `$${(item.price ?? 0).toFixed(2)}`,
          styles: { halign: "right" },
        },
        { content: item.quantity ?? 1, styles: { halign: "right" } },
        {
          content: `$${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}`,
          styles: { halign: "right" },
        },
      ]),
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: textColor,
        lineColor: secondaryColor,
        lineWidth: 0.2,
      },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: margin, right: margin },
      tableWidth: "auto",
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: finalY,
      body: [
        [
          {
            content: "Subtotal:",
            styles: { fontStyle: "bold", halign: "right" },
          },
          {
            content: `$${(latestOrder.subtotal ?? 0).toFixed(2)}`,
            styles: { halign: "right" },
          },
        ],
        [
          {
            content: "Shipping:",
            styles: { fontStyle: "bold", halign: "right" },
          },
          {
            content: `$${(latestOrder.shipping ?? 0).toFixed(2)}`,
            styles: { halign: "right" },
          },
        ],
        [
          { content: "Tax:", styles: { fontStyle: "bold", halign: "right" } },
          {
            content: `$${(latestOrder.tax ?? 0).toFixed(2)}`,
            styles: { halign: "right" },
          },
        ],
        [
          {
            content: "Total:",
            styles: {
              fontStyle: "bold",
              halign: "right",
              fillColor: secondaryColor,
            },
          },
          {
            content: `$${(latestOrder.total ?? 0).toFixed(2)}`,
            styles: {
              fontStyle: "bold",
              halign: "right",
              fillColor: secondaryColor,
            },
          },
        ],
      ],
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: textColor,
        lineColor: secondaryColor,
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: "auto", minCellWidth: 50 },
        1: { cellWidth: 40 },
      },
      margin: { left: pageWidth - 100, right: margin },
      tableWidth: 85,
    });

    doc.setFontSize(8);
    doc.setTextColor(...lightTextColor);
    doc.text("Thank you for your business!", pageWidth / 2, 280, {
      align: "center",
    });
    doc.text("Terms & Conditions apply", pageWidth / 2, 285, {
      align: "center",
    });

    doc.save(`invoice_${latestOrder.id ?? latestOrder._id}.pdf`);
  };

  if (loading || !latestOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const addr = latestOrder.shippingAddress || {};

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-gray-50">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-semibold mb-2">Thank You for Your Order!</h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        We've received your order #{latestOrder?.id ?? latestOrder?._id} and
        it's being processed. You'll get an email confirmation shortly.
      </p>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {addr.name}
              <br />
              {addr.street}
              <br />
              {addr.apartment}
              <br />
              {addr.city}, {addr.state} {addr.zip}
              <br />
              {addr.country}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Payment Information
            </h3>
            <p className="text-gray-600">
              <span className="font-medium">Method:</span>{" "}
              {latestOrder.paymentMethod}
              <br />
              <span className="font-medium">Status:</span>{" "}
              {latestOrder.paymentStatus}
              <br />
              <span className="font-medium">Order Date:</span>{" "}
              {latestOrder.date ?? latestOrder.createdAt}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-4">
            {(latestOrder.items || []).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              ${(latestOrder.subtotal ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              ${(latestOrder.shipping ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">
              ${(latestOrder.tax ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mt-4 pt-2 border-t text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              ${(latestOrder.total ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={generateInvoice}
          className="flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md font-medium"
        >
          <Download size={18} />
          Download Invoice
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <Link
          to="/myorders"
          className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium"
        >
          <ListOrdered size={18} />
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
