# POS Database Data Dictionary

MySQL/InnoDB. Singular uppercase tables. Internal PK/FK use INT. Selected external identifiers use BINARY(16) UUID. CREATED_AT, UPDATED_AT, DELETED_AT are shared audit columns.

## Relationships

- POS_EMPLOYEE.EMP_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_EMPLOYEE.EMP_ROLE_ID -> POS_ROLE.ROL_ID
- POS_PURCHASE_ORDER.POR_SUPPLIER_ID -> POS_SUPPLIER.SUP_ID
- POS_PURCHASE_ORDER.POR_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_PURCHASE_ORDER.POR_EMPLOYEE_ID -> POS_EMPLOYEE.EMP_ID
- POS_CATEGORY.CAT_PARENT_ID -> POS_CATEGORY.CAT_ID
- POS_PRODUCT.PRD_CATEGORY_ID -> POS_CATEGORY.CAT_ID
- POS_PURCHASE_ORDER_ITEM.POI_PO_ID -> POS_PURCHASE_ORDER.POR_ID
- POS_PURCHASE_ORDER_ITEM.POI_PRODUCT_ID -> POS_PRODUCT.PRD_ID
- POS_STOCK_MOVEMENT.STM_PRODUCT_ID -> POS_PRODUCT.PRD_ID
- POS_STOCK_MOVEMENT.STM_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_STOCK_MOVEMENT.STM_EMPLOYEE_ID -> POS_EMPLOYEE.EMP_ID
- POS_STOCK.STK_PRODUCT_ID -> POS_PRODUCT.PRD_ID
- POS_STOCK.STK_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_SALARY.SAL_EMPLOYEE_ID -> POS_EMPLOYEE.EMP_ID
- POS_DINING_TABLE.DTB_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_QR_CODE.QRC_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_QR_CODE.QRC_TABLE_ID -> POS_DINING_TABLE.DTB_ID
- POS_TABLE_SESSION.TSS_QR_CODE_ID -> POS_QR_CODE.QRC_ID
- POS_TABLE_SESSION.TSS_TABLE_ID -> POS_DINING_TABLE.DTB_ID
- POS_TABLE_SESSION.TSS_CUSTOMER_ID -> POS_CUSTOMER.CUS_ID
- POS_TABLE_REQUEST.TRQ_SESSION_ID -> POS_TABLE_SESSION.TSS_ID
- POS_TABLE_REQUEST.TRQ_TABLE_ID -> POS_DINING_TABLE.DTB_ID
- POS_TABLE_REQUEST.TRQ_HANDLED_BY_EMP_ID -> POS_EMPLOYEE.EMP_ID
- POS_ORDER_ITEM.ORI_ORDER_ID -> POS_ORDER.ORD_ID
- POS_ORDER_ITEM.ORI_PRODUCT_ID -> POS_PRODUCT.PRD_ID
- POS_ORDER_STATUS_HISTORY.OSH_ORDER_ID -> POS_ORDER.ORD_ID
- POS_ORDER_STATUS_HISTORY.OSH_CHANGED_BY_EMP_ID -> POS_EMPLOYEE.EMP_ID
- POS_ORDER_NOTIFICATION.ONT_ORDER_ID -> POS_ORDER.ORD_ID
- POS_ORDER_NOTIFICATION.ONT_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_ORDER.ORD_BRANCH_ID -> POS_BRANCH.BRN_ID
- POS_ORDER.ORD_CUSTOMER_ID -> POS_CUSTOMER.CUS_ID
- POS_ORDER.ORD_EMPLOYEE_ID -> POS_EMPLOYEE.EMP_ID
- POS_ORDER.ORD_TABLE_ID -> POS_DINING_TABLE.DTB_ID
- POS_ORDER.ORD_PROMOTION_ID -> POS_PROMOTION.PRM_ID
- POS_PAYMENT.PAY_ORDER_ID -> POS_ORDER.ORD_ID
- POS_PAYMENT.PAY_METHOD_ID -> POS_PAYMENT_METHOD.PMT_ID
- POS_FEEDBACK.FDB_CUSTOMER_ID -> POS_CUSTOMER.CUS_ID
- POS_FEEDBACK.FDB_ORDER_ID -> POS_ORDER.ORD_ID
- POS_ATTENDANCE.ATT_EMPLOYEE_ID -> POS_EMPLOYEE.EMP_ID
- POS_PROMOTION_PRODUCT.PRP_PROMOTION_ID -> POS_PROMOTION.PRM_ID
- POS_PROMOTION_PRODUCT.PRP_PRODUCT_ID -> POS_PRODUCT.PRD_ID

## POS_ATTENDANCE

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| ATT_ID | int | NO | PK |  | รหัสบันทึกการเข้างาน |
| ATT_EMPLOYEE_ID | int | NO |  |  | รหัสพนักงาน |
| ATT_WORK_DATE | date | NO |  |  | วันที่ทำงาน |
| ATT_CHECK_IN | datetime | YES |  |  | เวลาเข้างาน |
| ATT_CHECK_OUT | datetime | YES |  |  | เวลาออกงาน |

## POS_BRANCH

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| BRN_ID | int | NO | PK |  | รหัสสาขา |
| BRN_NAME | varchar(100) | NO |  |  | ชื่อสาขา |
| BRN_ADDRESS | varchar(255) | NO |  |  | ที่อยู่สาขา |
| BRN_PHONE | varchar(20) | NO |  |  | เบอร์โทรศัพท์สาขา |
| BRN_TAX_RATE | decimal(5,4) | NO |  | 0 | อัตราภาษีที่ backend ใช้คำนวณราคา |

## POS_CATEGORY

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| CAT_ID | int | NO | PK |  | รหัสหมวดหมู่สินค้า |
| CAT_PARENT_ID | int | YES |  |  | รหัสหมวดหมู่แม่ (null หากเป็นหมวดหมู่หลัก) |
| CAT_NAME | varchar(100) | NO |  |  | ชื่อหมวดหมู่สินค้า |
| CAT_DESCRIPTION | varchar(255) | YES |  |  | คำอธิบายหมวดหมู่สินค้า |

## POS_CUSTOMER

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| CUS_UUID | binary(16) | NO | UQ |  | External UUID for API |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| CUS_ID | int | NO | PK |  | รหัสลูกค้า |
| CUS_FIRST_NAME | varchar(50) | NO |  |  | ชื่อลูกค้า |
| CUS_LAST_NAME | varchar(50) | NO |  |  | นามสกุลลูกค้า |
| CUS_PHONE | varchar(20) | NO |  |  | เบอร์โทรศัพท์ลูกค้า |
| CUS_EMAIL | varchar(100) | YES |  |  | อีเมลลูกค้า |
| CUS_LOYALTY_POINT | int | NO |  | '0' | แต้มสะสม |
| CUS_REGISTER_DATE | datetime | NO |  |  | วันที่สมัครสมาชิก |
| IDX_6973c8fe3de2d69cdb5b4b7a03 | (\`CUS_PHONE\`) | YES |  |  |  |

## POS_DINING_TABLE

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| DTB_ID | int | NO | PK |  | รหัสโต๊ะอาหาร |
| DTB_BRANCH_ID | int | NO |  |  | รหัสสาขา |
| DTB_SEAT_CAPACITY | int | NO |  |  | จำนวนที่นั่งสูงสุด |

## POS_EMPLOYEE

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| EMP_UUID | binary(16) | NO | UQ |  | External UUID for API |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| EMP_ID | int | NO | PK |  | รหัสพนักงาน |
| EMP_BRANCH_ID | int | NO |  |  | รหัสสาขาที่สังกัด |
| EMP_ROLE_ID | int | NO |  |  | รหัสตำแหน่ง |
| EMP_FIRST_NAME | varchar(50) | NO |  |  | ชื่อพนักงาน |
| EMP_LAST_NAME | varchar(50) | NO |  |  | นามสกุลพนักงาน |
| EMP_PHONE | varchar(20) | NO |  |  | เบอร์โทรศัพท์พนักงาน |
| EMP_EMAIL | varchar(100) | NO |  |  | อีเมลพนักงาน |
| EMP_USERNAME | varchar(50) | NO |  |  | ชื่อผู้ใช้สำหรับเข้าสู่ระบบ |
| EMP_PASSWORD_HASH | varchar(255) | NO |  |  | รหัสผ่านที่เข้ารหัสแล้ว |
| EMP_HIRE_DATE | date | NO |  |  | วันที่เริ่มงาน |
| IDX_bbd6becf7763f7bf6bf4f1f628 | (\`EMP_EMAIL\`) | YES |  |  |  |
| IDX_0f0001bd2710c809a000747af5 | (\`EMP_USERNAME\`) | YES |  |  |  |

## POS_FEEDBACK

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| FDB_ID | int | NO | PK |  | รหัสความคิดเห็น |
| FDB_CUSTOMER_ID | int | NO |  |  | รหัสลูกค้า |
| FDB_ORDER_ID | int | YES |  |  | รหัสคำสั่งซื้อ (1 ออร์เดอร์ มีได้ 1 ความคิดเห็น) |
| FDB_RATING | tinyint | NO |  |  | คะแนนความพึงพอใจ (1-5) |
| FDB_COMMENT | text | YES |  |  | ข้อความติชม/รีวิว |
| IDX_41d06fc9856b261cdf8f687d79 | (\`FDB_ORDER_ID\`) | YES |  |  |  |
| REL_41d06fc9856b261cdf8f687d79 | (\`FDB_ORDER_ID\`) | YES |  |  |  |

## POS_ORDER

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| ORD_UUID | binary(16) | NO | UQ |  | External UUID for API |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| ORD_ID | int | NO | PK |  | รหัสคำสั่งซื้อ |
| ORD_NUMBER | varchar(30) | NO |  |  | เลขที่ใบสั่งซื้อ (เช่น ORD-20250101-001) |
| ORD_BRANCH_ID | int | NO |  |  | รหัสสาขา |
| ORD_CUSTOMER_ID | int | YES |  |  | รหัสลูกค้า (null สำหรับผู้ไม่ได้สมัครสมาชิก) |
| ORD_EMPLOYEE_ID | int | YES |  |  | รหัสพนักงานผู้รับออร์เดอร์ (null หากลูกค้าสั่งผ่าน QR) |
| ORD_TABLE_ID | int | YES |  |  | รหัสโต๊ะอาหาร (null สำหรับ takeaway/delivery) |
| ORD_PROMOTION_ID | int | YES |  |  | รหัสโปรโมชั่นที่ใช้ |
| ORD_SESSION_ID | int | YES |  |  | รหัสเซสชันโต๊ะอาหาร (สำหรับ QR Order) |
| ORD_QR_CODE_ID | int | YES |  |  | รหัส QR Code ที่สแกนสั่งซื้อ |
| ORD_GUEST_NAME | varchar(100) | YES |  |  | ชื่อผู้สั่งซื้อกรณีไม่มีบัญชีลูกค้า |
| ORD_GUEST_PHONE | varchar(20) | YES |  |  | เบอร์โทรผู้สั่งซื้อกรณีไม่มีบัญชีลูกค้า |
| ORD_DATE | datetime | NO |  |  | วันที่และเวลาที่สั่งซื้อ |
| IDX_0e4a7541d5bf38d85e11674dc7 | (\`ORD_NUMBER\`) | YES |  |  |  |

## POS_ORDER_ITEM

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| ORI_ID | int | NO | PK |  | รหัสรายการสินค้าในคำสั่งซื้อ |
| ORI_ORDER_ID | int | NO |  |  | รหัสคำสั่งซื้อ |
| ORI_PRODUCT_ID | int | NO |  |  | รหัสสินค้า |
| ORI_QUANTITY | int | NO |  |  | จำนวนสินค้า |

## POS_ORDER_NOTIFICATION

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| ONT_ID | int | NO | PK |  | รหัสรายการแจ้งเตือน |
| ONT_ORDER_ID | int | NO |  |  | รหัสคำสั่งซื้อ |
| ONT_BRANCH_ID | int | NO |  |  | รหัสสาขา |
| ONT_MESSAGE | varchar(255) | NO |  |  | ข้อความแจ้งเตือน |
| ONT_IS_READ | tinyint | NO |  | 0 | สถานะการอ่าน (true/false) |

## POS_ORDER_STATUS_HISTORY

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| OSH_ID | int | NO | PK |  | รหัสประวัติการเปลี่ยนสถานะ |
| OSH_ORDER_ID | int | NO |  |  | รหัสคำสั่งซื้อ |
| OSH_CHANGED_BY_EMP_ID | int | YES |  |  | รหัสพนักงานที่เปลี่ยนสถานะ (null หากเปลี่ยนโดยระบบ/ลูกค้า) |
| OSH_NOTE | varchar(255) | YES |  |  | หมายเหตุการเปลี่ยนสถานะ |
| OSH_CHANGED_AT | datetime | NO |  |  | วันที่และเวลาที่เปลี่ยนสถานะ |

## POS_PAYMENT

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| PAY_ID | int | NO | PK |  | รหัสรายการชำระเงิน |
| PAY_UUID | binary(16) | NO | UK |  | UUID ภายนอกสำหรับอ้างอิงผ่าน API |
| PAY_ORDER_ID | int | NO |  |  | รหัสคำสั่งซื้อ |
| PAY_METHOD_ID | int | NO |  |  | รหัสช่องทางการชำระเงิน |
| PAY_AMOUNT | decimal(10,2) | NO |  |  | จำนวนเงินที่ชำระ |
| PAY_REFUNDED_AMOUNT | decimal(10,2) | NO |  | 0 | จำนวนเงินที่คืนแล้ว |
| PAY_IDEMPOTENCY_KEY | char(36) | NO | UK |  | กุญแจป้องกันการบันทึกชำระซ้ำ |
| PAY_REFERENCE_NO | varchar(100) | YES |  |  | เลขอ้างอิงธุรกรรม/สลิปโอนเงิน |
| PAY_STATUS | enum | NO |  | success | สถานะการชำระเงิน |
| PAY_DATE | datetime | NO |  |  | วันที่และเวลาที่ชำระเงิน |

## POS_PAYMENT_METHOD

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| PMT_ID | int | NO | PK |  | รหัสช่องทางการชำระเงิน |

## POS_PRODUCT

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| PRD_ID | int | NO | PK |  | รหัสสินค้า |
| PRD_CATEGORY_ID | int | NO |  |  | รหัสหมวดหมู่สินค้า |
| PRD_NAME | varchar(100) | NO |  |  | ชื่อสินค้า |
| PRD_SKU | varchar(50) | NO |  |  | รหัส SKU สินค้า |
| PRD_BARCODE | varchar(50) | YES |  |  | รหัสบาร์โค้ด |
| PRD_DESCRIPTION | text | YES |  |  | คำอธิบายสินค้า |
| PRD_IMAGE_URL | varchar(255) | YES |  |  | URL รูปภาพสินค้า |
| IDX_3183089dcca6e99fb3c1fd68d2 | (\`PRD_SKU\`) | YES |  |  |  |
| IDX_f9bb3c16bfa94f2c74a7b24a77 | (\`PRD_BARCODE\`) | YES |  |  |  |

## POS_PROMOTION

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| PRM_ID | int | NO | PK |  | รหัสโปรโมชั่น |
| PRM_NAME | varchar(100) | NO |  |  | ชื่อโปรโมชั่น |
| PRM_START_DATE | date | NO |  |  | วันที่เริ่มโปรโมชั่น |
| PRM_END_DATE | date | NO |  |  | วันที่สิ้นสุดโปรโมชั่น |

## POS_PROMOTION_PRODUCT

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| PRP_PROMOTION_ID | int | NO |  |  |  |
| PRP_PRODUCT_ID | int | NO |  |  |  |
| IDX_2fde382acbff785998e97f46f8 | (\`PRP_PROMOTION_ID\`) | YES |  |  |  |
| IDX_f3012ec5442588b5d668bac1f0 | (\`PRP_PRODUCT_ID\`) | YES |  |  |  |

## POS_PURCHASE_ORDER

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| POR_ID | int | NO | PK |  | รหัสใบสั่งซื้อ |
| POR_SUPPLIER_ID | int | NO |  |  | รหัสซัพพลายเออร์ |
| POR_BRANCH_ID | int | NO |  |  | รหัสสาขาที่สั่งซื้อ |
| POR_EMPLOYEE_ID | int | NO |  |  | รหัสพนักงานผู้ทำรายการ |
| POR_ORDER_DATE | date | NO |  |  | วันที่สั่งซื้อ |

## POS_PURCHASE_ORDER_ITEM

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| POI_ID | int | NO | PK |  | รหัสรายการสินค้าในใบสั่งซื้อ |
| POI_PO_ID | int | NO |  |  | รหัสใบสั่งซื้อ |
| POI_PRODUCT_ID | int | NO |  |  | รหัสสินค้า |
| POI_QUANTITY | int | NO |  |  | จำนวนที่สั่งซื้อ |

## POS_QR_CODE

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| QRC_UUID | binary(16) | NO | UQ |  | External UUID for API |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| QRC_ID | int | NO | PK |  | รหัส QR Code |
| QRC_BRANCH_ID | int | NO |  |  | รหัสสาขา |
| QRC_TABLE_ID | int | YES |  |  | รหัสโต๊ะอาหาร (null สำหรับ QR แบบ takeaway) |
| QRC_CODE_TOKEN | varchar(100) | NO |  |  | โทเค็นสุ่มสำหรับสแกนเข้า URL สั่งอาหาร |
| IDX_07fd542a3da41e1def72fb83c0 | (\`QRC_CODE_TOKEN\`) | YES |  |  |  |

## POS_ROLE

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| ROL_ID | int | NO | PK |  | รหัสตำแหน่ง |
| ROL_DESCRIPTION | varchar(255) | YES |  |  | คำอธิบายตำแหน่ง |

## POS_SALARY

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| SAL_ID | int | NO | PK |  | รหัสรายการเงินเดือน |
| SAL_EMPLOYEE_ID | int | NO |  |  | รหัสพนักงาน |
| SAL_PAY_MONTH | int | NO |  |  | เดือนที่จ่าย (1-12) |
| SAL_PAY_YEAR | int | NO |  |  | ปีที่จ่าย (ค.ศ.) |
| SAL_PAYMENT_DATE | date | YES |  |  | วันที่ชำระเงิน |

## POS_STOCK

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| STK_ID | int | NO | PK |  | รหัสรายการสต็อก |
| STK_PRODUCT_ID | int | NO |  |  | รหัสสินค้า |
| STK_BRANCH_ID | int | NO |  |  | รหัสสาขา |
| STK_QUANTITY | int | NO |  | '0' | จำนวนสินค้าคงเหลือ |
| STK_REORDER_LEVEL | int | NO |  | '0' | ระดับการสั่งซื้อใหม่ (Reorder Point) |
| IDX_c21821e2d1e4996c232ec16f4e | (\`STK_PRODUCT_ID\` | YES |  |  |  |

## POS_STOCK_MOVEMENT

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| STM_ID | int | NO | PK |  | รหัสการเคลื่อนไหวสต็อก |
| STM_PRODUCT_ID | int | NO |  |  | รหัสสินค้า |
| STM_BRANCH_ID | int | NO |  |  | รหัสสาขา |
| STM_EMPLOYEE_ID | int | NO |  |  | รหัสพนักงานผู้ดำเนินการ |
| STM_QUANTITY | int | NO |  |  | จำนวนที่เคลื่อนไหว |
| STM_REFERENCE_ID | int | YES |  |  | รหัสเอกสารอ้างอิง |
| STM_NOTE | varchar(255) | YES |  |  | หมายเหตุการปรับสต็อก |

## POS_SUPPLIER

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| SUP_ID | int | NO | PK |  | รหัสซัพพลายเออร์ |
| SUP_NAME | varchar(100) | NO |  |  | ชื่อซัพพลายเออร์/บริษัท |
| SUP_CONTACT_NAME | varchar(100) | YES |  |  | ชื่อผู้ติดต่อ |
| SUP_PHONE | varchar(20) | NO |  |  | เบอร์โทรศัพท์ซัพพลายเออร์ |
| SUP_EMAIL | varchar(100) | YES |  |  | อีเมลซัพพลายเออร์ |
| SUP_ADDRESS | varchar(255) | YES |  |  | ที่อยู่ซัพพลายเออร์ |

## POS_TABLE_REQUEST

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| TRQ_ID | int | NO | PK |  | รหัสรายการคำขอ |
| TRQ_SESSION_ID | int | NO |  |  | รหัสเซสชันโต๊ะ |
| TRQ_TABLE_ID | int | NO |  |  | รหัสโต๊ะอาหาร |
| TRQ_HANDLED_BY_EMP_ID | int | YES |  |  | รหัสพนักงานที่เข้าดูแลคำขอ |
| TRQ_RESOLVED_AT | datetime | YES |  |  | เวลาที่พนักงานดูแลสำเร็จ |

## POS_TABLE_SESSION

| Column | Type | Null | Key | Default | Description |
|---|---|---:|---|---|---|
| CREATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่สร้างข้อมูล |
| UPDATED_AT | datetime(6) | NO |  | CURRENT_TIMESTAMP(6) | วันที่แก้ไขข้อมูลล่าสุด |
| DELETED_AT | datetime(6) | YES |  |  | วันที่ลบข้อมูล (Soft Delete) |
| TSS_ID | int | NO | PK |  | รหัสเซสชันโต๊ะ |
| TSS_QR_CODE_ID | int | NO |  |  | รหัส QR Code ที่สแกนเปิดเซสชัน |
| TSS_TABLE_ID | int | YES |  |  | รหัสโต๊ะอาหาร (null สำหรับ takeaway) |
| TSS_CUSTOMER_ID | int | YES |  |  | รหัสลูกค้า (null หากลูกค้าไม่เข้าสู่ระบบ) |
| TSS_GUEST_COUNT | int | NO |  | '1' | จำนวนลูกค้าในโต๊ะ |
| TSS_STARTED_AT | datetime | NO |  |  | เวลาเปิดเซสชัน |
| TSS_ENDED_AT | datetime | YES |  |  | เวลาปิดเซสชัน/เช็คบิล |
