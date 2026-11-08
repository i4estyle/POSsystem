import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BranchEntity } from '../../modules/branches/entities/branch.entity';
import { RoleEntity } from '../../modules/roles/entities/role.entity';
import { CategoryEntity } from '../../modules/categories/entities/category.entity';
import { ProductEntity } from '../../modules/products/entities/product.entity';
import { DiningTableEntity } from '../../modules/dining-tables/entities/dining-table.entity';
import { QrCodeEntity } from '../../modules/qr-orders/entities/qr-code.entity';
import { PromotionEntity } from '../../modules/promotions/entities/promotion.entity';
import { CustomerEntity } from '../../modules/customers/entities/customer.entity';
import {
  BranchStatus,
  DiningTableStatus,
  MemberLevel,
  ProductStatus,
  PromotionStatus,
  PromotionType,
  QrCodeStatus,
  QrType,
} from '../../common/enums';

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.seedBranches();
      await this.seedRoles();
      await this.seedCategories();
      await this.seedProducts();
      await this.seedPromotions();
      await this.seedCustomers();
      await this.seedDiningTablesAndQrCodes();
    } catch (err) {
      this.logger.warn(`Auto-seed skipped or encountered error: ${String(err)}`);
    }
  }

  private async seedBranches(): Promise<void> {
    const repo = this.dataSource.getRepository(BranchEntity);
    const count = await repo.count();
    if (count > 0) return;

    await repo.save([
      repo.create({
        branchId: 1,
        branchName: 'สาขาหลัก สยาม',
        address: '999/99 ถนนพระราม 1 ปทุมวัน กรุงเทพฯ',
        phone: '021234567',
        status: BranchStatus.ACTIVE,
      }),
    ]);
    this.logger.log('Seeded initial POS_BRANCHES');
  }

  private async seedRoles(): Promise<void> {
    const repo = this.dataSource.getRepository(RoleEntity);
    const count = await repo.count();
    if (count > 0) return;

    await repo.save([
      repo.create({ roleId: 1, roleName: 'admin', description: 'ผู้ดูแลระบบ (Administrator)' }),
      repo.create({ roleId: 2, roleName: 'cashier', description: 'พนักงานแคชเชียร์ (Cashier)' }),
      repo.create({ roleId: 3, roleName: 'manager', description: 'ผู้จัดการสาขา (Branch Manager)' }),
      repo.create({ roleId: 4, roleName: 'kitchen', description: 'พนักงานครัว (Kitchen Staff)' }),
    ]);
    this.logger.log('Seeded initial POS_ROLES');
  }

  private async seedCategories(): Promise<void> {
    const repo = this.dataSource.getRepository(CategoryEntity);
    const categories = [
      { categoryId: 1, categoryName: 'เบอร์เกอร์', description: 'Burgers' },
      { categoryId: 2, categoryName: 'เครื่องดื่ม', description: 'Beverages' },
      { categoryId: 3, categoryName: 'ของหวาน', description: 'Desserts' },
      { categoryId: 4, categoryName: 'ของว่าง', description: 'Snacks & Sides' },
      { categoryId: 5, categoryName: 'เซตสุดคุ้ม', description: 'Value Sets' },
    ];
    for (const cat of categories) {
      const exists = await repo.findOne({ where: { categoryId: cat.categoryId } });
      if (!exists) {
        await repo.save(repo.create(cat));
      }
    }
    this.logger.log('Verified POS_CATEGORIES (1..5)');
  }

  private async seedProducts(): Promise<void> {
    const repo = this.dataSource.getRepository(ProductEntity);

    const initialProducts: Partial<ProductEntity>[] = [
      {
        productId: 1,
        categoryId: 1,
        productName: 'Double Cheese Burger',
        sku: 'BKG-001',
        costPrice: 100,
        sellingPrice: 189,
        unit: 'ชิ้น',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      },
      {
        productId: 2,
        categoryId: 2,
        productName: 'Iced Matcha Latte',
        sku: 'DRK-001',
        costPrice: 40,
        sellingPrice: 85,
        unit: 'แก้ว',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
      },
      {
        productId: 3,
        categoryId: 4,
        productName: 'Truffle Fries',
        sku: 'SNK-001',
        costPrice: 50,
        sellingPrice: 120,
        unit: 'จาน',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
      },
      {
        productId: 4,
        categoryId: 3,
        productName: 'Strawberry Shortcake',
        sku: 'DST-001',
        costPrice: 70,
        sellingPrice: 145,
        unit: 'ชิ้น',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
      },
      {
        productId: 5,
        categoryId: 4,
        productName: 'Spicy Wings (6pcs)',
        sku: 'SNK-002',
        costPrice: 80,
        sellingPrice: 165,
        unit: 'ชุด',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80',
      },
      {
        productId: 6,
        categoryId: 2,
        productName: 'Sparkling Lemonade',
        sku: 'DRK-002',
        costPrice: 20,
        sellingPrice: 60,
        unit: 'แก้ว',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80',
      },
      {
        productId: 7,
        categoryId: 1,
        productName: 'Classic Bacon Cheeseburger',
        sku: 'BKG-002',
        costPrice: 110,
        sellingPrice: 199,
        unit: 'ชิ้น',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
      },
      {
        productId: 8,
        categoryId: 1,
        productName: 'Crispy Chicken Burger',
        sku: 'BKG-003',
        costPrice: 85,
        sellingPrice: 159,
        unit: 'ชิ้น',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&q=80',
      },
      {
        productId: 9,
        categoryId: 2,
        productName: 'Americano Cold Brew',
        sku: 'DRK-003',
        costPrice: 25,
        sellingPrice: 75,
        unit: 'แก้ว',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
      },
      {
        productId: 10,
        categoryId: 2,
        productName: 'Fresh Orange Juice',
        sku: 'DRK-004',
        costPrice: 30,
        sellingPrice: 70,
        unit: 'แก้ว',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80',
      },
      {
        productId: 11,
        categoryId: 3,
        productName: 'Chocolate Lava Cake',
        sku: 'DST-002',
        costPrice: 65,
        sellingPrice: 135,
        unit: 'จาน',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
      },
      {
        productId: 12,
        categoryId: 3,
        productName: 'Matcha Green Tea Parfait',
        sku: 'DST-003',
        costPrice: 75,
        sellingPrice: 150,
        unit: 'แก้ว',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
      },
      {
        productId: 13,
        categoryId: 4,
        productName: 'Mozzarella Cheese Sticks',
        sku: 'SNK-003',
        costPrice: 60,
        sellingPrice: 129,
        unit: 'ชุด',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&q=80',
      },
      {
        productId: 14,
        categoryId: 5,
        productName: 'Cheeseburger Set',
        sku: 'SET-001',
        costPrice: 150,
        sellingPrice: 299,
        unit: 'เซต',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&q=80',
      },
      {
        productId: 15,
        categoryId: 5,
        productName: 'Spicy Wings Set',
        sku: 'SET-002',
        costPrice: 160,
        sellingPrice: 319,
        unit: 'เซต',
        status: ProductStatus.ACTIVE,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
      },
    ];

    for (const p of initialProducts) {
      const exists = await repo.findOne({
        where: [{ productId: p.productId }, { sku: p.sku }],
      });
      if (!exists) {
        await repo.save(repo.create(p));
      }
    }
    this.logger.log('Verified POS_PRODUCTS (15 items)');
  }

  private async seedPromotions(): Promise<void> {
    const repo = this.dataSource.getRepository(PromotionEntity);
    const initialPromotions: Partial<PromotionEntity>[] = [
      {
        promotionId: 1,
        promotionName: 'WELCOME10 - ส่วนลดต้อนรับสมาชิกใหม่ 10%',
        promotionType: PromotionType.PERCENT,
        discountValue: 10,
        minPurchaseAmount: 200,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: PromotionStatus.ACTIVE,
      },
      {
        promotionId: 2,
        promotionName: 'DISCOUNT50 - คูปองส่วนลด 50 บาท',
        promotionType: PromotionType.FIXED_AMOUNT,
        discountValue: 50,
        minPurchaseAmount: 250,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: PromotionStatus.ACTIVE,
      },
      {
        promotionId: 3,
        promotionName: 'SUMMER20 - Summer Special 20% OFF',
        promotionType: PromotionType.PERCENT,
        discountValue: 20,
        minPurchaseAmount: 150,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-07-15'),
        status: PromotionStatus.EXPIRED,
      },
    ];

    for (const prm of initialPromotions) {
      const exists = await repo.findOne({ where: { promotionId: prm.promotionId } });
      if (!exists) {
        await repo.save(repo.create(prm));
      }
    }
    this.logger.log('Verified POS_PROMOTIONS (IDs 1..3)');
  }

  private async seedCustomers(): Promise<void> {
    const repo = this.dataSource.getRepository(CustomerEntity);
    const initialCustomers: Partial<CustomerEntity>[] = [
      {
        customerId: 1,
        firstName: 'ธีรเดช',
        lastName: 'สุขสันต์',
        phone: '081-888-9999',
        email: 'theerapat@gmail.com',
        loyaltyPoint: 1250,
        memberLevel: MemberLevel.GOLD,
        registerDate: new Date('2025-11-10'),
      },
      {
        customerId: 2,
        firstName: 'ชนิกา',
        lastName: 'เจริญผล',
        phone: '089-777-6655',
        email: 'chanika.c@yahoo.com',
        loyaltyPoint: 680,
        memberLevel: MemberLevel.GOLD,
        registerDate: new Date('2026-01-15'),
      },
      {
        customerId: 3,
        firstName: 'อนันต์',
        lastName: 'สายชล',
        phone: '086-333-2211',
        email: 'anant.s@outlook.com',
        loyaltyPoint: 320,
        memberLevel: MemberLevel.SILVER,
        registerDate: new Date('2026-04-05'),
      },
      {
        customerId: 4,
        firstName: 'กมลชนก',
        lastName: 'ฤทธิ์เดช',
        phone: '084-222-1100',
        email: 'kamon.r@gmail.com',
        loyaltyPoint: 95,
        memberLevel: MemberLevel.REGULAR,
        registerDate: new Date('2026-06-20'),
      },
    ];

    for (const cus of initialCustomers) {
      const exists = await repo.findOne({
        where: [{ customerId: cus.customerId }, { phone: cus.phone }],
      });
      if (!exists) {
        await repo.save(repo.create(cus));
      }
    }
    this.logger.log('Verified POS_CUSTOMERS (IDs 1..4)');
  }

  private async seedDiningTablesAndQrCodes(): Promise<void> {
    const tableRepo = this.dataSource.getRepository(DiningTableEntity);
    const qrRepo = this.dataSource.getRepository(QrCodeEntity);

    const capacities = [4, 2, 6, 4, 4, 8, 2, 4, 2, 6, 4, 2, 4, 8, 4, 6];
    for (let i = 1; i <= 16; i += 1) {
      const exists = await tableRepo.findOne({ where: { tableId: i } });
      if (!exists) {
        const numStr = `T-${i < 10 ? '0' + i : i}`;
        await tableRepo.save(
          tableRepo.create({
            tableId: i,
            branchId: 1,
            tableNumber: numStr,
            seatCapacity: capacities[i - 1] ?? 4,
            status: DiningTableStatus.AVAILABLE,
          }),
        );
      }
    }
    this.logger.log('Verified POS_DINING_TABLES (T-01 to T-16)');

    for (let i = 1; i <= 16; i += 1) {
      const numStr = `T-${i < 10 ? '0' + i : i}`;
      const exists = await qrRepo.findOne({
        where: [{ qrCodeId: i }, { codeToken: `TOKEN-${numStr}` }],
      });
      if (!exists) {
        await qrRepo.save(
          qrRepo.create({
            qrCodeId: i,
            branchId: 1,
            tableId: i,
            qrType: QrType.DINE_IN,
            codeToken: `TOKEN-${numStr}`,
            status: QrCodeStatus.ACTIVE,
          }),
        );
      }
    }
    this.logger.log('Verified POS_QR_CODES (16 table QR tokens)');
  }
}
