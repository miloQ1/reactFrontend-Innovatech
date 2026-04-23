import type { User } from '../types/auth';

export const mockUsers: (User & { password: string })[] = [
  {
    id: 'u1',
    userName: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@edutech.com',
    password: '123456',
  },
  {
    id: 'u2',
    userName: 'asmith',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@edutech.com',
    password: '123456',
  },
  {
    id: 'u3',
    userName: 'bwilson',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob@edutech.com',
    password: '123456',
  },
  {
    id: 'u4',
    userName: 'cmartinez',
    firstName: 'Carol',
    lastName: 'Martinez',
    email: 'carol@edutech.com',
    password: '123456',
  },
];
