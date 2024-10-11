export default async function Home({ params }) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  
    const data = await fetch(`${API_BASE}/customer/${params.id}`, { cache: "no-store" });
    const customer = await data.json();
    console.log({ customer, category: customer.category });
    // const id = params.id;
    return (
      <div className="m-4">
        <h1>Product</h1>
        <p className="font-bold text-xl text-blue-800">{customer.name}</p>
        <p>Interest: {customer.Interests}</p>
        <p>Date of Birth: {new Date(customer.DateofBirth).toLocaleDateString()}</p>
        <p>Member Number: {customer.MemberNumber}</p>
      </div>
    );
  }
  