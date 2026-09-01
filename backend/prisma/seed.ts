import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Masterspace ERP database...');

  // ---------------- Users ----------------
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@masterspace.co.ke' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@masterspace.co.ke',
      password: adminPassword,
      role: "ADMIN",
      active: true,
    },
  });

  const financePassword = await bcrypt.hash('Finance@123', 10);
  await prisma.user.upsert({
    where: { email: 'finance@masterspace.co.ke' },
    update: {},
    create: {
      name: 'Evans Ochieng',
      email: 'finance@masterspace.co.ke',
      password: financePassword,
      role: "FINANCE",
      active: true,
    },
  });

  // ---------------- Document counters ----------------
  // INV currently at 33 → next invoice will be INV0034
  const counters: { prefix: string; currentNumber: number }[] = [
    { prefix: 'INV', currentNumber: 33 },
    { prefix: 'LSO', currentNumber: 0 },
    { prefix: 'QOT', currentNumber: 0 },
    { prefix: 'POD', currentNumber: 0 },
    { prefix: 'RCT', currentNumber: 0 },
    { prefix: 'WOR', currentNumber: 0 },
    { prefix: 'CRN', currentNumber: 0 },
  ];
  for (const c of counters) {
    await prisma.documentCounter.upsert({
      where: { prefix: c.prefix },
      update: {},
      create: c,
    });
  }

  // ---------------- Clients ----------------
  const clients = [
    {
      name: 'Ministry of Information Communication Technology (MICT)',
      email: 'info@mict.gov.so',
      phone: '+252 63 000000',
      address: "Somaliland Innovation Zone, 1st Floor, Sha'ab Area, Road II, 26 June District",
      city: 'Hargeisa',
      country: 'Somaliland',
      taxPin: '',
    },
    {
      name: 'Coastal Developers Ltd',
      email: 'accounts@coastaldev.co.ke',
      phone: '+254 722 111222',
      address: 'Nyali Road, P.O. Box 8123-80100',
      city: 'Mombasa',
      country: 'Kenya',
      taxPin: 'P051234567X',
    },
    {
      name: 'Rift Valley Enterprises',
      email: 'procurement@rve.co.ke',
      phone: '+254 733 444555',
      address: 'Kenyatta Avenue, P.O. Box 456-20100',
      city: 'Nakuru',
      country: 'Kenya',
      taxPin: 'P059876543Y',
    },
  ];
  for (const c of clients) {
    const existing = await prisma.client.findFirst({ where: { name: c.name } });
    if (!existing) await prisma.client.create({ data: c });
  }

  // ---------------- Suppliers ----------------
  const suppliers = [
    {
      name: 'A. Mulu & Company Advocates',
      email: 'info@amulu.co.ke',
      phone: '+254 20 2345678',
      address: 'Global Trade Centre (GTC) Office Tower, 14th Floor, Chiromo Lane, Westlands, P.O Box 26849-00100',
      city: 'Nairobi',
      country: 'Kenya',
      taxPin: 'P051112223A',
    },
    {
      name: 'Techno Supplies Kenya Ltd',
      email: 'sales@technosupplies.co.ke',
      phone: '+254 711 998877',
      address: 'Enterprise Road, Industrial Area, P.O. Box 12345-00500',
      city: 'Nairobi',
      country: 'Kenya',
      taxPin: 'P054445556B',
    },
  ];
  for (const s of suppliers) {
    const existing = await prisma.supplier.findFirst({ where: { name: s.name } });
    if (!existing) await prisma.supplier.create({ data: s });
  }

  console.log('✅ Seed complete.');
  console.log('   Admin login:   admin@masterspace.co.ke / Admin@123');
  console.log('   Finance login: finance@masterspace.co.ke / Finance@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
