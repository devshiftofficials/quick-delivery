const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Reading SQL file...')
    const sql = fs.readFileSync(
      path.join(__dirname, 'add-vendor-column.sql'),
      'utf8'
    )

    console.log('Executing SQL commands...')
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)

    for (const command of commands) {
      console.log(`Executing: ${command}`)
      await prisma.$executeRawUnsafe(command)
    }

    console.log('Database schema updated successfully!')
  } catch (error) {
    console.error('Error updating database schema:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()