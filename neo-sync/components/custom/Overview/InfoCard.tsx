import { Card, CardContent } from "@/components/ui/card";

export default function InfoCard() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-2">
        <p className="text-sm text-gray-700 leading-relaxed">
          CEMEX busca desarrollar una aplicación móvil que mejore la experiencia
          de sus clientes y optimice la gestión de sus procesos comerciales. La
          app estará dirigida principalmente a sus clientes, distribuidores y
          equipo de ventas, con el objetivo de facilitar la compra de productos,
          el seguimiento de pedidos y el acceso a información clave.
        </p>
      </CardContent>
    </Card>
  );
}
