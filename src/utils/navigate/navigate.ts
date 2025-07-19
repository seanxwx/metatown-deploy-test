import { redirect } from 'next/navigation'

const navigate = (path: string): never => redirect(path)

export default navigate
