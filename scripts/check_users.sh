#!/bin/bash
export PGPASSWORD="7696310f87c6ff59d74aaa5c9414a1581b4bde75947dcfd8bf126b665f9841bd"
psql -h 127.0.0.1 -U masterspace_erp -d masterspace_erp -c 'SELECT id, email, role, "createdAt" FROM "User" ORDER BY "createdAt";'
