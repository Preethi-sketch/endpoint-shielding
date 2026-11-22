export interface LookupRecord {
  id: string;
  code: string;
  recipientName: string;
  email: string;
  phone: string;
  status: string;
}

export const SAMPLE_RECORDS: LookupRecord[] = [
  {
    id: "1",
    code: "CERT-101",
    recipientName: "Aarav Nair",
    email: "aarav.nair@example.com",
    phone: "+919876543210",
    status: "Verified",
  },
  {
    id: "2",
    code: "ORD-202",
    recipientName: "Meera Krishnan",
    email: "meera@example.org",
    phone: "9845012345",
    status: "Dispatched",
  },
];