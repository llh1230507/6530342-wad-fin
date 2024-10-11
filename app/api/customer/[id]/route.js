import Customer from "@/models/Customer";

export async function GET(request, { params }) {
  const id = params.id;
  const customer = await Customer.findById(id).populate("customer");
  console.log({ customer });
  return Response.json(customer);
}

export async function DELETE(request, { params }) {
  const id = params.id;
  return Response.json(await Customer.findByIdAndDelete(id));
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const customer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}


