import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { bills } from "@/lib/admin-data";

export default function BillingPage() {
  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage patient invoices, service charges, room charges, payments, and due amounts."
        action={
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Create Bill
          </button>
        }
      />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Billing Form</h2>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Phone" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Appointment ID" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Doctor Charge" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Charge" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Service Charge" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Medicine Charge" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Discount" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Paid Amount" type="number" />
          <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <option>Payment Method</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bkash</option>
            <option>Nagad</option>
            <option>Bank Transfer</option>
          </select>
          <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <option>Payment Status</option>
            <option>Paid</option>
            <option>Unpaid</option>
            <option>Partial</option>
          </select>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Billing Records</h2>
          <p className="text-sm text-slate-500">This billing UI is ready for backend bill APIs later.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Appointment</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Room Charge</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Medicine</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Paid</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{bill.invoiceNumber}</td>
                  <td className="px-5 py-4 text-slate-700">{bill.patientName}</td>
                  <td className="px-5 py-4 text-slate-700">{bill.patientPhone}</td>
                  <td className="px-5 py-4 text-slate-700">#{bill.appointmentId}</td>
                  <td className="px-5 py-4 text-slate-700">{bill.roomNumber}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.doctorCharge}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.roomCharge}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.serviceCharge}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.medicineCharge}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.discount}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">৳ {bill.totalAmount}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.paidAmount}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {bill.dueAmount}</td>
                  <td className="px-5 py-4 text-slate-700">{bill.paymentMethod}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={bill.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}