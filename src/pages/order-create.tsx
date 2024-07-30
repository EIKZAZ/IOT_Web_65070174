import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Order } from "../lib/models";

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, price } = location.state || { name: "", price: 0 };

  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(price);

  const orderCreateForm = useForm({
    initialValues: {
      name: name,
      price: price,
      amount: 1,
      descript: "",
    },

    validate: {
        amount: isNotEmpty("ระบุจำนวนเครื่องดื่มที่ต้องการ")
    },
  });

  useEffect(() => {
    const calculatedPrice = orderCreateForm.values.amount * price;
    setTotalPrice(calculatedPrice);
  }, [orderCreateForm.values.amount, price, orderCreateForm]);

  const handleSubmit = async (values: typeof orderCreateForm.values) => {
    const { name, amount, descript } = values;
    const total = amount * price;
    try {
      setIsProcessing(true);
      const response = await axios.post<Order>(`/order`, { name, amount, price: total, descript });
      notifications.show({
        title: "สั่งเครื่องดื่มสำเร็จ",
        message: "เครื่องดื่มได้รับการเพิ่มในออเดอร์เรียบร้อยแล้ว",
        color: "blue",
      });
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มเครื่องดื่มในออเดอร์</h1>

          <form onSubmit={orderCreateForm.onSubmit(handleSubmit)} className="space-y-8">
          <TextInput
              label="ชื่อกาแฟ"
              placeholder="ชื่อกาแฟ"
              value={orderCreateForm.values.name}
              readOnly
            />

            <NumberInput
              label="จำนวน"
              placeholder="จำนวน"
              {...orderCreateForm.getInputProps("amount")}
            />
            
            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              value={totalPrice} 
              readOnly
            />

            <TextInput
              label="หมายเหตุ"
              placeholder="หมายเหตุ"
              {...orderCreateForm.getInputProps("descript")}
            />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              บันทึกข้อมูล
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
