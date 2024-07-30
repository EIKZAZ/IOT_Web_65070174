import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import coffee from "../assets/images/coffee.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const { data: orders, error } = useSWR<Order[]>("/order");
  
  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">ออเดอร์ลูกค้า</h1>
          <h2>รายการออเดอร์ทั้งหมดที่ลูกค้าสั่ง</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการออเดอร์</h1>
          </div>

          {!orders && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders?.map((order) => (
              <div className="border border-solid border-neutral-200" key={order.name}>
                <img
                  src={coffee}
                  alt={order.name}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{order.name}</h2>
                  <p className="text-s text-neutral-500">จำนวน {order.amount} ที่</p>
                  
                </div>
                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/orders/${order.id}`} size="xs" variant="default">
                    ดูรายละเอียด
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
