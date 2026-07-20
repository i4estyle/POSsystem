import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabaseWithPrefix1784398658725 implements MigrationInterface {
  name = 'InitDatabaseWithPrefix1784398658725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`POS_SUPPLIERS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`SUP_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสซัพพลายเออร์', \`SUP_NAME\` varchar(100) NOT NULL COMMENT 'ชื่อซัพพลายเออร์/บริษัท', \`SUP_CONTACT_NAME\` varchar(100) NULL COMMENT 'ชื่อผู้ติดต่อ', \`SUP_PHONE\` varchar(20) NOT NULL COMMENT 'เบอร์โทรศัพท์ซัพพลายเออร์', \`SUP_EMAIL\` varchar(100) NULL COMMENT 'อีเมลซัพพลายเออร์', \`SUP_ADDRESS\` varchar(255) NULL COMMENT 'ที่อยู่ซัพพลายเออร์', PRIMARY KEY (\`SUP_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_BRANCHES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`BRN_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสสาขา', \`BRN_NAME\` varchar(100) NOT NULL COMMENT 'ชื่อสาขา', \`BRN_ADDRESS\` varchar(255) NOT NULL COMMENT 'ที่อยู่สาขา', \`BRN_PHONE\` varchar(20) NOT NULL COMMENT 'เบอร์โทรศัพท์สาขา', \`BRN_STATUS\` enum ('active', 'inactive') NOT NULL COMMENT 'สถานะสาขา (active/inactive)' DEFAULT 'active', PRIMARY KEY (\`BRN_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_ROLES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`ROL_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสตำแหน่ง', \`ROL_NAME\` varchar(50) NOT NULL COMMENT 'ชื่อตำแหน่ง (admin, manager, cashier, kitchen)', \`ROL_DESCRIPTION\` varchar(255) NULL COMMENT 'คำอธิบายตำแหน่ง', PRIMARY KEY (\`ROL_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_EMPLOYEES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`EMP_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสพนักงาน', \`EMP_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขาที่สังกัด', \`EMP_ROLE_ID\` int NOT NULL COMMENT 'รหัสตำแหน่ง', \`EMP_FIRST_NAME\` varchar(50) NOT NULL COMMENT 'ชื่อพนักงาน', \`EMP_LAST_NAME\` varchar(50) NOT NULL COMMENT 'นามสกุลพนักงาน', \`EMP_PHONE\` varchar(20) NOT NULL COMMENT 'เบอร์โทรศัพท์พนักงาน', \`EMP_EMAIL\` varchar(100) NOT NULL COMMENT 'อีเมลพนักงาน', \`EMP_USERNAME\` varchar(50) NOT NULL COMMENT 'ชื่อผู้ใช้สำหรับเข้าสู่ระบบ', \`EMP_PASSWORD_HASH\` varchar(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว', \`EMP_HIRE_DATE\` date NOT NULL COMMENT 'วันที่เริ่มงาน', \`EMP_STATUS\` enum ('active', 'resigned', 'suspended') NOT NULL COMMENT 'สถานะพนักงาน (active/resigned/suspended)' DEFAULT 'active', UNIQUE INDEX \`IDX_bbd6becf7763f7bf6bf4f1f628\` (\`EMP_EMAIL\`), UNIQUE INDEX \`IDX_0f0001bd2710c809a000747af5\` (\`EMP_USERNAME\`), PRIMARY KEY (\`EMP_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PURCHASE_ORDERS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`POR_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสใบสั่งซื้อ', \`POR_SUPPLIER_ID\` int NOT NULL COMMENT 'รหัสซัพพลายเออร์', \`POR_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขาที่สั่งซื้อ', \`POR_EMPLOYEE_ID\` int NOT NULL COMMENT 'รหัสพนักงานผู้ทำรายการ', \`POR_ORDER_DATE\` date NOT NULL COMMENT 'วันที่สั่งซื้อ', \`POR_STATUS\` enum ('pending', 'received', 'cancelled') NOT NULL COMMENT 'สถานะใบสั่งซื้อ (pending/received/cancelled)' DEFAULT 'pending', \`POR_TOTAL_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'ราคารวมใบสั่งซื้อ' DEFAULT '0.00', PRIMARY KEY (\`POR_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_CATEGORIES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`CAT_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสหมวดหมู่สินค้า', \`CAT_PARENT_ID\` int NULL COMMENT 'รหัสหมวดหมู่แม่ (null หากเป็นหมวดหมู่หลัก)', \`CAT_NAME\` varchar(100) NOT NULL COMMENT 'ชื่อหมวดหมู่สินค้า', \`CAT_DESCRIPTION\` varchar(255) NULL COMMENT 'คำอธิบายหมวดหมู่สินค้า', PRIMARY KEY (\`CAT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PRODUCTS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`PRD_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสสินค้า', \`PRD_CATEGORY_ID\` int NOT NULL COMMENT 'รหัสหมวดหมู่สินค้า', \`PRD_NAME\` varchar(100) NOT NULL COMMENT 'ชื่อสินค้า', \`PRD_SKU\` varchar(50) NOT NULL COMMENT 'รหัส SKU สินค้า', \`PRD_BARCODE\` varchar(50) NULL COMMENT 'รหัสบาร์โค้ด', \`PRD_DESCRIPTION\` text NULL COMMENT 'คำอธิบายสินค้า', \`PRD_COST_PRICE\` decimal(10,2) NOT NULL COMMENT 'ราคาทุน', \`PRD_SELLING_PRICE\` decimal(10,2) NOT NULL COMMENT 'ราคาขาย', \`PRD_UNIT\` varchar(20) NOT NULL COMMENT 'หน่วยนับ (แก้ว, ชิ้น, กก.)', \`PRD_IMAGE_URL\` varchar(255) NULL COMMENT 'URL รูปภาพสินค้า', \`PRD_STATUS\` enum ('active', 'inactive') NOT NULL COMMENT 'สถานะสินค้า (active/inactive)' DEFAULT 'active', UNIQUE INDEX \`IDX_3183089dcca6e99fb3c1fd68d2\` (\`PRD_SKU\`), UNIQUE INDEX \`IDX_f9bb3c16bfa94f2c74a7b24a77\` (\`PRD_BARCODE\`), PRIMARY KEY (\`PRD_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PURCHASE_ORDER_ITEMS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`POI_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการสินค้าในใบสั่งซื้อ', \`POI_PO_ID\` int NOT NULL COMMENT 'รหัสใบสั่งซื้อ', \`POI_PRODUCT_ID\` int NOT NULL COMMENT 'รหัสสินค้า', \`POI_QUANTITY\` int NOT NULL COMMENT 'จำนวนที่สั่งซื้อ', \`POI_UNIT_COST\` decimal(10,2) NOT NULL COMMENT 'ราคาทุนต่อหน่วย', PRIMARY KEY (\`POI_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_STOCK_MOVEMENTS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`STM_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสการเคลื่อนไหวสต็อก', \`STM_PRODUCT_ID\` int NOT NULL COMMENT 'รหัสสินค้า', \`STM_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขา', \`STM_EMPLOYEE_ID\` int NOT NULL COMMENT 'รหัสพนักงานผู้ดำเนินการ', \`STM_TYPE\` enum ('in', 'out', 'adjust') NOT NULL COMMENT 'ประเภทการเคลื่อนไหว (in/out/adjust)', \`STM_QUANTITY\` int NOT NULL COMMENT 'จำนวนที่เคลื่อนไหว', \`STM_REFERENCE_TYPE\` enum ('order', 'purchase_order', 'manual') NOT NULL COMMENT 'ประเภทเอกสารอ้างอิง (order/purchase_order/manual)' DEFAULT 'manual', \`STM_REFERENCE_ID\` int NULL COMMENT 'รหัสเอกสารอ้างอิง', \`STM_NOTE\` varchar(255) NULL COMMENT 'หมายเหตุการปรับสต็อก', PRIMARY KEY (\`STM_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_STOCKS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`STK_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการสต็อก', \`STK_PRODUCT_ID\` int NOT NULL COMMENT 'รหัสสินค้า', \`STK_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขา', \`STK_QUANTITY\` int NOT NULL COMMENT 'จำนวนสินค้าคงเหลือ' DEFAULT '0', \`STK_REORDER_LEVEL\` int NOT NULL COMMENT 'ระดับการสั่งซื้อใหม่ (Reorder Point)' DEFAULT '0', UNIQUE INDEX \`IDX_c21821e2d1e4996c232ec16f4e\` (\`STK_PRODUCT_ID\`, \`STK_BRANCH_ID\`), PRIMARY KEY (\`STK_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_SALARIES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`SAL_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการเงินเดือน', \`SAL_EMPLOYEE_ID\` int NOT NULL COMMENT 'รหัสพนักงาน', \`SAL_PAY_MONTH\` int NOT NULL COMMENT 'เดือนที่จ่าย (1-12)', \`SAL_PAY_YEAR\` int NOT NULL COMMENT 'ปีที่จ่าย (ค.ศ.)', \`SAL_BASE_SALARY\` decimal(10,2) NOT NULL COMMENT 'เงินเดือนพื้นฐาน', \`SAL_BONUS\` decimal(10,2) NOT NULL COMMENT 'โบนัส' DEFAULT '0.00', \`SAL_DEDUCTION\` decimal(10,2) NOT NULL COMMENT 'หักเงิน' DEFAULT '0.00', \`SAL_NET_SALARY\` decimal(10,2) NOT NULL COMMENT 'เงินสุทธิหลังหัก/บวกโบนัส', \`SAL_PAYMENT_DATE\` date NULL COMMENT 'วันที่ชำระเงิน', \`SAL_STATUS\` enum ('pending', 'paid') NOT NULL COMMENT 'สถานะการจ่ายเงินเดือน (pending/paid)' DEFAULT 'pending', PRIMARY KEY (\`SAL_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_DINING_TABLES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`DTB_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสโต๊ะอาหาร', \`DTB_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขา', \`DTB_NUMBER\` varchar(10) NOT NULL COMMENT 'หมายเลขโต๊ะ (เช่น T-01, A-02)', \`DTB_SEAT_CAPACITY\` int NOT NULL COMMENT 'จำนวนที่นั่งสูงสุด', \`DTB_STATUS\` enum ('available', 'occupied', 'reserved') NOT NULL COMMENT 'สถานะโต๊ะ (available/occupied/reserved)' DEFAULT 'available', PRIMARY KEY (\`DTB_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_QR_CODES\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`QRC_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัส QR Code', \`QRC_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขา', \`QRC_TABLE_ID\` int NULL COMMENT 'รหัสโต๊ะอาหาร (null สำหรับ QR แบบ takeaway)', \`QRC_TYPE\` enum ('dine_in', 'takeaway') NOT NULL COMMENT 'ประเภท QR (dine_in/takeaway)' DEFAULT 'dine_in', \`QRC_CODE_TOKEN\` varchar(100) NOT NULL COMMENT 'โทเค็นสุ่มสำหรับสแกนเข้า URL สั่งอาหาร', \`QRC_STATUS\` enum ('active', 'inactive') NOT NULL COMMENT 'สถานะ QR (active/inactive)' DEFAULT 'active', UNIQUE INDEX \`IDX_07fd542a3da41e1def72fb83c0\` (\`QRC_CODE_TOKEN\`), PRIMARY KEY (\`QRC_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_CUSTOMERS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`CUS_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสลูกค้า', \`CUS_FIRST_NAME\` varchar(50) NOT NULL COMMENT 'ชื่อลูกค้า', \`CUS_LAST_NAME\` varchar(50) NOT NULL COMMENT 'นามสกุลลูกค้า', \`CUS_PHONE\` varchar(20) NOT NULL COMMENT 'เบอร์โทรศัพท์ลูกค้า', \`CUS_EMAIL\` varchar(100) NULL COMMENT 'อีเมลลูกค้า', \`CUS_LOYALTY_POINT\` int NOT NULL COMMENT 'แต้มสะสม' DEFAULT '0', \`CUS_MEMBER_LEVEL\` varchar(20) NOT NULL COMMENT 'ระดับสมาชิก (regular, silver, gold)' DEFAULT 'regular', \`CUS_REGISTER_DATE\` datetime NOT NULL COMMENT 'วันที่สมัครสมาชิก', UNIQUE INDEX \`IDX_6973c8fe3de2d69cdb5b4b7a03\` (\`CUS_PHONE\`), PRIMARY KEY (\`CUS_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_TABLE_SESSIONS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`TSS_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสเซสชันโต๊ะ', \`TSS_QR_CODE_ID\` int NOT NULL COMMENT 'รหัส QR Code ที่สแกนเปิดเซสชัน', \`TSS_TABLE_ID\` int NULL COMMENT 'รหัสโต๊ะอาหาร (null สำหรับ takeaway)', \`TSS_CUSTOMER_ID\` int NULL COMMENT 'รหัสลูกค้า (null หากลูกค้าไม่เข้าสู่ระบบ)', \`TSS_GUEST_COUNT\` int NOT NULL COMMENT 'จำนวนลูกค้าในโต๊ะ' DEFAULT '1', \`TSS_STATUS\` enum ('active', 'closed') NOT NULL COMMENT 'สถานะเซสชัน (active/closed)' DEFAULT 'active', \`TSS_STARTED_AT\` datetime NOT NULL COMMENT 'เวลาเปิดเซสชัน', \`TSS_ENDED_AT\` datetime NULL COMMENT 'เวลาปิดเซสชัน/เช็คบิล', PRIMARY KEY (\`TSS_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_TABLE_REQUESTS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`TRQ_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการคำขอ', \`TRQ_SESSION_ID\` int NOT NULL COMMENT 'รหัสเซสชันโต๊ะ', \`TRQ_TABLE_ID\` int NOT NULL COMMENT 'รหัสโต๊ะอาหาร', \`TRQ_HANDLED_BY_EMP_ID\` int NULL COMMENT 'รหัสพนักงานที่เข้าดูแลคำขอ', \`TRQ_TYPE\` enum ('call_staff', 'request_bill', 'request_water', 'other') NOT NULL COMMENT 'ประเภทคำขอ (call_staff, request_bill, request_water, other)', \`TRQ_STATUS\` enum ('pending', 'acknowledged', 'done') NOT NULL COMMENT 'สถานะคำขอ (pending/acknowledged/done)' DEFAULT 'pending', \`TRQ_RESOLVED_AT\` datetime NULL COMMENT 'เวลาที่พนักงานดูแลสำเร็จ', PRIMARY KEY (\`TRQ_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PROMOTIONS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`PRM_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสโปรโมชั่น', \`PRM_NAME\` varchar(100) NOT NULL COMMENT 'ชื่อโปรโมชั่น', \`PRM_TYPE\` enum ('percent', 'fixed_amount', 'buy_x_get_y') NOT NULL COMMENT 'ประเภทโปรโมชั่น (percent/fixed_amount/buy_x_get_y)', \`PRM_DISCOUNT_VALUE\` decimal(10,2) NOT NULL COMMENT 'มูลค่าส่วนลด (เปอร์เซ็นต์ หรือ จำนวนเงิน)', \`PRM_MIN_PURCHASE_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'ยอดซื้อขั้นต่ำที่ได้รับโปรโมชั่น' DEFAULT '0.00', \`PRM_START_DATE\` date NOT NULL COMMENT 'วันที่เริ่มโปรโมชั่น', \`PRM_END_DATE\` date NOT NULL COMMENT 'วันที่สิ้นสุดโปรโมชั่น', \`PRM_STATUS\` enum ('active', 'expired', 'disabled') NOT NULL COMMENT 'สถานะโปรโมชั่น (active/expired/disabled)' DEFAULT 'active', PRIMARY KEY (\`PRM_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_ORDER_ITEMS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`ORI_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการสินค้าในคำสั่งซื้อ', \`ORI_ORDER_ID\` int NOT NULL COMMENT 'รหัสคำสั่งซื้อ', \`ORI_PRODUCT_ID\` int NOT NULL COMMENT 'รหัสสินค้า', \`ORI_QUANTITY\` int NOT NULL COMMENT 'จำนวนสินค้า', \`ORI_UNIT_PRICE\` decimal(10,2) NOT NULL COMMENT 'ราคาขายต่อหน่วย ณ เวลาสั่งซื้อ', \`ORI_DISCOUNT\` decimal(10,2) NOT NULL COMMENT 'ส่วนลดต่อรายการ' DEFAULT '0.00', \`ORI_SUBTOTAL\` decimal(10,2) NOT NULL COMMENT 'ยอดรวมของรายการนี้ ( (unit_price * quantity) - discount )', \`ORI_STATUS\` enum ('pending', 'preparing', 'ready', 'served') NOT NULL COMMENT 'สถานะรายการ (pending/preparing/ready/served)' DEFAULT 'pending', \`ORI_NOTE\` varchar(255) NULL COMMENT 'หมายเหตุพิเศษของเมนู (เช่น หวานน้อย, ไม่ใส่ผัก)', PRIMARY KEY (\`ORI_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_ORDER_STATUS_HISTORY\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`OSH_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสประวัติการเปลี่ยนสถานะ', \`OSH_ORDER_ID\` int NOT NULL COMMENT 'รหัสคำสั่งซื้อ', \`OSH_STATUS\` enum ('pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled') NOT NULL COMMENT 'สถานะที่เปลี่ยนไป', \`OSH_CHANGED_BY_EMP_ID\` int NULL COMMENT 'รหัสพนักงานที่เปลี่ยนสถานะ (null หากเปลี่ยนโดยระบบ/ลูกค้า)', \`OSH_NOTE\` varchar(255) NULL COMMENT 'หมายเหตุการเปลี่ยนสถานะ', \`OSH_CHANGED_AT\` datetime NOT NULL COMMENT 'วันที่และเวลาที่เปลี่ยนสถานะ', PRIMARY KEY (\`OSH_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_ORDER_NOTIFICATIONS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`ONT_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการแจ้งเตือน', \`ONT_ORDER_ID\` int NOT NULL COMMENT 'รหัสคำสั่งซื้อ', \`ONT_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขา', \`ONT_MESSAGE\` varchar(255) NOT NULL COMMENT 'ข้อความแจ้งเตือน', \`ONT_IS_READ\` tinyint NOT NULL COMMENT 'สถานะการอ่าน (true/false)' DEFAULT 0, PRIMARY KEY (\`ONT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_ORDERS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`ORD_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสคำสั่งซื้อ', \`ORD_NUMBER\` varchar(30) NOT NULL COMMENT 'เลขที่ใบสั่งซื้อ (เช่น ORD-20250101-001)', \`ORD_BRANCH_ID\` int NOT NULL COMMENT 'รหัสสาขา', \`ORD_CUSTOMER_ID\` int NULL COMMENT 'รหัสลูกค้า (null สำหรับผู้ไม่ได้สมัครสมาชิก)', \`ORD_EMPLOYEE_ID\` int NULL COMMENT 'รหัสพนักงานผู้รับออร์เดอร์ (null หากลูกค้าสั่งผ่าน QR)', \`ORD_TABLE_ID\` int NULL COMMENT 'รหัสโต๊ะอาหาร (null สำหรับ takeaway/delivery)', \`ORD_PROMOTION_ID\` int NULL COMMENT 'รหัสโปรโมชั่นที่ใช้', \`ORD_SESSION_ID\` int NULL COMMENT 'รหัสเซสชันโต๊ะอาหาร (สำหรับ QR Order)', \`ORD_QR_CODE_ID\` int NULL COMMENT 'รหัส QR Code ที่สแกนสั่งซื้อ', \`ORD_CHANNEL\` enum ('pos', 'qr_order') NOT NULL COMMENT 'ช่องทางการสั่งซื้อ (pos/qr_order)' DEFAULT 'pos', \`ORD_TYPE\` enum ('dine_in', 'takeaway', 'delivery') NOT NULL COMMENT 'ประเภทการทาน (dine_in/takeaway/delivery)' DEFAULT 'dine_in', \`ORD_STATUS\` enum ('pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled') NOT NULL COMMENT 'สถานะออร์เดอร์ (pending/confirmed/preparing/ready/served/paid/cancelled)' DEFAULT 'pending', \`ORD_GUEST_NAME\` varchar(100) NULL COMMENT 'ชื่อผู้สั่งซื้อกรณีไม่มีบัญชีลูกค้า', \`ORD_GUEST_PHONE\` varchar(20) NULL COMMENT 'เบอร์โทรผู้สั่งซื้อกรณีไม่มีบัญชีลูกค้า', \`ORD_TOTAL_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'ยอดรวมก่อนหักส่วนลด' DEFAULT '0.00', \`ORD_DISCOUNT_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'ยอดส่วนลดรวม' DEFAULT '0.00', \`ORD_TAX_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'ภาษีมูลค่าเพิ่ม (VAT)' DEFAULT '0.00', \`ORD_NET_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'ยอดสุทธิที่ต้องชำระ' DEFAULT '0.00', \`ORD_DATE\` datetime NOT NULL COMMENT 'วันที่และเวลาที่สั่งซื้อ', UNIQUE INDEX \`IDX_0e4a7541d5bf38d85e11674dc7\` (\`ORD_NUMBER\`), PRIMARY KEY (\`ORD_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PAYMENT_METHODS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`PMT_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสช่องทางการชำระเงิน', \`PMT_NAME\` varchar(50) NOT NULL COMMENT 'ชื่อช่องทางการชำระเงิน (cash, credit_card, promptpay, wallet)', \`PMT_STATUS\` enum ('active', 'inactive') NOT NULL COMMENT 'สถานะช่องทาง (active/inactive)' DEFAULT 'active', PRIMARY KEY (\`PMT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PAYMENTS\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`PAY_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการชำระเงิน', \`PAY_ORDER_ID\` int NOT NULL COMMENT 'รหัสคำสั่งซื้อ', \`PAY_METHOD_ID\` int NOT NULL COMMENT 'รหัสช่องทางการชำระเงิน', \`PAY_AMOUNT\` decimal(10,2) NOT NULL COMMENT 'จำนวนเงินที่ชำระ', \`PAY_REFERENCE_NO\` varchar(100) NULL COMMENT 'เลขอ้างอิงธุรกรรม/สลิปโอนเงิน', \`PAY_STATUS\` enum ('success', 'failed', 'refunded') NOT NULL COMMENT 'สถานะการชำระเงิน (success/failed/refunded)' DEFAULT 'success', \`PAY_DATE\` datetime NOT NULL COMMENT 'วันที่และเวลาที่ชำระเงิน', PRIMARY KEY (\`PAY_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_FEEDBACK\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`FDB_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสความคิดเห็น', \`FDB_CUSTOMER_ID\` int NOT NULL COMMENT 'รหัสลูกค้า', \`FDB_ORDER_ID\` int NULL COMMENT 'รหัสคำสั่งซื้อ (1 ออร์เดอร์ มีได้ 1 ความคิดเห็น)', \`FDB_RATING\` tinyint NOT NULL COMMENT 'คะแนนความพึงพอใจ (1-5)', \`FDB_COMMENT\` text NULL COMMENT 'ข้อความติชม/รีวิว', UNIQUE INDEX \`IDX_41d06fc9856b261cdf8f687d79\` (\`FDB_ORDER_ID\`), UNIQUE INDEX \`REL_41d06fc9856b261cdf8f687d79\` (\`FDB_ORDER_ID\`), PRIMARY KEY (\`FDB_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_ATTENDANCE\` (\`CREATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่สร้างข้อมูล' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` datetime(6) NOT NULL COMMENT 'วันที่แก้ไขข้อมูลล่าสุด' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` datetime(6) NULL COMMENT 'วันที่ลบข้อมูล (Soft Delete)', \`ATT_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสบันทึกการเข้างาน', \`ATT_EMPLOYEE_ID\` int NOT NULL COMMENT 'รหัสพนักงาน', \`ATT_WORK_DATE\` date NOT NULL COMMENT 'วันที่ทำงาน', \`ATT_CHECK_IN\` datetime NULL COMMENT 'เวลาเข้างาน', \`ATT_CHECK_OUT\` datetime NULL COMMENT 'เวลาออกงาน', \`ATT_STATUS\` enum ('on_time', 'late', 'absent', 'leave') NOT NULL COMMENT 'สถานะการเข้างาน (on_time/late/absent/leave)' DEFAULT 'on_time', PRIMARY KEY (\`ATT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`POS_PROMOTION_PRODUCTS\` (\`PRP_PROMOTION_ID\` int NOT NULL, \`PRP_PRODUCT_ID\` int NOT NULL, INDEX \`IDX_2fde382acbff785998e97f46f8\` (\`PRP_PROMOTION_ID\`), INDEX \`IDX_f3012ec5442588b5d668bac1f0\` (\`PRP_PRODUCT_ID\`), PRIMARY KEY (\`PRP_PROMOTION_ID\`, \`PRP_PRODUCT_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` ADD CONSTRAINT \`FK_cb8e860732d639c67b849ead0a8\` FOREIGN KEY (\`EMP_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` ADD CONSTRAINT \`FK_b41b8db0cb36b4a9749c6772c4d\` FOREIGN KEY (\`EMP_ROLE_ID\`) REFERENCES \`POS_ROLES\`(\`ROL_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDERS\` ADD CONSTRAINT \`FK_8818ca189e29fcc1a57df13df66\` FOREIGN KEY (\`POR_SUPPLIER_ID\`) REFERENCES \`POS_SUPPLIERS\`(\`SUP_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDERS\` ADD CONSTRAINT \`FK_e2509734e2a5d2564e5c9359e5e\` FOREIGN KEY (\`POR_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDERS\` ADD CONSTRAINT \`FK_9a2ab067f72b3b32fcb995ac1bd\` FOREIGN KEY (\`POR_EMPLOYEE_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_CATEGORIES\` ADD CONSTRAINT \`FK_c6c326b1990b294701210cb8e50\` FOREIGN KEY (\`CAT_PARENT_ID\`) REFERENCES \`POS_CATEGORIES\`(\`CAT_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PRODUCTS\` ADD CONSTRAINT \`FK_1b49a4b9d417ffc78f2712555b9\` FOREIGN KEY (\`PRD_CATEGORY_ID\`) REFERENCES \`POS_CATEGORIES\`(\`CAT_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDER_ITEMS\` ADD CONSTRAINT \`FK_8d9ca223b2d48ae74cfd5e6cb63\` FOREIGN KEY (\`POI_PO_ID\`) REFERENCES \`POS_PURCHASE_ORDERS\`(\`POR_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDER_ITEMS\` ADD CONSTRAINT \`FK_c3337adf61c41362fa115c371a4\` FOREIGN KEY (\`POI_PRODUCT_ID\`) REFERENCES \`POS_PRODUCTS\`(\`PRD_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCK_MOVEMENTS\` ADD CONSTRAINT \`FK_70e0f14e7a443654256f7f9a9aa\` FOREIGN KEY (\`STM_PRODUCT_ID\`) REFERENCES \`POS_PRODUCTS\`(\`PRD_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCK_MOVEMENTS\` ADD CONSTRAINT \`FK_0d0ecd137dcd8d963c083bed3f6\` FOREIGN KEY (\`STM_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCK_MOVEMENTS\` ADD CONSTRAINT \`FK_c6e0fc86ec1800199262393c840\` FOREIGN KEY (\`STM_EMPLOYEE_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCKS\` ADD CONSTRAINT \`FK_c67ddba89aa9c05e0886bac1a7f\` FOREIGN KEY (\`STK_PRODUCT_ID\`) REFERENCES \`POS_PRODUCTS\`(\`PRD_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCKS\` ADD CONSTRAINT \`FK_75ec65c86046bf613e5f86622d2\` FOREIGN KEY (\`STK_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_SALARIES\` ADD CONSTRAINT \`FK_d60f187fa2afeb0a862b401f8b7\` FOREIGN KEY (\`SAL_EMPLOYEE_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_DINING_TABLES\` ADD CONSTRAINT \`FK_189622941ac73a9c6afc12600f3\` FOREIGN KEY (\`DTB_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_QR_CODES\` ADD CONSTRAINT \`FK_bc10ade3681b8fe5ec6ea1f31f7\` FOREIGN KEY (\`QRC_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_QR_CODES\` ADD CONSTRAINT \`FK_e79042745bd01f2e36d608e540b\` FOREIGN KEY (\`QRC_TABLE_ID\`) REFERENCES \`POS_DINING_TABLES\`(\`DTB_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_SESSIONS\` ADD CONSTRAINT \`FK_ec8b9213422831e84712f3b7509\` FOREIGN KEY (\`TSS_QR_CODE_ID\`) REFERENCES \`POS_QR_CODES\`(\`QRC_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_SESSIONS\` ADD CONSTRAINT \`FK_5530b0cc482c61489bd7aa899e8\` FOREIGN KEY (\`TSS_TABLE_ID\`) REFERENCES \`POS_DINING_TABLES\`(\`DTB_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_SESSIONS\` ADD CONSTRAINT \`FK_9d046ade8335fed9a1167e5011f\` FOREIGN KEY (\`TSS_CUSTOMER_ID\`) REFERENCES \`POS_CUSTOMERS\`(\`CUS_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_REQUESTS\` ADD CONSTRAINT \`FK_a2458fe1c4225a00652b3878c8b\` FOREIGN KEY (\`TRQ_SESSION_ID\`) REFERENCES \`POS_TABLE_SESSIONS\`(\`TSS_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_REQUESTS\` ADD CONSTRAINT \`FK_83432a16b28562e427e1732cc8b\` FOREIGN KEY (\`TRQ_TABLE_ID\`) REFERENCES \`POS_DINING_TABLES\`(\`DTB_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_REQUESTS\` ADD CONSTRAINT \`FK_d6cead6fdd86701efebce1b7cd1\` FOREIGN KEY (\`TRQ_HANDLED_BY_EMP_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_ITEMS\` ADD CONSTRAINT \`FK_0f67ed21c74e01f8dabd133c5ba\` FOREIGN KEY (\`ORI_ORDER_ID\`) REFERENCES \`POS_ORDERS\`(\`ORD_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_ITEMS\` ADD CONSTRAINT \`FK_e80ab856b26d599521791016e32\` FOREIGN KEY (\`ORI_PRODUCT_ID\`) REFERENCES \`POS_PRODUCTS\`(\`PRD_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_STATUS_HISTORY\` ADD CONSTRAINT \`FK_ae5754c4b0a1db8f8de18bac209\` FOREIGN KEY (\`OSH_ORDER_ID\`) REFERENCES \`POS_ORDERS\`(\`ORD_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_STATUS_HISTORY\` ADD CONSTRAINT \`FK_a076c78bb54b360d0a821c82fd3\` FOREIGN KEY (\`OSH_CHANGED_BY_EMP_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_NOTIFICATIONS\` ADD CONSTRAINT \`FK_5a6b39be1e3668b062fdd8574bb\` FOREIGN KEY (\`ONT_ORDER_ID\`) REFERENCES \`POS_ORDERS\`(\`ORD_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_NOTIFICATIONS\` ADD CONSTRAINT \`FK_76cd6f9afee88acfeccd4f275b8\` FOREIGN KEY (\`ONT_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` ADD CONSTRAINT \`FK_18eafc4c7bce549ea1fd86bdde5\` FOREIGN KEY (\`ORD_BRANCH_ID\`) REFERENCES \`POS_BRANCHES\`(\`BRN_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` ADD CONSTRAINT \`FK_fc8385f35f55f1dd0f4efb499ab\` FOREIGN KEY (\`ORD_CUSTOMER_ID\`) REFERENCES \`POS_CUSTOMERS\`(\`CUS_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` ADD CONSTRAINT \`FK_488afaf14bc24f9c97fe644676b\` FOREIGN KEY (\`ORD_EMPLOYEE_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` ADD CONSTRAINT \`FK_fb52401ba856f4032204d9fe87b\` FOREIGN KEY (\`ORD_TABLE_ID\`) REFERENCES \`POS_DINING_TABLES\`(\`DTB_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` ADD CONSTRAINT \`FK_ea068d6e24054b84fa8ce0474de\` FOREIGN KEY (\`ORD_PROMOTION_ID\`) REFERENCES \`POS_PROMOTIONS\`(\`PRM_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PAYMENTS\` ADD CONSTRAINT \`FK_681cacda037ed26453850622b7d\` FOREIGN KEY (\`PAY_ORDER_ID\`) REFERENCES \`POS_ORDERS\`(\`ORD_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PAYMENTS\` ADD CONSTRAINT \`FK_4bb01d7e8dea9b990bbc13214dc\` FOREIGN KEY (\`PAY_METHOD_ID\`) REFERENCES \`POS_PAYMENT_METHODS\`(\`PMT_ID\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_FEEDBACK\` ADD CONSTRAINT \`FK_dbc789d74be92ddcbb60da1df29\` FOREIGN KEY (\`FDB_CUSTOMER_ID\`) REFERENCES \`POS_CUSTOMERS\`(\`CUS_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_FEEDBACK\` ADD CONSTRAINT \`FK_41d06fc9856b261cdf8f687d798\` FOREIGN KEY (\`FDB_ORDER_ID\`) REFERENCES \`POS_ORDERS\`(\`ORD_ID\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ATTENDANCE\` ADD CONSTRAINT \`FK_4a1489937eaf8a38ad063b2719b\` FOREIGN KEY (\`ATT_EMPLOYEE_ID\`) REFERENCES \`POS_EMPLOYEES\`(\`EMP_ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PROMOTION_PRODUCTS\` ADD CONSTRAINT \`FK_2fde382acbff785998e97f46f85\` FOREIGN KEY (\`PRP_PROMOTION_ID\`) REFERENCES \`POS_PROMOTIONS\`(\`PRM_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PROMOTION_PRODUCTS\` ADD CONSTRAINT \`FK_f3012ec5442588b5d668bac1f01\` FOREIGN KEY (\`PRP_PRODUCT_ID\`) REFERENCES \`POS_PRODUCTS\`(\`PRD_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`POS_PROMOTION_PRODUCTS\` DROP FOREIGN KEY \`FK_f3012ec5442588b5d668bac1f01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PROMOTION_PRODUCTS\` DROP FOREIGN KEY \`FK_2fde382acbff785998e97f46f85\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ATTENDANCE\` DROP FOREIGN KEY \`FK_4a1489937eaf8a38ad063b2719b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_FEEDBACK\` DROP FOREIGN KEY \`FK_41d06fc9856b261cdf8f687d798\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_FEEDBACK\` DROP FOREIGN KEY \`FK_dbc789d74be92ddcbb60da1df29\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PAYMENTS\` DROP FOREIGN KEY \`FK_4bb01d7e8dea9b990bbc13214dc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PAYMENTS\` DROP FOREIGN KEY \`FK_681cacda037ed26453850622b7d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` DROP FOREIGN KEY \`FK_ea068d6e24054b84fa8ce0474de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` DROP FOREIGN KEY \`FK_fb52401ba856f4032204d9fe87b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` DROP FOREIGN KEY \`FK_488afaf14bc24f9c97fe644676b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` DROP FOREIGN KEY \`FK_fc8385f35f55f1dd0f4efb499ab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDERS\` DROP FOREIGN KEY \`FK_18eafc4c7bce549ea1fd86bdde5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_NOTIFICATIONS\` DROP FOREIGN KEY \`FK_76cd6f9afee88acfeccd4f275b8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_NOTIFICATIONS\` DROP FOREIGN KEY \`FK_5a6b39be1e3668b062fdd8574bb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_STATUS_HISTORY\` DROP FOREIGN KEY \`FK_a076c78bb54b360d0a821c82fd3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_STATUS_HISTORY\` DROP FOREIGN KEY \`FK_ae5754c4b0a1db8f8de18bac209\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_ITEMS\` DROP FOREIGN KEY \`FK_e80ab856b26d599521791016e32\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_ORDER_ITEMS\` DROP FOREIGN KEY \`FK_0f67ed21c74e01f8dabd133c5ba\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_REQUESTS\` DROP FOREIGN KEY \`FK_d6cead6fdd86701efebce1b7cd1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_REQUESTS\` DROP FOREIGN KEY \`FK_83432a16b28562e427e1732cc8b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_REQUESTS\` DROP FOREIGN KEY \`FK_a2458fe1c4225a00652b3878c8b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_SESSIONS\` DROP FOREIGN KEY \`FK_9d046ade8335fed9a1167e5011f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_SESSIONS\` DROP FOREIGN KEY \`FK_5530b0cc482c61489bd7aa899e8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_TABLE_SESSIONS\` DROP FOREIGN KEY \`FK_ec8b9213422831e84712f3b7509\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_QR_CODES\` DROP FOREIGN KEY \`FK_e79042745bd01f2e36d608e540b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_QR_CODES\` DROP FOREIGN KEY \`FK_bc10ade3681b8fe5ec6ea1f31f7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_DINING_TABLES\` DROP FOREIGN KEY \`FK_189622941ac73a9c6afc12600f3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_SALARIES\` DROP FOREIGN KEY \`FK_d60f187fa2afeb0a862b401f8b7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCKS\` DROP FOREIGN KEY \`FK_75ec65c86046bf613e5f86622d2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCKS\` DROP FOREIGN KEY \`FK_c67ddba89aa9c05e0886bac1a7f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCK_MOVEMENTS\` DROP FOREIGN KEY \`FK_c6e0fc86ec1800199262393c840\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCK_MOVEMENTS\` DROP FOREIGN KEY \`FK_0d0ecd137dcd8d963c083bed3f6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_STOCK_MOVEMENTS\` DROP FOREIGN KEY \`FK_70e0f14e7a443654256f7f9a9aa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDER_ITEMS\` DROP FOREIGN KEY \`FK_c3337adf61c41362fa115c371a4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDER_ITEMS\` DROP FOREIGN KEY \`FK_8d9ca223b2d48ae74cfd5e6cb63\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PRODUCTS\` DROP FOREIGN KEY \`FK_1b49a4b9d417ffc78f2712555b9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_CATEGORIES\` DROP FOREIGN KEY \`FK_c6c326b1990b294701210cb8e50\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDERS\` DROP FOREIGN KEY \`FK_9a2ab067f72b3b32fcb995ac1bd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDERS\` DROP FOREIGN KEY \`FK_e2509734e2a5d2564e5c9359e5e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_PURCHASE_ORDERS\` DROP FOREIGN KEY \`FK_8818ca189e29fcc1a57df13df66\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` DROP FOREIGN KEY \`FK_b41b8db0cb36b4a9749c6772c4d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`POS_EMPLOYEES\` DROP FOREIGN KEY \`FK_cb8e860732d639c67b849ead0a8\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f3012ec5442588b5d668bac1f0\` ON \`POS_PROMOTION_PRODUCTS\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2fde382acbff785998e97f46f8\` ON \`POS_PROMOTION_PRODUCTS\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_PROMOTION_PRODUCTS\``);
    await queryRunner.query(`DROP TABLE \`POS_ATTENDANCE\``);
    await queryRunner.query(
      `DROP INDEX \`REL_41d06fc9856b261cdf8f687d79\` ON \`POS_FEEDBACK\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_41d06fc9856b261cdf8f687d79\` ON \`POS_FEEDBACK\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_FEEDBACK\``);
    await queryRunner.query(`DROP TABLE \`POS_PAYMENTS\``);
    await queryRunner.query(`DROP TABLE \`POS_PAYMENT_METHODS\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_0e4a7541d5bf38d85e11674dc7\` ON \`POS_ORDERS\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_ORDERS\``);
    await queryRunner.query(`DROP TABLE \`POS_ORDER_NOTIFICATIONS\``);
    await queryRunner.query(`DROP TABLE \`POS_ORDER_STATUS_HISTORY\``);
    await queryRunner.query(`DROP TABLE \`POS_ORDER_ITEMS\``);
    await queryRunner.query(`DROP TABLE \`POS_PROMOTIONS\``);
    await queryRunner.query(`DROP TABLE \`POS_TABLE_REQUESTS\``);
    await queryRunner.query(`DROP TABLE \`POS_TABLE_SESSIONS\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_6973c8fe3de2d69cdb5b4b7a03\` ON \`POS_CUSTOMERS\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_CUSTOMERS\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_07fd542a3da41e1def72fb83c0\` ON \`POS_QR_CODES\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_QR_CODES\``);
    await queryRunner.query(`DROP TABLE \`POS_DINING_TABLES\``);
    await queryRunner.query(`DROP TABLE \`POS_SALARIES\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c21821e2d1e4996c232ec16f4e\` ON \`POS_STOCKS\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_STOCKS\``);
    await queryRunner.query(`DROP TABLE \`POS_STOCK_MOVEMENTS\``);
    await queryRunner.query(`DROP TABLE \`POS_PURCHASE_ORDER_ITEMS\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f9bb3c16bfa94f2c74a7b24a77\` ON \`POS_PRODUCTS\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3183089dcca6e99fb3c1fd68d2\` ON \`POS_PRODUCTS\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_PRODUCTS\``);
    await queryRunner.query(`DROP TABLE \`POS_CATEGORIES\``);
    await queryRunner.query(`DROP TABLE \`POS_PURCHASE_ORDERS\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_0f0001bd2710c809a000747af5\` ON \`POS_EMPLOYEES\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bbd6becf7763f7bf6bf4f1f628\` ON \`POS_EMPLOYEES\``,
    );
    await queryRunner.query(`DROP TABLE \`POS_EMPLOYEES\``);
    await queryRunner.query(`DROP TABLE \`POS_ROLES\``);
    await queryRunner.query(`DROP TABLE \`POS_BRANCHES\``);
    await queryRunner.query(`DROP TABLE \`POS_SUPPLIERS\``);
  }
}
