import Dashboard from '@/components/dashboard-01'
import React from 'react'
import db from '@/lib/prisma'
import { userEntity } from '@/lib/entities';

export default async function page() {
    const users = await db.user.findMany();
    return (
        <Dashboard records={users} entity={userEntity} />
    )
}
