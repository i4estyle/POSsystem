# POS Domain Glossary

- Branch: ขอบเขตข้อมูลและการปฏิบัติงานของสาขา ผู้ใช้ที่ไม่ใช่ Admin อ่านหรือแก้ข้อมูลข้ามสาขาไม่ได้
- Master data: ข้อมูลตั้งค่าที่รองรับ CRUD เช่น สาขา พนักงาน สินค้า หมวดหมู่ ซัพพลายเออร์ และวิธีชำระเงิน
- Transaction: ข้อมูลธุรกิจที่แก้ย้อนหลังไม่ได้โดยตรง เช่น Order, Payment, Stock Movement และ Purchase Order
- Order: รายการขายที่ backend เป็นผู้กำหนดราคา ส่วนลด ภาษี และสถานะ
- Payment: รายการรับเงินแบบ append-only รองรับหลายรายการต่อ Order และใช้ idempotency key ป้องกันรายการซ้ำ
- Refund: การคืนยอดบางส่วนหรือทั้งหมดจาก Payment เดิม โดยไม่แก้ยอดรับเงินเดิม
- Stock balance: ยอดคงเหลือปัจจุบันต่อ Product และ Branch
- Stock movement: ledger การเปลี่ยนยอด stock ซึ่งสร้างพร้อมการเปลี่ยน balance ใน transaction เดียวกัน
- Purchase order: เอกสารสั่งซื้อที่เปลี่ยนจาก pending ไป received หรือ cancelled เท่านั้น
- External UUID: UUID ที่เก็บด้วย BINARY(16) สำหรับอ้างอิงทรัพยากรสำคัญผ่าน API ไม่ใช่ hash
- Internal ID: INT primary key สำหรับ join และการประมวลผลภายใน
