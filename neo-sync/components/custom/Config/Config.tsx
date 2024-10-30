import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export default function Config() {
  const data = getData();

  return (
    <div className="mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "María Pérez",
      rol: "administrador",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      name: "Juan López",
      rol: "lider",
      email: "example@gmail.com",
    },
    {
      id: "a12b3c4d",
      name: "Ana Gómez",
      rol: "usuario",
      email: "user1@yahoo.com",
    },
    {
      id: "b56c7d8e",
      name: "Carlos Martínez",
      rol: "usuario",
      email: "customer@outlook.com",
    },
    {
      id: "c90d1e2f",
      name: "Lucía Fernández",
      rol: "administrador",
      email: "client@domain.com",
    },
    {
      id: "d34e5f6g",
      name: "Pedro Sánchez",
      rol: "lider",
      email: "shopper@market.com",
    },
    {
      id: "e78f9g0h",
      name: "Sofía Ramírez",
      rol: "usuario",
      email: "buyer@shop.com",
    },
    {
      id: "f12g3h4i",
      name: "Diego Torres",
      rol: "administrador",
      email: "subscriber@mail.com",
    },
    {
      id: "g56h7i8j",
      name: "Laura Díaz",
      rol: "usuario",
      email: "member@service.com",
    },
    {
      id: "h90i1j2k",
      name: "Miguel Álvarez",
      rol: "lider",
      email: "account@website.com",
    },
    {
      id: "i34j5k6l",
      name: "Elena Ruiz",
      rol: "usuario",
      email: "user2@example.com",
    },
    {
      id: "j78k9l0m",
      name: "Fernando Morales",
      rol: "administrador",
      email: "subscriber2@mail.com",
    },
    {
      id: "k12l3m4n",
      name: "Valeria Ortiz",
      rol: "usuario",
      email: "newuser@domain.com",
    },
    {
      id: "l56m7n8o",
      name: "Andrés Castillo",
      rol: "usuario",
      email: "another@example.com",
    },
    {
      id: "m90n1o2p",
      name: "Carla Mendoza",
      rol: "lider",
      email: "customer2@outlook.com",
    },
    {
      id: "n34o5p6q",
      name: "Jorge Silva",
      rol: "administrador",
      email: "shopuser@market.com",
    },
    {
      id: "o78p9q0r",
      name: "Paula Navarro",
      rol: "usuario",
      email: "buyer2@shop.com",
    },
    {
      id: "p12q3r4s",
      name: "Ricardo Vega",
      rol: "usuario",
      email: "subscriber3@mail.com",
    },
    {
      id: "q56r7s8t",
      name: "Natalia Romero",
      rol: "lider",
      email: "member2@service.com",
    },
    {
      id: "r90s1t2u",
      name: "Héctor Guzmán",
      rol: "administrador",
      email: "account2@website.com",
    },
    {
      id: "s34t5u6v",
      name: "Isabella Herrera",
      rol: "usuario",
      email: "user3@example.com",
    },
    {
      id: "t78u9v0w",
      name: "Luis Fernández",
      rol: "lider",
      email: "subscriber4@mail.com",
    },
  ];
}
