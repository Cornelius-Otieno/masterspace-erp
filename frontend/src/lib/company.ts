// Masterspace Solutions Limited — company constants used across document templates.
export const COMPANY = {
  name: 'Masterspace Solutions Limited',
  tagline: 'Tangible Solutions for Businesses',
  addressLines: [
    '2nd Floor, Suite #A, RAMIS CENTER',
    'Mombasa Road, Nairobi, Kenya',
    'P.O. Box 57933-00200, Nairobi, Kenya',
  ],
  addressShort: '2nd Floor, Suite #A, RAMIS CENTER, Mombasa Road, Nairobi, Kenya',
  kraPin: 'P051565369U',
  email: 'info@masterspace.co.ke',
  phone: '+254 754 906577',
  website: 'https://masterspace.co.ke',
};

export interface CompanyBankAccount {
  id: string;
  name: string;
  branch: string;
  currency: 'KES' | 'USD';
  accountName: string;
  accountNumber: string;
  swift?: string;
}

export const COMPANY_BANK_ACCOUNTS: CompanyBankAccount[] = [
  {
    id: 'sidian-kes-kenyatta-market',
    name: 'Sidian Bank',
    branch: 'Kenyatta Market Branch',
    currency: 'KES',
    accountName: 'Masterspace Solutions Ltd',
    accountNumber: '01014020005833',
  },
  {
    id: 'stanbic-kes-express-way',
    name: 'Stanbic Bank',
    branch: 'Express Way Branch',
    currency: 'KES',
    accountName: 'Masterspace Solutions Ltd',
    accountNumber: '0100011520318',
  },
  {
    id: 'stanbic-usd-imaara',
    name: 'Stanbic Bank',
    branch: 'Imaara Branch',
    currency: 'USD',
    accountName: 'Masterspace Solutions Ltd',
    accountNumber: '0100012676217',
    swift: 'SBICKENX',
  },
];

export function getCompanyBankAccount(id?: string) {
  return COMPANY_BANK_ACCOUNTS.find((account) => account.id === id)
    ?? COMPANY_BANK_ACCOUNTS[0];
}
