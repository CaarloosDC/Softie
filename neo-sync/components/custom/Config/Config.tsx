import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Config() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "a12b3c4d",
      amount: 250,
      status: "success",
      email: "user1@yahoo.com",
    },
    {
      id: "b56c7d8e",
      amount: 75,
      status: "failed",
      email: "customer@outlook.com",
    },
    {
      id: "c90d1e2f",
      amount: 300,
      status: "pending",
      email: "client@domain.com",
    },
    {
      id: "d34e5f6g",
      amount: 50,
      status: "processing",
      email: "shopper@market.com",
    },
    {
      id: "e78f9g0h",
      amount: 150,
      status: "success",
      email: "buyer@shop.com",
    },
    {
      id: "f12g3h4i",
      amount: 200,
      status: "pending",
      email: "subscriber@mail.com",
    },
    {
      id: "g56h7i8j",
      amount: 175,
      status: "failed",
      email: "member@service.com",
    },
    {
      id: "h90i1j2k",
      amount: 225,
      status: "processing",
      email: "account@website.com",
    },
    {
      id: "i34j5k6l",
      amount: 80,
      status: "success",
      email: "user2@example.com",
    },
    {
      id: "j78k9l0m",
      amount: 95,
      status: "pending",
      email: "subscriber2@mail.com",
    },
    {
      id: "k12l3m4n",
      amount: 130,
      status: "success",
      email: "newuser@domain.com",
    },
    {
      id: "l56m7n8o",
      amount: 60,
      status: "failed",
      email: "another@example.com",
    },
    {
      id: "m90n1o2p",
      amount: 210,
      status: "processing",
      email: "customer2@outlook.com",
    },
    {
      id: "n34o5p6q",
      amount: 180,
      status: "pending",
      email: "shopuser@market.com",
    },
    {
      id: "o78p9q0r",
      amount: 140,
      status: "success",
      email: "buyer2@shop.com",
    },
    {
      id: "p12q3r4s",
      amount: 190,
      status: "failed",
      email: "subscriber3@mail.com",
    },
    {
      id: "q56r7s8t",
      amount: 160,
      status: "processing",
      email: "member2@service.com",
    },
    {
      id: "r90s1t2u",
      amount: 220,
      status: "success",
      email: "account2@website.com",
    },
    {
      id: "s34t5u6v",
      amount: 85,
      status: "pending",
      email: "user3@example.com",
    },
    {
      id: "t78u9v0w",
      amount: 105,
      status: "processing",
      email: "subscriber4@mail.com",
    },
  ];
}
